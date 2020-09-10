exports.toggle = function toggle(rewardID, isPaused, twitchCPRopts) {
    const client_id = twitchCPRopts.client_id;
    const channelID = twitchCPRopts.channelID;
    const authorization = twitchCPRopts.authorization;
    var data2 = `[
    {
        "operationName": "PauseCustomRewardRedemptions",
        "variables": {
            "input": {
                "channelID": "${channelID}",
                "rewardID": "${rewardID}",
                "isPaused": ${isPaused}
            }
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "${twitchCPRopts.sha}"
            }
        }
    }
]`;
    var xhr = getXhr(client_id, authorization)
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (twitchCPRopts.debug === `true`) {
                console.log(`Reward ID: ${rewardID}`);
            } else if (twitchCPRopts.debug === `full`) {
                console.log(this.responseText);
            }
        }
    });
    xhr.send(data2);
};
exports.list = function list(twitchCPRopts) {
    const client_id = twitchCPRopts.client_id;
    const channelID = twitchCPRopts.channelID;
    var data2 = `
    [
        {
            "operationName":"UserModStatus",
            "variables":{
                "channelID":"46332253",
                "userID":"470816908"
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
                "channelLogin":"cazgem"
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
    ]
    `;
    var xhr = getXhr(client_id, Authorization);
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (twitchCPRopts.debug === `true`) {
                // console.log(`Reward ID: ${rewardID}`);
            } else if (twitchCPRopts.debug === `full`) {
                // console.log(this.responseText);
            } else {
                var jsonResponse = JSON.parse(this.responseText)[1].data.user.channel.communityPointsSettings.summarizedRewards;
                var count = 0;
                jsonResponse.forEach(obj => {
                    Object.entries(obj).forEach(([key, value]) => {
                        if (key === "node") {
                            count = count + 1;
                            console.log(`${count} ${value.title} || ${value.id}`);
                        }
                    });
                });
            }
        }
    });
    xhr.send(data2);
};

function getXhr(client_id, authorization) {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    var xhr = new XMLHttpRequest();
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

    return xhr;
}