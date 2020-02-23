import React from 'react'
import ClockWidget from './clockwidget'
//Start timezones
const NYTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour: '2-digit', minute: '2-digit', second: '2-digit'})
const LDNTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London", hour: '2-digit', minute: '2-digit', second: '2-digit'})
const MSKTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow", hour: '2-digit', minute: '2-digit', second: '2-digit'})
const HKTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong", hour: '2-digit', minute: '2-digit', second: '2-digit'})
const TKYTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo", hour: '2-digit', minute: '2-digit', second: '2-digit'})
const timeZoneArray = [[NYTime, 'New York'], [LDNTime, 'London'], [MSKTime, 'Moscow'], [HKTime, 'Hong Kong'], [TKYTime, 'Tokyo']]
//End timezones
    //the clocks rotate using css transition(i.e. 12 hours = transition that takes 42300 seconds
    //after establishing the original clock hand positions and using them as the start point to transform
    //we then establish the final point of transform by adding 360 to the start(full rotation)
    //the actual time only updates once on creation


export default function ClockPanel(props){
    return(
        <div>
        {timeZoneArray.map(timeZone => {
            return(
                <div key = {timeZone[1]}>
                <ClockWidget handAngles = {convertTimeToDegrees(timeZone[0])} city = {timeZone[1]}/>
                </div>
            )
        })}
        
        </div>
    )
}

function convertTimeToDegrees(timeIn){
    const timeArr = timeIn.split(/[:| ]/)
    const hoursIn = +timeArr[0]
    const minutesIn = +timeArr[1]
    const secondsIn = +timeArr[2]
    const hourAngle = (0.5*(60*hoursIn+minutesIn))
    const minuteAngle = (6*minutesIn)
    const secondsAngle = (6*secondsIn)
    return [hourAngle, minuteAngle, secondsAngle]
}