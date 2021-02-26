import {Link, Location} from '../store/model';
import {playSound} from './sound';
import {sendDesktopNotification} from './desktop';
import {sendEmail} from './email';
import {sendSlackMessage} from './slack';
import {sendSms} from './sms';

export function sendNotification(link: Link, location: Location) {
  // Priority
  playSound();
  sendDesktopNotification(link, location);
  sendEmail(link, location);
  sendSms(link, location);
  sendSlackMessage(link, location);
}
