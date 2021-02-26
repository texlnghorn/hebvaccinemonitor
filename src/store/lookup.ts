import {Link, Location} from './model';
import fetch from 'node-fetch';
import {config} from '../config';
import {logger} from '../logger';
import {filterLocation} from './filter';
import {sendNotification} from '../notification';

const link: Link = {
  cartUrl: config.store.vaccineScheduleUrl,
  url: config.store.vaccineScheduleUrl,
};

const inStock: Record<string, boolean> = {};

/**
 * Retrieve the vaccine locations, identify locations that have vaccine and match the filter criteria, send notifications.
 */
async function lookup() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // get the vaccine locations
  const response = await fetch(config.store.vaccineLocationUrl);
  const heblocations = await response.json();
  logger.debug('locations:' + JSON.stringify(heblocations.locations, null, 4));
  logger.info(`found ${heblocations.locations.length} stores`);
  // find and filter locations with availble vaccine
  const availableLocations = heblocations.locations.filter(
    (location: Location) => filterLocation(location)
  );
  if (availableLocations) {
    logger.info(
      `found ${availableLocations.length} stores with vaccine matching search criteria`
    );
  } else {
    logger.info('No stores found with vaccine matching search criteria');
  }
  logger.debug(
    'availableLocations:' +
      JSON.stringify(availableLocations.locations, null, 4)
  );
  // send notifications for each available location
  availableLocations.forEach((location: Location) => {
    if (inStock[location.name]) {
      logger.info(
        `${location.name} still has open time slots, a notification will not be sent again`
      );
    } else {
      sendNotification(link, location);
      logger.info(JSON.stringify(location));
    }
  });
  // used to limit repeat notifications for the same location until the location has no open time slots
  heblocations.locations.forEach((location: Location) =>
    location.openTimeslots > 0
      ? (inStock[location.name] = true)
      : (inStock[location.name] = false)
  );
  /* eslint-enable no-await-in-loop */
}

export async function tryLookupAndLoop() {
  logger.debug(`Starting lookup...`);
  try {
    await lookup();
  } catch (error: unknown) {
    logger.error(error);
  }

  const sleepTime = config.store.vaccineCheckInterval;
  logger.debug(`Lookup done, next one in ${sleepTime} ms`);
  setTimeout(tryLookupAndLoop, sleepTime);
}
