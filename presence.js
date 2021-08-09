const RPC = require('discord-rpc');
client = new RPC.Client({ transport: 'ipc' })


const fs = require("fs");
var presenceEnabled = false;
let tempest = "./data/config.json";



if (!fs.existsSync(tempest)) {
	config = { presenceEnabled: false }
} else {
	let rawdata = fs.readFileSync(tempest);
	config = JSON.parse(rawdata)
}


if (config.discordPresence == true) { //If the user opts-in to having the Rich Presence then try connent to the rich presence application




	try {
		client.login({
			clientId: '872392087440621579'
		});

	} catch (error) { //An error will be thrown if this fails. The most common issue is the user does not have discord running.
		throw ("Discord not detected. Rich presence will not work. If you belive this is an error please re-open the SaladBind app.");
	}


}

function presence(details, state, time, large_image, large_text, small_image, small_text) {
	if (presenceEnabled == true) {
		activity = {
			pid: process.pid,
			activity: {
				details: details,
				state: state,
				timestamps: {},
				assets: {
					large_image: large_image,
					large_text: large_text,
					small_image: small_image,
					small_text: small_text
				},
				buttons: [
					{ label: "Download SaladBind", url: "https://bit.ly/saladbind" },
					{ label: "Join the SaladBind Discord", url: "https://discord.gg/HfBAtQ2afz" }
				]
			}
		}
		if (time != undefined && time != null) {
			activity.activity.timestamps = { start: time }
		}
		try {
			client.request('SET_ACTIVITY', activity);
		} catch {
			
		}

	}
}

module.exports = {
	disconnect: function() {
		if (config.presenceEnabled == true) {
			client.clearActivity();
			presenceEnabled = false;
		}
	}, //Not technically disconnecting but idfk its basically the same
	enable: function() { presenceEnabled = true; },
	mainmenu: function() { presence("In main menu", "   ", null, "icon", "Join me on salad.com", "idle", "Not mining") },
	configuring: function() { presence("Configuring miner", "   ", null, "icon", "Join me on salad.com", "idle", "Not mining") },
	mine: function(miner) { presence(`Mining with ${miner}`, "   ", Date.now(), "icon", "Join me on salad.com", "mining", "Mining") },
	state: client
}
