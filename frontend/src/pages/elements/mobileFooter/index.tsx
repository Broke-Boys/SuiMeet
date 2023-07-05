import react from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import { HomeActive, HomeDisabled } from '../icons/home';
import { ProfileActive, ProfileDisabled } from '../icons/profile';
import { SubscriptionsActive, SubscriptionsDisabled } from '../icons/subscriptions';


export const MobileFooter: react.FC = () => {
    const {action} = useParams();
    const navigate = useNavigate();

    return <div className='mobile-footer__container'>
        <div className="mobile-btn" onClick={() => {
            navigate('/index')
        }}>
            {
                action == 'index' ? 
                <HomeActive size={28}/> : 
                <HomeDisabled size={28} />
            }
        </div>
        <div className="mobile-btn" onClick={() => {
            navigate('/profile/profile-update')
        }}>
            {
                action == 'profile-update' ? 
                <ProfileActive size={28}/> : 
                <ProfileDisabled size={28} />
            }
        </div>
        <div className="mobile-btn" onClick={() => {
            navigate('/subs')
        }}>
        {
            action == 'subs' ? 
            <SubscriptionsActive size={28}/> : 
            <SubscriptionsDisabled size={28} />
        }
        </div>
    </div>
}