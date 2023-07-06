import react, { useState } from 'react'
import { Sidebar } from '../../elements/sidebar'
import { LeftSidebar } from '../../elements/leftSidebar'
import './style.css';
import { TendentionWidget } from '../../elements/ViewsTendetion';
import { Button } from '../../elements/button';
import { Textarea } from '../../elements/textarea';
import { PostHeader } from '../../elements/postHeader';
import { Post, imgCondition } from '../../elements/post';
import { Image } from '../../elements/icons/image';
import { File } from '../../elements/icons/file';
import { useNavigate, useParams } from 'react-router-dom';
import { ExtendedProfile } from '../../elements/extendedProfile';
import { getFollowings } from '../../../client/getFollowings';
import { useWalletKit } from '@mysten/wallet-kit';
import { IDataShortProfile, blockchainToStructAdaptee } from '../../../service/getSuggestedProfiles';
import {formatAddress} from '@mysten/sui.js'
import { getFollowers } from '../../../client/getFollowers';
import { createPost } from '../../../client/createPost';
import { PROFILE_ADDR } from '../../../client/config';
import { IDataPost, getFeed } from '../../../service/getFeed';
import { changePost, feedFetchedTypeSelector, feedTypeSelector, postSelector, setType } from '../../../store/posts';
import { useSelector, useDispatch } from 'react-redux';
import { createPostAction, getPostsAction, getPostsActionNotFirst } from '../../../store/posts/actions';
import { getProfile } from '../../../client/getProfile';
import { fetchedTypeSelector, followersSelector, followingsSelector, profileChangePost, profilePostsSelector, profileSelector, profileUpdate, setProfileFetchedType } from '../../../store/profile';
import { getFollowersAction, getFollowingsAction, getProfileAction, getProfilePostsAction } from '../../../store/profile/actions';
import { uploadFile } from '../../../client/uploadFIle';
import { Cross } from '../../elements/icons/crosss';
import { Image as ImageAntd } from 'antd';
import {Avatar, Checkbox} from 'antd'
import { Input } from '../../elements/input';
import { editProfile } from '../../../client/editProfile';
import { editPost } from '../../../client/editPost';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Puff } from 'react-loader-spinner';
import { MobileFooter } from '../../elements/mobileFooter';


interface IImageControll{
    image: string;
    onCross: () => void;
}

const ImageControll: react.FC<IImageControll> = (props) => {
    return <div className="image-controlls">
        <div className="control-abs">
            <div className="controll-content" onClick={props.onCross}>
                <Cross color='white'/>
            </div>
        </div>
        <div className='image__controll'>
            <ImageAntd src={props.image} width={100}/>
        </div>
    </div> 
}


const FileControll: react.FC<IImageControll> = (props) => {
    var filename = props.image.split('/')
    filename = filename[filename.length-1] as any

    return <div className="image-controlls">
        <div className="control-abs">
            <div className="controll-content" onClick={props.onCross}>
                <Cross color='white'/>
            </div>
        </div>
        <div className='image__controll file__controll'>
            <span>{filename}</span>
        </div>
    </div> 
}

interface IPostCreation{
    postId?: string;
    closeFunction?: any;
}

export const PostCreation: react.FC<IPostCreation> = (props) => {
    const posts = useSelector(postSelector);
    var post = undefined;
    var startImages: string[] = [];
    var startFiles: string[] = [];
    
    //console.log(props.postId, posts)
    if (props.postId) {
        post = posts.filter(e => e.messageAddr == props.postId)[0];
        startImages = post.file.split(';').filter(imgCondition);
        startFiles = post.file.split(';').filter(e => !imgCondition(e) && e.length)
    }
    const [text, setText] = react.useState(post ? post.content : '');
    const dispatch = useDispatch();
    const profile = useSelector(profileSelector);
    const {signAndExecuteTransactionBlock} = useWalletKit();
    const [images, setImages] = react.useState<string[]>(startImages);
    const [imageLoading, setImageLoading] = react.useState(false);
    const [files, setFiles] = react.useState(startFiles);

    
    return <div className="post_insert">
    <Textarea
        onChange={(e) => {
            setText(e);
        }}
        value={text}
        setText={setText}
    />
    <div className='posting-controlls'>
        <div className="uploads">
            <div className="image-upl">
                <label htmlFor={props.postId ? 'file-update' : 'file'} className='file_input'>
                    {
                        !imageLoading ? <Image /> : <Puff 
                            height="18"
                            width="18"
                            radius={1}
                            color="#BBB7C9"
                            ariaLabel="puff-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    }
                    
                </label>
                <input type="file" id={props.postId ? 'file-update' : 'file'} onChange={async (e) => {
                    setImageLoading(true);
                    var links = [];
                    for (var i = 0; i < e.target.files?.length!; ++i) {
                        links.push(await uploadFile(e.target.files![i]))
                    }
                    setImages(images.concat(links));
                    setImageLoading(false);
                }} multiple />
            </div>
            {/* <div className="file-upl">
                <label htmlFor="file-upl" className='file_input'>
                    <File />
                </label>
                <input type="file" id='file-upl' onChange={async (e) => {
                    var links = [];
                    for (var i = 0; i < e.target.files?.length!; ++i) {
                        links.push(await uploadFile(e.target.files![i]))
                    }
                    setFiles(files.concat(links as any));
                }}/>
            </div> */}
        </div>
        <Button 
            content={ props.postId ? "Update" : "Post"}
            className='small-btn'
            onClick={async () => {
                var filesStr = files.concat(images as any).join(';')
                
                if (props.postId) {
                    editPost(
                        signAndExecuteTransactionBlock,
                        text,
                        filesStr,
                        props.postId
                    ).then((e) => {
                        if (e.error) return; 
                        var changeData = {
                            postId: props.postId!,
                            files: filesStr,
                            content: text
                        }
                        dispatch(
                            profileChangePost(
                                changeData
                            )
                        );
                        dispatch(
                            changePost(changeData)
                        );
                        props.closeFunction()
                    })
                } else{
                    dispatch(
                        createPostAction({
                            post:{
                                author: profile,
                                content: text,
                                likes: 0,
                                comments: [],
                                addr: '',
                                file: filesStr,
                                messageAddr: ''
                            },
                            signAndExecuteTransactionBlock: signAndExecuteTransactionBlock  
                        }
                            
                        ) as any
                    ).then(() => {
                        setTimeout(() => {
                            if (localStorage.getItem('errorCreatePost')) {
                                localStorage.removeItem('errorCreatePost');
                                return;
                            }
                            setText('')
                            setFiles([])
                            setImages([])
                        }, 100)
                    })
                    
                }
            }}
        />
    </div>
    <div className="post__imgs">
        {
            images.map((e) => <ImageControll 
                onCross={() => {
                    setImages(images.filter(ee => ee != e))
                }}
                image={e}
            />)
        }
    </div>
    <div className="post__imgs">
        {
            files.map((e) => <FileControll 
                onCross={() => {
                    setFiles(files.filter(ee => ee != e))
                }}
                image={e}
            />)
        }
    </div>
</div>
}


const MainPage: react.FC = () => {

    const fetchedType = useSelector(fetchedTypeSelector);
    const feedFetchedType = useSelector(feedFetchedTypeSelector);
    const posts = useSelector(postSelector);
    const profile = useSelector(profileSelector);
    const dispatch = useDispatch();
    const {currentAccount} = useWalletKit();
    const feedType = useSelector(feedTypeSelector);

    if (fetchedType == 'none' && currentAccount?.address) {
        dispatch(
            getProfileAction(PROFILE_ADDR()!) as any
        );
        dispatch(
            getProfilePostsAction(PROFILE_ADDR()!) as any
        );
        dispatch(
            getFollowersAction(PROFILE_ADDR()!) as any
        );
        dispatch(
            getFollowingsAction(PROFILE_ADDR()!) as any
        );
        dispatch(
            getProfilePostsAction(PROFILE_ADDR()!) as any
        );
    }
    if (fetchedType == 'fetched') {
        if (profile.fullWallet != PROFILE_ADDR()!) {
            dispatch(
                setProfileFetchedType('none')
            )
        }
    }

    if (feedFetchedType == 'none') {
        dispatch(
            getPostsAction(feedType) as any
        )
    }

    console.log(feedFetchedType)

    return <div className='main__content' id='main-content'>
    <div className="post-insert__container">
        <PostCreation />
    </div>
    
    <PostHeader 
        news={posts.length} 
        postTypeChange={(e) => {
            dispatch(
                setType(e)
            )
        }}
    />
    {
        feedType == 'All' ?
        <InfiniteScroll
        dataLength={posts.length}
        next={async () => {
            await dispatch(
                getPostsActionNotFirst() as any
            )
        }}
        hasMore={JSON.parse(localStorage.getItem('hasPage')!)}
        loader={<div style={{
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 20
        }}>
            <Puff 
                height={80}
                width={80}
                radius={1}
                color={'#FE754D'}
            />
        </div>}
        scrollableTarget={'main-content'}
    >
        {
            posts.map((e, idx) => <div key={idx} style={{'marginTop': 10}}><Post {...e} /></div>)
        }
    </InfiniteScroll> :
    <>
    {
        feedFetchedType == 'fetching' ? <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 20
        }}>
            <Puff 
                height={80}
                width={80}
                radius={1}
                color={'#FE754D'}
            />
        </div> :
        posts.length ?
        posts.map((e, idx) => <div key={idx} style={{'marginTop': 10}}>
            <Post {...e} />
            </div>
        ) : <span style={{textAlign: 'center', color: '#504D62', fontWeight: 'bold'}}>There is no any posts</span>
    }
    </>
    }
    

</div>
}

export const ProfileView: react.FC = () => {
    const posts = useSelector(profilePostsSelector);
    const type = useSelector(fetchedTypeSelector);
    const dispatch = useDispatch();

    if (type == 'none' && posts.length == 0) {
        dispatch(
            getProfilePostsAction(PROFILE_ADDR()!) as any
        )
    }

    //console.log(posts);

    return <>
        <div className="post-header__container">
            <span>Recent posts</span>
        </div>
        <div className="posts__container-profile">
        {
            type == 'fetching' ? 
            <div style={{
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: 20
            }}>
                <Puff 
                    height={80}
                    width={80}
                    radius={1}
                    color={'#FE754D'}
                />
            </div> : 
            posts.length ?
            posts.map((e) => {
                return <Post {...e}/>
            }) : <span style={{textAlign: 'center', color: '#504D62', fontWeight: 'bold'}}>No posts yet</span>
        }
        </div>

    </>
}

const Followers: react.FC = () => {
    const queried = react.useRef(false);
    const {currentAccount} = useWalletKit();
    const followers = useSelector(followersSelector);
    
    if (currentAccount?.address && !queried.current) {
        queried.current = true;
        
    }

    return <div className='followers__list'>
        {
            followers.length ?
            followers.map((e) => <ExtendedProfile {...e}/>) : 
            <span style={{textAlign: 'center', fontWeight: 'bold'}}>Not followers yet</span>
        }
    </div>
}

const ProfileUpdate: react.FC = () => {
    var profile = useSelector(profileSelector);
    var [profileValue, setProfileValue] = react.useState(profile.name);
    var [description, setDescription] = react.useState(profile.description);
    var [isGroup, setIsGroup] = react.useState(false);
    var [profilePhoto, setProfilePhoto] = react.useState(profile.imageUrl);
    var [edited, setEdited] = react.useState(false);
    var fetchedType = useSelector(fetchedTypeSelector);
    var dispatch = useDispatch();

    const [loaded, setLoaded] = useState(false);

    if (fetchedType == 'none') {
        dispatch(
            getProfileAction(PROFILE_ADDR()!) as any
        )
    }

    if (!edited) {
        if (profileValue != profile.name) {
            setProfileValue(profile.name);
        }
        if (description != profile.description) {
            setDescription(profile.description)
        }
        if (profilePhoto != profile.imageUrl) {
            setProfilePhoto(profile.imageUrl);
        }
    } 

    const {signAndExecuteTransactionBlock} = useWalletKit();


    return <div className='profile-update__container'>
        
        <div className="avatar-update">
        <Avatar
            src={profilePhoto}
            size={{ xs: 48, sm: 52, md: 64, lg: 72, xl: 100, xxl: 120 }}
        >{(profile.name ? profile.name : 'US').slice(0, 2)}</Avatar>
        <div className="file-inp">
            <input 
                type="file" 
                style={{display: 'none'}} 
                id='change-profile'
                onChange={async (e) => {
                    setLoaded(true);
                    setEdited(true);
                    var link = await uploadFile(e.target.files![0])
                    setProfilePhoto(link!);
                    setLoaded(false);
                }} 
            />
            <label htmlFor="change-profile">
                <div className="update-photo">
                    {
                        loaded ? <Puff 
                            width={16}
                            height={16}
                            color='white'    
                        /> : <>New photo</>
                    }
                    
                </div>
            </label>
        </div>
        </div>
        <input 
            placeholder='username'
            className='inp-colored'
            value={profileValue}
            onChange={(e) => {
                setEdited(true);
                setProfileValue(e.target.value);
            }}
        />
        <textarea 
            className='ta-bordered' 
            placeholder='Profile description'
            value={description}
            onChange={(e) => {
                setEdited(true);
                setDescription(e.target.value)
            }}
        ></textarea>
        {/* <Checkbox
            value={isGroup}
            onChange={(e) => {
                setIsGroup(e.target.value)
            }}
        >
            Is Group account
        </Checkbox> */}
        <Button 
            content={'Save'}
            className=''
            onClick={() => {
                editProfile(
                    profileValue,
                    description!,
                    profilePhoto,
                    isGroup,
                    signAndExecuteTransactionBlock
                );
                dispatch(
                    profileUpdate(
                        {
                            name: profileValue,
                            description: description ? description : '',
                            imageUrl: profilePhoto
                        }
                    )
                )
            }}
        />
    </div>
}

const Profile: react.FC = () => {
    const {action} = useParams();
    const mapping = {
        'profile': <ProfileView />,
        'followers': <Followers />,
        'profile-update': <ProfileUpdate />
    }
    return <div className='profile-screen__container'>
        {
            (mapping as any)[action!]
        }
    </div>
}

export interface IDataFullProfile extends IDataShortProfile {
    description?: string;
}

export const dataFullProfileAdaptee = (profile: any) => {
    try {
        var fields = profile.data.content.fields;
    } catch {
        var fields = profile;
    }
    
    return {
        name: fields.name,
        wallet: formatAddress(fields.id.id),
        fullWallet: fields.id.id,
        description: fields.description,
        imageUrl: fields.image_url
    } as IDataFullProfile
}

const Subs: react.FC = () => {
    const followings = useSelector(followingsSelector)
    const fetchedType = useSelector(fetchedTypeSelector);
    const {currentAccount} = useWalletKit();
    const dispatch = useDispatch();

    if (fetchedType == 'none' && currentAccount?.address) {
        dispatch(
            getFollowingsAction(PROFILE_ADDR()!) as any
        )
    }

    return <div className='subs__container'>
        {
            followings.length ?
            followings.map(e => <ExtendedProfile {...e}/>):
            <span style={{textAlign: 'center', color: '#504D62', fontWeight: 'bold'}}>You don't subscribe to any author</span>
        }
    </div>
}

export const Main: react.FC = () => {
    const content = {
        'index': <MainPage />,
        'profile': <Profile />,
        'followers': <Profile />,
        'profile-update': <Profile />,
        'subs': <Subs />
    }
    const {action} = useParams();
    const navigate = useNavigate();
    
    if (!localStorage.getItem('profileAddr')) {
        setTimeout(() => {
            navigate('/sign-up')
        }, 200)
        
    }

    return <div className='main__container'>
        <div className="right-sidebar__media">
            <Sidebar />
        </div>
        
        {
            (content as any)[action as string]
        }
        <div className="left-sidebar__media">
            <LeftSidebar />
        </div>
        <div className="mobile-media">
            <MobileFooter />
        </div>
    </div>
}