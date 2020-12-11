export interface User{
    username: string;
}
export interface PostProps {
    id?: string;
    user?: User;
    body?: string;
    date: string;
    tags?: string[];
}