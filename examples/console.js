//Twitch-CPR v 2.1.3 Console Logging Example (headless)

const config = require(`./secretConfig.js`);
var params = process.argv.slice(2);
const tmi = require('tmi.js');
const client = new tmi.client(config);
// client.connect();
cname = params[0];
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
const Twitch_CPR = require(`../index.js`);
// Call once per command
const twitchCPR = new Twitch_CPR(twitchCPRopts, config.default.channel_id, config.default.streamer); // user-id === room-id in deployment, channel derived automatically
if (cname === `pause`) {
    twitchCPR.pause(`56aa0ba4-8446-47b0-a07e-623ec71bfc92`);
} else if (cname === `unpause`) {
    twitchCPR.unpause(`56aa0ba4-8446-47b0-a07e-623ec71bfc92`);
} else if (cname === `toggle`) {
    twitchCPR.toggle(`56aa0ba4-8446-47b0-a07e-623ec71bfc92`, `off`, twitchCPRopts);
} else if (cname === `list`) {
    twitchCPR.list(config.default.streamer, config.default.channel_id);
} else if (cname === `cpr`) {
    if (params[1] === `update`) {
        twitchCPR.updateGame(params[2], params[3], params[4]);
    } else if (params[1] === `new`) {
        twitchCPR.newGame(params[2], params[3], params[4]);
    } else if (params[1] === `debug`) {
        twitchCPR.debugit(params[2], params[3], params[4]);
    } else if (params[1] === `list`) {
        twitchCPR.listGames(config.default.channel_id, config.default.streamer, client);
    } else if (cname === `version`) {
        console.log(`Twitch CPR Version ${twitchCPR.version}`);
    } else {
        twitchCPR.switch(params[1], config.default.channel_id, config.default.streamer);
    }
} else {
    console.log(`Please follow with pause, unpause, list or toggle (dep.)`);
}