import {PostProps} from "./PostProps";
import {baseUrl, config, withLogs} from "../core";
import axios from 'axios';

const newsUrl=`http://${baseUrl}/post`;

export const getNewsFeed: () => Promise<PostProps[]> = () => {
    return withLogs(axios.get(newsUrl, config), `getNews`);
}