import {useEffect, useState} from "react";

const Countdown = ( {number} ) => {
    let [time, setTime]  = useState(number / 1000);
    let [minutes, setMinutes] = useState(Math.floor(time / 60));
    let [seconds, setSeconds] = useState(time - minutes * 60);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time - 1)
        }, 1000);
        return () => clearInterval(interval);
    }, [time]);

    return <div className='remain-time'>
        {time} s
    </div>;
};

export default Countdown;