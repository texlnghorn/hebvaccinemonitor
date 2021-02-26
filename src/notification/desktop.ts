import {Link, Location} from '../store/model';
import {Print, logger} from '../logger';
import {config} from '../config';
import {join} from 'path';
import notifier from 'node-notifier';

const {desktop} = config.notifications;

export function sendDesktopNotification(link: Link, location: Location) {
  if (desktop) {
    logger.info('↗ sending desktop notification');
    (async () => {
      notifier.notify({
        message: location.url
          ? location.url
          : link.cartUrl
          ? link.cartUrl
          : link.url,
        open: location.url
          ? location.url
          : link.cartUrl
          ? link.cartUrl
          : link.url,
        title: Print.inStock(link, location),
        sound: true,
      });

      logger.info('✔ desktop notification sent');
    })();
  }
}
