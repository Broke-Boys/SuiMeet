import react from 'react'
import './style.css';
import {useSelector} from 'react-redux'
import { 
    profileSelector, 
    followersSelector,
    followingsSelector,
    profilePostsSelector
} from '../../../store/profile';
import { useNavigate } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {message} from 'antd';


interface ISepBlock{
    value: string;
    name: string;
}

const SepBlock: react.FC<ISepBlock> = (props) => {
    return <div className='sep-block__container'>
        <div className="sep-block__value">{props.value}</div>
        <div className="sep-block__name">{props.name}</div>
    </div>
}


export const ProfileDetail: react.FC = () => {
    const profile = useSelector(profileSelector);
    const followers = useSelector(followersSelector);
    const followings = useSelector(followingsSelector);
    const posts = useSelector(profilePostsSelector);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    return <div className='profile-detail__container'>
        {contextHolder}
        <div style={{
            height: 170,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <img src={profile.imageUrl} alt="" width={220}/>
        </div>
        
        <div className="profile-header">
            {profile.name}
        </div>
        <div className="profile-tag">
            <CopyToClipboard 
                text={profile.fullWallet}
                onCopy={() => {
                    messageApi.info('address copied to clipboard!')
                }}
                >
                <span style={{cursor: 'pointer'}}>{profile.wallet}</span>
            </CopyToClipboard>
            
        </div>
        <div className="seps-info">
            <SepBlock 
                name='posts'
                value={(posts ? posts : []).length.toString()}
            />
            <div className="sep"></div>
            <SepBlock 
                name='followers'
                value={(followers ? followers : []).length.toString()}
            />
            <div className="sep"></div>
            <SepBlock 
                name='followings'
                value={(followings ? followings : []).length.toString()}
            />
        </div>
        <div className="hor-sep"></div>
        <div className="change" onClick={() => {
            navigate('/profile/profile-update')
        }}>
            Change Info
        </div>
    </div>
}