import react from 'react'
import './style.css'
import { Select } from '../../elements/postHeader'
import { Button } from '../../elements/button'
import { Post } from '../../elements/post'
import { MainSidebar, SuggestedGroups, SuggestedPeople } from '../../elements/leftSidebar'
import {useSelector, useDispatch} from 'react-redux'
import { fetchedTypeSelector, followersSelector, followingsSelector, profilePostsSelector, profileSelector, setProfileFetchedType } from '../../../store/profile'
import { getFollowersAction, getFollowingsAction, getProfileAction, getProfilePostsAction } from '../../../store/profile/actions'
import { PROFILE_ADDR } from '../../../client/config'
import { useNavigate, useParams } from 'react-router-dom'
import { follow } from '../../../client/follow'
import { useWalletKit } from '@mysten/wallet-kit'
import { unfollow } from '../../../client/unfollow'
import { getFollowers } from '../../../client/getFollowers'
import { postSelector } from '../../../store/posts'
import { ExtendedProfile } from '../../elements/extendedProfile'
import {Avatar} from 'antd';


const ProfilePosts: react.FC = () => {
    var posts = useSelector(profilePostsSelector);
    
    return <>
        {
            posts.map(e => <Post {...e}/>)
        }
    </>
}

const ProfileFollowings: react.FC = () => {
    var followings = useSelector(followingsSelector)
    
    return <>
    {
        followings.map(e => <ExtendedProfile {...e}/>)
    }
    </>
}

const ProfileFollowers: react.FC = () => {
    var followers = useSelector(followersSelector)
    return <>
        {
            followers.map(e => <ExtendedProfile {...e} />)
        }
    </>
}

export const Profile: react.FC = () => {
    const {addr, action} = useParams();
    const profile = useSelector(profileSelector);
    const followers = useSelector(followersSelector);
    const followings = useSelector(followingsSelector);
    const posts = useSelector(profilePostsSelector);
    const fetchedType = useSelector(fetchedTypeSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {signAndExecuteTransactionBlock} = useWalletKit();
    const [followed, setFollowed] = react.useState(localStorage.getItem('followings') ? 
    localStorage.getItem('followings')?.split(';').includes(addr!) : false)

    var followingsEnabled = !(PROFILE_ADDR() == addr);

    console.log(followingsEnabled, addr)

    var localAction = action ? action : 'posts';

    var actions = {
        'posts': <ProfilePosts />,
        'followings': <ProfileFollowings />,
        'followers': <ProfileFollowers />
    }

    if (fetchedType == 'none') {
        dispatch(
            getProfileAction(addr!) as any
        );
        dispatch(
            getProfilePostsAction(addr!) as any
        );
        dispatch(
            getFollowingsAction(addr!) as any
        );
        dispatch(
            getFollowersAction(addr!) as any
        )
    }
    if (fetchedType == 'fetched') {
        if (profile.fullWallet != addr) {
            dispatch(
                setProfileFetchedType('none')
            )
        }
    }

    

    return <div className='centered'>
        <div className="profile__container">
            <div className="profile-info">
                <Avatar 
                    src={profile.imageUrl}
                    size={200}
                />
                <div className="header">
                    {profile.name}
                </div>
                <div className="account">
                    {profile.wallet}
                </div>
                <div className="short-description">
                    {profile.description}
                </div>
                <Button 
                    content={'Back to main menu'}
                    className='profile-btn'
                    disabled
                    onClick={() => {
                        navigate('/index')
                    }}
                />
            </div>
            <div className="profile-content">
                <div className="profile-content__header">
                    <Select 
                        types={[
                            `Posts (${posts.length})`,
                            `Followings (${followings.length})`,
                            `Followers (${followers.length})`,
                            //'Donated (5)'
                        ]}
                        typeChange={(e) => {
                            if (e.startsWith('Followings')) {
                                navigate(`/user/${addr}/followings`)
                            }
                            else if (e.startsWith('Followers')) {
                                navigate(`/user/${addr}/followers`)
                            }
                            else if (e.startsWith('Posts')) {
                                navigate(`/user/${addr}/`)
                            }
                        }}
                    />
                    {
                        followingsEnabled ? <Button 
                        className='follow-btn'
                        disabled={true}
                        onClick={() =>{
                            if (followed) {
                                unfollow(
                                    signAndExecuteTransactionBlock,
                                    addr!
                                ).then((e) => {
                                    var followings = localStorage.getItem('followings')
                                    if (followings) {
                                        followings = followings.split(";").filter(e => e != addr).join(';')
                                        localStorage.setItem('followings', followings)
                                    }
                                    setFollowed(false);
                                })
                                
                            } else {
                                follow(
                                    signAndExecuteTransactionBlock,
                                    addr!
                                ).then(() => {
                                    var followings = localStorage.getItem('followings')
                                    followings = followings + ';' + addr;
                                    localStorage.setItem('followings', followings)
                                    setFollowed(true);
                                })
                            }
                        }}
                        content={followed ? 'Unfollow' : 'Follow'}
                        
                    /> : <></>
                    }
                    
                </div>
                {
                    (actions as any)[localAction as any]
                }
                
            </div>
            <div className="left-sidebar__container sized">
                <SuggestedPeople />
                {/* <SuggestedGroups /> */}
            </div>
        </div>
    </div>
}
