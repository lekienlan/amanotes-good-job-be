import express from 'express';
import passportConfig from './config/passport';
import routes from './routes/v1';

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// configure passport
passportConfig();

// v1 api routes
app.use('/api/v1', routes);

export default app;
