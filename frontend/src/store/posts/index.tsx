import {createSlice, createSelector, PayloadAction} from '@reduxjs/toolkit';
import { IDataPost } from '../../service/getFeed';
import { createPostAction, getPostsAction, getPostsActionNotFirst } from './actions';
import { createPost } from '../../client/createPost';
import { RootType } from '..';

const initialState = {
    posts: [] as IDataPost[],
    type: "none" as "none" | "fetched" | "fetching",
    postType: 'All' as "All" | "Followings"
}

export interface IPostUpdate {
    postId: string;
    content: string;
    files: string;
}


const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        changePost(state, payload: PayloadAction<IPostUpdate>) {
            state.posts = state.posts.map((e) => {
                if (e.messageAddr == payload.payload.postId) {
                    return {
                        ...e,
                        ...payload.payload
                    }
                }
                return e
            })
        },
        setType(state, payload: PayloadAction<"All"|"Followings">) {
            state.postType = payload.payload;
            state.type = 'none'
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPostsAction.pending, (state, action) => {
            state.type = 'fetching';
        })
        builder.addCase(getPostsAction.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.type = "fetched";

        });
        builder.addCase(createPostAction.fulfilled, (state, action) => {
            if (action.payload) state.posts = [action.payload].concat(state.posts as any);
        });
        builder.addCase(getPostsActionNotFirst.fulfilled, (state, action) => {
            state.posts = state.posts.concat(action.payload);
        })
    }
});


export const {changePost, setType} = postSlice.actions;

export default postSlice.reducer;

export const postSelector = createSelector((store: RootType) => store.post.posts, (e) => e)
export const feedFetchedTypeSelector = createSelector((store: RootType) => store.post.type, e => e);
export const feedTypeSelector = createSelector((store: RootType) => store.post.postType, e => e);