import React from "react";
import { Button } from 'react-bootstrap';

let interval;
const CountDown = (exitmodal) => {
    const [isTimerOpen, setTimmer] = React.useState(false);
    let history = { push: () => null };

    // SET BY THE ADMIN
    var minutesToCountDown = 1;
    // TRANSFORM INTO SECONDS
    var transformMinutesToSeconds = minutesToCountDown * 10;
    // KEEP A STATE
    const [counterValue, setCounterValue] = React.useState(10);
    const [isTimmerStoped, setStopTimer] = React.useState(false);

    // FUNCTION TO HAPPEN EVERY 1 SECOND
    function timeIt() {
        if (isTimmerStoped === false) {
            transformMinutesToSeconds--
            setCounterValue(transformMinutesToSeconds);
            if (transformMinutesToSeconds === 0) {
                clearInterval(interval);
                setStopTimer(true);
                exitmodal.onClick(false);
            }
        } else {
            setStopTimer(true);
            clearInterval(interval);
        }
    }

    // STARTS THE COUNTDOWN

    const startCountdown = () => {
        interval = setInterval(timeIt, 1000);
    }

    const stopCountdown = () => {
        setStopTimer(true);
        setCounterValue(0);
        setTimmer(false);
        clearInterval(interval);
    }

    // ADD 0 IN FRONT ON THE TIME REMAINING
    // const addLeadingZeros = value => {
    //     value = String(value);
    //     while (value.length < 2) {
    //         value = `0${value}`;
    //     }
    //     return value;
    // };

    // CONVERT SECONDS INTO TIME REMAINING
    // function convertSeconds(seconds) {
    //     var min = Math.floor(seconds / 60);
    //     var sec = seconds % 60;
    //     return addLeadingZeros(min) + ':' + addLeadingZeros(sec)
    // }

    // const logOutUser = () => {
    //     logout();
    //     return history.push(mainRoute)
    // }

    function setTimer() {
        const timer = setTimeout(() => {
            setTimmer(true);
            //('This will run after 3 seconds!')
            startCountdown();
        }, 1000);
        return () => clearTimeout(timer);
    }

    React.useEffect(() => {
        if (isTimmerStoped === false) {
            setTimer();
        } else {
            stopCountdown();
        }

    }, [isTimmerStoped, setStopTimer, minutesToCountDown]);



    return (
        <Button
            className='d-flex justify-content-center w-45'
            onClick={()=> {
                exitmodal.onClick(false);
                stopCountdown();
            }}
            variant="danger"
        >خير ({counterValue})</Button>
    );
}

export default CountDown;
