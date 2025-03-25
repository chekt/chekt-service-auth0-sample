'use strict';

const appRoot = require('app-root-path');
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const defaultOutputFile = appRoot + '/docs/api.json';
const argvOutputFile = process.argv[2];

const doc = {
  info: {
    title: 'Auth API',
    description: 'Description'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = argvOutputFile || defaultOutputFile;
const endpointsFiles = [appRoot + '/src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
