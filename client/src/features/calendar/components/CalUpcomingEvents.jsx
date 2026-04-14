import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";

export default function CalUpcomingEvents({selectedDay, events}) {
    const { user } = useAuth();

    // let arry = ["apple", "banana", "cherry"]
    // console.log(user)
    // console.log(selectedDay)
    // console.log(JSON.stringify(events))
    // console.log("ARRY:" + arry)
    console.log("events length:" + events.length)


    return (
        <>
            <p> here is everything to see if it worked. check your console log</p>
            <ul>
                {events.map(event => (
                            <li key={event.id}>{event.name}</li>
                    ))}
            </ul>
        </>
    )
}