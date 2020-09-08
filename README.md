# twitch-cpr

Twitch-CPR is meant to act as an extension to tmi.js to allow for the automated pausing/unpausing of channel point rewards.

To find the separate Oauth and Sha key, visit https://www.twitch.tv/popout/username/reward-queue as the account you wish to authorize for these actions, navigate to a reward, and open the browser console.

Look at Network Activity, and click the Pause Redemptions Slider. The Network Activity you are looking for is under "gql".

Grab your Client-ID and Authorization under Headers while you're here. Then, under OperationName->Extentions->PersistedQuery you can find sha256Hash. Grab this for your Sha key.

Then, OperationName->Variables-> Input-> RewardID for the individual RewardID (unless you've written a script for it here)

IMPLEMENTATION

INCLUDES
<code?
const tmi = require('tmi.js');
const config = require('./config'); // Great to store variables safely
const twitchCPR = require(`twitch-cpr`);
</code>
BUILDING THE CONFIG

let twitchCPRopts = {
            client_id: config.identity.client_id, // REQUIRED!
            channelID: context[`room-id`], // REQUIRED!
            authorization: config.identity.authorization, // REQUIRED! OAUTH 456adwn3qf93yufbnojhnbe This may be different than your usual OAUTH Pass. Info on Github.
            sha: config.httpSha256Hash, // REQUIRED! See Github for how to generate
            debug: `false` // Switch to full to allow full debug mode, or true for just the reward ID's (Full Debug not recommended for production use)
        }

PAUSE A REWARD
twitchCPR(rewardID, `true`, twitchCPRopts);

UNPAUSE A REWARD
twitchCPR(rewardID, `false`, twitchCPRopts);

DEBUGGING

OFF
twitchCPR(rewardID, `true`, twitchCPRopts, false);

LIGHT (Prints Reward IDs to Console)
twitchCPR(rewardID, `true`, twitchCPRopts, true);

FULL (Prints entire handshake, exchange, and data dump from the HTTP POST)
twitchCPR(rewardID, `true`, twitchCPRopts, full);
