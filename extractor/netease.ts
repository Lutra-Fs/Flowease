import * as NCMapi from 'NeteaseCloudMusicApi';

export default class NeteaseCloudMusic {
    // expect duration to be in ms
    private static durationToString(duration: number) {
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const secondsRemain = seconds % 60;
        return `${minutes}:${secondsRemain < 10 ? '0' : ''}${secondsRemain}`;
    }

    private static mapToTrack(item: any, source: string = 'search') {
        if (source === 'search') {
            return {
                id: item.id,
                title: item.name,
                duration: item.duration ? NeteaseCloudMusic.durationToString(item.duration) : '0:00',
                thumbnail: "",
                artist: {
                    names: item.artists.map((artist: any) => artist.name),
                }
            }
        }
        return {
            id: item.id,
            title: item.name,
            duration: item.dt ? NeteaseCloudMusic.durationToString(item.dt) : '0:00',
            thumbnail: item.al.picUrl,
            artist: {
                // Array of artists, save as an Array
                names: item.ar.map((artist: any) => artist.name),
            }
        }
    }

    public static async search(query: string, limit: number = 10, offset: number = 0) {
        const res = await NCMapi.search({keywords: query, limit, offset, type: 1});
        const result: any = res.body.result;
        try {
            // @ts-ignore
            if (result.songs instanceof Array) {
                // @ts-ignore
                console.log(result.songs);
                // @ts-ignore
                const mappedTrack = result.songs.map((item: any) => NeteaseCloudMusic.mapToTrack(item, 'search'));
                console.log(mappedTrack)
                return mappedTrack;
            }
            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    public static async getSongInfoById(id: string) {
        const songInfo = await NCMapi.song_detail({ids: id});
        if (songInfo.body.songs instanceof Array) {
            return NeteaseCloudMusic.mapToTrack(songInfo.body.songs[0]);
        }
        return null;
    }

    public static async getSongLyricById(id: string) {
        const lyric = await NCMapi.lyric({id});
        return lyric.body.lrc;
    }

    //TODO playlist support

    public static async getSongUrlById(id: string): Promise<string | undefined> {
        const response = await NCMapi.song_url({id, realIP: '111.224.143.87'});

        // Type assertion
        const urlContent = (response as any);

        // Additional check to make sure the data structure we expect is present
        if (urlContent?.body?.data[0]?.url) {
            return urlContent.body.data[0].url;
        } else {
            throw new Error('Unexpected API response structure, actual response: ' + JSON.stringify(urlContent));
        }
    }

    public static async getRelatedSongsById(id: string) {
        const relatedSongs = await NCMapi.simi_song({id});
        if (relatedSongs.body.songs instanceof Array) {
            return relatedSongs.body.songs.map(song => NeteaseCloudMusic.mapToTrack(song, 'related'));
        }
        return [];
    }
}