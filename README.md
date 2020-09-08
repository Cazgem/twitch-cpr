# twitch-cpr

Twitch-CPR is meant to act as an extension to tmi.js to allow for the automated pausing/unpausing of channel point rewards.

To find the separate Oauth and SHA keys:
- Visit `https://www.twitch.tv/popout/<username>/reward-queue` as the account you wish to authorize for these actions.
- Navigate to a reward.
- Open the browser console.
- Look at Network Activity, and click the Pause Redemptions Slider at the top-left of the page.
- The Network Activity you are looking for is under "gql".
- Grab your Client-ID and Authorization under Headers while you're here.
- Under `OperationName -> Extentions -> PersistedQuery` you can find sha256Hash. Grab this for your SHA key.

Then, `OperationName -> Variables-> Input-> RewardID` gives you the individual RewardID (unless you've written a script for it here)

## Implementation

### Includes
```javascript
const tmi = require('tmi.js');
const config = require('./config'); // Great to store variables safely
const twitchCPR = require(`twitch-cpr`);
```
### Building the Config
```javascript
let twitchCPRopts = {
            client_id: config.identity.client_id, // REQUIRED!
            channelID: context[`room-id`], // REQUIRED!
            authorization: config.identity.authorization, // REQUIRED! OAUTH 456adwn3qf93yufbnojhnbe This may be different than your usual OAUTH Pass. Info on Github.
            sha: config.httpSha256Hash, // REQUIRED! See Github for how to generate
            debug: `false` // Switch to full to allow full debug mode, or true for just the reward ID's (Full Debug not recommended for production use)
        }
```

### Pause a Reward
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts);
```

### Unause a Reward
```javascript
twitchCPR.toggle(rewardID, `false`, twitchCPRopts);
```

## Debugging

### Off
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts, false);
```
### Light - Prints Reward IDs to Console
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts, true);
```

### Full - Prints entire handshake, exchange, and data dump from the HTTP POST
```javascript
twitchCPR.toggle(rewardID, `true`, twitchCPRopts, full);
```
