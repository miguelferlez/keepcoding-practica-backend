import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import connectMongoose from './lib/connectMongoose.js';
import * as homeController from './controllers/homeController.js';
import * as loginController from './controllers/loginController.js';

await connectMongoose();
console.log('Connected to MongoDB');

const app = express();

/**
 * View engine setup
 */

app.set('views', 'views');
app.set('view engine', 'ejs');

app.locals.appName = 'Nodepop';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

/**
 * Application routes
 */

app.get('/', homeController.index);
app.get('/login', loginController.index);
app.post('/login', loginController.login);

/**
 * Catch 404 and forward to error handler
 */

app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * Error handler
 */

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.APP_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;