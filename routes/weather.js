import express from 'express';
import { getWeatherByCity } from '../services/weatherService.js';

const weatherRouter = express.Router();

// GET /api/weather?city={city}
weatherRouter.get('/', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const weatherData = await getWeatherByCity(city);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default weatherRouter;
