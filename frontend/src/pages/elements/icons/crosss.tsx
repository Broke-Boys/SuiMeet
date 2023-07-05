import react from 'react'

interface ICross {
    color?: string;
}

export const Cross: react.FC<ICross> = (props) => {
    var color = props.color ? props.color : '#716E80';
    return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 10.8999L1.1001 1" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.8999 1.1001L1 11" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
}