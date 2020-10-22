# twitch-cpr 2.0

Twitch-CPR is meant to act as an extension to Polyphony TwitchBot to allow for the automated pausing/unpausing of channel point rewards. It can also run as a stand-alone console application if you wish.

## Installation

`npm install twitch-cpr`

To find Special Oauth keys:
- Visit `https://www.twitch.tv/popout/<username>/reward-queue` as the account you wish to authorize for these actions.
- Navigate to a reward.
- Open the browser console.
- Look at Network Activity, and click the Pause Redemptions Slider at the top-left of the page.
- The Network Activity you are looking for is under "gql".
- Grab your Authorization [OAUTH ************************] under Headers.

To generate a client-ID (if you don't have one already):
- Visit dev.twitch.tv/console/apps
- Next to your chatbot/applicaiton name, click "Manage"
- Copy the text inside Client ID

Getting Reward IDs:
Option 1) Visit https://polyphony.me, login with your Twitch Account, and navigate to https://polyphony.me/twitch/rewards.
Option 2) Run the `twitchCPR.list` function (details below) to get your individual reward IDs in the console.

## Implementation

### Includes
```javascript
const twitchCPR = require(`twitch-cpr`);

const mysql = require('mysql'); // Required for 2.0 Upgrade
const tmi = require('tmi.js'); // Recommended for chat functionality, though not strictly necessary to function.
const config = require('./config'); // Great to store variables safely
```

### Building the Config
```javascript
let twitchCPRopts = {
        channelID: context[`room-id`],                  // REQUIRED
        client_id: config.identity.client_id,           // REQUIRED
        channel_name: config.default.streamer,          // REQUIRED
        authorization: config.identity.authorization,   // REQUIRED! "OAUTH ********************" This may WILL BE different than your usual OAUTH Pass. Info on Github.
        debug: `false`                                  // OPTIONAL: Switch to full to allow full debug mode, or true for just the reward ID's (Full Debug not recommended for production use)
    }
```

## USE

### Pause a Reward (New in 1.4)
```javascript
twitchCPR.pause(rewardID);
```

### Unpause a Reward (New in 1.4)
```javascript
twitchCPR.unpause(rewardID);
```

### List Reward IDs (in Console. Still works in 1.5)
```javascript
twitchCPR.list(twitchCPRopts);
```

### List Reward IDs for other channels [1.5+] (in Console)
```javascript
twitchCPR.list(twitchCPRopts, channel);
```

## Toggle [Depreceated]

### [Toggle] Pause a Reward (depreceated)
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts);
```

### [Toggle] Unpause a Reward (depreceated)
```javascript
twitchCPR.toggle(rewardID, `false`, twitchCPRopts);
```

## Debugging

### Off
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts, `false`);
```
### Light - Prints Reward IDs to Console
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts, `true`);
```

### Full - Prints entire handshake, exchange, and data dump from the HTTP POST
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts, `full`);
```

Developed by Cazgem for personal use at (https://twitch.tv/cazgem) as well as for his chatbot, Polyphony.

Credit to BrainlessSociety for discovering some of the endpoints used.
