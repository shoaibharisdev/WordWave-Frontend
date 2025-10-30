import axios from 'axios';

// Function to detect language using LanguageLayer API
const detectLanguage = async (text) => {
  const apiKey = 'f5b1140c3c6e190dbe9bcd2c68f44a7c';
  try {
    const response = await axios.get('http://api.languagelayer.com/detect', {
      params: {
        access_key: apiKey,
        query: text,
      },
    });
    const detectedLanguage = response.data.results[0].language_code;
    return detectedLanguage;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English in case of error
  }
};

// Function to translate text using Google Translate API via RapidAPI
const translateText = async (text, sourceLang) => {
  const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'x-rapidapi-key': '79f95ac61dmshb80731a069ceea9p155477jsne3fc547fb186',
      'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'application/gzip'
    },
    data: {
      q: text,
      source: sourceLang,
      target: 'en'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text in case of error
  }
};

// Combined function to detect and translate text
const detectAndTranslateText = async (text) => {
  const detectedLanguage = await detectLanguage(text);
  if (detectedLanguage !== 'en') {
    return await translateText(text, detectedLanguage);
  }
  return text;
};

export default detectAndTranslateText;
