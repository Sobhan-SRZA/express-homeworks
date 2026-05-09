import useWebSocket from "../hooks/useWebsocket"
import backend from "../backend/backend"
import { useState } from "react";

interface ApplicationProbs {
  token: string;
}

export default function Application({ token }: ApplicationProbs) {
  const { } = useWebSocket(`${backend.websocket}?token=${token}`);
  const [openChat, setOpenChat] = useState<boolean>(false);

  const chats = [
    { id: 1, muted: true, name: "narges", last_message: { text: "کجایی", timestamp: 1778075241372 }, status: "online", unread_message: 5 },
    { id: 2, muted: true, name: "mmd", last_message: { text: "sexy boy", timestamp: 1777920999999 }, status: "online", unread_message: 0 },
    { id: 3, muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047725578 }, status: "offline", unread_message: 1 },
    { id: 4, muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725578 }, status: "offline", unread_message: 250 },
    { id: 5, muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: 6, muted: true, name: "sepehr", last_message: { text: "bro where are you???", timestamp: Date.now() }, status: "offline", unread_message: 5 },
  ]

  const showTime = (time: number): string => {
    const date = new Date(time);
    const now = new Date();

    const faTime = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const faDayName = new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
    });

    const faMonthDay = new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      day: "numeric",
    });

    const faFullDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const faFYearDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric"
    });

    // today
    if (date.toDateString() === now.toDateString()) {
      return faTime.format(date);
    }

    // yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return "دیروز";
    }

    // calculating week
    const startOfWeek = new Date(now);
    const day = (now.getDay() + 1) % 7; // strat week from saturday
    startOfWeek.setDate(now.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // current week
    if (date >= startOfWeek && date < endOfWeek) {
      return faDayName.format(date); 
    }

    // current year
    if (faFYearDate.format(date) === faFYearDate.format(now)) {
      return faMonthDay.format(date);
    }

    // last years
    return faFullDate.format(date);
  };


  return (
    <>
      <main id="platform" className="flex justify-between items-center text-center min-h-full min-w-full p-0 inset-0 m-0 relative">
        <section id="chat" className="flex flex-col w-full">
          {openChat
            && <div>
            </div>
            || <div className="text-center rtl">
              <p>برای شروع گفت و گو چتی را انتخاب کنید.</p>
            </div>}
        </section>

        <section id="conversetion" className="max-w-full min-h-screen bg-(--card-bg) border-l-(--border) border-l-2">

          <div className="">
            <input
              type="text"
              className=""
              placeholder="جست و جو کاربر"
            />
          </div>

          <ul className="flex flex-col p-0 justify-center items-center text-center">
            {chats
              .sort((a, b) => b.last_message.timestamp - a.last_message.timestamp)
              .map((chat, index) => {
                return <>
                  {index % 2 !== 0 && <span className="w-3/4 h-[0.1rem] bg-(--border)" />}

                  <li className="flex justify-between items-center cursor-pointer p-4 w-full min-w-xs hover:bg-(--hover)/20 transition-colors" key={chat.id}>

                    <div className="felx flex-col justify-center items-center text-left h-full w-max">
                      {/* last message time */}
                      <p className="text-left text-(--text)/60 text-[0.8rem] rtl">{showTime(chat.last_message.timestamp)}</p>

                      {chat.unread_message > 0 && <span className={`flex flex-col mt-2 w-fit px-2 rounded-full font-bold text-(--text)/80 text-[0.7rem] p-[0.2rem] ${chat.muted ? "bg-green-600/70" : "bg-gray-400/70"}`}>{chat.unread_message}</span>}
                    </div>

                    <div className="flex gap-2">
                      {/* profile */}
                      <div className="flex flex-col text-right">
                        <h3 className="font-semibold text-[1.1rem] text-(--text)">{chat.name}</h3>
                        <p className="text-(--text)/60 text-[0.80rem]">{chat.last_message.text}</p>
                      </div>

                      <div className="relative">
                        <img src="/favicon.ico" alt="" className="size-13 rounded-full" />
                        <span className={`rounded-full size-4 absolute inset-0 top-9 left-0.5 border-3 border-(--card-bg) ${chat.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                      </div>
                    </div>
                  </li>

                  {index + 1 < chats.length && index % 2 !== 0 && <span className="w-3/4 h-[0.1rem] bg-(--border)" />}
                </>
              })}
          </ul>
        </section>
      </main>
    </>
  )
}
