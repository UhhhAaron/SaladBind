# Guide

## Miners
Links to miners listed in /internal/miners.json for convenience:

#### PhoenixMiner: https://phoenixminer.info/downloads
#### T-Rex: https://github.com/trexminer/T-Rex/releases
#### NBMiner: https://github.com/NebuTech/NBMiner/releases
#### TeamRedMiner: https://github.com/todxx/teamredminer/releases
#### lolMiner: https://github.com/Lolliedieb/lolMiner-releases/releases
#### XMRig: https://github.com/xmrig/xmrig/releases

## miners.json (DAG)
Tip: When disabling algorithm, set the DAG value of the algorithm that you want to disable to `2147483647`, **DO NOT SET IT TO 0, -1 OR NULL** or else SaladBind will think that the algorithm is compatible because the GPU VRAM is higher than `0 or -1` or doesn't have a requirement `null`

| Coin | Algorithm  | Mineable | Get dag source from |
| ------------- | ------------- | ------------- | ------------- |
| Ethereum  | Ethash  | ❌ (as of 15 September 2022) | 2147483647 (unmineable)
| Ethereum Classic | Etchash |  ✅ | https://minerstat.com/dag-size-calculator
| Ravencoin  | KawPow |  ✅ | https://minerstat.com/dag-size-calculator
| Ergo  | Autolykos2 | ✅ | https://minerstat.com/dag-size-calculator
| BEAM | BeamV3 (EQUI150-5)| ✅ | 2gb
| Zcash | ZHash (EQUI144-5) | ✅ | 2gb
| Flux* | Zelhash (EQUI125-4) | ✅ | 2gb
| Monero  | RandomX | ✅ | DAG not required
| Raptoreum | Ghostrider | ✅ | DAG not required

*Zcash or Zelhash is not enabled in SaladBind because it hasn't been tested yet™️, to enable it, change the supported algorithm in compatible miner at miners.json if you wish to use it (Only Prohashing pool is supported)

## Announcement.json
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
