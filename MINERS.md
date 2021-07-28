# Miner Setup Guide

## Table of Contents

[Pools](#Pools) <br>
[Miners](#Miners) <br>
[Algorithms](#Algorithms) <br>
[Additional Commands](#Additional-Commands) <br>

## Pools

### NiceHash

Good if you know you're going to be restarting the miner constantly instead of having long mining sessions. Has more stable earnings.

### Ethermine

Good for longer sessions, earnings can be unstable. Can take up to 30 minutes for earnings to start appearing on Salad.

## Miners

### PhoenixMiner

PhoenixMiner supports Ethash and Etchash. It has a lower fee than most other miners of 0.65%.

Supported OS: Windows, Linux

Supported GPUS: NVIDIA, AMD

### T-Rex Miner

T-Rex supports Ethash, Etchash and KawPow. It has a fee of 1%.

Supported OS: Windows, Linux

Supported GPUS: NVIDIA

### NBMiner

NBMiner supports Ethash, Etchash, KawPow and beamv3. It has a fee of 1% on Ethash and Etchash, and 2% on KawPow and beamv3.

Supported OS: Windows, Linux

Supported GPUS: NVIDIA, AMD

### Teamredminer

Teamredminer supports Ethash, Etchash and KawPow. It has a fee of 1% on Ethash and Etchash, and 2% on KawPow.

Supported OS: Windows, Linux

Supported GPUS: AMD

### Ethminer

Ethminer supports Ethash. It has no fee.

Supported OS: Windows, Linux, MacOS

Supported GPUS: NVIDIA, AMD

### lolMiner

lolMiner supports Ethash, Etchash, beamv3 and EQUI144_5 (Bitcoin Gold). It has a fee of 0.75% on Ethash and Etchash, and 1% on beamv3 and EQUI144_5.

Supported OS: Windows, Linux

Supported GPUS: NVIDIA, AMD

## Algorithms

### Recommendations

Over 4GB of VRAM: Ethash

3-4GB of VRAM: KawPow

2GB of VRAM: EQUI144_5 (Bitcoin Gold)

## Additional Commands

To use additional commands select Set Additional Commands before starting the miner, these arguments are passed directly to the miner.
If you do not specify a wallet, pool or algorithm, the default will be used.
