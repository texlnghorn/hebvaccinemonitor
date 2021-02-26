import {Location} from './model';
import {logger} from '../logger';
import {config} from '../config';

/**
 * Returns true if the city should be checked for stock
 *
 * @param city The city
 */
function filterCities(city: Location['city']): boolean {
  if (config.store.showOnlyCities.length === 0) {
    return true;
  }

  return config.store.showOnlyCities.includes(<string>city);
}

function filterOpenTimeslots(
  openTimeslots: Location['openTimeslots'],
  openAppointmentSlots: Location['openAppointmentSlots']
): boolean {
  // setting this to greater than 2.  because of false positives
  return openTimeslots > 2 && openAppointmentSlots > 2;
}

function filterDistance(
  latitude: Location['latitude'],
  longitude: Location['longitude'],
  name: Location['name']
): boolean {
  if (
    config.store.withinDistance === 0 ||
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
    logger.debug(`Cannot determine distance for ${name}`);
    return true;
  }
  const dist = distance(
    config.store.latitude,
    config.store.longitude,
    latitude ?? 0,
    longitude ?? 0
  );
  logger.debug(
    `${name} is ${dist} miles away with latitude ${latitude} longitude ${longitude}`
  );
  return dist <= config.store.withinDistance;
}

function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }
}

/**
 * Returns true if the link should be checked for stock
 *
 * @param location The location of the HEB store
 */
export function filterLocation(location: Location): boolean {
  return (
    filterOpenTimeslots(location.openTimeslots, location.openAppointmentSlots) &&
    filterCities(location.city) &&
    filterDistance(location.latitude, location.longitude, location.name)
  );
}
