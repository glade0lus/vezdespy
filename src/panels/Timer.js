import React, { useState, useEffect } from 'react';
import { Title, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';

const Timer = ({ timer, onEnd = ()=>{} }) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setMinutes(timer.minutes);
        setSeconds(timer.seconds);
        let updateInterval = setInterval(() => {
            setMinutes(timer.minutes);
            setSeconds(timer.seconds);
            if (timer.minutes === 0 && timer.seconds === 0) {
                clearInterval(updateInterval);
                onEnd();
            }
        }, 1000);
        return () => {
            clearInterval(updateInterval);
        };

    }, [])

    return (
        <div>
            {minutes === 0 && seconds === 0
                ? null
                :
                <Title level="1" style={{ marginBottom: 16, textAlign: "center" }}>
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </Title>
            }
        </div>
    )
}

export default Timer;