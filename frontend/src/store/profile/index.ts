import {
    createSlice, createSelector, PayloadAction
} from '@reduxjs/toolkit'
import { IDataFullProfile } from '../../pages/desktop/main'
import { IDataPost } from '../../service/getFeed'
import { getFollowersAction, getFollowingsAction, getProfileAction, getProfilePostsAction } from './actions'
import { RootType } from '..'
import { IPostUpdate } from '../posts'


interface IPerson {
    profile: IDataFullProfile,
    followes: IDataFullProfile[],
    followings: IDataFullProfile[],
    posts: IDataPost[]
}


const initialState = {
    profile: {
        profile: {} as IDataFullProfile,
        followes: [],
        followings: [],
        posts: []
    } as IPerson,
    type: "none" as "none" | "fetched" | "fetching"
}

interface IProfileUpdate{
    name: string;
    description: string;
    imageUrl: string;
}

const profileSlice = createSlice({
    'name': 'profile',
    initialState,
    reducers: {
        setProfileFetchedType(state, payload: PayloadAction<"none" | "fetched" | "fetching">) {
            state.type = payload.payload;
        },
        profileChangePost(state, payload: PayloadAction<IPostUpdate>) {
            state.profile.posts = state.profile.posts.map((e) => {
                if (e.messageAddr == payload.payload.postId) {
                    return {
                        ...e,
                        ...payload.payload
                    }
                }
                return e
            })
        },
        profileUpdate(state, payload: PayloadAction<IProfileUpdate>) {
            state.profile.profile = {
                ...state.profile.profile,
                ...payload.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProfileAction.pending, (state, data) => {
            state.type = "fetching";
        })
        builder.addCase(getFollowersAction.pending, (state, data) => {
            state.type = "fetching";
        })
        builder.addCase(getProfilePostsAction.pending, (state, data) => {
            state.type = "fetching";
        })
        builder.addCase(getFollowingsAction.pending, (state, data) => {
            state.type = "fetching";
        })

        builder.addCase(getProfileAction.fulfilled, (state, action) => {
            state.profile.profile = action.payload;
            state.type = "fetched";
        });
        builder.addCase(getFollowersAction.fulfilled, (state, action) => {
            state.profile.followes = action.payload!;
            state.type = "fetched";
        });
        builder.addCase(getProfilePostsAction.fulfilled, (state, action) => {
            state.profile.posts = action.payload;
            state.type = "fetched";
        });
        builder.addCase(getFollowingsAction.fulfilled, (state, action) => {
            state.profile.followings = action.payload!;
            state.type = "fetched";
        });
    }
});

export default profileSlice.reducer;

export const {
    setProfileFetchedType,
    profileChangePost,
    profileUpdate
} = profileSlice.actions;

export const profileSelector = createSelector(
    (state: RootType) => state.profile.profile.profile,
    (e) => e
)

export const followersSelector = createSelector(
    (state: RootType) => state.profile.profile.followes,
    (e) => e
)

export const followingsSelector = createSelector(
    (state: RootType) => state.profile.profile.followings,
    (e) => e
)

export const profilePostsSelector = createSelector(
    (state: RootType) => state.profile.profile.posts,
    (e) => e
)

export const fetchedTypeSelector = createSelector(
    (state: RootType) => state.profile.type,
    e => e
)
