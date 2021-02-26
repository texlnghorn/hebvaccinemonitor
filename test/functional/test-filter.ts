import {Link, Location} from '../../src/store/model';
import {filterLocation} from '../../src/store/filter';
import {logger} from '../../src/logger';

const link: Link = {
  cartUrl: 'https://www.example.com/cartUrl',
  url: 'https://www.example.com/url',
};

const location: Location = {
  zip: '78681-3922',
  type: 'store',
  url:
    'https://heb.secure.force.com/FlexibleScheduler/FSAppointment?event_ID=a8h4P00000003Pd',
  street: '16900 N RANCH ROAD 620',
  storeNumber: 373,
  state: 'TX',
  openTimeslots: 10,
  openAppointmentSlots: 10,
  name: "620 and O'Connor H-E-B",
  longitude: -97.72218,
  latitude: 30.50028,
  city: 'ROUND ROCK',
};

/**
 * Send test email.
 */
const result = filterLocation(location);
logger.info(result);
