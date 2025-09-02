import React, { useEffect, useMemo, useRef } from 'react';
import { PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import { Renderer, TextureLoader as ExpoTextureLoader } from 'expo-three';
import * as THREE from 'three';

export default function SpinningGlobe({
  pins = [],               
  size = 320,
  autoSpin = true,
  textureModule = require('./assets/images/earth-map.jpg'),
}) {
  const earthRef = useRef(null);
  const spinningRef = useRef(autoSpin);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });


  const pinGroupRef = useRef(null);
  const pinGeomRef = useRef(null);
  const glReadyRef = useRef(false);

  const RADIUS = 1.01;

 
  const toNum = (v) => (v == null ? NaN : Number(v));
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
  const normalizePin = (p) => {
    const rawLat = p?.lat ?? p?.latitude;
    const rawLon = p?.lon ?? p?.lng ?? p?.long ?? p?.longitude;
    const lat = clamp(toNum(rawLat), -90, 90);
    const lon = clamp(toNum(rawLon), -180, 180);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return {
      lat, lon,
      color: p?.color ?? 0xff3b3b,
      label: typeof p?.label === 'string' ? p.label : '',
    };
  };

  // === Correct mapping for THREE.SphereGeometry + equirectangular ===
  // theta: 0..π from +Y (north) down; phi: 0..2π from +X toward +Z
  // With this sphere, lon=0 maps to phi=π (−X meridian),
  // and we yaw the globe by +π/2 so lon=0 faces the camera (+Z).
  function latLonToVec3(latDeg, lonDeg, r = 1.0) {
    const lat = THREE.MathUtils.degToRad(latDeg);
    const lon = THREE.MathUtils.degToRad(lonDeg);
    const theta = Math.PI / 2 - lat;   
    const phi   = lon + Math.PI;       

    const sinT = Math.sin(theta), cosT = Math.cos(theta);
    const sinP = Math.sin(phi),   cosP = Math.cos(phi);

    const x = -r * cosP * sinT;
    const y =  r * cosT;
    const z =  r * sinP * sinT;
    return new THREE.Vector3(x, y, z);
  }

  // When pins update
  useEffect(() => {
    if (!glReadyRef.current || !pinGroupRef.current || !pinGeomRef.current) return;

    const group = pinGroupRef.current;

    for (let i = group.children.length - 1; i >= 0; i--) {
      const child = group.children[i];
      if (child.material) child.material.dispose();
      group.remove(child);
    }

    const safePins = (Array.isArray(pins) ? pins : [])
      .map(normalizePin)
      .filter(Boolean);

    safePins.forEach(({ lat, lon, color }) => {
      const mat = new THREE.MeshBasicMaterial({ color });
      const pin = new THREE.Mesh(pinGeomRef.current, mat);
      const p = latLonToVec3(lat, lon, RADIUS);
      pin.position.copy(p);
      pin.lookAt(p.clone().multiplyScalar(1.1));
      group.add(pin);
    });
  }, [pins]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (_, g) => {
          draggingRef.current = true;
          spinningRef.current = false;
          lastRef.current = { x: g.x0, y: g.y0 };
        },
        onPanResponderMove: (_, g) => {
          const dx = g.moveX - lastRef.current.x;
          const dy = g.moveY - lastRef.current.y;
          lastRef.current = { x: g.moveX, y: g.moveY };
          const earth = earthRef.current;
          if (!earth) return;
          earth.rotation.y += dx * 0.005;
          earth.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, earth.rotation.x + dy * 0.005));
        },
        onPanResponderRelease: () => {
          draggingRef.current = false;
          spinningRef.current = autoSpin;
        },
        onPanResponderTerminate: () => {
          draggingRef.current = false;
          spinningRef.current = autoSpin;
        },
      }),
    [autoSpin]
  );

  return (
    <GLView
      style={{ width: size, height: size, backgroundColor: 'transparent' }}
      {...panResponder.panHandlers}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: w, drawingBufferHeight: h } = gl;

        const renderer = new Renderer({ gl, antialias: true });
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0); // transparent

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.z = 3;
        camera.lookAt(0, 0, 0);
        
        // Texture
        const asset = Asset.fromModule(textureModule);
        await asset.downloadAsync();
        const tex = await new ExpoTextureLoader(gl).loadAsync(asset);
        tex.colorSpace = THREE.SRGBColorSpace;
        if (renderer.outputColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;

        // Earth
        const mat = new THREE.MeshBasicMaterial({ map: tex });
        const geo = new THREE.SphereGeometry(1, 64, 64);
        const earth = new THREE.Mesh(geo, mat);
        scene.add(earth);
        earthRef.current = earth;

    
        earth.rotation.y = Math.PI / 2;

        
        const pinGroup = new THREE.Group();
        earth.add(pinGroup);
        pinGroupRef.current = pinGroup;

        const pinGeom = new THREE.SphereGeometry(0.02, 16, 16);
        pinGeomRef.current = pinGeom;

   
        glReadyRef.current = true;

        const animate = () => {
          if (spinningRef.current && earthRef.current && !draggingRef.current) {
            earthRef.current.rotation.y += 0.002;
          }
          renderer.render(scene, camera);
          gl.endFrameEXP();
          requestAnimationFrame(animate);
        };
        animate();
      }}
    />
  );
}
