// hi there!
// just wanted to say that this took 3+ hours to figure out.
// please don't steal it without giving credit? :D

const si = require("systeminformation");
const fetch = require("node-fetch");
async function getInfo(sAccessToken){
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
    let poo;
    await fetch("https://app-api.salad.io/api/v2/machines", {
        "headers": {
            "content-type": "application/json;charset=UTF-8",
            "rid": "session",
            "cookie": `sAccessToken=${sAccessToken};sIdRefreshToken=notrequiredforthisbecausewedontkeepitlol`
        },
        "body": `{\"systemInfo\":{\"version\":\"${systemInfo.version}\",\"system\":${JSON.stringify(systemInfo.system)},\"cpu\":${JSON.stringify(systemInfo.cpu)},\"memLayout\":${JSON.stringify(systemInfo.memLayout)},\"graphics\":${JSON.stringify(systemInfo.graphics)},\"os\":${JSON.stringify(systemInfo.os)},\"platform\":${JSON.stringify(systemInfo.platform)},\"uuid\":${JSON.stringify(systemInfo.uuid)}}}`,
        "method": "POST"
        }).then(res => {poo = res.json()}); 
    return poo;
};
   

module.exports = {
    getInfo
};