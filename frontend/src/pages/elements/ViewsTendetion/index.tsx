import react from 'react'
import { ArrowDown, ArrowUp } from '../icons/arrow';
import './style.css';

interface ITendention{
    positive: boolean;
    percent: string;
    name: string;
    value: string;
}

export const TendentionWidget: react.FC<ITendention> = (props) => {
    var arrowIcon = <ArrowUp />
    if (!props.positive) arrowIcon = <ArrowDown />

    return <div className='tendention__container'>
        <div className="tendention__name">
            {props.name}
        </div>
        <div className="tendention__value">
            {props.value}
        </div>
        <div className="tendention_percent">
            {arrowIcon}
            <span className='bold'>
                {props.percent}
            </span>
            <span className='think'>
                vs previos week
            </span>
        </div>
    </div>
}