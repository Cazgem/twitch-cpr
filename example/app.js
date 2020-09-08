// Super Simple Implementation Example //
const tmi = require('tmi.js'); // Technically not required to run, but makes things more useful.
const config = require('./config'); // Great to store variables safely
const twitchCPR = require(`twitch-cpr`);
const mysql = require('mysql');
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
const client = new tmi.Client({
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: config.identity.username,
        password: config.identity.authentication
    },
    channels: ['my-channel']
});
client.connect().catch(console.error);
client.on('message', (channel, context, message, self) => {
    if (self || msg[0] !== '!') {
        return;
    }
    let params = msg.slice(1).split(' ');
    let cname = params.shift().toLowerCase();
    if (cname === `hello`) {
        client.say(channel, `@${context.username}, heya!`);
    } else if (cname === `minecraft`) { ///////// TWITCH-CPR IMPLEMENTATION USE CASE //////////
        let twitchCPRopts = {
            client_id: config.identity.client_id, // REQUIRED!
            channelID: context[`room-id`], // REQUIRED!
            authorization: config.identity.authorization, // REQUIRED! OAUTH 456adwn3qf93yufbnojhnbe This may be different than your usual OAUTH Pass. Info on Github.
            sha: config.httpSha256Hash, // REQUIRED! See Github for how to generate
            debug: `false` // Switch to full to allow full debug mode, or true for just the reward ID's (Full Debug not recommended for production use)
        }
        let game = `minecraft`;
        let sql = `SELECT rewardID FROM channelpoints_rewards WHERE channelID = ? AND game != ?`;
        let cazgemRewards = db.query(sql, [channelID, game], (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
                if (cazgemRewards) {
                    twitchCPR(result[key].rewardID, `true`, twitchCPRopts); // Turn OFF rewards for games not being played.
                }
            });
        });
        let sql2 = `SELECT rewardID FROM channelpoints_rewards WHERE channelID = ? AND game = ?`;
        let cazgemRewards2 = db.query(sql2, [channelID, game], (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
                if (cazgemRewards2) {
                    twitchCPR(result[key].rewardID, `false`, twitchCPRopts); // Turn ON rewards for games being played.
                }
            });
        });
        client.action(channel, `Channel Point Rewards for ${game} activated!`);
    } else if (cname === `citiesskylines`) {
        let twitchCPRopts = {
            client_id: config.identity.client_id, // wrer45dsdewn3qffbnojbe This will be different than your usual client ID. Info on Github.
            channelID: context[`room-id`], //context['room-id'] works here!
            authorization: config.identity.authorization, // OAUTH 456adwn3qf93yufbnojhnbe This will be different than your usual OAUTH Pass. Info on Github.
            sha: config.httpSha256Hash,
            debug: `true`
        }
        let game = `minecraft`;
        let sql = `SELECT rewardID FROM channelpoints_rewards WHERE channelID = ? AND game != ?`;
        let cazgemRewards = db.query(sql, [channelID, game], (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
                if (cazgemRewards) {
                    twitchCPR(result[key].rewardID, `true`, twitchCPRopts); // Turn OFF rewards for games not being played.
                }
            });
        });
        let sql2 = `SELECT rewardID FROM channelpoints_rewards WHERE channelID = ? AND game = ?`;
        let cazgemRewards2 = db.query(sql2, [channelID, game], (err, result) => {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
                if (cazgemRewards2) {
                    twitchCPR(result[key].rewardID, `false`, twitchCPRopts); // Turn ON rewards for games being played.
                }
            });
        });
        client.action(channel, `Channel Point Rewards for ${game} activated!`);
    } else {

    }

}
});