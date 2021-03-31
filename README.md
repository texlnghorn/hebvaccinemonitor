HEBVACCINEMONITOR
==============================
## Features

First and foremost, this service _will not_ automatically register you for a vaccine appointment at HEB.

- **Checks for vaccine appointments** -- runs 24/7, 365.
- **Notifications galore** -- when you're not by your computer, worry free with notifications .

## Quick start

hebvaccinemonitor runs on Node.js:

```shell
git clone https://github.com/texlnghorn/hebvaccinemonitor.git
cd hebvaccinemonitor && npm i && npm run start
```

## Configuration

Copy the dotenv-example to .env

Example .env
```shell
DESKTOP_NOTIFICATIONS="true"
EMAIL_USERNAME="<the gmail email to send notification emails and texts from>"
EMAIL_PASSWORD="<the gmail password>"
EMAIL_TO="<comma separated emails to send notification email to>"
LOG_LEVEL="info"
PHONE_NUMBER="<comma separated phone numbers to send notification text messages to>"
PHONE_CARRIER="<comma separated phone carrier matching the phone numbers>"
PLAY_SOUND="/System/Library/Sounds/Ping.aiff"
SHOW_ONLY_CITIES=""
COUNTRY="usa"
HEB_VACCINE_CHECK_INTERVAL=10000
HEB_VACCINE_LOCATION_URL="http://vaccine.heb.com/vaccine_locations.json"
HEB_VACCINE_SCHEDULE_URL="https://vaccine.heb.com/scheduler"
LATITUDE=30.51261
LONGITUDE=-97.63135
WITHIN_DISTANCE=50
```

## Test Your Notifications

The notifications can be tested prior to running the monitor.

```shell
npm run test:notification
```
