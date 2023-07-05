import react from 'react'

interface IProfile {
    size?: number;
}

export const ProfileActive: react.FC<IProfile> = (props) => {
    var size = props.size ? props.size : 16;
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.99999 7.99998C9.84094 7.99998 11.3333 6.5076 11.3333 4.66665C11.3333 2.8257 9.84094 1.33331 7.99999 1.33331C6.15904 1.33331 4.66666 2.8257 4.66666 4.66665C4.66666 6.5076 6.15904 7.99998 7.99999 7.99998Z" fill="white"/>
    <path d="M8 9.66669C4.66 9.66669 1.94 11.9067 1.94 14.6667C1.94 14.8534 2.08667 15 2.27334 15H13.7267C13.9133 15 14.06 14.8534 14.06 14.6667C14.06 11.9067 11.34 9.66669 8 9.66669Z" fill="white"/>
    </svg>    
}

export const ProfileDisabled: react.FC<IProfile> = (props) => {
    var size = props.size ? props.size : 16;
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.99999 7.99998C9.84094 7.99998 11.3333 6.5076 11.3333 4.66665C11.3333 2.8257 9.84094 1.33331 7.99999 1.33331C6.15904 1.33331 4.66666 2.8257 4.66666 4.66665C4.66666 6.5076 6.15904 7.99998 7.99999 7.99998Z" stroke="#716E80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.7267 14.6667C13.7267 12.0867 11.16 10 8.00001 10C4.84001 10 2.27335 12.0867 2.27335 14.6667" stroke="#716E80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
}