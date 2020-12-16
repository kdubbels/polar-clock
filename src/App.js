import {useReducer, useEffect, useCallback} from 'react';
import './App.css';
import './index.css';

const SET_TIME = 'SET_TIME';

const initialState = {
  hours: '',
  minutes: '',
  seconds: '',
  date: '',
  month: '',
  twelveHour: ''
};

function getDay() {
  const now = new Date();

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  const date = now.getDate();
  const month = now.getMonth() + 1;
  const twelveHour = now.getHours() < 12 ? 'AM' : 'PM';
  
  return [hours, minutes, seconds, date, month, twelveHour];
}

function reducer(state, action) {
  if (action.type === SET_TIME) {
    return {
      ...state,
      ...action.payload
    };
  }

  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {hours, minutes, seconds, date, month, twelveHour} = state;

  const setDate = useCallback((hours, minutes, seconds, date, month, twelveHour) => {
      dispatch({
        type: SET_TIME,
        payload: {
          hours, 
          minutes, 
          seconds,
          date,
          month,
          twelveHour
        }
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const [hours, minutes, seconds, date, month, twelveHour] = getDay();
      setDate(hours, minutes, seconds, date, month, twelveHour);
    }, 1000);
    return () => clearInterval(interval);
  }, [setDate]);

  // For reference on stroke-dasharray, I made heavy use of this article.
  // I've used stroke-dasharray previously on quite a few projects but this
  // finally made it "click". No more guesswork.
  // 
  // https://codepen.io/xgad/post/svg-radial-progress-meters

  return (
    <div className="App">
      <div>
      {hours && (
        <svg width="500" height="500" viewBox="0 0 500 500">
          <filter id="blurMe" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur5"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur10"/>
            <feMerge result="blur-merged">
              <feMergeNode in="blur10"/>
            </feMerge>
            <feColorMatrix result="red-blur" in="blur-merged" type="matrix"
                     values="1 0 0 0 0
                             0 0.06 0 0 0
                             0 0 0.44 0 0
                             0 0 0 1 0" />
            <feMerge>
              <feMergeNode in="red-blur"/>
              <feMergeNode in="blur5"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
            <text x="50%" y="10%" filter="url(#blurMe)">
              <tspan className="hours">{hours}</tspan><tspan className="blink">:</tspan><tspan className="minutes">{minutes < 10 ? `0${minutes}` : minutes}</tspan><tspan className="blink">:</tspan><tspan className="seconds">{seconds < 10 ? `0${seconds}` : seconds}</tspan> <tspan className="white-text">{twelveHour}</tspan> <tspan className="blink">|</tspan> <tspan className="month">{month}</tspan><tspan className="blink">/</tspan><tspan className="day">{date}</tspan>
            </text>
            <g className="clock" style={{transform: "translate(0, 45px)  rotate(-90deg)"}}>
              
              <circle className="month" cy="50%" cx="50%" r="25" strokeDasharray={`${157 * (month/12) }, 157`} filter="url(#blurMe)"></circle>
              
              <circle className="day" cy="50%" cx="50%" r="65" strokeDasharray={`${408.4 * (month === 4 || month === 6 || month === 9 || month === 11 ? month === 2 ? date/ 28 : date/30 : date/31) }, 408.4`} filter="url(#blurMe)"></circle>
              
              <circle className="hours" cy="50%" cx="50%" r="105" strokeDasharray={`${659.73 * (hours/12) }, 659.73`} filter="url(#blurMe)"></circle>
              
              <circle className="minutes" cy="50%" cx="50%" r="145" strokeDasharray={`${911.061 * (minutes/60) }, 911.061`} filter="url(#blurMe)"></circle>

              <circle className="seconds" cy="50%" cx="50%" r="185" strokeDasharray={`${1162.38 * (seconds/60) }, 1162.38`} strokeWidth="30" filter="url(#blurMe)"></circle> 
            </g>
        </svg>
        )}
      </div>
    </div>
  );
}

export default App;
