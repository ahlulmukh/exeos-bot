# Exeos Bot

This bot automates earning point Exeos

## Features

- Multi Account
- Uses proxies to avoid IP bans/Limit.
- Auto LiveNess Check

## Requirements

- NodeJS [Download](https://nodejs.org/en/download).
- Exeos Account [Register Here](https://app.exeos.network?referralCode=REFQ1ZSQSEZ).
- Proxy (Optional). Best Proxy [Cherry Proxy](https://center.cherryproxy.com/Login/Register?invite=029ad2d3)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ahlulmukh/exeos-bot.git
   cd exeos-bot
   ```

2. Instal Packages:

   ```sh
   npm install
   ```

3. Create a `proxy.txt` file in the root directory and add your proxies (one per line) (Optional).

   ```
   http://user:pass@host:port
   http://user:pass@host:port
   http://user:pass@host:port
   ```

4. Crete accounts.json file, `cp accounts.json.example accounts.json` and put your token and extensionId, you you don't have extension id just leave it.

   ```json
   [
     {
       "token": "your_token",
       "extensionId": [
         "your_extension_id",
         "your_extension_id2",
         "your_extension_id3"
       ]
     },
     {
       "token": "your_token2",
       "extensionId": ["your_extension_id", "your_extension_id2"]
     }
   ]
   ```

## Usage

1. Run the bot:

```sh
node .
```

## Stay Connected

- Channel Telegram : [Telegram](https://t.me/elpuqus)
- Channel WhatsApp : [Whatsapp](https://whatsapp.com/channel/0029VavBRhGBqbrEF9vxal1R)
- Discord : [Discord](https://discord.com/invite/uKM4UCAccY)

## Donation

If you would like to support the development of this project, you can make a donation using the following addresses:

- Solana: `FdHsx8He55QgRCSv6NMEpFfkjXFsXFEeWEpJpo7sUQZe`
- EVM: `0x406de5ec09201002c45fdd408ab23159cd12fa3e`
- BTC: `bc1prze475lgalevngrhwq6r9wyng3rl3zskyru4rn4k6j8kwzmmczmqcd7u7y`

## Disclaimer

This tool is for educational purposes only. Use it at your own risk.
