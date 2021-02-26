import * as Process from 'process';
import {config} from './config'; // Needs to be loaded first
import {logger} from './logger';
import {tryLookupAndLoop} from './store';

/**
 * Starts the bot.
 */
async function main() {
  const args: string[] = [];

  // https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#tips
  // https://stackoverflow.com/questions/48230901/docker-alpine-with-node-js-and-chromium-headless-puppeter-failed-to-launch-c
  if (config.docker) {
    args.push('--disable-dev-shm-usage');
    args.push('--no-sandbox');
    args.push('--disable-setuid-sandbox');
    args.push('--headless');
    args.push('--disable-gpu');
  }

  if (args.length > 0) {
    logger.info('ℹ puppeteer config: ', args);
  }

  await stop();

  setTimeout(tryLookupAndLoop, config.store.vaccineCheckInterval);
}

async function stop() {}

async function stopAndExit() {
  await stop();
  Process.exit(0);
}

/**
 * Will continually run until user interferes.
 */
async function loopMain() {
  try {
    await main();
  } catch (error: unknown) {
    logger.error(
      '✖ something bad happened, resetting hebvaccinemonitor in 5 seconds',
      error
    );
    setTimeout(loopMain, 5000);
  }
}

void loopMain();

process.on('SIGINT', stopAndExit);
process.on('SIGQUIT', stopAndExit);
process.on('SIGTERM', stopAndExit);
