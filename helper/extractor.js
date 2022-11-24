const ncmApi = require('NeteaseCloudMusicApi');

module.exports = {
	NcmExtractor: {
		version: '1.0.0',
		important: true,
		validate: () => true,
		getInfo: async query => {
			console.log('ncmExtractor: getInfo for query: ' + query);
			// check if query is a song id
			query = getQueryInfo(query);
			if (query.query_type == '0') {
				console.log('ncmExtractor: query is a song');
				if (query.query.match(/^[0-9]+$/)) {
					console.log('ncmExtractor: query is a song id');
					// assume it's a song id
					return await play_song_id(query.query);
				}
				else {
					console.log('ncmExtractor: query is not a song id');
					const search_result = await ncmApi.search(
						{ keywords: query.query, type: 1, limit: 1 });
					const song_id = search_result.body.result.songs[0].id;
					return await play_song_id(song_id);
				}
			}
			else if (query.query_type == '1') {
				console.log('ncmExtractor: query is a playlist');
				console.log(query.query);
				if (query.query.match(/^[0-9]+$/)) {
					console.log('ncmExtractor: query is a playlist id');
					return await play_playlist_id(query.query);
				}
				else {
					const search_result = await ncmApi.search(
						{ keywords: query.query, type: 1000, limit: 1 });
					const playlist_id = search_result.body.result.playlists[0].id;
					return await play_playlist_id(playlist_id);
				}
			}
		},
	},
};

function generateAuthorsStr(author_list) {
	let author_str = '';
	for (let i = 0; i < author_list.length; i++) {
		author_str += author_list[i].name;
		if (i < author_list.length - 1) {
			author_str += ', ';
		}
	}
	return author_str;
}

function getQueryInfo(query) {
	// the query passed in is query-type:query
	// query-type can be:
	// 0. song
	// 1. playlist
	return {
		query_type: query.split(':')[0],
		query: query.split(':')[1],
	};
}

async function play_song_id(song_id) {
	const song_info = await ncmApi.song_detail({ ids: song_id });
	console.log('song_info = ' + song_info);
	const song_url = await ncmApi.song_url({ id: song_id });
	console.log('song_url = ' + song_url);
	const song_hot_comments = await ncmApi.comment_hot(
		{ id: song_id, type: 0 });
	console.log('song_hot_comments = ' + song_hot_comments);
	return {
		playlist: null,
		info: [
			{
				title: song_info.body.songs[0].name,
				duration: song_info.body.songs[0].dt,
				thumbnail: song_info.body.songs[0].al.picUrl
					? song_info.body.songs[0].al.picUrl
					: '',
				engine: song_url.body.data[0].url,
				views: 0,
				author: generateAuthorsStr(song_info.body.songs[0].ar),
				description: song_hot_comments.body.hotComments[0].content
					? song_hot_comments.body.hotComments[0].content
					: '',
				url: song_url.body.data[0].url,
			},
		],
	};
}

async function play_playlist_id(playlist_id) {
	// limit to 50 songs to avoid rate limit issues
	const playlist_info = await ncmApi.playlist_detail({ id: playlist_id });
	console.log('playlist_info = ' + playlist_info);
	let playlist_tracks = [];
	for (let i = 0; i < 5; i++) {
		const playlist_track = await ncmApi.playlist_track_all(
			{ id: playlist_id, offset: i * 10 });
		const playlist_track_songs = playlist_track.body.songs;
		playlist_tracks = playlist_tracks.concat(playlist_track_songs);
	}
	const playlist_songs_info = [];
	for (let i = 0; i < playlist_tracks.length; i++) {
		const song_url = await ncmApi.song_url({ id: playlist_tracks[i].id });
		const song_hot_comments = await ncmApi.comment_hot(
			{ id: playlist_tracks[i].id, type: 0 });
		playlist_songs_info.push({
			title: playlist_tracks[i].name,
			duration: playlist_tracks[i].dt,
			thumbnail: playlist_tracks[i].al.picUrl
				? playlist_tracks[i].al.picUrl
				: '',
			engine: song_url.body.data[0].url,
			views: 0,
			author: generateAuthorsStr(playlist_tracks[i].ar),
			description: song_hot_comments.body.hotComments[0].content
				? song_hot_comments.body.hotComments[0].content
				: '',
			url: song_url.body.data[0].url,
		});
	}
	return {
		playlist: {
			title: playlist_info.body.playlist.name,
			author: { name: playlist_info.body.playlist.creator.nickname, url: '' },
			description: playlist_info.body.playlist.description,
			id: playlist_info.body.playlist.id,
			thumbnail: playlist_info.body.playlist.coverImgUrl,
			type: 'playlist',
			url: 'https://music.163.com/#/playlist?id=' + playlist_id,
			tracks: playlist_songs_info,
		},
		info: playlist_songs_info,
	};
}

