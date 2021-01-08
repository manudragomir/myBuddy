import {UserPostProps} from "./UserPostProps";
import {RouteComponentProps} from "react-router";

export interface PostProps{
    id: string,
    user: UserPostProps,
    body: string,
    date: string,
    latitude: number,
    longitude: number,
    tags: []
    type: []
}
