module.exports = (rewardID, isPaused, twitchCPRopts) => {
    const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    const client_id = twitchCPRopts.client_id;
    const channelID = twitchCPRopts.channelID;
    const Authorization = twitchCPRopts.authorization;
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
                "sha256Hash": "${twitchCPRopts.sha}"            }
        }
    }
]`;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (twitchCPRopts.debug === `true`) {
                console.log(`Reward ID: ${rewardID}`);
            } else if (twitchCPRopts.debug === `full`) {
                console.log(this.responseText);
            }
        }
    });
    xhr.open("POST", `https://gql.twitch.tv/gql?Client-ID=${client_id}`);
    xhr.setRequestHeader("Accept-Language", "en-US");
    xhr.setRequestHeader("Authorization", `${Authorization}`);
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
    xhr.send(data2);
}