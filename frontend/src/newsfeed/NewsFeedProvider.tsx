import React, {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../core';
import {PostProps} from "./PostProps";
import {getNewsFeed} from "./newsFeedApi";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const log = getLogger('NewsFeedProvider');

type fetchNewsFeedTemplate = (type?: string, tags?: string[]) => void;

var PAGE = 0;

export interface NewsFeedState {
    posts?: PostProps[],
    fetching: boolean,
    fetchingError: string,
    fetchNewsFeed?: fetchNewsFeedTemplate,
    disableInfiniteScroll: boolean,
}

const initialState: NewsFeedState = {
    posts: [],
    fetching: false,
    fetchingError: "",
    disableInfiniteScroll: false,
};


export const NewsFeedContext = React.createContext<NewsFeedState>(initialState);

interface NewsFeedProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const FETCH_POSTS_STARTED = 'FETCH_POSTS_STARTED';
const FETCH_POSTS_SUCCEEDED = 'FETCH_POSTS_SUCCEEDED';
const FETCH_POSTS_FAILED = 'FETCH_POSTS_FAILED';
const DISABLE_INFINITE_SCROLL = 'DISABLE_INFINITE_SCROLL'
const ENABLE_INFINITE_SCROLL = 'ENABLE_INFINITE_SCROLL'
const ADD_TO_FEED = 'ADD_TO_FEED'
const WS_SAVE_POST_TO_FEED = 'WS_SAVE_POST_TO_FEED'
const WS_UPDATE_POST_FROM_FEED = 'UPDATE_POST_FROM_FEED'
const WS_DELETE_POST_FROM_FEED = 'DELETE_POST_FROM_FEED'
const PREPARE_FOR_FILTERED_POSTS = 'PREPARE_FOR_FILTERED_POSTS'

const reducer: (state: NewsFeedState, action: ActionProps) => NewsFeedState =
    (state, {type, payload}) => {
        switch (type) {
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
            case ADD_TO_FEED:
                console.log(`ADD_TO_FEED >>>>>>>> ${payload.newsFeed}`)
                let newPosts = [...(state.posts || [])]
                newPosts = newPosts?.concat(payload.newsFeed);
                return {...state, posts: newPosts, fetching: false}
            case WS_SAVE_POST_TO_FEED:
                log(`[WS-REDUCER] SAVE POST TO FEED ${payload.post}`)
                let onSavePosts = [...(state.posts || [])]
                onSavePosts?.push(payload.post)
                return {...state, posts: onSavePosts};
            case WS_UPDATE_POST_FROM_FEED:
                log(`[WS-REDUCER] SAVE POST TO FEED ${payload.post}`)
                let onUpdatePosts = [...(state.posts || [])]
                let updateIdx = onUpdatePosts.findIndex(post => post.id === payload.post.id)
                if (updateIdx !== -1) onUpdatePosts[updateIdx] = payload.post
                return {...state, posts: onUpdatePosts}
            case WS_DELETE_POST_FROM_FEED:
                log(`[WS-REDUCER] DELETE POST FROM FEED ${payload.post}`)
                let onDeletePosts = [...(state.posts || [])]
                let deleteIdx = onDeletePosts.findIndex(post => post.id === payload.post)
                if (deleteIdx !== -1) onDeletePosts.splice(deleteIdx, 1);
                return {...state, posts: onDeletePosts}
            case PREPARE_FOR_FILTERED_POSTS:
                console.log(`[REDUCER] PREPARE FOR FILTERED POSTS >>>>>>>>>>>>>>`)
                return {...state, posts: [], disableInfiniteScroll: false}
            default:
                return state;
        }
    };

export const NewsFeedProvider: React.FC<NewsFeedProviderProps> = ({children}) => {
        const [state, dispatch] = useReducer(reducer, initialState);
        const {posts, fetching, fetchingError, disableInfiniteScroll} = state;
        const fetchNewsFeed = newsFeedCallback
        const SIZE = 2;
        const [prevtype, setPrevtype] = useState<string | undefined>("");
        const [prevTags, setPrevTags] = useState<string[] | undefined>([]);

        useEffect(initializeWebSocket, [])

        const value = {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll};

        return (
            <NewsFeedContext.Provider value={value}>
                {children}
            </NewsFeedContext.Provider>
        );

        async function newsFeedCallback(type?: string, tags?: string[]) {
            try {
                console.log(`[PROVIDER] TAGS: ${tags}`)
                console.log(`[PROVIDER] PREV_TAGS: ${prevTags}`)
                console.log(`[PROVIDER] TYPE: ${type}`)
                if (prevtype !== type || prevTags !== tags) {
                    setPrevtype(type);
                    setPrevTags(tags);
                    dispatch({type: PREPARE_FOR_FILTERED_POSTS})
                    PAGE = 0
                }

                console.log(`[PROVIDER] CURRENT PAGE : ${PAGE}`)
                dispatch({type: FETCH_POSTS_STARTED});

                const posts = await getNewsFeed(PAGE, SIZE, type, tags);

                console.log(`[NF CALLBACK] ${posts.length}`)
                if (posts.length > 0) {
                    dispatch({type: ADD_TO_FEED, payload: {newsFeed: posts}})
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
                log(`Getting news feed PAGE ${PAGE} encountered error: ${error}`)
                dispatch({type: FETCH_POSTS_FAILED});
            }
        }

        function initializeWebSocket() {
            const ws = SockJS('http://localhost:8080/ws');
            const stompClient = Stomp.over(ws);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/newPost', function (message) {
                    console.log(`[WS] NEW POST RECEIVED >>>>>>>>>> ${message["body"]}`);
                    const post: PostProps = JSON.parse(message["body"]);
                    setTimeout(()=>{
                        dispatch({type: WS_SAVE_POST_TO_FEED, payload: {post: post}})
                    },10000);

                });
                stompClient.subscribe('/topic/updatePost', function (message) {
                    console.log(`[WS] UPDATE POST RECEIVED >>>>>>> ${message["body"]}`);
                    const post: PostProps = JSON.parse(message["body"])
                    dispatch({type: WS_UPDATE_POST_FROM_FEED, payload: {post: post}})
                });
                stompClient.subscribe('/topic/deletePost', function (message) {
                    console.log(`[WS] DELETE POST RECEIVED >>>>>>> ${message["body"]}`);
                    const post = message["body"]
                    dispatch({type: WS_DELETE_POST_FROM_FEED, payload: {post: post}})
                });
            })
        }
    }
;