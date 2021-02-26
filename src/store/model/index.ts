import {config} from '../../config';
import {logger} from '../../logger';

printConfig();

export function printConfig() {
  if (config.store.showOnlyCities.length > 0) {
    logger.info(`ℹ selected cities: ${config.store.showOnlyCities.join(', ')}`);
  }
}

export * from './location';
