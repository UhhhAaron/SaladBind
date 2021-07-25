const si = require("systeminformation");
(async () => {
var piss = await si.osInfo()
const systemInfo = {
version: await si.version(),
system: await si.system(),
cpu: await si.cpu(),
grpahics: await si.graphics(),
memLayout: await si.memLayout(),
os: piss,
platform: piss.platform,
uuid: await si.uuid()
}
console.log(systemInfo)

//OUR CODE
const fetch = require("node-fetch");
fetch("https://app-api.salad.io/api/v2/machines", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "fi",
    "content-type": "application/json;charset=UTF-8",
    "rid": "session",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "cookie": ""
  },
  "referrer": "https://app.salad.io/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": `{\"systemInfo\":{\"version\":\"${systemInfo.version}\",\"system\":${JSON.stringify(systemInfo.system)},\"cpu\":${JSON.stringify(systemInfo.cpu)},\"memLayout\":${JSON.stringify(systemInfo.memLayout)},\"graphics\":${JSON.stringify(systemInfo.graphics)},\"os\":${JSON.stringify(systemInfo.os)},\"platform\":${JSON.stringify(systemInfo.platform)},\"uuid\":${JSON.stringify(systemInfo.uuid)}}}`,
  "method": "POST",
  "mode": "cors"
}).then(res => console.log(res));
})();