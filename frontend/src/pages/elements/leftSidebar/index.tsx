import react from 'react'
import { ProfileDetail } from '../ProfileDetail'
import './style.css';
import { ShortProfile } from '../shortPorifle';
import { useNavigate, useParams } from 'react-router-dom';
import { Select } from '../postHeader';
import { IDataShortProfile, getSuggestedProfiles } from '../../../service/getSuggestedProfiles';


export const SuggestedGroups: react.FC = () => {
    return <>
        <span className='people__container'>
            Suggested groups
        </span>
        <ShortProfile 
            name=''
            wallet=''
            imageUrl=''
            fullWallet=''
        />
        <ShortProfile 
            name=''
            wallet=''
            imageUrl=''
            fullWallet=''
        />
        <ShortProfile 
            name=''
            wallet=''
            imageUrl=''
            fullWallet=''
        />
        <ShortProfile 
            name=''
            wallet=''
            imageUrl=''
            fullWallet=''
        />
    </>
}


export const SuggestedPeople: react.FC = () => {
    const [suggestedPeople, setSuggestedPeople] = react.useState<IDataShortProfile[]>([]);
    const queried = react.useRef(false);
    if (!queried.current) {
        queried.current = true;
        getSuggestedProfiles().then(setSuggestedPeople)
    }
    return <>
        <span className='people__container'>
            Suggested people
        </span>
        {
            suggestedPeople.map(e => <ShortProfile 
                {...e}
            />)
        }
    </>
}

export const MainSidebar: react.FC = () => {
    return <>
        <ProfileDetail />
        <SuggestedPeople />
    </>
}

const ProfileSidebar: react.FC = () => {
    const navigate = useNavigate();
    const mapping = {
        'View profile': '',
        'Update profile': 'profile-update',
        'Badges': 'badges',
        'Donations': 'donations',
        'Followers': 'followers',
    }
    const {action} = useParams();
    const revMapping = Object.fromEntries(
        Object
            .entries(mapping)
            .map(([key, value]) => [value, key])
    )
    
    return <div className='profile-sidebar'>
        <Select 
            types={[
                'View profile', 
                'Update profile',
                'Followers'
            ]}
            typeChange={(e) => {
                navigate('/profile/'+(mapping as any)[e])
            }}
            vertical={true}
            selected={revMapping[action!]}
        />
    </div>
}

const SubsSidebar: react.FC = () => {
    return <div></div>
}

export const LeftSidebar: react.FC = () => {
    const {action} = useParams();
    const actions = {
        'index': <MainSidebar />,
        'profile': <ProfileSidebar />,
        'followers': <ProfileSidebar />,
        'profile-update': <ProfileSidebar />,
        'subs': <SubsSidebar />
    }
    return <div className='left-sidebar__container'>
        {(actions as any)[action as any]}
    </div>
}