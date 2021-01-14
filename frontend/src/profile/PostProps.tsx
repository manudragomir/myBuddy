export interface User{
    username: string;
}

/*
    PostProps is an interface that holds information regarding the Posts
 */
export interface PostProps {
    id?: string;
    user?: User;
    body?: string;
    date: string;
    type: string;
    tags?: string[];
    latitude?:number;
    longitude?:number;
}