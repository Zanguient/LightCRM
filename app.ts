import express from 'express';
import mongoose from 'mongoose'
import passport from 'passport'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import cors from 'cors';
import keys from './config/keys';

import authRoutes from "./routes/auth";
import analyticsRoutes from "./routes/analytics";
import categoryRoutes from "./routes/category";
import orderRoutes from "./routes/order";
import positionRoutes from "./routes/position";

import passportMiddleware from "./middleware/passport";

const app: express.Application = express();

mongoose.connect(keys.mongoURI)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => {
        console.error(err)
    });

app.use(passport.initialize());
passportMiddleware.passportInit(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;