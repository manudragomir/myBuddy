import React, {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../core';
import {PostProps} from "./PostProps";
import {getNewsFeed} from "./newsFeedApi";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {useMyLocation} from "./useLocation";

const log = getLogger('NewsFeedProvider');

type fetchNewsFeedTemplate = (searchArea: number, type?: string, tags?: string[]) => void;

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
                payload.newsFeed.forEach((p: PostProps) => newPosts.findIndex(x => x.id === p.id) === -1 ? newPosts.push(p) : '')
                //newPosts = newPosts?.concat(payload.newsFeed);
                return {...state, posts: newPosts, fetching: false}
            case WS_SAVE_POST_TO_FEED:
                log(`[WS-REDUCER] SAVE POST TO FEED ${payload.post}`)
                let onSavePosts = [...(state.posts || [])]
                onSavePosts?.unshift(payload.post)
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
        const [prevSearchArea, setPrevSearchArea] = useState<number | undefined>(0);
        const currentLocation = useMyLocation();
        const {latitude: lat, longitude: lng} = currentLocation.position?.coords || {}

        useEffect(initializeWebSocket, [])

        const value = {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll};

        return (
            <NewsFeedContext.Provider value={value}>
                {children}
            </NewsFeedContext.Provider>
        );

        async function newsFeedCallback(searchArea: number, type?: string, tags?: string[]) {
            try {
                console.log(`[PROVIDER] TAGS: ${tags}`)
                console.log(`[PROVIDER] PREV_TAGS: ${prevTags}`)
                console.log(`[PROVIDER] TYPE: ${type}`)
                console.log(`[PROVIDER] SEARCHAREA: ${searchArea}`)
                console.log(`[PROVIDER] PREV SEARCH: ${prevSearchArea}`)
                if (prevtype !== type || prevTags !== tags || prevSearchArea !== searchArea) {
                    dispatch({type: PREPARE_FOR_FILTERED_POSTS})
                    setPrevtype(type);
                    setPrevTags(tags);
                    setPrevSearchArea(searchArea)
                    PAGE = 0
                }

                console.log(`[PROVIDER] CURRENT PAGE : ${PAGE}`)
                dispatch({type: FETCH_POSTS_STARTED});

                let posts: PostProps[];
                console.log(`SEARCH AREA IN POST: ${searchArea}`)
                if (searchArea > 0)
                    posts = await getNewsFeed(PAGE, SIZE, type, tags, lat, lng, searchArea);
                else
                    posts = await getNewsFeed(PAGE, SIZE, type, tags);

                console.log(`[NF CALLBACK] ${posts.length}`)
                if (posts.length > 0) {
                    dispatch({type: ADD_TO_FEED, payload: {newsFeed: posts}})
                    PAGE = PAGE + 1
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
            const WS_TIMEOUT_WAIT_FOR_S3_UPLOAD = 3000;
            const ws = SockJS('http://localhost:8080/ws');
            const stompClient = Stomp.over(ws);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/newPost', function (message) {
                    setTimeout(() => {
                        console.log(`[WS] NEW POST RECEIVED >>>>>>>>>> ${message["body"]}`);
                        const post: PostProps = JSON.parse(message["body"]);
                        dispatch({type: WS_SAVE_POST_TO_FEED, payload: {post: post}})
                    }, WS_TIMEOUT_WAIT_FOR_S3_UPLOAD);
                });
                stompClient.subscribe('/topic/updatePost', function (message) {
                    setTimeout(() => {
                        console.log(`[WS] UPDATE POST RECEIVED >>>>>>> ${message["body"]}`);
                        const post: PostProps = JSON.parse(message["body"])
                        dispatch({type: WS_UPDATE_POST_FROM_FEED, payload: {post: post}})
                    }, WS_TIMEOUT_WAIT_FOR_S3_UPLOAD);
                });
                stompClient.subscribe('/topic/deletePost', function (message) {
                    setTimeout(() => {
                        console.log(`[WS] DELETE POST RECEIVED >>>>>>> ${message["body"]}`);
                        const post = message["body"]
                        dispatch({type: WS_DELETE_POST_FROM_FEED, payload: {post: post}})
                    }, WS_TIMEOUT_WAIT_FOR_S3_UPLOAD);
                });
            })
        }
    }
;
