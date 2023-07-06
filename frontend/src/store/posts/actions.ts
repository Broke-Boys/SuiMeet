import {createAsyncThunk} from '@reduxjs/toolkit';
import { IDataPost, blockchainPostAdaptee, getFeed, getFriendsFeed } from '../../service/getFeed';
import { createPost } from '../../client/createPost';
import { PROFILE_ADDR } from '../../client/config';
import { likePost } from '../../client/likePost';
import { authorPosts } from '../../client/authorPost';
import { allPostDetails } from '../../client/postDetail';

export const getPostsAction = createAsyncThunk(
    'posts/getPostAction',
    async (type?: "All" | "Followings") => {
        if (!type) type = 'All';

        if (type == 'All') {
            var feeds = await getFeed(5, true);
        }
        else {
            var feeds = await getFriendsFeed();
        }
        //console.log(feeds)
        return feeds;
    }
)

export const getPostsActionNotFirst = createAsyncThunk(
    'posts/getPostsActionNotInFirst',
    async () => {
        return await getFeed(5, false)
    }
)

// export const 

interface ICreatePostAction {
    post: IDataPost,
    signAndExecuteTransactionBlock: any
}


export const createPostAction = createAsyncThunk(
    'posts/createPostAction',
    async (
        data: ICreatePostAction
    ) => {
        var ans = await createPost(
            data.signAndExecuteTransactionBlock,
            data.post.content,
            data.post.file,
            PROFILE_ADDR()!
        );
        if (ans.error) {
            localStorage.setItem('errorCreatePost', 'true');
            return null
        }
        await new Promise(r => setTimeout(r, 2000));
        var posts = await authorPosts(PROFILE_ADDR()!, 1);
        //console.log(posts)
        var detail = await blockchainPostAdaptee(
            (await allPostDetails(
                [posts![0]]
            ) as any)[0]
        );
        return detail
    }
)

interface ILikePost{
    signAndExecuteTransactionBlock: any
    postId: string;
}

export const likePostAction = createAsyncThunk(
    'posts/likePost',
    async (
        data: ILikePost
    ) => {
        likePost(
            data.signAndExecuteTransactionBlock,
            data.postId,
            PROFILE_ADDR()!
        )
    }
)