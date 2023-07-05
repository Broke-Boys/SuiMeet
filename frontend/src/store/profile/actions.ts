import {createAsyncThunk} from '@reduxjs/toolkit';
import { getProfile } from '../../client/getProfile';
import { PROFILE_ADDR } from '../../client/config';
import { IDataFullProfile, dataFullProfileAdaptee } from '../../pages/desktop/main';
import { authorPosts } from '../../client/authorPost';
import { blockchainPostAdaptee } from '../../service/getFeed';
import { getFollowers } from '../../client/getFollowers';
import { getFollowings } from '../../client/getFollowings';
import { allPostDetails, postDetail } from '../../client/postDetail';
import { getAllPosts } from '../../client/getAllPosts';

export const getProfileAction = createAsyncThunk(
    'profile/profile',
    async (
        profileAddr: string
    ) => {
        return dataFullProfileAdaptee(
            await getProfile(
                profileAddr
            )
        )
    }
)

export const getProfilePostsAction = createAsyncThunk(
    'profile/posts',
    async (
        profileAddr: string
    ) => {
        //console.log('profile posts')
        var postDetails = await authorPosts(profileAddr, 5);
        //console.log(postDetails)
        postDetails = await allPostDetails((postDetails) as any);
        //console.log(postDetails)
        var mapped = []
        for (var i = 0; i < postDetails!.length; ++i) {
            mapped.push(await blockchainPostAdaptee(postDetails![i]))
        }
        return mapped;
    }
)

export const getFollowersAction = createAsyncThunk(
    'profile/followers',
    async (
        profileAddr: string
    ) => {
        //console.log('followers')
        var followers = (await getFollowers(profileAddr) as any)
        //console.log(followers, 'followers')
        return (await getFollowers(profileAddr) as any)?.map(dataFullProfileAdaptee);
    }
)

export const getFollowingsAction = createAsyncThunk(
    'profile/followings',
    async (
        profileAddr: string
    ) => {
        var followings = await getFollowings(profileAddr);
        var res: IDataFullProfile[] = (followings as any)?.map(dataFullProfileAdaptee);
        if (profileAddr == PROFILE_ADDR()!) localStorage.setItem('followings', res.map((e) => e.fullWallet).join(';'))
        return (followings as any)?.map(dataFullProfileAdaptee);
    }
)