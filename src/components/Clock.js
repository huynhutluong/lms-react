import {useEffect, useState} from "react";

const Clock = () => {
    let days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    let clock = new Date();
    let currentHour = clock.getHours();
    let currentMin = clock.getMinutes();
    let currentSec = clock.getSeconds();
    let [hour, setHour] = useState(currentHour);
    let [min, setMin] = useState(currentMin);
    let [sec, setSec] = useState(currentSec);

    useEffect(() => {
        const interval = setInterval(() => {
            clock = new Date();
            setHour(hour => hour = clock.getHours());
            setMin(min => min = clock.getMinutes());
            setSec(sec => sec = clock.getSeconds());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <div className='clock'>
        { hour } giờ, { min } phút, { sec } giây
    </div>;
};

export default Clock;