import {existsSync} from 'fs';
import {banner} from './banner';
import dotenv from 'dotenv';
import path from 'path';
import * as console from 'console';

if (process.env.npm_config_conf) {
  if (
    existsSync(path.resolve(__dirname, '../../' + process.env.npm_config_conf))
  ) {
    dotenv.config({
      path: path.resolve(__dirname, '../../' + process.env.npm_config_conf),
    });
  } else {
    dotenv.config({path: path.resolve(__dirname, '../../.env')});
  }
} else if (existsSync(path.resolve(__dirname, '../../dotenv'))) {
  dotenv.config({path: path.resolve(__dirname, '../../dotenv')});
} else {
  dotenv.config({path: path.resolve(__dirname, '../../.env')});
}

console.info(
  banner.render(
    envOrBoolean(process.env.ASCII_BANNER, false),
    envOrString(process.env.BANNER_COLOR, '#808080')
  )
);

/**
 * Returns environment variable, given array, or default array.
 *
 * @param environment Interested environment variable.
 * @param array Default array. If not set, is `[]`.
 */
function envOrArray(
  environment: string | undefined,
  array?: string[]
): string[] {
  return (environment
    ? environment.includes('\n')
      ? environment.split('\n')
      : environment.split(',')
    : array ?? []
  ).map(s => s.trim());
}

/**
 * Returns environment variable, given boolean, or default boolean.
 *
 * @param environment Interested environment variable.
 * @param boolean Default boolean. If not set, is `true`.
 */
function envOrBoolean(
  environment: string | undefined,
  boolean?: boolean
): boolean {
  return environment ? environment === 'true' : boolean ?? true;
}

/**
 * Returns environment variable, given string, or default string.
 *
 * @param environment Interested environment variable.
 * @param string Default string. If not set, is `''`.
 */
function envOrString(environment: string | undefined, string?: string): string {
  return environment ? environment : string ?? '';
}

/**
 * Returns environment variable, given number, or default number.
 *
 * @param environment Interested environment variable.
 * @param number Default number. If not set, is `0`.
 */
function envOrNumber(environment: string | undefined, number?: number): number {
  return environment ? Number(environment) : number ?? 0;
}

/**
 * Returns environment variable, given number, or default number,
 * while handling dotenv input errors for a Min/Max pair.
 * dotenv errors handled:
 * - Min/Max swapped (Min larger than Max, Max smaller than Min)
 * - Min larger than default Max when no Max defined
 * - Max smaller than default Min when no Min defined
 *
 * @param environmentMin Min environment variable of Min/Max pair.
 * @param environmentMax Max environment variable of Min/Max pair.
 * @param number Default number. If not set, is `0`.
 */
function envOrNumberMin(
  environmentMin: string | undefined,
  environmentMax: string | undefined,
  number?: number
) {
  if (environmentMin || environmentMax) {
    if (environmentMin && environmentMax) {
      return Number(
        Number(environmentMin) < Number(environmentMax)
          ? environmentMin
          : environmentMax
      );
    }

    if (environmentMax) {
      return Number(environmentMax) < (number ?? 0)
        ? Number(environmentMax)
        : number ?? 0;
    }

    if (environmentMin) {
      return Number(environmentMin);
    }
  }

  return number ?? 0;
}

/**
 * Returns environment variable, given number, or default number,
 * while handling dotenv input errors for a Min/Max pair.
 * dotenv errors handled:
 * - Min/Max swapped (Min larger than Max, Max smaller than Min)
 * - Min larger than default Max when no Max defined
 * - Max smaller than default Min when no Min defined
 *
 * @param environmentMin Min environment variable of Min/Max pair.
 * @param environmentMax Max environment variable of Min/Max pair.
 * @param number Default number. If not set, is `0`.
 */
function envOrNumberMax(
  environmentMin: string | undefined,
  environmentMax: string | undefined,
  number?: number
) {
  if (environmentMin || environmentMax) {
    if (environmentMin && environmentMax) {
      return Number(
        Number(environmentMin) < Number(environmentMax)
          ? environmentMax
          : environmentMax
      );
    }

    if (environmentMin) {
      return Number(environmentMin) > (number ?? 0)
        ? Number(environmentMin)
        : number ?? 0;
    }

    if (environmentMax) {
      return Number(environmentMax);
    }
  }

  return number ?? 0;
}

const docker = envOrBoolean(process.env.DOCKER, false);

const logLevel = envOrString(process.env.LOG_LEVEL, 'info');

const notifications = {
  desktop: process.env.DESKTOP_NOTIFICATIONS === 'true',
  email: {
    password: envOrString(process.env.EMAIL_PASSWORD),
    smtpAddress: envOrString(process.env.SMTP_ADDRESS),
    smtpPort: envOrNumber(process.env.SMTP_PORT, 25),
    to: envOrString(
      process.env.EMAIL_TO,
      envOrString(process.env.EMAIL_USERNAME)
    ),
    username: envOrString(process.env.EMAIL_USERNAME),
  },
  phone: {
    availableCarriers: new Map([
      ['att', 'txt.att.net'],
      ['attgo', 'mms.att.net'],
      ['bell', 'txt.bell.ca'],
      ['fido', 'fido.ca'],
      ['google', 'msg.fi.google.com'],
      ['koodo', 'msg.koodomobile.com'],
      ['mint', 'mailmymobile.net'],
      ['rogers', 'pcs.rogers.com'],
      ['sprint', 'messaging.sprintpcs.com'],
      ['telus', 'msg.telus.com'],
      ['tmobile', 'tmomail.net'],
      ['verizon', 'vtext.com'],
      ['virgin', 'vmobl.com'],
      ['virgin-ca', 'vmobile.ca'],
      ['visible', 'vtext.com'],
    ]),
    carrier: envOrArray(process.env.PHONE_CARRIER),
    number: envOrArray(process.env.PHONE_NUMBER),
  },
  playSound: envOrString(process.env.PLAY_SOUND),
  pushbullet: envOrString(process.env.PUSHBULLET),
  slack: {
    channel: envOrString(process.env.SLACK_CHANNEL),
    token: envOrString(process.env.SLACK_TOKEN),
  },
  soundPlayer: envOrString(process.env.SOUND_PLAYER),
};

const store = {
  showOnlyCities: envOrArray(process.env.SHOW_ONLY_CITIES),
  withinDistance: envOrNumber(process.env.WITHIN_DISTANCE),
  latitude: envOrNumber(process.env.LATITUDE),
  longitude: envOrNumber(process.env.LONGITUDE),
  vaccineCheckInterval: envOrNumber(
    process.env.HEB_VACCINE_CHECK_INTERVAL,
    15000
  ),
  vaccineLocationUrl: envOrString(process.env.HEB_VACCINE_LOCATION_URL),
  vaccineScheduleUrl: envOrString(process.env.HEB_VACCINE_SCHEDULE_URL),
};

export const config = {
  docker,
  logLevel,
  notifications,
  store,
};

export function setConfig(newConfig: any) {
  const writeConfig = config as any;
  for (const key of Object.keys(newConfig)) {
    writeConfig[key] = newConfig[key];
  }
}
