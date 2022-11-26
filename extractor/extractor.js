const ncmApi = require('NeteaseCloudMusicApi');

module.exports = {
	NcmExtractor: {
		version: '1.0.0',
		important: true,
		validate: (query) => {
			const query_info = getQueryInfo(query);
			console.log('ncmExtractor: validate: ' + query_info.query + ' ' + query_info.query_type);
			return query_info.query_type === '0' || query_info.query_type === '1';
		},
		getInfo: async query => {
			// check if query is a song id
			query = getQueryInfo(query);
			if (query.query_type === '0') {
				console.log('ncmExtractor: query is a song');
				console.log('ncmExtractor: query is: ' + query.query);
				if (query.query.match(/^[0-9]+$/)) {
					console.log('ncmExtractor: query is a song id');
					// assume it's a song id
					return await play_song_id(query.query);
				}
				// match url and extract id from url, the url can be:
				// match any url that domain is music.163.com
				else if (query.query.match(/https?:\/\/(y\.)?music\.163\.com\/.*/)) {
					console.log('ncmExtractor: query is a song url');
					// extract id from url, match &id||?id
					let id = query.query.match(/([&?])id=([0-9]+)/)[0];
					id = id.substring(id.indexOf('=') + 1);
					console.log('ncmExtractor: query is a song url, id = ' + id);
					return await play_song_id(id);
				}
				else {
					console.log('ncmExtractor: query is not a song id');
					const search_result = await ncmApi.search(
						{ keywords: query.query, type: 1, limit: 1 });
					console.log(search_result.body);
					const song_id = search_result.body.result.songs[0].id;
					console.log('ncmExtractor: song id = ' + song_id);
					return await play_song_id('' + song_id);
				}
			}
			else if (query.query_type === '1') {
				console.log('ncmExtractor: query is a playlist');
				console.log(query.query);
				if (query.query.match(/^[0-9]+$/)) {
					console.log('ncmExtractor: query is a playlist id');
					return await play_playlist_id(query.query);
				}
				else if (query.query.match(/https?:\/\/(y\.)?music\.163\.com\/.*/)) {
					console.log('ncmExtractor: query is a song url');
					// extract id from url, match &id||?id
					let id = query.query.match(/([&?])id=([0-9]+)/)[0];
					id = id.substring(id.indexOf('=') + 1);
					console.log('ncmExtractor: query is a song url, id = ' + id);
					return await play_song_id(id);
				}
				else {
					const search_result = await ncmApi.search(
						{ keywords: query.query, type: 1000, limit: 1 });
					const playlist_id = search_result.body.result.playlists[0].id;
					return await play_playlist_id('' + playlist_id);
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
	// the query passed in is query#type
	// query-type can be:
	// 0. song
	// 1. playlist
	// find the last #, and split the string
	return {
		query: query.substring(0, query.lastIndexOf('#')),
		query_type: query.substring(query.lastIndexOf('#') + 1),
	};
}

// song_id is a string
// if song_id is not a string, it needs to be converted to a string
// before calling this function, e.g. '' + song_id
async function play_song_id(song_id) {
	console.log('ncmExtractor: play_song_id: ' + song_id);
	const song_info = await ncmApi.song_detail({ ids: song_id });
	const song_url = await ncmApi.song_url({ id: song_id });
	const song_hot_comments = await ncmApi.comment_hot(
		{ id: song_id, type: 0 });
	console.log(song_info.body);
	console.log(song_info.body.songs[0].name);
	console.log(song_info.body.songs[0].dt);
	console.log(song_url.body.data[0].url);
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
				description: song_hot_comments.body.hotComments.length > 0
					? (song_hot_comments.body.hotComments[0].content
						? song_hot_comments.body.hotComments[0].content
						: '') : '',
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
	for (const element of playlist_tracks) {
		const song_url = await ncmApi.song_url({ id: element.id });
		const song_hot_comments = await ncmApi.comment_hot(
			{ id: element.id, type: 0 });
		playlist_songs_info.push({
			title: element.name,
			duration: element.dt,
			thumbnail: element.al.picUrl
				? element.al.picUrl
				: '',
			engine: song_url.body.data[0].url,
			views: 0,
			author: generateAuthorsStr(element.ar),
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

