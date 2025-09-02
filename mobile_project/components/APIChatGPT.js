// services/chatGPTService.js
import axios from 'axios';
import CONFIG from './config.js';

const chatGPTService = async (message) => {
  const apiKey = CONFIG.CHAT_GPT_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000,
    temperature: 0.7
  };

  try {
    const response = await axios.post(url, data, { headers });
    //console.log('API Response:', response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      // Enhanced error logging
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export default chatGPTService;
