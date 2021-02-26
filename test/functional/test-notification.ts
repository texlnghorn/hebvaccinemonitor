import {Link, Location} from '../../src/store/model';
import {sendNotification} from '../../src/notification';

const link: Link = {
  cartUrl: 'https://www.example.com/cartUrl',
  url: 'https://www.example.com/url',
};

const location: Location = {
  zip: '78681-3922',
  type: 'store',
  street: '16900 N RANCH ROAD 620',
  storeNumber: 373,
  state: 'TX',
  openTimeslots: 0,
  openAppointmentSlots: 0,
  name: "620 and O'Connor H-E-B",
  longitude: -97.72218,
  latitude: 30.50028,
  city: 'ROUND ROCK',
};

/**
 * Send test email.
 */
sendNotification(link, location);
