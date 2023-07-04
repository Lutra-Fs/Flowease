import {BaseExtractor, ExtractorInfo, QueryType, SearchQueryType, Track} from "discord-player";
import NeteaseCloudMusic from "./netease";
import {Readable} from "stream";


export class FloweaseExtractor extends BaseExtractor {
    static identifier = "flowease" as const;

    public async activate(): Promise<void> {
    }

    public async validate(query: string, queryType?: SearchQueryType | null | undefined): Promise<boolean> {
        console.log("validating query: " + query + " with queryType: " + queryType)
        // check if the type is AUTO_SEARCH or the query is a valid URL
        if (RegExp(/id=(\d+)/).exec(query) !== null) {
            console.log("query match the regex")
        }
        return (<SearchQueryType[]>[QueryType.AUTO, QueryType.AUTO_SEARCH]).some((type) => queryType === type) || RegExp(/id=(\d+)/).exec(query) !== null;
    }

    public async handle(query: string, context: any): Promise<ExtractorInfo> {
        console.log("handling query: " + query + " with queryType: " + context.type);
        if (query === null) {
            return this.createResponse(null, []);
        }
        if ((context.type === QueryType.AUTO || context.type === QueryType.AUTO_SEARCH) && RegExp(/id=(\d+)/).exec(query) === null) {
            const searchResult = await NeteaseCloudMusic.search(query);
            if (searchResult.length === 0) {
                console.log("no result found for query: " + query);
                return this.createResponse(null, []);
            }
            const tracks = searchResult.map((item: any) => {
                const track = new Track(this.context.player, {
                    author: item.artist.names.join(','),
                    duration: item.duration,
                    description: item.title,
                    title: item.title,
                    thumbnail: item.thumbnail,
                    views: 0,
                    url: "https://music.163.com/#/song?id=" + item.id,
                    requestedBy: context.requestedBy,
                });
                track.extractor = this;
                return track;
            });

            return this.createResponse(null, tracks);
        } else {
            let
                id: string = "";
            const
                match = RegExp(/id=(\d+)/).exec(query);

            if (match?.[1]) {
                id = match[1];
            }

            const data = await NeteaseCloudMusic.getSongInfoById(id);
            if (data === null) {
                return this.createResponse(null, []);
            }
            const track = new Track(this.context.player, {
                author: data.artist.names.join(','),
                duration: data.duration,
                description: data.title,
                title: data.title,
                thumbnail: data.thumbnail,
                views: 0,
                url: "https://music.163.com/#/song?id=" + data.id, //this url is not playable
                requestedBy: context.requestedBy,
            });
            track.extractor = this;

            return this.createResponse(null, [track]);
        }
    }

    public async stream(track: Track): Promise<Readable | string> {
        // extract netease id from url
        const match = RegExp(/id=(\d+)/).exec(track.url);
        console.log("streaming track: " + track.url + " with id: " + match?.[1])
        const url = await NeteaseCloudMusic.getSongUrlById(<string>match?.[1]);
        if (url === null || url === undefined
        ) {
            return "";
        }
        track.raw.engine = {
            streamURL: url,
        }
        console.log("streaming url: " + url)
        return url;
    }

    public async getRelatedTracks(track: Track): Promise<ExtractorInfo> {
        const data = await NeteaseCloudMusic.getRelatedSongsById(track.id);
        const tracks = data.map((item: any) => {
            const track = new Track(this.context.player, {
                author: item.artist.join(','),
                duration: item.duration,
                description: item.title,
                title: item.title,
                thumbnail: item.thumbnail,
                views: 0,
                url: "https://music.163.com/#/song?id=" + item.id,
            });
            track.extractor = this;
            return track;
        });
        return this.createResponse(null, tracks);
    }
}