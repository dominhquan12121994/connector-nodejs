let createError = require('http-errors');
import express, {Application, Request, Response, NextFunction} from 'express'
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const rfs = require('rotating-file-stream')
const winston = require('./configs/winston')
const msbRoute = require('./modules/msb/routes/msb.route');
const mongodb = require('./connections/mongo');

let app: Application = express();

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'log')
})

app.use(logger('combined', { stream: accessLogStream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongodb.once('open', (e: any) => {
  console.log("MONGODB IS CONNECTED");
});

mongodb.on('error', (err: any) => {
  console.error("MONGODB CONNECT ERROR");
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  winston.error('this winston error')
  winston.log({
    level: 'info',
    message: 'this is winston info',
  })
  res.json({
    result: 'integrate wallet bank with nodejs-express-typescript-mongodb'
  })
});

app.use('/msb', msbRoute);

app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

app.use(function(err: any, req: any, res: any, next: any) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
