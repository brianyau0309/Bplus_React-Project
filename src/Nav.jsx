import React from 'react'
import { NavLink } from 'react-router-dom'

export default class Nav extends React.Component {
    render() {
        const today = String((new Date()).getDate())
        const pngCloud = "https://img.icons8.com/android/48/000000/clouds.png" 
        const pngCalendar = "https://img.icons8.com/ios/50/000000/calendar-" + today + ".png" 
        const pngExpand = "https://img.icons8.com/ios/50/000000/login-rounded-up-filled.png" 
        const pngMemo = "https://img.icons8.com/ios/50/000000/note.png" 
        const pngNotification = "https://img.icons8.com/windows/64/000000/appointment-reminders.png" 
        return (
        <nav>
             <ul>
                 <NavLink to="/counter">
                    <li>
                        <img alt="Cloud" src={pngCloud} />
                        <span className="name">&nbsp;Clould&nbsp;</span> 
                    </li>
                 </NavLink>
                 <NavLink to="/calendar">
                    <li>
                        <img alt="Calendar" src={pngCalendar} />
                        <span className="name">&nbsp;Calendar&nbsp;</span> 
                    </li>
                 </NavLink>
                 <li id="itemExpand">
                     <img alt="Expand" src={pngExpand} />
                 </li>
                 <NavLink to="/Memo">
                    <li>
                        <img alt="Memo" src={pngMemo} />
                        <span className="name">&nbsp;Memo&nbsp;</span> 
                    </li>
                 </NavLink>
                 <NavLink to="/Notification">
                    <li>
                        <img alt="Notification" src={pngNotification} />
                        <span className="name">&nbsp;Notification&nbsp;</span> 
                    </li>  
                  </NavLink>
             </ul>
        </nav>
        )
    }
}
