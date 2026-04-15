import { useState, useEffect } from "react";
import "./Calendar.css";
import CalendarApp from "../components/CalendarApp.jsx";
import useCreateUserEvent from "../customHooks/UseEventCreator.jsx"
// import CalUpcomingEvents  from "../components/CalUpcomingEvents.jsx";
import Modal from "../../workouts/components/Modal.jsx"
import { useAuth } from "../../../app/AuthProvider.jsx";

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const mins = (m || 0) > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${hour}${mins} ${ampm}`;
}


function timeToMinutes(timeStr) {
  if (!timeStr) return Infinity;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", time: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // const [dayWorkouts, setDayWorkouts] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  useEffect(() => {
    if (!user?.id) return;

    const fetchPersonal = fetch(`http://localhost:8080/users/user_events/id/${user.id}`)
      .then(r => r.json());
    const fetchGroups = fetch(`http://localhost:8080/users/groups/id/${user.id}`)
      .then(r => r.json());

  Promise.all([fetchPersonal, fetchGroups])
    .then(async ([personalEvents, groups]) => {
      // 1 here
      const personalLabeled = personalEvents.map(e => ({ ...e, type: "personal-workout"}))
      let allEvents = Array.isArray(personalEvents) ? personalEvents : [];

      if (Array.isArray(groups)) {
        const groupEventsPromises = groups.map(group => 
          fetch(`http://localhost:8080/groups/group_events/id/${group.id}`)
            .then(r => r.json())
        );
        
        const groupsEventsResults = await Promise.all(groupEventsPromises);
        
        const labeledGroupEvents = groupsEventsResults
          .flat().filter(Boolean).map(e => (
            { ...e, type: "group-workout"}
          ));
          allEvents = [...allEvents, ...labeledGroupEvents];
        // groupsEventsResults.forEach(groupEvents => {
        //   if (Array.isArray(groupEvents)) {
        //     //2 here
        //     const groupEventsResults = await Promise.all(groupEventsPromises);
        //     const groupsLabeled = groupEventsResults.flat().map(e => ({ ...e, category: 'group-workout'}))
        //     allEvents = [...allEvents, ...groupEvents];
        //   }
        // }
        // );
      }

      setEvents(allEvents);
    })
    .catch((err) => console.error("Error loading events:", err));
    // setEvents([ ...personalLabeled, ...groupsLabeled]);



    // fetch(`http://localhost:8080/users/user_events/id/${user.id}`)
    // .then((r) => r.json())
    // .then((data) => setEvents(Array.isArray(data) ? data : []))
    // .catch(() => setEvents([]));

    fetch(`http://localhost:8080/users/user_workouts/id/${user.id}`)
  .then((r) => r.json())
  .then((data) => setUserWorkouts(Array.isArray(data) ? data : []))
  .catch(() => setUserWorkouts([]));
  }, [user?.id]);

  // Clear selected day when month changes so the side panel doesn't show stale data
  function handleMonthChange(newDate) {
    setCurrentDate(newDate);
    setSelectedDay(null);
    setSelectedEvent(null)
  }

  function handleDaySelect(day) {
  setSelectedDay(day);
  setSelectedEvent(null);
}


  
  function getDaysAway(eventStartDate, selectedDate) {
    const eventDate = new Date(eventStartDate)
    const transferSelectedDate = new Date(selectedDate)

    const d1 = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
    const d2 = Date.UTC(transferSelectedDate.getUTCFullYear(), transferSelectedDate.getUTCMonth(), transferSelectedDate.getUTCDate())

    const dayDiff = d1 - d2;
    const daysAway = Math.ceil(dayDiff / (1000 * 60 * 60 * 24));


    if (daysAway === 1) {
      return (<span className="event-time">Tomorrow</span>);
    }
    if (daysAway > 1  && daysAway <=7 ) return (<span className="event-time">{daysAway} days away</span>)
    return ""
  }
  
  const selectedDate =
  selectedDay != null ? new Date(Date.UTC(year, month, selectedDay)) : null;
  
  const upcomingDateWindowStart =
  selectedDay != null
  ? new Date(Date.UTC(year, month, selectedDay + 1))
  : null;
  const upcomingDateWindowEnd =
  selectedDay != null
  ? new Date(Date.UTC(year, month, selectedDay + 7))
  : null;
  
  
  
  const dayEvents = selectedDate
  ? events
    .filter((e) => {
      // const d = new Date(e.start_date);
      // return (
      //   d.getUTCFullYear() === selectedDate.getUTCFullYear() &&
      //   d.getUTCMonth() === selectedDate.getUTCMonth() &&
      //   d.getUTCDate() === selectedDate.getUTCDate()
      // );
      const selUTC = new Date(Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
      ));

      const startDay = new Date(e.start_date);
      const endDay = e.end_date ? new Date(e.end_date) : startDay;
      const s = new Date(Date.UTC(startDay.getUTCFullYear(), startDay.getUTCMonth(), startDay.getUTCDate()));
      const end = new Date(Date.UTC(endDay.getUTCFullYear(), endDay.getUTCMonth(), endDay.getUTCDate()));
      return selUTC >= s && selUTC <= end;
      
      // const eventDateStr = new Date(e.start_date)
      //   .toISOString()
      //   .split("T")[0]
      // const selectedDateStr = selectedDate
      //   .toISOString()
      //   .split("T")[0];

      // return eventDateStr === selectedDateStr
  })
  .map((e) => {
      if (!e.end_date) return e;
      const strt = new Date(e.start_date)
      const nd = new Date(e.end_date)
      const totalDays = Math.ceil((nd - strt) / (1000 * 60 * 60 * 24 )) + 1;
      const currentDayNum = Math.ceil((selectedDate - strt) / (1000 * 60 * 60 * 24 )) + 1;
      return totalDays > 1 ? { ...e, name: `${e.name} (${currentDayNum}/${totalDays})`} : e;
  })
  .sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time))
  : [];
  
  const dayWorkouts = dayEvents.length > 0
    ? dayEvents.flatMap((event) => 
    (event.workouts_list || [])
      .map((workoutId) => userWorkouts.find((w) => w.id === workoutId))
      .filter(Boolean)
) : [];

  const upcomingWeekEvents = upcomingDateWindowStart && upcomingDateWindowEnd
  ? events
  .filter((e) => {
    const d = new Date(e.start_date).getTime();

    return (
      d >= upcomingDateWindowStart.getTime() &&
      d <= upcomingDateWindowEnd.getTime()
    );
  })
  .sort((a, b) => {
    const dateA = new Date(a.start_date)
    const dateB = new Date(b.start_date)
    const dateDiff = dateA - dateB;
    if (dateDiff !== 0) return dateDiff;

    return timeToMinutes(a.start_time) - timeToMinutes(b.start_time)
  })
  : [];
  
  async function handleDeleteEvent(id) {
    try {
      const res = await fetch(
        `http://localhost:8080/users/user_events/id/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        if (selectedEvent?.id === id) setSelectedEvent(null);
      }
    } catch {
      // silently fail — event stays in list if request fails
    } finally {
      setConfirmDeleteId(null);
    }
  }
  
  async function handleAddEvent(e) {
    e.preventDefault();
    const eventObject = {
      name: form.name.trim(),
      start_date: selectedDate,
      end_date: form.end_date,
      start_time: form.start_time,
      end_time: form.end_time,
      user_id: user.id
    };
    setSaveError("");
    if (!form.name.trim() || !selectedDate || !user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8080/users/user_events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventObject),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prev) => [...prev, newEvent]);
        setForm({
          name: "",
          start_date: selectedDate,
          end_date: "",
          start_time: "",
          end_time: "",
          user_id: ""
        });
      } else {
        const body = await res.json().catch(() => ({}));
        setSaveError(body.message || `Error ${res.status}`);
      }
    } catch {
      setSaveError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }
  
  const selectedLabel = selectedDate
  ? selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  : null;
  
  const upcomingSelectedLabel = upcomingDateWindowStart
  ? upcomingDateWindowStart.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  : null;
  
  // TEST CODE BELOOWWWWWWWWW ------------------------------------------------------------

    function displayWorkoutsForEvent(event) {
      // console.log("Checking this specific event object:", event);
      // console.log("Step 1: IDs in this event:", event.workouts_list);
      // console.log("Step 2: Total workouts in state:", userWorkouts.length);


    if (!event.workouts_list || event.workouts_list.length === 0) {
      return <p>No workouts for this event.</p>
    }

    function handleOpen(workout) {
      console.log(`clicked ${Object.keys(workout)}`)
      setSelectedWorkout(workout);
      setIsOpen(true);
    }
    function handleClose() {
      setIsOpen(false)
    }

    const workoutsForEvent = event.workouts_list
      .map((workoutId) => userWorkouts.find((w) => w.id === workoutId))
      .filter(Boolean)

    if (workoutsForEvent.length === 0) {
      console.log("DEBUG: Search failed.");
      console.log("Looking for IDs:", event.workouts_list);
      console.log("Available IDs in userWorkouts:", userWorkouts.map(w => w.id));
      return <p>No workouts found for this event.</p>
    }

    return (
      <>
        <ul className="workout-list">
          {workoutsForEvent.map((workout) => (
            <li 
              key={workout.id}
              onClick={() => handleOpen(workout)}
              className="cursor-pointer hover:text-purple-400"
              >{workout.name}
            </li>
          ))}
        </ul>
        {/* <Modal 
          openModal={isOpen}
          closeModal={handleClose}
          info={selectedWorkout}
        /> */}
      </>
    )
  }


  // function eventsForDay(day) {
  //   return events
  //     .filter((e) => {
  //       const eventDateStr = new Date(e.start_date).toISOString().split("T")[0];
  //       const selectedDateStr = new Date(Date.UTC(year, month, day))
  //         .toISOString()
  //         .split("T")[0];
  //       return eventDateStr === selectedDateStr
  //     })
  //   .sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
  // }



  

  return (
    <div className="calendar-page">
      {/* {selectedDay === null && ( */}
        <aside className="calendar-side-panel">
          <div className="panel-date-heading">Upcoming Events</div>
          {upcomingWeekEvents.length === 0 ? (
            <p className="no-events">No events yet.</p>
          ) : (
            <ul className="event-list upcoming-events" /*POSSIBLE UPDATE TO NEW DESIGN WITH WORKOUTS GREYED OUT*/ >
              {upcomingWeekEvents.map((ev) => (
                <li key={ev.id} className={`${ev.type}`}>
                  <span className="event-name">{ev.name}</span>
                  {ev.time && <span className="event-time">{ev.time}</span>}
                  <span className="event-name">{getDaysAway(ev.start_date, selectedDate)}</span> {/*will resolve issue eventually*/}
                </li>
              ))}
            </ul>
          )}
        </aside>
      {/* )} */}

      <div className="calendar-box">
        <CalendarApp
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
          events={events}
          dayEvents={dayEvents}
          dayWorkouts={dayWorkouts}
        />
      </div>

      <aside className="calendar-side-panel">
        {selectedDay == null ? (
          <p className="panel-empty">Select a day to see or add events.</p>
        ) : (
          <>
            <div className="panel-date-heading">{selectedLabel}</div>

            {dayEvents.length === 0 ? (
              <p className="no-events">No events yet.</p>
            ) : (
              <ul className="event-list">
                {dayEvents.map((ev) => (
                  <li key={ev.id} className={`${ev.type}`} onClick={() => setSelectedEvent(ev)}>
                    <span className="event-name">{ev.name}</span>
                    {ev.start_time && (
                      <span className="event-time">{formatTime(ev.start_time)}</span>
                    )}
                    {confirmDeleteId === ev.id ? (
                      <span className="delete-confirm">
                        Remove?{" "}
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id);}}>
                          Yes
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null);}}>
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        className="delete-btn"
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(ev.id); }}
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
  {selectedEvent && (
  <div className="workout-panel">
    <h4><b>Workouts for {selectedEvent.name}</b></h4>
    {displayWorkoutsForEvent(selectedEvent)}
    <button type="button" className="add-btn" onClick={() => console.log("THIS WILL ADD GOAL")}>Add Goal</button>
    <button type="button" className="add-btn" onClick={() => console.log("THIS WILL ADD WORKOUT")}>Add Workout</button>
  </div>
)}
            <form className="add-event-form" onSubmit={handleAddEvent}>
              <h3>Add Event</h3>
              <input
                type="text"
                placeholder="Event name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <p>End date</p>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => 
                  setForm((f) => ({ ...f, end_date: e.target.value }))
                }
              />
              <p>Start time</p>
              <input
                type="time"
                value={form.start_time}
                placeholder = "start_time"
                onChange={(e) =>
                  setForm((f) => ({ ...f, start_time: e.target.value }))
                }
              />
              <p>End time</p>
              <input
                type="time"
                value={form.end_time}
                placeholder = "end_time"
                onChange={(e) =>
                  setForm((f) => ({ ...f, end_time: e.target.value }))
                }
              />
              {saveError && <p className="save-error">{saveError}</p>}
              <button type="submit" disabled={saving || !form.name.trim()}>
                {saving ? "Saving..." : "Add Event"}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
