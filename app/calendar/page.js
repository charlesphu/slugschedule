"use client";
// import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      slotMinTime="08:00:00"
      slotMaxTime="22:00:00"
      allDaySlot={false}
      height={"auto"}
      headerToolbar={false}
      weekends={false} // hides Saturday and Sunday
    />
  );
}

//   const [sidebarItems] = useState([
//     { id: 1, title: "Item 1", day: 1, time: 9 }, // Monday, 9 AM
//     { id: 2, title: "Item 2", day: 3, time: 14 }, // Wednesday, 2 PM
//     { id: 3, title: "Item 3", day: 5, time: 11 }, // Friday, 11 AM
//   ]);

//   // ... (keep all the styles unchanged)

//   const renderEvent = (hour, dayIndex) => {
//     const event = sidebarItems.find(
//       (item) => item.time === hour && item.day === dayIndex
//     );

//     if (event) {
//       return (
//         <div
//           style={{
//             backgroundColor: "#e3f2fd",
//             padding: "5px",
//             borderRadius: "3px",
//             fontSize: "0.9em",
//             position: "absolute",
//             top: "5px",
//             left: "5px",
//             right: "5px",
//           }}>
//           {event.title}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.sidebar}>
//         {sidebarItems.map((item) => (
//           <div key={item.id} style={styles.sidebarItem}>
//             {item.title} -{" "}
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][item.day]}{" "}
//             {item.time > 12
//               ? `${item.time - 12}:00 PM`
//               : `${item.time}:00 ${item.time === 12 ? "PM" : "AM"}`}
//           </div>
//         ))}
//       </div>

//       <div style={styles.calendar}>
//         <div
//           style={{
//             ...calendarStyles.grid,
//             gap: "0",
//             gridTemplateColumns: "60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
//             gridTemplateRows: `repeat(${hours.length}, 50px)`,
//             border: "1px solid #ddd",
//             width: "100%",
//           }}>
//           {/* Time column and days header remain unchanged */}
//           {/* ... previous header code ... */}

//           {hours.map((hour) => (
//             <>
//               <div
//                 key={`time-${hour}`}
//                 style={{
//                   ...calendarStyles.day,
//                   borderRadius: "0",
//                   borderBottom: "1px solid #ddd",
//                   borderRight: "1px solid #ddd",
//                   fontSize: "0.8em",
//                   color: "#70757a",
//                 }}>
//                 {hour > 12
//                   ? `${hour - 12}:00 PM`
//                   : `${hour}:00 ${hour === 12 ? "PM" : "AM"}`}
//               </div>
//               {Array(7)
//                 .fill(null)
//                 .map((_, dayIndex) => (
//                   <div
//                     key={`slot-${hour}-${dayIndex}`}
//                     style={{
//                       ...calendarStyles.day,
//                       borderRadius: "0",
//                       borderBottom: "1px solid #ddd",
//                       borderRight: "1px solid #ddd",
//                       minHeight: "50px",
//                       position: "relative",
//                     }}>
//                     {renderEvent(hour, dayIndex)}
//                   </div>
//                 ))}
//             </>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
