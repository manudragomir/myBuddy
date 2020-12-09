import React, {useContext, useReducer} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../core';
import {PostProps} from "./PostProps";
import {getNewsFeed} from "./newsFeedApi";
import {AuthContext} from "../auth";

const log = getLogger('NewsFeedProvider');

type fetchNewsFeedTemplate = () => void;

export interface NewsFeedState {
    posts?: PostProps[],
    fetching: boolean,
    fetchingError: string,
    fetchNewsFeed?: fetchNewsFeedTemplate,
    disableInfiniteScroll: boolean,
    page: number
}

const initialState: NewsFeedState = {
    posts: [],
    fetching: false,
    fetchingError: "",
    disableInfiniteScroll: false,
    page: 0
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
const SET_NEXT_PAGE = 'SET_NEXT_PAGE'

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
                return {...state, disableInfiniteScroll: true}
            case ADD_TO_FEED:
                let newPosts = state.posts
                const newPage = state.page + 1
                newPosts = newPosts?.concat(payload.newsFeed);
                return {...state, posts: newPosts, page: newPage}
            default:
                return state;
        }
    };

export const NewsFeedProvider: React.FC<NewsFeedProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {posts, fetching, fetchingError, disableInfiniteScroll, page} = state;
    const fetchNewsFeed = newsFeedCallback
    const SIZE = 2;

    //  useEffect(getNewsFeedPostsEffect, []);

    const value = {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll, page};
    log('returns');
    return (
        <NewsFeedContext.Provider value={value}>
            {children}
        </NewsFeedContext.Provider>
    );

    async function newsFeedCallback() {
        try {
            console.log(`PAGE: ${page}`)
            const posts = await getNewsFeed(page, SIZE);
            if (posts.length > 0) {
                dispatch({type: ADD_TO_FEED, payload: {newsFeed: posts}})
                if (posts.length < SIZE) {
                    dispatch({type: DISABLE_INFINITE_SCROLL})
                }
            }
            if (posts.length == 0) {
                dispatch({type: DISABLE_INFINITE_SCROLL})
            }
        } catch (error) {
            getLogger(`Getting news feed page ${page} encountered error: ${error}`)
        }
    }

    // function getNewsFeedPostsEffect() {
    //     console.log("GET NEWS FEED")
    //     let canceled = false;
    //     fetchPosts();
    //     return () => {
    //         canceled = true;
    //     }
    //
    //     async function fetchPosts() {
    //         try {
    //             log('fetchPosts started');
    //             dispatch({type: FETCH_POSTS_STARTED, payload: ""})
    //             const result = await getNewsFeed(0,1);
    //             log('fetchPosts succeeded');
    //             if (!canceled) {
    //                 dispatch({type: FETCH_POSTS_SUCCEEDED, payload: {result: result}})
    //             }
    //         } catch (error) {
    //             log('fetchPosts failed');
    //             log(error);
    //             dispatch({type: FETCH_POSTS_FAILED, payload: {error: error}})
    //         }
    //     }
    // }
};
