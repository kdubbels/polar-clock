import {useReducer, useEffect, useCallback} from 'react';
import {arc} from 'd3-shape';
import './App.css';
import './index.css';

const SET_TIME = 'SET_TIME';

const initialState = {
  hours: '',
  minutes: '',
  seconds: '',
  date: '',
  month: ''
};


function getDay() {
  const now = new Date();

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12 || 12;
  const date = now.getDate();
  const month = now.getMonth() + 1;
  
  return [hours, minutes, seconds, date, month];
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
  const {hours, minutes, seconds, date, month} = state;

  const setDate = useCallback((hours, minutes, seconds, date, month) => {
      dispatch({
        type: SET_TIME,
        payload: {
          hours, 
          minutes, 
          seconds,
          date,
          month
        }
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const [hours, minutes, seconds, date, month] = getDay();
      setDate(hours, minutes, seconds, date, month);
    }, 1000);
    return () => clearInterval(interval);
  }, [setDate]);


  useEffect(() => {
    console.log(state)
  }, [state]);

  // For reference on stroke-dasharray, this was an incredible resource, even
  // though I'd consider myself "advanced" on the topic. This made me realize
  // I definitely have a lot yet to learn.
  // 
  // https://codepen.io/xgad/post/svg-radial-progress-meters

  return (
    <div className="App">
      {hours && (
        <pre>
            <span className='hours'>{hours}</span>:<span className="minutes">{minutes < 10 ? `0${minutes}` : minutes}</span>:<span className='seconds'>{seconds < 10 ? `0${seconds}` : seconds}</span> {hours < 12 ? 'AM' : 'PM'} | <span className="day">{date}</span>/<span className="month">{month}</span>
        </pre>
      )}
      <div>
        <svg width="420" height="420" viewBox="0 0 420 420">
          <filter id="blurMe" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10"/>
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

            <circle className="month" cy="50%" cx="50%" r="25" strokeDasharray={`${157 * (month/12) }, 157`} filter="url(#blurMe)"></circle>
            {/* <circle className="month" cy="50%" cx="50%" r="25" strokeDasharray={`${157 * (month/12) }, 157`}></circle> */}

            <circle className="day" cy="50%" cx="50%" r="65" strokeDasharray={`${408.4 * (date/31) }, 408.4`} filter="url(#blurMe)"></circle>
            {/* <circle className="day" cy="50%" cx="50%" r="65" strokeDasharray={`${408.4 * (date/31) }, 408.4`}></circle> */}

            <circle className="hours" cy="50%" cx="50%" r="105" strokeDasharray={`${659.73 * (hours/12) }, 659.73`} filter="url(#blurMe)"></circle>
            {/* <circle className="hours" cy="50%" cx="50%" r="105" strokeDasharray={`${659.73 * (hours/12) }, 659.73`}></circle> */}

            <circle className="minutes" cy="50%" cx="50%" r="145" strokeDasharray={`${911.061 * (minutes/60) }, 911.061`} filter="url(#blurMe)"></circle>
            {/* <circle className="minutes" cy="50%" cx="50%" r="145" strokeDasharray={`${911.061 * (minutes/60) }, 911.061`}></circle> */}

            <circle className="seconds" cy="50%" cx="50%" r="185" strokeDasharray={`${1162.38 * (seconds/60) }, 1162.38`} strokeWidth="30" filter="url(#blurMe)"></circle>    
            {/* <circle className="seconds" cy="50%" cx="50%" r="185" strokeDasharray={`${1162.38 * (seconds/60) }, 1162.38`} strokeWidth="30"></circle>     */}
        </svg>
      </div>
    </div>
  );
}

export default App;
