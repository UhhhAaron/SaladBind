# SaladBind

## Table of Contents

[About](#About) <br>
[Installation](#Installation) <br>
[Configuration](#Configuration) <br>
[Miner Setup Guide](#Miner-Setup-Guide)

## About

**This application is not affiliated with Salad Technologies.** It is made by Vukky Limited, for the entire Salad community.

*BIND-ing* the good features from other projects together! (and fucking nuke the bad ones)

It's like if CLI and CLI+ had a baby: Switch between miners, pools, **and algorithms** with ease using a fancy UI and some brand-new extras, like an interactive configuration editor built right in to the program; **no website involved!**

And the best part: It's **open-source**! And another part is that we don't ever use your token, except for *once* in the configuration process. You can get your Rig ID automatically using your token! Once you've done that, **never again.** You will never have to enter your token again, we don't store it either! But, you don't have to give your token, you can enter your Rig ID manually too! Security first!

Oh, and did we mention the **insane data savings**? SaladBind downloads miners on demand, so there's no need to download 460MB of miners you'll never use, and you don't have to install Python, Java, or anything else on your computer. Just download SaladBind, and you're good to go - it's only **40-50MB**!

Oh and one last thing, did we mention it's **not-for-profit**? We don't any have hidden fees and pools which means we do not scrape on top of your earnings.

Welcome to the next generation of Salad CLIs!

## Installation

Head to our [GitHub Releases](https://github.com/VukkyLtd/SaladBind/releases/latest) page, download the latest release, and run it. **BUT KEEP READING!**

If you are on macOS or Linux, please note that these platforms are untested and you may encounter bugs.

On those platforms, you'll have to run SaladBind from the terminal like this, respectively:

```bash
./saladbind-macos
```

```bash
./saladbind-linux
```

### Configuration

Once you start SaladBind for the first time, it'll prompt you to enter your mining details.

You can do this by entering your Salad Auth token, which grabs your Rig ID automatically, or you can enter your Rig ID manually.

#### Automatic

You will be prompted to enter your access token. It is recommended to use a Chromium-based browser like Google Chrome or the new Microsoft Edge.
To get your access token follow these steps:

1. Log in at [https://app.salad.io/](app.salad.io)
2. Click the lock symbol in the address bar
3. Open Cookies and uncollapse app-api.salad.io
4. Look for sAccessToken and copy it (right click and select all as it is very long)
5. Paste the token into the terminal (on Windows, use right-click)

#### Manual

1. Start mining with normal Salad
2. Mine for 5-15 minutes
3. Find your Salad logs. A guide can be found [https://support.salad.com/hc/en-us/articles/360042215512-How-To-Find-Your-Salad-Log-Files](here)
4. Search for "rig ID" in the main.log file and copy it. Both Ethermine worker ID and Nicehash rig ID are supported.
5. Paste the Rig ID into the terminal (on Windows, use right-click)

You are now ready to go!

### Miner Setup Guide

If you don't know what miner, algorithm or pool to pick, we have a [handy guide](MINERS.md).
