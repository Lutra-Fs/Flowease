# Flowease

![stars](https://img.shields.io/github/stars/Lutra-Fs/flowease.svg) ![forks](https://img.shields.io/github/forks/Lutra-Fs/flowease.svg) ![issues](https://img.shields.io/github/issues/Lutra-Fs/flowease.svg) ![license](https://img.shields.io/github/license/Lutra-Fs/flowease.svg)

一个可以从网易云音乐播放的 Discord 音乐机器人。 [English](README-en.md)

## 需求

- [Node.js](https://nodejs.org/) 16 或更高版本 (推荐使用 [volta](https://volta.sh/) 进行安装
- [npm](https://www.npmjs.com/)

## 安装

```bash
# 克隆仓库
git clone https://github.com/Lutra-Fs/flowease.git --depth=1
# 进入仓库
cd flowease
# 安装依赖
npm install
```

配置文件位于 `config/config.json`。部署后请自行修改。请参阅 [Wiki](https://github.com/Lutra-Fs/Flowease/wiki/config.json) 了解更多。

## 在 [Discord Developer Portal](https://discord.com/developers/applications) 创建应用

你将需要在 [Discord Developer Portal](https://discord.com/developers/applications) 创建一个应用。 参阅 [Wiki](https://github.com/Lutra-Fs/Flowease/wiki/register-bot) 了解更多。

你需要确保你的应用具有以下权限：

- `applications.commands` (斜线命令) 位于 `OAuth2` 选项卡

## 部署

```bash
# 注册斜线命令（仅需运行一次）
cd helper && node deploy-command.js
# 返回上一级目录
cd ..
# 启动机器人
npm start
```

启动后，你可以在 Discord 中使用 `/help` 命令查看机器人的所有命令。（命令帮助锐意施工中）

## FAQ

锐意施工中

## 许可证

此存储库使用 [LGPL-3.0](LICENSE) 许可证。你可以在 [这里](https://choosealicense.com/licenses/lgpl-3.0/) 查看更多信息。

## 贡献

欢迎提交 PR。 参照 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多。

## 社区准则

参阅 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 了解更多。

## 开发路线

参阅 [GitHub Projects](https://github.com/Lutra-Fs/Flowease/projects) 了解更多。

## 支持

- 如果你喜欢这个项目，欢迎给我一个 Star。如果你想支持我，可以通过网页上的 Sponsor 按钮给我打赏。
- 如果你有任何技术问题，可以在 [GitHub Issues](https://github.com/Lutra-Fs/Flowease/issues) 中提出。
- 其他问题可以通过[GitHub Discussions](https://github.com/Lutra-Fs/Flowease/discussions) 中提出。
- 我们也有一个 [Discord Server](https://discord.com). 欢迎加入！(TODO)

## 致谢

本项目基于 [discord-bot](https://github.com/TannerGabriel/discord-bot) 开发。感谢 [TannerGabriel](
https://github.com/TannerGabriel) 的开源项目以及他的[教程](https://gabrieltanner.org/blog/dicord-music-bot)

本项目使用了以下开源项目：

- [discord.js](https://discord.js.org/)
- [discord-player](https://discord-player.js.org/)
- [ffmpeg-static](https://gabrieltanner.org/blog/dicord-music-bot)
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
