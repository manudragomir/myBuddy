import {UserPostProps} from "./UserPostProps";

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