import React from "react"

function CalendarDayInside (props) {
  return (
    <li class="calendar_dayInside">
      <div class="calendar_dayNum"></div>
      <div class="calendar_dayEvents">
      <CalendarDayContent/>
      </div>
    </li>
  )
}

function CalendarDayEvent (props) {
  return (
    <div class="calendar_dayEvent">
    </div>
  )
}

export default class CalendarDay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return(
      <ul id="yyyy-mm-dd" class="calendar_day-list">
        <Multe_CalendarDayInside/>
      </ul>
    ) 
  }
} 
