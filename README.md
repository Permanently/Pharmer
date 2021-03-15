# Pharmer

Pharmer is a lightweight NodeJS client based on
[Mineflayer](https://mineflayer.prismarine.js.org/) that's ideal for AFK'ing
games, farms, or pretty much anything you want. The bot can link into Discord as
well, giving you easy access to view your Minecraft chat. Currently, the client
is built around Party Games on an unmentioned Minecraft server, in order to farm
Guild EXP. Customisability may be extended in the near future.

**Fun fact:** I named this Pharmer because I had this clever idea of combining
two things into a word, but I completely forgot what I was thinking - so now
this is called Pharmer, and I'm not too sure why anymore.

## Requirements

- Node v14 (still need v10 or v12? [nvm](https://github.com/Neilpang/nvm) might
  be perfect for you!)
- A Discord bot
- A Minecraft: Java Version account

## Bot Setup Instructions

- Download this project (or alternatively, `git clone` the repository)
- Run `npm install`
- Fill in `config/config.json` with the necessary details
- Run `node .` or `npm start`, and leave the bot running!
  - If you decide to run the bot on a Linux machine, I recommend using
    [forever](https://www.npmjs.com/package/forever).

### Discord Setup Instructions

- Create a Discord app from the
  [Developer Portal](https://discord.com/developers/applications).
- Add a Bot under the bots tab.
- Take note of your **token** (under the Bot tab).
- Go to the following link, replacing `123YourClientID456` with your client ID:
  `https://discord.com/oauth2/authorize?scope=bot&client_id=123YourClientID456`
- Select the Discord server to add your bot to.
- Add your token and channel ID rto the respective fields in
  [config/config.json](https://github.com/Permanently/Pharmer/blob/main/config/config.json).
  - You can `Right Click > Copy ID` if you turn on Developer Mode in Discord
    settings!

### How to Update

Want to add new features without going through the hassle of entering in all of
your customisations again? No problem! Just enter these in your CLI:

```
git stash
git pull
git stash pop
```

That's it!

## config.json walkthrough

| Name                              | Description                                                                     | Type    |
| --------------------------------- | ------------------------------------------------------------------------------- | ------- |
| `discord.botToken`                | Enter the token of your Discord bot here.                                       | string  |
| `discord.channelID`               | The ID of the _text_ channel that the bot should log to.                        | string  |
| `minecraft.username`              | Enter your Minecraft email/username here.                                       | string  |
| `minecraft.password`              | Enter your Minecraft password here. (keep this file locked away, too)           | string  |
| `minecraft.authType`              | This can be either `mojang`, or `microsoft`.                                    | string  |
| `minecraft.server.address`        | Enter the Minecraft server address you want the bot to connect to.              | string  |
| `minecraft.server.port`           | Enter the port of the Minecraft server address you want the bot to connect to.  | integer |
| `minecraft.server.version`        | Enter the version you want the bot to connect with.                             | string  |
| `extras.hypixelAutoGG.enabled`    | Whether you want the bot to say "gg" at the end of the game.                    | boolean |
| `extras.hypixelAutoGG.interval`   | How long you want the bot to wait before saying "gg".                           | integer |
| `extras.hypixelAutoMatch.enabled` | Whether you want the bot to automatically enter a game whenever the bot starts. | boolean |
| `extras.hypixelLobbyWarp.enabled` | Whether you want the bot to warp to lobby before re-joining a game. Useful if you want to also farm for Mystery Boxes. | boolean |
| `extras.hypixelLobbyWarp.interval.beforeLobby` | The amount of milliseconds you want to wait after the end of a game. | integer |
| `extras.hypixelLobbyWarp.interval.beforeGame` | The amount of milliseconds you want to wait before re-joining a game. | integer |

### silenced-msgs.json

| Name                | Description                                                                                                                                            | Type  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| `silenced-messages` | Enter the messages you don't want to send to Discord. This means the Discord bot will be more up-to-date with messages as it will not be rate-limited. | array |

## Discord Commands

| Name     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| `!limbo` | This will send the client to Limbo.                                |
| `!play`  | This will execute a /play command to enter the client into a game. |
| `!quit`  | This will tell the bot to disconnect and end the process.          |

## Made With

- [Mineflayer](https://mineflayer.prismarine.js.org/)
- [Discord.js](https://discord.js.org)
