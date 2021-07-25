// hi there!
// just wanted to say that this took 3+ hours to figure out.
// please don't steal it without giving credit? :D

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
    let poo;
    await fetch("https://app-api.salad.io/api/v2/machines", {
        "headers": {
            "content-type": "application/json;charset=UTF-8",
            "rid": "session",
            "cookie": `sAccessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsInZlcnNpb24iOiIyIn0=.eyJzZXNzaW9uSGFuZGxlIjoiZmY0NjliZjktNTZjOS00ODQyLWJmNDItYzk4N2ViZjljZDI5IiwidXNlcklkIjoiNjNmNmZkYjktM2M1Ni00ZWE2LTgyYWUtNjRlOGI4Mzc2NGZiIiwicmVmcmVzaFRva2VuSGFzaDEiOiJjNDRkYjM1ZTc1MTFkMDNiM2JkY2NiOGMyZWZlMmU0ZmI2MjYyNjI5YjFmODE4YzA4ZDUzMDgwMGE0NTBlODUzIiwidXNlckRhdGEiOnt9LCJleHBpcnlUaW1lIjoxNjI3MjQwNTM2NTEzLCJ0aW1lQ3JlYXRlZCI6MTYyNzIzNjkzNjUxMywibG1ydCI6MTYyNzIzNjkzNjM0OX0=.lCMq+wx2QJghyrSWj20wmyXqo4McwKqejbVYdmREtJBiwN0W/arCWVX3BKbSmPP51MbHCh5DEI3n6gJTY2kleSUHB7kT3D+9MzIuzCZ9jz58kqfL7NxqJC23byhMLEFAj3MFIcbaT9qFkRH1lB7UnBVVMmXPmV3q82gU13TMw63yYc9lUKmtPhjL/Qg6bRzHwBllnZWCt92iESOhvzaIYWNm6U8QmIdn3JdedWa9oYhCutxUz3zCj0wAHgIsHZWX+OpoMi+zv9YVp5m8UV9tI1kb9VgOfYZDqvBNGlIP0PKEBoAOtqY5BJpjgZG3OsGzpNLiyuVAiVoZJXJTV9YoHQ==;sIdRefreshToken=80d66c04-5fce-426f-baf4-746aef45a0c7`
        },
        "body": `{\"systemInfo\":{\"version\":\"${systemInfo.version}\",\"system\":${JSON.stringify(systemInfo.system)},\"cpu\":${JSON.stringify(systemInfo.cpu)},\"memLayout\":${JSON.stringify(systemInfo.memLayout)},\"graphics\":${JSON.stringify(systemInfo.graphics)},\"os\":${JSON.stringify(systemInfo.os)},\"platform\":${JSON.stringify(systemInfo.platform)},\"uuid\":${JSON.stringify(systemInfo.uuid)}}}`,
        "method": "POST"
        }).then(res => {poo = res.json()}); //didnt need a promise!! :D 
    return poo;
};

(async () => {
console.log(await getInfo());
})();
module.exports = {
    getInfo
};