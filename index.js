//Twitch-CPR v 3.0.0 EventSub Update
const request = require(`request`);
const Promise = require('promise');
const mysql = require(`mysql`);
const Polyphony = require(`polyphony.js`);
module.exports = TwitchCPR;
function TwitchCPR(config, polyphony_link = null) {
    this.channel_name = config.default.channel_name,                       // REQUIRED!  
        this.channelID = config.default.channel_id,                        // REQUIRED!
        this.channel_id = config.default.channel_id,
        this.authorization = config.identity.authorization,   // REQUIRED! OAUTH ********************* This is unique to this service/account combination. Info on Github.
        this.debug = config.twitchCPR.debug || `false`,
        this.database = config.twitchCPR.database || true,
        this.tableName = config.twitchCPR.tableName || `twitchCPR`,
        this.db = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
        });
    this.version = `3.0.0 EventSub Update`;
    this.client_id = config.identity.client_id;      //Static Client ID used by the GQL endpoint. Left as a field incase of future breaks.
    let sql = `create table if not exists ${this.tableName}(
        id int(11) primary key auto_increment,
        channel_id int(12),
        game_id varchar(50),
        reward_id varchar(50),
        reward_title varchar(125) default null,
        isPaused varchar(5)
    )`;
    let createDB = this.db.query(sql, (err, result) => {
        if (err) throw err;
    });
    this.polyphony = polyphony_link || new Polyphony(config).Twitch;
}
TwitchCPR.prototype.create = function (channel_id, _body, callback) {
    const that = this;
    this.polyphony.fetchAccessToken(channel_id, function (err, token) {
        if (!token) { console.log(`No Access Token Found!`); throw err; } else {
            let body = _body;
            const opts = {
                method: 'POST',
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel_id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': `${that.client_id}`
                },
                body,
                json: true
            };
            console.log(opts)
            request(opts, function (error, response, resbody) {
                if (!error && response.statusCode == 200) {
                    // return callback(null, JSON.parse(response.body).data[0]);
                    return callback(null, response.body);
                } else {
                    console.log(`Request ${error}`);
                    that.polyphony.refreshToken(channel_id, function (err, res) {
                        // that.fetchAccessToken(channel_id, function (err, res) {
                        return callback(null, res);
                        // }, res.access_token);
                    });
                    return callback(`Refreshing Token!`, null);
                }
            });
        }
    })
}
TwitchCPR.prototype.enable = function (channel_id, id, callback) {
    const that = this;
    this.polyphony.fetchAccessToken(channel_id, function (err, token) {
        if (!token) { console.log(`No Access Token Found!`); throw err; } else {
            let body = {
                is_enabled: true
            }
            const opts = {
                method: 'PATCH',
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel_id}&id=${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': `${that.client_id}`
                },
                body,
                json: true
            };
            request(opts, function (error, response, resbody) {
                if (!error && response.statusCode == 200) {
                    // return callback(null, JSON.parse(response.body).data[0]);
                    console.log(`Success!`);
                    return callback(null, response);
                } else {
                    console.log(response)
                    that.polyphony.refreshToken(channel_id, function (err, res) {
                        // that.fetchAccessToken(channel_id, function (err, res) {
                        return callback(null, res);
                        // }, res.access_token);
                    });
                    return callback(`Refreshing Token!`, null);
                }
            });
        }
    });
}
TwitchCPR.prototype.disable = function (channel_id, id, callback) {
    const that = this;
    this.polyphony.fetchAccessToken(channel_id, function (err, token) {
        if (!token) { console.log(`No Access Token Found!`); throw err; } else {
            let body = {
                is_enabled: false
            }
            const opts = {
                method: 'PATCH',
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel_id}&id=${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': `${that.client_id}`
                },
                body,
                json: true
            };
            request(opts, function (error, response, resbody) {
                if (!error || response.statusCode == 200) {
                    // return callback(null, JSON.parse(response.body).data[0]);
                    return callback(null, response);
                } else {
                    that.polyphony.refreshToken(channel_id, function (err, res) {
                        // that.fetchAccessToken(channel_id, function (err, res) {
                        return callback(null, res);
                        // }, res.access_token);
                    });
                    return callback(`Refreshing Token!`, null);
                }
            });
        }
    });
}
TwitchCPR.prototype.delete = function (channel_id, id, callback) {
    const that = this;
    this.polyphony.fetchAccessToken(channel_id, function (err, token) {
        if (!token) { console.log(`No Access Token Found!`); throw err; } else {
            // console.log(`found token for ${channel_id}`)
            const opts = {
                method: 'DELETE',
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel_id}&id=${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': `${that.client_id}`
                }
            };
            request(opts, function (error, response, resbody) {
                if (!error || response.statusCode == 204) {
                    return callback(null, JSON.parse(response.statusCode));
                } else {
                    that.polyphony.refreshToken(channel_id, function (err, res) {
                        // that.fetchAccessToken(channel_id, function (err, res) {
                        return callback(null, res);
                        // }, res.access_token);
                    });
                    return callback(`Refreshing Token!`, null);
                }
            });
        }
    });
}
TwitchCPR.prototype.get = function (channel_id, id, callback) {
    const that = this;
    this.polyphony.fetchAccessToken(channel_id, function (err, token) {
        if (!token) { console.log(`No Access Token Found!`); throw err; } else {
            // console.log(`found token for ${channel_id}`)
            const opts = {
                method: 'GET',
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel_id}&id=${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': `${that.client_id}`
                }
            };
            request(opts, function (error, response, resbody) {
                if (!error || response.statusCode == 204) {
                    return callback(null, JSON.parse(response.body).data[0]);
                } else {
                    that.polyphony.refreshToken(channel_id, function (err, res) {
                        // that.fetchAccessToken(channel_id, function (err, res) {
                        return callback(null, res);
                        // }, res.access_token);
                    });
                    return callback(`Refreshing Token!`, null);
                }
            });
        }
    });
}
TwitchCPR.prototype.list = function (channel_id, callback) {
    const that = this;
    this.polyphony.fetchAccessToken(channel_id, function (err, token) {
        if (!token) { console.log(`No Access Token Found!`); throw err; } else {
            const opts = {
                method: 'GET',
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel_id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': `${that.client_id}`
                }
            };
            request(opts, function (error, response, resbody) {
                if (!error || response.statusCode == 204) {
                    return callback(null, JSON.parse(response.body).data);
                } else {
                    that.polyphony.refreshToken(channel_id, function (err, res) {
                        // that.fetchAccessToken(channel_id, function (err, res) {
                        return callback(null, res);
                        // }, res.access_token);
                    });
                    return callback(`Refreshing Token!`, null);
                }
            });
        }
    });
}
TwitchCPR.prototype.transfer = function (channel_id, callback) {
    const that = this;
    this.list(channel_id, function (err, res) {
        res.forEach(cpr => {
            console.log(`${cpr.title} | ${cpr.id} | ${cpr.is_enabled}`);
            let load = {
                broadcaster_id: cpr.broadcaster_id,
                id: cpr.id,
                title: cpr.title,
                prompt: cpr.prompt,
                cost: cpr.cost,
                image: cpr.image,
                default_image: cpr.default_image,
                background_color: cpr.background_color,
                is_enabled: cpr.is_enabled,
                is_user_input_required: cpr.is_user_input_required,
                max_per_stream_setting: cpr.max_per_stream_setting,
                max_per_user_per_stream_setting: cpr.max_per_user_per_stream_setting,
                global_cooldown_setting: cpr.global_cooldown_setting,
                is_paused: cpr.is_paused,
                is_in_stock: cpr.is_in_stock,
                should_redemptions_skip_request_queue: cpr.should_redemptions_skip_request_queue,
                redemptions_redeemed_current_stream: cpr.redemptions_redeemed_current_stream,
                cooldown_expires_at: cpr.cooldown_expires_at
            };
            let sql = `INSERT INTO channelpointsrewards SET ?`;
            let cazgemRewards = that.db.query(sql, load, (err, result) => {
                if (err) throw err;
            });
        });
    })
}
TwitchCPR.prototype.toggle = function (rewardID, isPaused, twitchCPRopts) {
    const pause = isPaused;
    if ((pause === `on`) || (pause === `enable`) || (pause === `enabled`)) {
        paused = `false`;
    } else if ((pause === `off`) || (pause === `disable`) || (pause === `disabled`)) {
        paused = `true`;
    }
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const client_id = this.client_id;
    const channelID = twitchCPRopts.channelID;
    const channel_name = twitchCPRopts.channel_name;
    const authorization = twitchCPRopts.authorization;
    const debug = twitchCPRopts.debug;
    if (debug === ``) {
        const debug = `false`;
    } else {
        const debug = twitchCPRopts.debug;
    }
    var data = `[
    {
        "operationName": "PauseCustomRewardRedemptions",
        "variables": {
            "input": {
                "channelID": "${channelID}",
                "rewardID": "${rewardID}",
                "isPaused": ${paused}
            }
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "0cf84624f984ef052db18bedb2e034a5c1017dda9d065bb0f6978c3128fa9b99"            }
        }
    }
]`;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Is Paused: ${paused}`);
                console.log(`Reward ID: ${rewardID}`);
                console.log(`Client ID: ${client_id}`);
                console.log(`Channel ID: ${channelID}`);
                console.log(`Channel Name: ${channel_name}`);
                console.log(`Authentication: ${authorization}`);
                console.log(`Raw: ${data}`);
            } else if (debug === `full`) {
                console.log(`Raw: ${data}`);
                console.log(`----------------------------`);
                console.log(this.responseText);
            }
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.pause = function (rewardID) {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const channelID = this.channelID;
    const channel_name = this.channel_name;
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    var data = `[
    {
        "operationName": "PauseCustomRewardRedemptions",
        "variables": {
            "input": {
                "channelID": "${channelID}",
                "rewardID": "${rewardID}",
                "isPaused": true
            }
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "0cf84624f984ef052db18bedb2e034a5c1017dda9d065bb0f6978c3128fa9b99"            }
        }
    }
]`;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Reward ID: ${rewardID}`);
                console.log(`Client ID: ${client_id}`);
                console.log(`Channel ID: ${channelID}`);
                console.log(`Channel Name: ${channel_name}`);
                console.log(`Authentication: ${authorization}`);
                console.log(`Raw: ${data}`);
            } else if (debug === `full`) {
                console.log(`Raw: ${data}`);
                console.log(`----------------------------`);
                console.log(this.responseText);
            }
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.unpause = function (rewardID) {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const channelID = this.channelID;
    const channel_name = this.channel_name;
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    var data = `[
    {
        "operationName": "PauseCustomRewardRedemptions",
        "variables": {
            "input": {
                "channelID": "${channelID}",
                "rewardID": "${rewardID}",
                "isPaused": false
            }
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "0cf84624f984ef052db18bedb2e034a5c1017dda9d065bb0f6978c3128fa9b99"            }
        }
    }
]`;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Reward ID: ${rewardID}`);
                console.log(`Client ID: ${client_id}`);
                console.log(`Channel ID: ${channelID}`);
                console.log(`Channel Name: ${channel_name}`);
                console.log(`Authentication: ${authorization}`);
                console.log(`Raw: ${data}`);
            } else if (debug === `full`) {
                console.log(`Raw: ${data}`);
                console.log(`----------------------------`);
                console.log(this.responseText);
            }
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.listByGame = function (game_id, channel_id, channel) {
    const channelID = channel_id;
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    if (debug === `true`) {
        console.log(`Client ID: ${client_id}`);
        console.log(`Channel ID: ${channel_id}`);
        console.log(`Channel Name: ${channel}`);
        console.log(`Authentication: ${authorization}`);
    } else if (debug === `full`) {
        console.log(this.responseText);
    } else {
    }
    let sql = `SELECT * FROM ${this.tableName} WHERE channel_id='${channelID}' AND game_id='${game_id}' AND isPaused='0'`;
    this.db.query(sql, function (err, row, fields) {
        row.forEach(element => {
            let string = `${element.reward_title}: ${element.reward_id}`;
            console.log(string);
        });
    });
}
TwitchCPR.prototype.listAll = function (channel_id, channel) {
    const channelID = channel_id;
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    if (debug === `true`) {
        console.log(`Client ID: ${client_id}`);
        console.log(`Channel ID: ${channel_id}`);
        console.log(`Channel Name: ${channel}`);
        console.log(`Authentication: ${authorization}`);
    } else if (debug === `full`) {
        console.log(this.responseText);
    } else {
    }
    let sql = `SELECT * FROM ${this.tableName} WHERE channel_id='${channelID}'`;
    this.db.query(sql, function (err, row, fields) {
        row.forEach(element => {
            let string = `${element.reward_title}: ${element.reward_id}`;
            console.log(string);
        });
    });
}
TwitchCPR.prototype.listGames = function (channel_id, channel_name, client) {
    const channelID = channel_id;
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    if (debug === `true`) {
        console.log(`Client ID: ${client_id}`);
        console.log(`Channel ID: ${channel_id}`);
        console.log(`Channel Name: ${channel_name}`);
        console.log(`Authentication: ${authorization}`);
    } else if (debug === `full`) {
        console.log(this.responseText);
    } else {
        // Hello There! Like the scripts? Consider checking out My patreon. :) (https://patreon.com/cazgem)
    }
    let sql = `SELECT DISTINCT game_id FROM ${this.tableName} WHERE channel_id='${channelID}'`;
    this.db.query(sql, function (err, row, fields) {
        let total = row.length;
        var count = 0;
        var list = 'Twitch CPR Profiles: ';
        row.forEach(element => {
            count = count + 1;
            if (count === total) {
                let string = `${element.game_id}`;
                list = list + string;
                client.action(channel_name, list);
                // console.log(`${list}`);
            } else {
                let string = `${element.game_id}, `;
                list = list + string;
            }
        })
    });
}
TwitchCPR.prototype.newGame = function (game_id, channel_id, channel) {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const channelID = this.channelID;
    if (channel) {
        channel_name = channel;
    } else {
        channel_name = this.channel_name;
    }
    if (channel_id) {
        channel_id = channel_id;
    } else {
        channel_id = this.channelID;
    }
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    var data = `[
            {
                "operationName": "UserModStatus",
                "variables":
                {
                    "channelID":"${channelID}",
                    "userID":"${channelID}"
                },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"511b58faf547070bc95b7d32e7b5cdedf8c289a3aeabfc3c5d3ece2de01ae06f"
                        }
                    }
                },
                {
                    "operationName":"CoPoRewardQueue",
                    "variables":{
                        "channelLogin":"${channel_name}"
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"672bbf3146996aaa0d0893a1b1d3bb12a0e16de849859c2878d5894885bd7e37"
                        }
                    }
                },
                {
                    "operationName":"ConnectAdIdentityMutation",
                    "variables":{
                        "input":{
                            "targetDeviceID":"da44671b62825c5e"
                        }
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"aeb02ffde95392868a9da662631090526b891a2972620e6b6393873a39111564"
                        }
                    }
                }
            ]`;
    var xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Client ID: ${client_id}`);
                console.log(`Channel ID: ${channelID}`);
                console.log(`Channel Name: ${channel_name}`);
                console.log(`Authentication: ${authorization}`);
            } else if (debug === `full`) {
                console.log(this.responseText);
            } else {
            }
            var jsonResponse = JSON.parse(this.responseText)[1].data.user.channel.communityPointsSettings.summarizedRewards;
            var count = 0;
            jsonResponse.forEach(obj => {
                Object.entries(obj).forEach(([key, value]) => {
                    if (key === "node") {
                        let load = {
                            isPaused: value.isPaused,
                            reward_title: value.title,
                            channel_id: channel_id,
                            game_id: game_id,
                            reward_id: value.id
                        };
                        let sql = `REPLACE INTO ${that.tableName} SET ?`;
                        let cazgemRewards = that.db.query(sql, load, (err, result) => {
                            if (err) throw err;
                        });
                    }

                });
            });
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.deleteGame = function (game_id, channel_id, channel) {
    if (channel) {
        channel_name = channel;
    } else {
        channel_name = this.channel_name;
    }
    if (channel_id) {
        channel_id = channel_id;
    } else {
        channel_id = this.channelID;
    }
    const that = this;
    let load = {
        channel_id: channel_id,
        game_id: game_id
    };
    let sql = `DELETE FROM ${this.tableName} WHERE channel_id='${channel_id}' AND game_id='${game_id}'`;
    let cazgemRewards = that.db.query(sql, load, (err, result) => {
        if (err) throw err;
    });
}
TwitchCPR.prototype.updateGame = function (game_id, channel_id, channel) {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const channel_id = this.channel_id;
    if (channel) {
        channel_name = channel;
    } else {
        channel_name = this.channel_name;
    }
    if (channel_id) {
        channel_id = channel_id;
    } else {
        channel_id = this.channel_id;
    }
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    var data = `[
            {
                "operationName": "UserModStatus",
                "variables":
                {
                    "channelID":"${channelID}",
                    "userID":"${channelID}"
                },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"511b58faf547070bc95b7d32e7b5cdedf8c289a3aeabfc3c5d3ece2de01ae06f"
                        }
                    }
                },
                {
                    "operationName":"CoPoRewardQueue",
                    "variables":{
                        "channelLogin":"${channel_name}"
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"672bbf3146996aaa0d0893a1b1d3bb12a0e16de849859c2878d5894885bd7e37"
                        }
                    }
                },
                {
                    "operationName":"ConnectAdIdentityMutation",
                    "variables":{
                        "input":{
                            "targetDeviceID":"da44671b62825c5e"
                        }
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"aeb02ffde95392868a9da662631090526b891a2972620e6b6393873a39111564"
                        }
                    }
                }
            ]`;
    var xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Client ID: ${client_id} | Channel ID: ${channel_id} | Channel Name: ${channel_name} | Authentication: ${authorization}`);
            } else if (debug === `full`) {
                console.log(this.responseText);
            } else {
            }
            var jsonResponse = JSON.parse(this.responseText)[1].data.user.channel.communityPointsSettings.summarizedRewards;
            var count = 0;
            jsonResponse.forEach(obj => {
                Object.entries(obj).forEach(([key, value]) => {
                    if (key === "node") {
                        let load = {
                            isPaused: value.isPaused,
                            channel_id: channel_id,
                            reward_title: value.title,
                            game_id: game_id,
                            reward_id: value.id
                        };
                        let sql = `REPLACE INTO ${that.tableName} SET ?`;
                        let cazgemRewards = that.db.query(sql, load, (err, result) => {
                            if (err) throw err;
                        });
                    }

                });
            });
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.switch = function (game_id, channel_id, channel_name, callback) {
    console.log(`${game_id} ${channel_id} ${channel_name}`)
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const channelID = channel_id;
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    var data = `[
            {
                "operationName": "UserModStatus",
                "variables":
                {
                    "channelID":"${channelID}",
                    "userID":"${channelID}"
                },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"511b58faf547070bc95b7d32e7b5cdedf8c289a3aeabfc3c5d3ece2de01ae06f"
                        }
                    }
                },
                {
                    "operationName":"CoPoRewardQueue",
                    "variables":{
                        "channelLogin":"${channel_name}"
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"672bbf3146996aaa0d0893a1b1d3bb12a0e16de849859c2878d5894885bd7e37"
                        }
                    }
                },
                {
                    "operationName":"ConnectAdIdentityMutation",
                    "variables":{
                        "input":{
                            "targetDeviceID":"da44671b62825c5e"
                        }
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"aeb02ffde95392868a9da662631090526b891a2972620e6b6393873a39111564"
                        }
                    }
                }
            ]`;
    var xhr = new XMLHttpRequest();
    const that = this;
    const db = that.db;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Client ID: ${client_id}`);
                console.log(`Channel ID: ${channelID}`);
                console.log(`Channel Name: ${channel_name}`);
                console.log(`Authentication: ${authorization}`);
            } else if (debug === `full`) {
                console.log(this.responseText);
            } else {
            }
            var jsonResponse = JSON.parse(this.responseText)[1].data.user.channel.communityPointsSettings.summarizedRewards;
            var count = 0;
            var promise = new Promise(function (resolve, reject) {
                resolve(
                    jsonResponse.forEach(obj => {
                        Object.entries(obj).forEach(([key, value]) => {
                            if (key === "node") {
                                let sql = `SELECT * FROM ${that.tableName} WHERE channel_id='${channelID}' AND game_id='${game_id}' AND reward_id='${value.id}'`;
                                that.db.query(sql, function (err, result, fields) {
                                    if (callback) {
                                        callback(err, result);
                                    }
                                    // if (err) throw err;
                                    if (result.length > 0) {
                                        if (result[0].isPaused === `1`) {
                                            that.pause(`${result[0].reward_id}`)
                                        } else if (result[0].isPaused === `0`) {
                                            that.unpause(`${result[0].reward_id}`)
                                        }
                                    } else {
                                    }
                                });
                            }

                        })
                    })
                )
            });
            promise.then(
                console.log(`Profile Switched to ${game_id}`)
            )
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.debugit = function (channel) {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const channelID = this.channelID;
    if (channel) {
        channel_name = channel;
    } else {
        channel_name = this.channel_name;
    }
    const authorization = this.authorization;
    const client_id = this.client_id;
    const debug = this.debug === `` ? `false` : this.debug;
    var data = `[
            {
                "operationName": "UserModStatus",
                "variables":
                {
                    "channelID":"${channelID}",
                    "userID":"${channelID}"
                },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"511b58faf547070bc95b7d32e7b5cdedf8c289a3aeabfc3c5d3ece2de01ae06f"
                        }
                    }
                },
                {
                    "operationName":"CoPoRewardQueue",
                    "variables":{
                        "channelLogin":"${channel_name}"
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"672bbf3146996aaa0d0893a1b1d3bb12a0e16de849859c2878d5894885bd7e37"
                        }
                    }
                },
                {
                    "operationName":"ConnectAdIdentityMutation",
                    "variables":{
                        "input":{
                            "targetDeviceID":"da44671b62825c5e"
                        }
                    },
                    "extensions":{
                        "persistedQuery":{
                            "version":1,
                            "sha256Hash":"aeb02ffde95392868a9da662631090526b891a2972620e6b6393873a39111564"
                        }
                    }
                }
            ]`;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (debug === `true`) {
                console.log(`Client ID: ${client_id}`);
                console.log(`Channel ID: ${channelID}`);
                console.log(`Channel Name: ${channel_name}`);
                console.log(`Authentication: ${authorization}`);
            } else if (debug === `full`) {
                console.log(this.responseText);
            } else {
            }
            var jsonResponse = JSON.parse(this.responseText)[1].data.user.channel.communityPointsSettings.summarizedRewards;
            var count = 0;
            jsonResponse.forEach(obj => {
                Object.entries(obj).forEach(([key, value]) => {
                    if (key === "node") {
                        count = count + 1;
                        console.log(`${count} ${value.title} || ${value.id} || ${value.isPaused}`);
                        // console.log(`${count} ${value.title} || ${JSON.stringify(value)}`);
                    }
                });
            });
        }
    });
    this.xhrGET(xhr, data, client_id, authorization);
}
TwitchCPR.prototype.xhrGET = function (xhr, data, client_id, authorization) {
    xhr.withCredentials = true;
    xhr.open("POST", `https://gql.twitch.tv/gql?Client-ID=${client_id}`);
    xhr.setRequestHeader("Accept-Language", "en-US");
    xhr.setRequestHeader("Authorization", `${authorization}`);
    xhr.setRequestHeader("Content-Type", `application/json`);
    xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.26.3");
    xhr.setRequestHeader("Client-Id", `${client_id}`);
    xhr.setRequestHeader("X-Device-Id", "56ba665ec8de11eb");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Sec-Fetch-Site", "same-site");
    xhr.setRequestHeader("Sec-Fetch-Mode", "cors");
    xhr.setRequestHeader("dnt", "1");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", `be9142ed-85c1-4a9c-b014-811d3c8bf9a3,6ff3ffc8-8841-46cb-bbd7-7690b355440e`);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
}
TwitchCPR.prototype.cleanup = function () {
    this.db.end(function (err) {
        if (err) {
        }
    });
}