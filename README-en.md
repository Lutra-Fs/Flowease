# Flowease

![stars](https://img.shields.io/github/stars/Lutra-Fs/flowease.svg) ![forks](https://img.shields.io/github/forks/Lutra-Fs/flowease.svg) ![issues](https://img.shields.io/github/issues/Lutra-Fs/flowease.svg) ![license](https://img.shields.io/github/license/Lutra-Fs/flowease.svg)

A Discord music bot that can play music from Netease Cloud Music. [中文](README.md)

## Requirements

- [Node.js](https://nodejs.org/) 16 or higher (recommended to install with [volta](https://volta.sh/))
- [npm](https://www.npmjs.com/)

## Installation

```bash
# Clone the repository
git clone https://github.com/Lutra-Fs/flowease.git --depth=1
# Enter the repository
cd flowease
# Install dependencies
npm install
```

**Important:** The configuration file is located at `config/config.json`. Please modify it after deployment. Please refer to [Wiki](https://github.com/Lutra-Fs/Flowease/wiki/config.json) for details.

## Usage

```bash
# register commands
cd helper && node deploy-command.js
# go back to the root directory
cd ..
# start the bot
npm start
```

After the bot is started, you can use the `help` command to view the command list.

## FAQ

TBD

## License

This project is licensed under the [LGPL-3.0 License](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Development Roadmap

See [Github Projects](https://github.com/Lutra-Fs/Flowease/projects).

## Support

If you like this project, please give it a star or sponsor me via [GitHub Sponsors](https://github.com/sponsors/Lutra-Fs).

### Technical Support

If you have any questions about the project, you can submit an issue or discuss it in the discussion area.
We also have a [Discord server]() for technical support.

## Acknowledgements

This project is inspired from my discord server members. It is based on [discord-bot](https://github.com/TannerGabriel/discord-bot)
Thanks to [TannerGabriel](https://github.com/TannerGabriel) and his easy-to-read [tutorial](https://gabrieltanner.org/blog/dicord-music-bot)

Except for the persons and projects mentioned above, this project also uses the following open source projects:

- [discord.js](https://discord.js.org/)
- [discord-player](https://discord-player.js.org/)
- [ffmpeg-static](https://gabrieltanner.org/blog/dicord-music-bot)
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)-
