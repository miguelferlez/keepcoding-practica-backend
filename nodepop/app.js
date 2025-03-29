import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import connectMongoose from './lib/connectMongoose.js';
import * as homeController from './controllers/homeController.js';
import * as loginController from './controllers/loginController.js';
import * as sessionManager from './lib/sessionManager.js';
import * as productsController from './controllers/productsController.js';

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
app.use(express.static('public'));

/**
 * Application routes
 */

app.use(sessionManager.userSession);
app.use(sessionManager.setSessionInViews);
app.get('/', homeController.index);
app.get('/login', loginController.index);
app.post('/login', loginController.login);
app.get('/logout', loginController.logout);
app.get('/products/new', sessionManager.guard, productsController.index);
app.post('/products/new', sessionManager.guard, productsController.upload.single('image'), productsController.addProduct);
app.get('/products/delete/:productId', sessionManager.guard, productsController.deleteProduct);

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