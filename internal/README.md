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
For algorithm that use the following
| Coin | Algorithm  | Mineable | Get dag source from |
| ------------- | ------------- | ------------- | ------------- |
| Ethereum  | Ethash  | ❌ (as of 15 September 2022) | ❌ Ethereum is not mineable after the ETH 2.0 merge
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
