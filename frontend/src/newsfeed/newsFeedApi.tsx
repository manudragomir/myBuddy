import {PostProps} from "./PostProps";
import {baseUrl, withLogs} from "../core";
import axios from 'axios';

const newsUrl = `http://${baseUrl}/post/newsfeed`;

export const getNewsFeed: (page: number, size: number, type?: string, tags?: string[], lat?: number, lng?: number, searchArea?: number) => Promise<PostProps[]> = (page, size, type, tags, lat, lng, searchArea) => {
    let rangeInfo = undefined;
    if (searchArea !== undefined) {
        rangeInfo = {longitude: lng, latitude: lat, range: searchArea}
    }

    if (type === 'All') {
        type = undefined
    }

    return withLogs(
        axios({
            method: 'post',
            url: newsUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({page: {nrOrd: page, size: size}, type: type, listTags: tags, range: rangeInfo}),
        }), 'Get Posts');
}


export const sendReport: (idPost: string, message: string) => Promise<any> = (idPost: string, message: string) => {
    return withLogs(
        axios({
                method: `post`,
                url: newsUrl + `/report/${idPost}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({postId: idPost, message: message}),
            }
        ), `Send Report`
    );
}
