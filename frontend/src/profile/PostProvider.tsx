import {useState,useEffect, useReducer, ReactPropTypes, useCallback, useContext} from 'react';
import {Post} from './Post';
import {PostProps} from './PostProps'
import {add, getUserPosts,remove, submitFile,getUserPersonalData,uploadUserPersonalData} from './postApi'
import React from 'react';
import PropTypes from 'prop-types';
import { AuthContext, AuthState } from '../auth';
import Moment from 'moment';

var PAGE = 0;
type AddPostFn = (post : PostProps, file: FileList) => Promise<any>;
type DeletePostFn = (postId : string) => Promise<any>;
type fetchUserPosts = () => void;
type GetPersonalDataFn = (username : string) => Promise<any>;
type UploadPersonalDataFn =(username : string,email:string,phone:string,desc:string,has:boolean, file:FileList | undefined) => Promise<any>;

export interface PostState{
    posts?: PostProps[],
    saving: boolean,
    savingError?: Error | null,
    addPost?: AddPostFn,
    deleting: boolean,
    deleteError?: Error | null,
    deletePost?: DeletePostFn
    fetching: boolean,
    fetchingError: string,
    fetchPosts?: fetchUserPosts,
    disableInfiniteScroll: boolean,
    getData?: GetPersonalDataFn,
    uploadData?: UploadPersonalDataFn
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
    deleting: false
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
const DELETE_POST_STARTED = 'DELETE_POST_STARTED';
const DELETE_POST_SUCCEDED = 'DELETE_POST_SUCCEDED';
const DELETE_POST_FAILED = 'DELETE_POST_FAILED';


const reducer: (state: PostState, action: ActionProps)=> PostState =
    (state, {type,payload}) => {
        switch(type){
            case SAVE_POST_STARTED:
                return {...state, savingError: null, saving:true};
            case SAVE_POST_SUCCEEDED:
                const posts=[...(state.posts || [])]
                const post=payload.post;

                // let isInList = false;
                // posts.forEach((p) => {if(p.id == post.id) isInList = true; });
                //
                // if(!isInList)
                    posts.unshift(post);
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
            case DELETE_POST_STARTED:
                return {...state, deleteError: null, deleting: true};
            case DELETE_POST_SUCCEDED:
                const {deletedPostId} = payload;
                let userPosts = [...(state.posts || [])];
                let deleteIdx = userPosts.findIndex(post => post.id === deletedPostId);
                if (deleteIdx !== -1) userPosts.splice(deleteIdx, 1);
                return {...state, posts: userPosts, deleteError: null, deleting: false};
            case DELETE_POST_FAILED:
                return {...state, deleteError: payload.error, deleting: false};
            default:
                return state;
        }
    };

export const PostContext = React.createContext<PostState>(initialState);

interface PostProviderProps{
    children: PropTypes.ReactNodeLike,
}
/*
    The "PostProvider" component maitains the logic of the application regarding the adding and providing the posts functionalities
 */
export const PostProvider: React.FC<PostProviderProps>=({children})=>{
    const [state, dispatch] = useReducer(reducer, initialState)
    const {token} = useContext<AuthState>(AuthContext);
    const {posts,saving,savingError,deleting,deleteError,fetching, fetchingError, disableInfiniteScroll} = state;


    const addPost=useCallback<AddPostFn>(savePostCallback,[token]);
    const getData=useCallback<GetPersonalDataFn>(getPersonalDataCallback,[]);
    const uploadData=useCallback<UploadPersonalDataFn>(uploadPersonalDataCallback,[]);
    const fetchPosts = userPageCallback
    const SIZE = 2;
    const deletePost=useCallback<DeletePostFn>(deletePostCallback, [token]);
    const value={posts,saving,savingError,addPost, fetching, fetchingError, fetchPosts,deleting,deleteError,deletePost, disableInfiniteScroll,getData,uploadData}


    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );

    async function userPageCallback() {
        try {
            console.log(`[PROVIDER] CURRENT PAGE : ${PAGE}`)
            dispatch({type: FETCH_POSTS_STARTED});

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
            const savedPost= await (add(post.date,post.type,token,post.body,post.tags,post.latitude,post.longitude));
            savedPost.id && await submitFile(file, savedPost.id);
            dispatch({type:SAVE_POST_SUCCEEDED,payload:{post: savedPost}})
        }catch(error){
            dispatch({type:SAVE_POST_FAILED, payload:{error}})
        }
    }

    //callback for deleting te post
    async function deletePostCallback(postId: string) {
        try {
            dispatch({type: DELETE_POST_STARTED});
            await remove(token, postId);
            dispatch({type: DELETE_POST_SUCCEDED, payload: {deletedPostId: postId}});
        } catch (error) {
            dispatch({type: DELETE_POST_FAILED, payload: {error}});
        }
    }

    //callback for getting the personal data
    async function getPersonalDataCallback(username : string){
        return await getUserPersonalData(username);
    }

    async function uploadPersonalDataCallback(username : string,email:string,phone:string,desc:string,has:boolean, file:FileList|undefined){
        await uploadUserPersonalData(username,email,phone,desc,has);
        file && await submitFile(file,username); 
    }
};