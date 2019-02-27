const axios = require('axios');

const baseURL = 'https://vpic.nhtsa.dot.gov/api';

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
});

class API {

    static async checkKnownModels({ make }) {

        // Returns a Promise with the response.
        return await client.get(`/vehicles/GetModelsForMake/${make}?format=json`);
    }

}

module.exports = API;
