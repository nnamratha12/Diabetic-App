const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.1.0', // Specify the OpenAPI version
    info: {
      title: 'Diabetes Monitoring App API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation for fetching and storing data in MongoDB for the Diabetes Monitoring App', // Description of the API
    },
    servers: [
      {
        url: 'http://localhost:8083', // URL of your server
      },
    ],
  },
  apis: ['routes/*.js'], // Path to the API routes folder
};

const specs = swaggerJsdoc(options);

module.exports = specs;
