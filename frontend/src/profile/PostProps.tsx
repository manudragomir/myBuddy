export interface User{
    username: string;
}
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