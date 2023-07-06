import react from 'react'
import './style.css';
import { LikeDisabled, LikeEnabled } from '../icons/like';
import { CommentDisabled, CommentEnabled } from '../icons/comment';
import { ArrowDown } from '../icons/arrow';
import { ArrowUp, ArrowUpActive } from '../icons/arrowDown';
import { Input } from '../input';
import { ShortProfile } from '../shortPorifle';
import { Button } from '../button';
import { SendInput } from '../icons/sendInput';
import {Slider} from 'antd';
import { IComment, IDataPost } from '../../../service/getFeed';
import { IDataShortProfile } from '../../../service/getSuggestedProfiles';
import { likePost } from '../../../client/likePost';
import { useWalletKit } from '@mysten/wallet-kit';
import { PROFILE_ADDR } from '../../../client/config';
import { unlikePost } from '../../../client/unlike';
import { commentPost } from '../../../client/comment';
import {Image} from 'antd';
import { ReactPhotoCollage } from "react-photo-collage";
import {Popover, Modal} from 'antd';
import { IDataFullProfile, PostCreation } from '../../desktop/main';
import { makeDonate } from '../../../client/makeDonation';
import {useSelector} from 'react-redux';
import { profileSelector } from '../../../store/profile';
import {Avatar, message} from 'antd';


const AuthorPost: react.FC<IDataShortProfile & {timestamp: string}> = (props) => {
    return <div className='author__container'>
        <div className="author">
            <Avatar src={props.imageUrl} size={40}/>
            <span>{props.name}</span>
        </div>
        <div className="time">
            {props.timestamp}
        </div>
    </div>
}

interface IPostControll {
    icon: react.ReactElement;
    value: number;
    activeIcon?: react.ReactElement;
    active?: boolean;
    activeHandle?: (active: boolean) => void;
    disable?: boolean;
}

const PostControll: react.FC<IPostControll> = (props) => {
    const icon = props.activeIcon && props.active ? props.activeIcon : props.icon;
    const onActive = props.activeHandle ? props.activeHandle : (e: boolean) => {}
    var disabledClass = props.disable ? 'post__disabled' : ''
    return <div className={'post-controll__container ' + disabledClass} onClick={() => {
        if (props.disable) return;
        onActive(!props.active);
    }}>
        {icon}
        <span>{props.value}</span>
    </div>
}


const Comment: react.FC<IComment> = (props) => {
    return <div className='comment__container'>
        <div className="comment-profile__container">
            <ShortProfile 
                {...props.author}
            />
            <div className="time">
                {props.timestamp}
            </div>
        </div>
        
        <div className="comment__content">
            {props.content}
        </div>
    </div>
}


interface ICommentSection {
    postId: string;
    comments: IComment[];
    localCommentsIncrementor: () => void;
}

const CommentSection: react.FC<ICommentSection> = (props) => {
    const [value, setValue] = react.useState('');
    const [comments, setComments] = react.useState<IComment[]>(props.comments!);
    const profile = useSelector(profileSelector);
    const {signAndExecuteTransactionBlock} = useWalletKit();
    
    return <div className='comment-section__container'>
        <div className='comment-input'>
            <Input 
                placeholder='Write comment'
                onChange={setValue}
                value={value}
            />
            <Button 
                content={<SendInput />}
                className='smaller-btn'
                onClick={() => {
                    commentPost(
                        signAndExecuteTransactionBlock,
                        props.postId,
                        value
                    ).then((e) => {
                        if (e.error) return;
                        setComments([
                            {
                                author: profile,
                                content: value,
                                timestamp: 'Just now',
                                id: ''
                            }
                        ].concat(comments))
                        props.localCommentsIncrementor();
                        setValue('');
                    })
                }}
            />
        </div>
        {comments.map(e => <Comment {...e}/>)}
        
    </div>
}

interface ITipSection {
    postAddr: string;
    localDonationsIncrementer: (e: number) => void
}

const TipSection: react.FC<ITipSection> = (props) => {
    const [howMany, setHowMany] = react.useState(0.1);
    const [messageApi, contextHolder] = message.useMessage();
    const {
        currentAccount, 
        signAndExecuteTransactionBlock,
               
    } = useWalletKit();
    
    return <div className="centered">
        {contextHolder}
        <div className='tip-section__container'>
            <div className="tip__head">
                {howMany} Sui
            </div>
            <Slider 
                defaultValue={howMany}
                min={0.1}
                max={10}
                onChange={(e) => {
                    setHowMany(e)
                }}
                step={0.2}
            />
            <Button 
                content={'Send tip'}
                className='smaller-button'
                disabled
                onClick={() => {
                    makeDonate(
                        currentAccount?.address!,
                        signAndExecuteTransactionBlock,
                        props.postAddr,
                        howMany * (10 ** 9),
                    ).then((e) => {
                        if (e.error == 2) {
                            messageApi.error('You doesnt have balance to make this donation')
                        }
                        if (e.error) return;
                        props.localDonationsIncrementer(howMany)
                    })
                }}
            />
        </div>
    </div> 
}

interface IPostControlls {
    setComments: (active: boolean) => void;
    setTip: (active: boolean) => void;
    setLike: (active: boolean) => void;
    likes: number;
    comments: IComment[];
    donations: number;
    liked?: boolean;
    localLikes: number;
    localComments: number;
    localDonations: number;
    author: IDataFullProfile;
    localLiked?: boolean;
    localDonationOpen: boolean;
    localCommentsOpen: boolean;
}

const PostControlls: react.FC<IPostControlls> = (props) => {
    var tip = !(props.author.fullWallet == PROFILE_ADDR())
    
    return <div className='post-controlls__container'>
        <PostControll 
            icon={<LikeDisabled />}
            activeIcon={<LikeEnabled />}
            value={props.likes + props.localLikes}
            activeHandle={props.setLike}
            active={props.localLiked}
        />
        <PostControll 
            icon={<CommentDisabled />}
            value={props.comments.length + props.localComments}
            activeIcon={<CommentEnabled />}
            activeHandle={props.setComments}
            active={props.localCommentsOpen}
        />
        {
            <PostControll 
                icon={<ArrowUp />}
                value={parseFloat((parseFloat(props.donations.toString() as any) + parseFloat(props.localDonations.toString() as any)).toFixed(1))}
                activeIcon={<ArrowUpActive />}
                activeHandle={props.setTip}
                disable={!tip}
                active={props.localDonationOpen}
            />
        }
        
    </div>
}

const PostBody: react.FC<{content: string}> = (props) => {
    return <span className='postbody__container'>        
        {props.content}
    </span>
}

export var imgCondition = (e: string) => e.endsWith('.jpg') || 
e.endsWith('.png') || 
e.endsWith('.jpeg') || e.length


export const Post: react.FC<IDataPost> = (props) => {
    const [isModalOpen, setIsModalOpen] = react.useState(false);
    const {signAndExecuteTransactionBlock} = useWalletKit();
    const [section, setSection] = react.useState<'none'|'comments'|'tip'>('none');
    const [popoverOpen, setPopoverOpen] = react.useState(false);

    const [localLike, setLocalLike] = react.useState(0);
    const [localComments, setLocalComments] = react.useState(0);
    const [localDonations, setLocalDonations] = react.useState(0);
    const [localLiked, setLocalLiked] = react.useState(props.liked);
    const [footerState, setFooterState] = react.useState<'null' | 'comments' | 'donation'>('null')

    var files = props.file.split(';');
    var images = files.filter(imgCondition)
    files = files.filter(e => !imgCondition(e));

    var collageSize = window.innerWidth > 800 ? '400px' : '300px';
    

    return <Popover 
        open={!isModalOpen && popoverOpen && props.author.fullWallet == PROFILE_ADDR()}
        onOpenChange={setPopoverOpen}
        content={<div>
        <Button 
            content={'Edit post'}
            className='small-btn'
            onClick={() => {
                setIsModalOpen(true)
            }}
        />
    </div>}>
        <Modal 
            open={isModalOpen} 
            footer={<></>}
            onCancel={() => {
                setIsModalOpen(false)
            }}
            width={700}
        >
            <span>Change post</span>
            <div style={{height: 30}}></div>
            <PostCreation 
                postId={props.messageAddr}
                closeFunction={() => {
                    setIsModalOpen(false)
                }}
            />
        </Modal>
        <div className='post__container'>
            <AuthorPost {...props.author} timestamp={props.timestamp!}/>
            <PostBody {...props}/>
            {
                images.length ?
                <ReactPhotoCollage 
                    width={collageSize}
                    height={
                        ['250px', '170px']
                    }
                    layout={ images.length == 1 ?  [1] : [1, images.length-1]}
                    photos={images.map(
                        (e) => {
                            return {
                                source: e.replaceAll(' ', '%20')
                            }
                        }
                    )}
                />
                
                : <></>
            }
            <PostControlls
                setComments={(e) => {
                    if (e) setFooterState('comments')
                    else setFooterState('null')
                }}
                setTip={(e) => {
                    if (e) setFooterState('donation')
                    else setFooterState('null')
                }}
                setLike={async (e) => {
                    if (e) {
                        var res = await likePost(
                            signAndExecuteTransactionBlock,
                            props.addr,
                            PROFILE_ADDR()!
                        )
                        if (!res.errors) {
                            if (!props.liked) {
                                setLocalLike(1);
                            } else {
                                setLocalLike(0);
                            }
                            setLocalLiked(true);
                        }
                    } else {
                        unlikePost(
                            signAndExecuteTransactionBlock,
                            props.addr,
                        )
                        if (props.liked) {
                            setLocalLike(-1);
                        } else {
                            setLocalLike(0);
                        }
                    }
                }}
                {...props}
                localLikes={localLike}
                localComments={localComments}
                localDonations={localDonations}
                localLiked={localLiked}
                localCommentsOpen={footerState == 'comments'}
                localDonationOpen={footerState == 'donation'}
                donations={props.donated ? props.donated : 0}
            />
            {
                footerState == 'comments' ? <CommentSection 
                postId={props.addr}
                comments={props.comments}
                localCommentsIncrementor={() => {
                    setLocalComments(localComments+1);
                }}
                /> : <></>
            }
            {
                footerState == 'donation' ? <TipSection 
                    postAddr={props.addr}
                    localDonationsIncrementer={(donations) => {
                        setLocalDonations(localDonations+donations);
                    }}
                /> : <></>
            }
        </div>

    </Popover> 
}
