import axios from 'axios';

const API_BASE_URL = 'https://quizappapi-0cf91e1b68f1.herokuapp.com';

export const fetchQuestions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};
