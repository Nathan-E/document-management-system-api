import winston from 'winston';
import 'winston-mongodb';
import 'express-async-errors';

//creating a winston logger object for logging errors
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  //transports are the means by which the errors or info are logged
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.Console(),
     new winston.transports.File({
       filename: 'logfile.log',
       level: 'info'
     }),
    // new winston.transports.MongoDb({db: db, level: 'error'}),
  ],
  //winston exception handler
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'uncaughtExceptions.log'
    }),
    new winston.transports.Console()
  ]
});

/* unhandled promise rejections throw an exception 
so that it can be caught by winston exception handler
*/
process.on('unhandledRejection', ex => {
  process.exit(1);
  throw ex;
});

export default logger;