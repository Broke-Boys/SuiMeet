import { getAllPosts } from "../client/getAllPosts"
import { getProfile } from "../client/getProfile";
import { allPostDetails, postDetail } from "../client/postDetail";
import { dataFullProfileAdaptee } from "../pages/desktop/main";
import { IDataShortProfile, blockchainToStructAdaptee } from "./getSuggestedProfiles";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')


export interface IDataPost {
    author: IDataShortProfile,
    content: string;
    likes: number;
    comments: IComment[];
    addr: string;
    file: string;
    messageAddr: string;
    liked?: boolean;
    donated?: number;
    timestamp?: string;
}

export interface IComment {
    author: IDataShortProfile,
    content: string;
    timestamp: string;
    id: string;
}

export const commentAdaptee = async (comment: any) => {
    if (comment.data) {
        comment = comment.data.content.fields;
    }
    //console.log(comment)

    var author = blockchainToStructAdaptee(
        await getProfile(comment.author)
    );
    var date = new Date(parseInt(comment.timestamp))
    var timestamp = timeAgo.format(date);
    //console.log("comment1")
    return {
        author,
        content: comment.text,
        timestamp: timestamp,
        id: comment.id.id
    } as IComment
}

export const blockchainPostAdaptee = async (post: any) => {
    //console.log(post, "poooooost")
    var authorData = blockchainToStructAdaptee(
        await getProfile(post.author)
    );
    //console.log("post12")
    var comments = [];
    for (var i = 0; i < post.comments.length; ++i) {
        comments.push(await commentAdaptee(post.comments[i]))
    }
    //console.log("post1234")
    var ts = new Date(parseInt(post.timestamp));
    var timestamp = timeAgo.format(ts);
    //console.log("post blyat")
    return {
        author: authorData,
        addr: post.id.id,
        file: post.files,
        content: post.text,
        likes: post.likes,
        comments: comments,
        messageAddr: post.messageAddr,
        liked: post.liked,
        donated: post.donated,
        timestamp: timestamp
    } as IDataPost
}


export const getFeed = async (limit: number, first: boolean) => {
    if (!first) {
        var lastEventPrev = JSON.parse(localStorage.getItem('lastEvent')!);
        var {postsIds, lastEvent, hasPage} = (await getAllPosts(limit, lastEventPrev))!;
    } else {
        var {postsIds, lastEvent, hasPage} = (await getAllPosts(limit))!;
    }
    localStorage.setItem('lastEvent', JSON.stringify(lastEvent))
    localStorage.setItem('hasPage', JSON.stringify(hasPage));

    var posts = await allPostDetails(postsIds);
    //console.log(posts, "posts")
    var newposts = []

    for (var i = 0; i < postsIds!.length; ++i) {
        //console.log(i, "fuck blyat")
        newposts!.push(
            await blockchainPostAdaptee(
                posts![i]
            )
        );
        //console.log(i, "endfuck")
    }
    //console.log("new posts", newposts)
    return newposts;
}