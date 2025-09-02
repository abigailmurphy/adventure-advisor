# adventure-advisor
A ReactNative/Expo mobile application, built as a part of CS153: Mobile Application Development at Brandeis University.


<video src="advisorImg/Scrapbook.mp4" width="250" controls></video>

## Uses
AdventureAdvisor is here to solve all of your travel headaches through planning your trip, and allowing easy documentation so that you will never forget about it. This tool will generate a detailed itinerary for any location based on user specifications. The user will then have the option to save this itinerary, edit as desired, and add photos in the 'scrabook' section of the app. Finally, your Adventure Advisor will map your travels with an interractive 3D globe. 

## Tools
This app was built using ReactNative and Expo tools and Javascript. Data is stored locally on the device using async storage, allowing updates to existing itineraries to be made no matter where you wander. AdventureAdvisor uses tools from expo such as image picker, vector icons, location, and camera. Prompts based on user preference are sent to the OpenAI API, using their chat completions gpt-3.5-turbo model.

Persistantly stored variables are the username, trips, and completed (trips). Trips stores an array of objects. The objects include the following fields: the 'prompt', 'plan' which is the itinerary, 'startDate', and 'endDate'. Once a 'trip' is moved to completed, it adds a field for photos. These values are shared accross the app using value context. Finally, the interractive visualization was created using Three.js with gestures and GLView. The pins are created by turning the destination string to coordinates using Nominatim, an open source Geocoding API that allows free-form queries. 

## How to Start
First, there is no config.js present in this repository. Once pulled to your device, you will need to add 'config.js' to the components folder, and export a constant of your personal OpenAI API key as variable "CHAT_GPT_API_KEY".

Next, open a terminal and navigate to the project. Run - npx expo start, and scan the QR code using a mobile device. You must have the expoGo app already installed on your phone. Alternatively, it should work currently on a computer by editing components/Storage.js to comment out the "storageBackend: AsyncStorage" line and uncomment the "storageBackend: window.localStorage" line. If you wish to open it on the computer after completing this additional step, press w in the terminal. 








