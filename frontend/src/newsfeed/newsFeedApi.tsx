import {PostProps} from "./PostProps";
import {baseUrl, withLogs} from "../core";
import axios from 'axios';

const newsUrl = `http://${baseUrl}/post/newsfeed`;

export const getNewsFeed: (page: number, size: number, type?: string, tags?: string[]) => Promise<PostProps[]> = (page, size, type, tags) => {
    let filterProps;
    if (type === "All") {
        if (tags !== undefined && tags.length > 0) filterProps = JSON.stringify({
            page: {nrOrd: page, size: size},
            listTags: tags
        });
        else filterProps = JSON.stringify({page: {nrOrd: page, size: size}});
    } else {
        if (tags !== undefined && tags.length > 0) {
            filterProps = JSON.stringify({page: {nrOrd: page, size: size}, type: type, listTags: tags});
        } else filterProps = JSON.stringify({page: {nrOrd: page, size: size}, type: type});
    }

    return withLogs(
        axios({
            method: 'post',
            url: newsUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            data: filterProps,
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
