import axios from 'axios';

const apiKey = process.env.weatherApiKey;
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data based on city name
export async function getWeatherByCity(city) {
    try {
        const response = await axios.get(baseURL, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric',  // Convert temperature to Celsius
            }
        });
        
        // Extract the needed data from the response
        const { name, weather, main } = response.data;
        return {
            city: name,
            temperature: main.temp,
            description: weather[0].description,
        };
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error.response.data.message || 'Unable to fetch weather data';
    }
}
