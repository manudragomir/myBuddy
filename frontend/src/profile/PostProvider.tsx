import {useState,useEffect, useReducer, ReactPropTypes, useCallback, useContext} from 'react';
import {Post} from './Post';
import {PostProps} from './PostProps'
import {add, getUserPosts, submitFile} from './postApi'
import React from 'react';
import PropTypes from 'prop-types';
import { AuthContext, AuthState } from '../auth';
import Moment from 'moment';

var PAGE = 0;
type AddPostFn = (post : PostProps, file: FileList) => Promise<any>;
type fetchUserPosts = () => void;

export interface PostState{
    posts?: PostProps[],
    saving: boolean,
    savingError?: Error | null,
    addPost?: AddPostFn,
    fetching: boolean,
    fetchingError: string,
    fetchPosts?: fetchUserPosts,
    disableInfiniteScroll: boolean,
}

interface ActionProps{
    type: string,
    payload?: any,
}

const initialState: PostState = {
    posts: [],
    saving : false,
    fetching: false,
    fetchingError: "",
    disableInfiniteScroll: false,
};

const SAVE_POST_STARTED = 'SAVE_POST_STARTED';
const SAVE_POST_SUCCEEDED = 'SAVE_POST_SUCCEEDED';
const SAVE_POST_FAILED = 'SAVE_POST_FAILED';
const FETCH_POSTS_STARTED = 'FETCH_POSTS_STARTED';
const FETCH_POSTS_SUCCEEDED = 'FETCH_POSTS_SUCCEEDED';
const FETCH_POSTS_FAILED = 'FETCH_POSTS_FAILED';
const DISABLE_INFINITE_SCROLL = 'DISABLE_INFINITE_SCROLL'
const ENABLE_INFINITE_SCROLL = 'ENABLE_INFINITE_SCROLL'
const ADD_TO_USERPAGE = 'ADD_TO_USERPAGE'

const reducer: (state: PostState, action: ActionProps)=> PostState =
    (state, {type,payload}) => {
        switch(type){
            case SAVE_POST_STARTED:
                return {...state, savingError: null, saving:true};
            case SAVE_POST_SUCCEEDED:
                const posts=[...(state.posts || [])]
                const post=payload.post;
                posts.push(post);
                return {...state,posts,saving:false};
            case SAVE_POST_FAILED:
                return {...state,savingError:payload.error,saving:false}
            case FETCH_POSTS_STARTED:
                return {...state, fetching: true, fetchingError: ""};
            case FETCH_POSTS_SUCCEEDED:
                return {...state, posts: payload.result, fetching: false};
            case FETCH_POSTS_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            case ENABLE_INFINITE_SCROLL:
                return {...state, disableInfiniteScroll: false}
            case DISABLE_INFINITE_SCROLL:
                return {...state, disableInfiniteScroll: true, fetching: false}
            case ADD_TO_USERPAGE:
                console.log(`ADD_TO_USERPAGE >>>>>>>> ${payload.userPage}`)
                let newPosts = [...(state.posts || [])]
                newPosts = newPosts?.concat(payload.userPage);
                return {...state, posts: newPosts, fetching: false}
            default:
                return state;
        }
    };

export const PostContext = React.createContext<PostState>(initialState);

interface PostProviderProps{
    children: PropTypes.ReactNodeLike,
}
export const PostProvider: React.FC<PostProviderProps>=({children})=>{
    const [state, dispatch] = useReducer(reducer, initialState)
    const {token} = useContext<AuthState>(AuthContext);
    const {posts, saving, savingError, fetching, fetchingError, disableInfiniteScroll}= state;

    const addPost=useCallback<AddPostFn>(savePostCallback,[token]);
    const fetchPosts = userPageCallback
    const SIZE = 2;
    const value={posts,saving,savingError,addPost, fetching, fetchingError, fetchPosts, disableInfiniteScroll}

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );

    async function userPageCallback() {
        try {
            console.log(`[PROVIDER] CURRENT PAGE : ${PAGE}`)
            dispatch({type: FETCH_POSTS_STARTED});
            console.log("E AICIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII - provider");

            const posts = await getUserPosts(PAGE, SIZE);


            console.log(`[NF CALLBACK] ${posts.length}`)
            if (posts.length > 0) {
                dispatch({type: ADD_TO_USERPAGE, payload: {userPage: posts}})
                PAGE = PAGE + 1

                console.log(`FUTURE PAGE: ${PAGE}`)

                if (posts.length < SIZE) {
                    dispatch({type: DISABLE_INFINITE_SCROLL})
                }
            }
            if (posts.length == 0) {
                dispatch({type: DISABLE_INFINITE_SCROLL})
            }
        } catch (error) {
            console.log(`Getting user PAGE ${PAGE} encountered error: ${error}`)
            dispatch({type: FETCH_POSTS_FAILED, payload: {error}});
        }
    }
   
    async function savePostCallback(post : PostProps, file : FileList){
        try{
            console.log("am ajuns in save cu ",post, file);
            dispatch({type:SAVE_POST_STARTED});
            const savedPost= await (add(post.date,post.type,token,post.body,post.tags));
            savedPost.id && await submitFile(file, savedPost.id);
            dispatch({type:SAVE_POST_SUCCEEDED,payload:{post: savedPost}})
        }catch(error){
            dispatch({type:SAVE_POST_FAILED, payload:{error}})
        }
    }
};