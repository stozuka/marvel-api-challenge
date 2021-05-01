import * as winston from 'winston';

let logger: winston.Logger = null;

const getLogger = () => {
  if (!logger) {
    logger = winston.createLogger({
      transports: [new winston.transports.Console()],
    });
  }

  return logger;
};

export const error = (message: any) => {
  getLogger().error(message);
};

export const warn = (message: any) => {
  getLogger().warn(message);
};

export const info = (message: any) => {
  getLogger().info(message);
};

export const debug = (message: any) => {
  getLogger().debug(message);
};
