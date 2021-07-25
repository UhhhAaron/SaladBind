const si = require("systeminformation");
const fetch = require("node-fetch");
async function getInfo(sAccessToken, sIdRefreshToken){
    var temp = await si.osInfo()
    const systemInfo = {
        version: await si.version(),
        system: await si.system(),
        cpu: await si.cpu(),
        grpahics: await si.graphics(),
        memLayout: await si.memLayout(),
        os: temp,
        platform: temp.platform,
        uuid: await si.uuid()
    }
    fetch("https://app-api.salad.io/api/v2/machines", {
        "headers": {
            "content-type": "application/json;charset=UTF-8",
            "rid": "session",
            "cookie": `sAccessToken=${sAccessToken};sIdRefreshToken=${sIdRefreshToken}`
        },
        "body": `{\"systemInfo\":{\"version\":\"${systemInfo.version}\",\"system\":${JSON.stringify(systemInfo.system)},\"cpu\":${JSON.stringify(systemInfo.cpu)},\"memLayout\":${JSON.stringify(systemInfo.memLayout)},\"graphics\":${JSON.stringify(systemInfo.graphics)},\"os\":${JSON.stringify(systemInfo.os)},\"platform\":${JSON.stringify(systemInfo.platform)},\"uuid\":${JSON.stringify(systemInfo.uuid)}}}`,
        "method": "POST"
        }).then(res => console.log(res));
    };
module.exports = getInfo;