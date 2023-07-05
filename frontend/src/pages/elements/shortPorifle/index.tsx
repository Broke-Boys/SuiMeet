import react from 'react'
import './style.css'
import { IDataShortProfile } from '../../../service/getSuggestedProfiles';
import { useNavigate } from 'react-router-dom';
import {Avatar} from 'antd';

interface IShortProfile extends IDataShortProfile {
    className?: string;
}

export const ShortProfile: react.FC<IShortProfile> = (props) => {
    var className = props.className ? ' ' + props.className : ''
    const navigate = useNavigate();

    return <div 
        className={'profile profile__cp ' + className}
        onClick={() => {
            navigate(`/user/${props.fullWallet}`)
        }}
    >
        <Avatar 
            src={props.imageUrl} 
            size={48}
        />
        <div className="profile-creds">
            <div className="name">{props.name}</div>
            <div className="tag">{props.wallet}</div>
        </div>
    </div>
}