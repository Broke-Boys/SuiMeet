import react from 'react'
import './style.css';
import { HomeActive, HomeDisabled } from '../icons/home';
import { ProfileActive, ProfileDisabled } from '../icons/profile';
import { SubscriptionsActive, SubscriptionsDisabled } from '../icons/subscriptions';
import {Link, useParams} from 'react-router-dom';
import { Messages } from '../icons/messages';
import { Input } from '../input';
import { Search } from '../icons/search';
import { ActivityDisabled, ActivityEnabled } from '../icons/activity';


interface ISidebarElement {
    activeIcon: react.ReactElement;
    disabledIcon: react.ReactElement;
    content: string;
    link: string;
    subLinks?: string[];
}

const SidebarElement: react.FC<ISidebarElement> = (props) => {
    var {action} = useParams<{action: string}>();
    var subLinks = props.subLinks ? props.subLinks : []
    var active = subLinks.concat([props.link]).includes(action!);
    var icon = active ? props.activeIcon : props.disabledIcon;
    var classes = '';
    if (active) {
        classes += 'sidebar-element__active'
    }
    
    return <Link to={`/${props.link}`} style={{textDecoration: 'none'}}>
        <div className={'sidebar-element__container ' + classes}>
            {icon}
            <span>
                {props.content}
            </span>
        </div>
    </Link> 
}


export const Sidebar: react.FC = () => {

    return <div className='sidebar__container'>
        <div className="logo">
            <Messages />
            <span>SuiMeet</span>
        </div>
        {/* <Input
        placeholder='search'
        icon={<Search />}
        /> */}
        <div style={{'height': 30}}></div>
        <div className="sidebar-actions">
            <span className='sidebar-actions__title'>GENERAL</span>
            <SidebarElement 
                activeIcon={<HomeActive />}
                disabledIcon={<HomeDisabled />}
                content={'Home'}
                link={'index'}
            />
            <SidebarElement 
                activeIcon={<ProfileActive />}
                disabledIcon={<ProfileDisabled />}
                content={'Profile'}
                link={'profile'}
                subLinks={['followers', 'profile-update']}
            />
            <SidebarElement 
                activeIcon={<SubscriptionsActive />}
                disabledIcon={<SubscriptionsDisabled />}
                content={'Subscriptions'}
                link={'subs'}
            />
            {/* <SidebarElement 
                activeIcon={<ActivityEnabled />}
                disabledIcon={<ActivityDisabled />}
                content='Actions'
                link={'actions'}
            /> */}
        </div>

    </div>
}