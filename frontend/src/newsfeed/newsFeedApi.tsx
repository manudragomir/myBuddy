import {PostProps} from "./PostProps";
import {baseUrl, getLogger, withLogs} from "../core";
import axios from 'axios';

const newsUrl = `http://${baseUrl}/post/newsfeed`;

export const getNewsFeed: (page: number, size: number, type?: string, tags?: string[]) => Promise<PostProps[]> = (page, size, type, tags) => {
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
            data: JSON.stringify({page: {nrOrd: page, size: size}, type: type, listTags: tags}),
            auth: {
                username: "a",
                password: "a"
            },
        }), 'Get Posts');
}

export const sendReport: (idPost: number, message: string) => Promise<any> = (idPost: number, message: string) => {
    return withLogs(
        axios({
                method: `post`,
                url: newsUrl + "/report",
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({idPost: idPost, message: message}),
                auth: {
                    username: "a",
                    password: "a"
                },
            }
        ), `Send Report`
    );
}
