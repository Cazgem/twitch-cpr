# twitch-cpr 2.1.5

Twitch-CPR is meant to act as an extension to Polyphony TwitchBot to allow for the automated pausing/unpausing of channel point rewards. It can also run as a stand-alone console application if you wish.

If you like what you see, consider visiting my patreon, or visit my twitch page for a paypal donation link.

### What's New?

Automated MySQL Database Creation, Customized Table Name
Version Call
Code Cleanup

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
- Visit `https://www.twitch.tv/popout/<username>/reward-queue` as the account you wish to authorize for these actions.
- Navigate to a reward.
- Open the browser console.
- Look at Network Activity, and click the Pause Redemptions Slider at the top-left of the page.
- The Network Activity you are looking for is under "gql".
- Grab your Reward ID from Preview->0->data->updateComunityPointsCustomReward->reward->id.
- Simple Reward ID fetcher coming soon to https://polyphony.me/twitch! (2.3)

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
    channel_name: config.default.streamer, // REQUIRED!
    channelID: config.default.channel_id, // REQUIRED!
    authorization: config.identity.authorization, // REQUIRED! OAUTH ****************** This is unique to this service/account combination. Info on Github.
    debug: `false`,
    database: true,
    mysql: {
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    }
}
```

### Implement and Call the Class
```javascript
const Twitch_CPR = require(`twitch-cpr`);
// Call once per command
const twitchCPR = new Twitch_CPR(twitchCPRopts, config.default.channel_id, config.default.streamer); // user-id === room-id in deployment, channel derived automatically
```

## USE

### Toggle a Reward
```javascript
twitchCPR.toggle = function (rewardID, isPaused, twitchCPRopts);
```

### Pause a Reward
```javascript
twitchCPR.pause(rewardID);
```

### Unpause a Reward
```javascript
twitchCPR.unpause(rewardID);
```

### List Rewards Profiles
```javascript
twitchCPR.listGames(channel_id, channel_name, client);
```

### Create a Reward
```javascript
twitchCPR.newGame(game_id, channel_id, channel);
```

### Delete a Reward
```javascript
twitchCPR.deleteGame(game_id, channel_id, channel);
```

### Update a Reward
```javascript
twitchCPR.updateGame(game_id, channel_id, channel);
```

### Switch a Reward
```javascript
twitchCPR.switch(game_id, channel_id, channel);
```

### Call Version
```javascript
twitchCPR.version;
```


Developed by Cazgem for personal use at (https://twitch.tv/cazgem) as well as for his chatbot, Polyphony.