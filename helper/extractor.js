const ncmApi = require("NeteaseCloudMusicApi");
const { SoundQualityType } = require("NeteaseCloudMusicApi");

module.exports = {
  NcmExtractor: {
    version: "1.0.0",
    important: true,
    validate: (query) => true,
    getInfo: async (query) => {
      console.log("ncmExtractor: getInfo for query: " + query);
      // check if query is a song id
      if (query.match(/^[0-9]+$/)) {
        console.log("ncmExtractor: query is a song id");
        // assume it's a song id
        const song_id = query;
        const song_info = await ncmApi.song_detail({ ids: song_id });
        console.log("song_info = " + song_info);
        const song_url = await ncmApi.song_url({ id: song_id });
        console.log("song_url = " + song_url);
        const song_hot_comments = await ncmApi.comment_hot(
          { id: song_id, type: 0 });
        console.log("song_hot_comments = " + song_hot_comments);
        return {
          playlist: null,
          info: [
            {
              title: song_info.body.songs[0].name,
              duration: song_info.body.songs[0].dt,
              thunbnail: song_info.body.songs[0].al.picUrl
                ? song_info.body.songs[0].al.picUrl
                : "",
              engine: song_url.body.data[0].url,
              views: 0,
              author: generateAuthorsStr(song_info.body.songs[0].ar),
              description: song_hot_comments.body.hotComments[0].content
                ? song_hot_comments.body.hotComments[0].content
                : "",
              url: song_url.body.data[0].url
            }
          ]
        };
      }
    }
  }
};

function generateAuthorsStr(author_list) {
  let author_str = "";
  for (let i = 0; i < author_list.length; i++) {
    author_str += author_list[i].name;
    if (i < author_list.length - 1) {
      author_str += ", ";
    }
  }
  return author_str;
}