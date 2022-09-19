# Miners
Links to miners listed in /internal/miners.json for convenience:

#### PhoenixMiner: https://phoenixminer.info/downloads
#### T-Rex: https://github.com/trexminer/T-Rex/releases
#### NBMiner: https://github.com/NebuTech/NBMiner/releases
#### TeamRedMiner: https://github.com/todxx/teamredminer/releases
#### lolMiner: https://github.com/Lolliedieb/lolMiner-releases/releases
#### XMRig: https://github.com/xmrig/xmrig/releases

# Announcement.json
If your going to make your own announcement, increment the number in "number" by 1, It not that important :)
![image](https://user-images.githubusercontent.com/93124920/191002509-8ec5dca1-c722-498d-86c6-efcaae099c89.png)

### Tip
* When writing announcements, it is recommended that you don't use [emoji](https://en.wikipedia.org/wiki/Emoji) 🔧📜🛠️⚠️🎉✅🐛🩹 (or at least don't overuse it, as some OS don't support emoji or have certain emoji.)

* When editing a JSON file, it is recommended that you use IDE or a JSON Validator

Invalid JSON (Trailing comma)
```json
{
    "number": "2",
    "announcement": [
        "🔧 Under the hood",
        "Migrate from CodeQL v1 to CodeQL v2",
    ]
}

```
Valid JSON
```json
{
    "number": "2",
    "announcement": [
        "🔧 Under the hood",
        "Migrate from CodeQL v1 to CodeQL v2"
    ]
}

```
