import React, {useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../core';
import {PostProps} from "./PostProps";
import {getNewsFeed} from "./newsFeedApi";

const log = getLogger('NewsFeedProvider');

export interface NewsFeedState {
    posts?: PostProps[],
    fetching: boolean,
    fetchingError: string,
}

const initialState: NewsFeedState = {
    posts: [],
    fetching: false,
    fetchingError: "",
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

const reducer: (state: NewsFeedState, action: ActionProps) => NewsFeedState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_POSTS_STARTED:
                return {...state, fetching: true, fetchingError: ""};
            case FETCH_POSTS_SUCCEEDED:
                return {...state, posts: payload.result, fetching: false};
            case FETCH_POSTS_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            default:
                return state;
        }
    };

export const NewsFeedProvider: React.FC<NewsFeedProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {posts, fetching, fetchingError} = state;

    useEffect(getNewsFeedPostsEffect, []);

    const value = {posts, fetching, fetchingError};
    log('returns');
    return (
        <NewsFeedContext.Provider value={value}>
            {children}
        </NewsFeedContext.Provider>
    );

    function getNewsFeedPostsEffect() {
        console.log("GET NEWS FEED")
        let canceled = false;
        fetchPosts();
        return () => {
            canceled = true;
        }

        async function fetchPosts() {
            try {
                log('fetchPosts started');
                dispatch({type: FETCH_POSTS_STARTED, payload: ""})
                const result = await getNewsFeed();
                log('fetchPosts succeeded');
                if (!canceled) {
                    dispatch({type: FETCH_POSTS_SUCCEEDED, payload: {result: result}})
                }
            } catch (error) {
                log('fetchPosts failed');
                log(error);
                dispatch({type: FETCH_POSTS_FAILED, payload: {error: error}})
            }
        }
    }
};
