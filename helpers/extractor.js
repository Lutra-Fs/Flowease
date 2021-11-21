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
    let url_str=url_str.replace('/#/','/')
    let url_obj= new URL(url_str);
    let target_id=url_obj.searchParams.get('id');
    let target_pattern=url_obj.pathname;
    target_pattern=target_pattern.split('/');
    target_pattern=target_pattern[target_pattern.length-1];
    switch(target_pattern){
      case 'song':
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
      case 'playlist':

      default:
        throw new Error('Link translation error. The error link is '+url);
    }


  }

  static validate(url) {
    const REGEX = /(http:\/\/|https:\/\/)?(y\.)?music\.163\.com\/(#\/)?(m\/)?(song|playlist)\?id=[0-9]+.+/
    return REGEX.test(url || "");
  }

  static get important() {
    return true;
  }
  static async #getUrl(song_id){
    const link = await ncmApi.song_url({ id: song_id, realIP: '211.161.244.70' });
    return link.body.data[0].url;
  }
}


module.exports = NCMExtractor;