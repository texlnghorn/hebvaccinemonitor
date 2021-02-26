import {Link, Location} from './store/model';
import chalk from 'chalk';
import {config} from './config';
import winston from 'winston';

const prettyJson = winston.format.printf(info => {
  const timestamp = new Date().toLocaleTimeString();

  let out = `${chalk.grey(`[${timestamp}]`)} ${info.level} ${chalk.grey(
    '::'
  )} ${info.message}`;

  if (Object.keys(info.metadata).length > 0) {
    out = `${out} ${chalk.magenta(JSON.stringify(info.metadata, null, 2))}`;
  }

  return out;
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.metadata({
      fillExcept: ['level', 'message', 'timestamp'],
    }),
    prettyJson
  ),
  level: config.logLevel,
  transports: [new winston.transports.Console({})],
});

export const Print = {
  inStock(
    link: Link,
    location: Location,
    color?: boolean,
    sms?: boolean
  ): string {
    const productString = `${buildProductString(location)} :: IN STOCK`;

    if (color) {
      return chalk.bgGreen.white.bold(`${productString}`);
    }

    if (sms) {
      return productString;
    }

    return `${productString}`;
  },
  productInStock(link: Link, location: Location): string {
    const scheduleUrl = location.url
      ? location.url
      : link.cartUrl
      ? link.cartUrl
      : link.url;
    const productString = `Schedule Page: ${scheduleUrl}`;
    return productString;
  },
  message(
    message: string,
    topic: string,
    store: Location,
    color?: boolean
  ): string {
    if (color) {
      return (
        '✖ ' +
        buildSetupString(topic, store, true) +
        ' :: ' +
        chalk.yellow(message)
      );
    }

    return `✖ ${buildSetupString(topic, store)} :: ${message}`;
  },
};

function buildSetupString(
  topic: string,
  store: Location,
  color?: boolean
): string {
  if (color) {
    return chalk.cyan(`[${store.name}]`) + chalk.grey(` [setup (${topic})]`);
  }

  return `[${store.name}] [setup (${topic})]`;
}

function buildProductString(store: Location, color?: boolean): string {
  if (color) {
    return chalk.cyan(`[${store.name}]`) + chalk.grey(` [${store.city}`);
  }

  return `[${store.name}] [${store.city}]`;
}
