import {useState,useEffect, useReducer, ReactPropTypes, useCallback, useContext} from 'react';
import {Post} from './Post';
import {PostProps} from './PostProps'
import {add, submitFile} from './postApi'
import React from 'react';
import PropTypes from 'prop-types';
import { AuthContext, AuthState } from '../auth';
import Moment from 'moment';

type AddPostFn = (post : PostProps, file: FileList) => Promise<any>;

export interface PostState{
    posts?: PostProps[],
    saving: boolean,
    savingError?: Error | null,
    addPost?: AddPostFn,
}

interface ActionProps{
    type: string,
    payload?: any,
}

const initialState: PostState = {
   saving : false
};

const SAVE_POST_STARTED = 'SAVE_POST_STARTED';
const SAVE_POST_SUCCEEDED = 'SAVE_POST_SUCCEEDED';
const SAVE_POST_FAILED = 'SAVE_POST_FAILED';

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
    const {posts,saving,savingError}= state;

    const addPost=useCallback<AddPostFn>(savePostCallback,[token]);
    const value={posts,saving,savingError,addPost}

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
   
    async function savePostCallback(post : PostProps, file : FileList){
        try{
            console.log("am ajuns in save cu ",post, file);
            dispatch({type:SAVE_POST_STARTED});
            const savedPost= await (add(post.date,post.type,token,post.body,post.tags,post.latitude,post.longitude));
            savedPost.id && await submitFile(file, savedPost.id);
            dispatch({type:SAVE_POST_SUCCEEDED,payload:{post: savedPost}})
        }catch(error){
            dispatch({type:SAVE_POST_FAILED, payload:{error}})
        }
    }
};
