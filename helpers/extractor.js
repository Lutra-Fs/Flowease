const ncmApi = require('NeteaseCloudMusicApi');

class NCMExtractor {

  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
  }

  /**
   * Returns stream info
   * @param {string} url stream url
   */
  static getInfo(url) {
    return {
      title: "Extracted by custom extractor",
      duration: 20000,
      thumbnail: "some thumbnail link",
      engine: "someStreamLink",
      views: 0,
      author: "Some Artist",
      description: "",
      url: "Some Link"
    }
  }

  static validate(url) {
    const REGEX = /(http:\/\/|https:\/\/)?music.163.com\/#\/(song|playlist)\?id=[0-9]+/
    return REGEX.test(url || "");
  }

  static get important() {
    return true;
  }
}


module.exports = NCMExtractor;