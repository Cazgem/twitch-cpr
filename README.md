# twitch-cpr

Twitch-CPR is meant to act as an extension to tmi.js to allow for the automated pausing/unpausing of channel point rewards.

To find the separate Oauth and Sha key, visit https://www.twitch.tv/popout/<username>/reward-queue as the account you wish to authorize for these actions, navigate to a reward, and open the browser console.

Look at Network Activity, and click the Pause Redemptions Slider. The Network Activity you are looking for is under "gql".

Grab your Client-ID and Authorization under Headers while you're here. Then, under OperationName->Extentions->PersistedQuery you can find sha256Hash. Grab this for your Sha key.

Then, OperationName->Variables-> Input-> RewardID for the individual RewardID (unless you've written a script for it here)