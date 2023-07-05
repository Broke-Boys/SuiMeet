import react from 'react'

interface IHome{
    size?: number;
}

export const HomeActive: react.FC<IHome> = (props) => {
    var size = props.size ? props.size : 16;
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.9067 5.57998L9.28667 1.88665C8.57334 1.31331 7.42 1.31331 6.71334 1.87998L2.09334 5.57998C1.57334 5.99331 1.24 6.86665 1.35334 7.51998L2.24 12.8266C2.4 13.7733 3.30667 14.54 4.26667 14.54H11.7333C12.6867 14.54 13.6 13.7666 13.76 12.8266L14.6467 7.51998C14.7533 6.86665 14.42 5.99331 13.9067 5.57998ZM8 10.3333C7.08 10.3333 6.33334 9.58665 6.33334 8.66665C6.33334 7.74665 7.08 6.99998 8 6.99998C8.92 6.99998 9.66667 7.74665 9.66667 8.66665C9.66667 9.58665 8.92 10.3333 8 10.3333Z" fill="white"/>
    </svg>    
}


export const HomeDisabled: react.FC<IHome> = (props) => {
    var size = props.size ? props.size : 16;
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.71334 1.88004L2.09334 5.58003C1.57334 5.99336 1.24 6.86672 1.35334 7.52005L2.24001 12.8267C2.40001 13.7734 3.30667 14.54 4.26667 14.54H11.7333C12.6867 14.54 13.6 13.7667 13.76 12.8267L14.6467 7.52005C14.7533 6.86672 14.42 5.99336 13.9067 5.58003L9.28667 1.88671C8.57333 1.31338 7.42001 1.31337 6.71334 1.88004Z" stroke="#716E80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.00001 10.3333C8.92048 10.3333 9.66668 9.58714 9.66668 8.66667C9.66668 7.74619 8.92048 7 8.00001 7C7.07954 7 6.33334 7.74619 6.33334 8.66667C6.33334 9.58714 7.07954 10.3333 8.00001 10.3333Z" stroke="#716E80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>  
}