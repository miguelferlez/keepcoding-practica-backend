import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import connectMongoose from './lib/connectMongoose.js';

await connectMongoose();
console.log('Connected to MongoDB');

const app = express();

/**
 * View engine setup
 */

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

/**
 * Application routes
 */

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;