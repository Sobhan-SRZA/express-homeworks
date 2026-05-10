import { Bars3Icon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import { MoveLeft, Search } from "lucide-react";
import useWebSocket from "../hooks/useWebsocket"
import backend from "../backend/backend"

interface ApplicationProbs {
  token: string;
}

export default function Application({ token }: ApplicationProbs) {
  const url = `${backend.websocket}?token=${token}`;

  // const { } = useWebSocket(url);
  const [openChat, setOpenChat] = useState<boolean>(false);

  const chats = [
    { id: 1, avatar: "/favicon.ico", muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047725578 }, status: "offline", unread_message: 1 },
    { id: 2, muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047925578 }, status: "offline", unread_message: 1 },
    { id: 3, avatar: "/favicon.ico", muted: true, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725578 }, status: "offline", unread_message: 250 },
    { id: 4, muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: 5, muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725598 }, status: "offline", unread_message: 250 },
    { id: 6, muted: true, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925858 }, status: "online", unread_message: 45 },
    { id: 7, muted: true, name: "narges", last_message: { text: "کجایی", timestamp: 1778075241372 }, status: "online", unread_message: 69 },
    { id: 8, muted: true, name: "mmd", last_message: { text: "sexy boy", timestamp: 1777920999999 }, status: "online", unread_message: 0 },
    { id: 9, muted: true, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047725678 }, status: "offline", unread_message: 1 },
    { id: 10, muted: true, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047755578 }, status: "offline", unread_message: 1 },
    { id: 11, avatar: "/favicon.ico", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947525578 }, status: "offline", unread_message: 250 },
    { id: 12, avatar: "/favicon.ico", muted: true, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768043925358 }, status: "online", unread_message: 45 },
    { id: 13, avatar: "/favicon.ico", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777941225578 }, status: "offline", unread_message: 250 },
    { id: 14, muted: true, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047225578 }, status: "offline", unread_message: 1 },
    { id: 16, muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947735578 }, status: "offline", unread_message: 250 },
    { id: 15, muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768028925358 }, status: "online", unread_message: 45 },
    { id: 17, avatar: "/favicon.ico", muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777027725578 }, status: "offline", unread_message: 1 },
    { id: 18, muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725578 }, status: "offline", unread_message: 250 },
    { id: 19, muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768041925358 }, status: "online", unread_message: 45 },
    { id: 52, avatar: "/favicon.ico", muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: 554642, muted: false, name: "setayesh hazery", last_message: { text: "Ashkum", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: 613, muted: true, name: "sepehr", last_message: { text: "bro where are you???", timestamp: Date.now() }, status: "offline", unread_message: 5 },
  ]
  const socket = new WebSocket(url);
  const sendMessage = (msg: string | object) => {
    if (socket.readyState === WebSocket.OPEN) {

      if (typeof msg !== "string")
        msg = JSON.stringify(msg);

      socket.send(msg);
    }
  };
  socket.onopen = () => {
    console.log('WebSocket connection established');
    sendMessage({ type: 'get_initial_data' });
  };

  socket.onmessage = (event) => {
    const data = event.data;

    if (data.type === "error") {
      if (["AUTH_EXPIRE", "AUTH_MISSING"].includes(data.code)) {
        location.reload();
      }
    }

  };

  const sortedChats = chats.sort((a, b) => {
    const timestampA = Number(a.last_message?.timestamp || 0);
    const timestampB = Number(b.last_message?.timestamp || 0);

    if (timestampA < timestampB) {
      return 1;
    }

    if (timestampA > timestampB) {
      return -1;
    }

    return 0;
  });

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

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const searchInput = useRef<HTMLInputElement>(null);

  const searchReuslt: any[] = [];

  useEffect(() => {
    if (searchInput.current) {
      const handleSearchInput = () => {
        setSearchOpen(true);
      };

      searchInput.current.addEventListener("focus", handleSearchInput);

      return () => searchInput.current?.removeEventListener("focus", handleSearchInput);
    }

  }, [searchInput, searchInput.current])

  const SearchReuslt = () => {
    return (
      <ul className={`flex flex-col p-0 py-3 justify-start items-center text-center overflow-hidden overscroll-y-contain overflow-y-auto ${searchReuslt.length < 1 ? "min-h-full" : "min-h-0"} felx-1 custom-scroll scroll-smooth px-2 gap-2`}>
        {
          searchReuslt.length < 1 && <li className="flex justify-center text-center items-center p-4 w-full min-w-xs rounded-2xl">
            <p className="rtl">چتی پیدا نشد.</p>
          </li>

          || searchReuslt
            .map((chat) => {
              return (
                <li className="flex justify-between items-center cursor-pointer p-4 w-full min-w-xs hover:bg-(--hover)/20 transition-colors rounded-2xl" key={chat.id}>

                  <div className="felx flex-col justify-center items-center text-left h-full w-max">
                    {/* last message time */}
                    <p className="text-left text-(--text)/60 text-[0.8rem] rtl">{showTime(chat.last_message.timestamp)}</p>

                    {chat.unread_message > 0 && <span className={`flex flex-col mt-2 w-fit px-2 rounded-full font-bold text-(--text)/80 text-[0.7rem] p-[0.2rem] ${!chat.muted ? "bg-green-600/70" : "bg-gray-400/70"}`}>{chat.unread_message}</span>}
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
              )
            })}
      </ul>
    )
  }

  const ChatsList = () => {
    const DisplayUserAvatar = ({ chat }: { chat: typeof sortedChats[0] }) => {
      return (
        chat.avatar
        && <img src={chat.avatar} alt="" className="size-13 rounded-full" />
        || <div className="size-13 rounded-full bg-(--primary) text-(--background) font-bold text-2xl content-center"><p>{chat.name.toUpperCase().split(" ")[0].toString()[0]}{chat.name.toUpperCase().split(" ")[1]?.toString()![0] || ""}</p></div>

      )
    }

    return (
      <ul className="flex flex-col p-0 py-3 justify-start items-center text-center overflow-hidden overscroll-y-contain overflow-y-auto felx-1 custom-scroll h-screen scroll-smooth px-2 gap-2">
        {sortedChats
          .map((chat, index) => {
            return (
              <li className="flex justify-between items-center cursor-pointer p-4 w-full min-w-xs hover:bg-(--hover)/20 transition-colors rounded-2xl" key={chat.id}>

                <div className="felx flex-col justify-center items-center text-left h-full w-max">
                  {/* last message time */}
                  <p className="text-left text-(--text)/60 text-[0.8rem] rtl">{showTime(chat.last_message.timestamp)}</p>

                  {chat.unread_message > 0 && <span className={`flex flex-col mt-2 w-fit px-2 rounded-full font-bold text-(--text)/80 text-[0.7rem] p-[0.2rem] ${!chat.muted ? "bg-green-600/70" : "bg-gray-400/70"}`}>{chat.unread_message}</span>}
                </div>

                <div className="flex gap-2">
                  {/* profile */}
                  <div className="flex flex-col text-right">
                    <h3 className="font-semibold text-[1.1rem] text-(--text)">{chat.name}</h3>
                    <p className="text-(--text)/60 text-[0.80rem]">{chat.last_message.text}</p>
                  </div>

                  <div className="relative">
                    <DisplayUserAvatar chat={chat} />

                    <span className={`rounded-full size-4 absolute inset-0 top-9 left-0.5 border-3 border-(--card-bg) ${chat.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                </div>
                {/* {index + 1 < chats.length && index % 2 !== 0 && <span className="w-3/4 h-[0.1rem] bg-(--border)" />}
                {index % 2 !== 0 && <span className="w-3/4 h-[0.1rem] bg-(--border)" />} */}
              </li>
            )
          })}
      </ul>
    )
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

        <section id="conversetion" className="flex flex-col max-w-full max-h-screen bg-(--card-bg) border-l-(--border) border-l-2">

          <div className="flex place-self-center items-center gap-2 py-2">
            {searchOpen
              && <MoveLeft
                className="size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300"
                onClick={() => setSearchOpen(false)}
              />

              || <Bars3Icon className="size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300" />
            }

            {/* Searching part */}
            <div className="flex justify-center items-center place-self-center p-2 px-4 gap-2 rounded-4xl bg-(--border)/30 w-max h-full border-3 border-transparent focus-within:border-(--primary) transition-colors duration-200" >
              <Search className="bg-transparent text-(--text) in-focus-within:text-(--primary) transition-colors duration-200" />

              <input
                type="text"
                className="rtl outline-none bg-transparent text-(--text) focus:outline-(--primary)"
                placeholder="جست و جو کاربر"
                ref={searchInput}
              />
            </div>
          </div>

          <div className="w-full h-[0.1rem] bg-(--border)" />

          {searchOpen
            && <SearchReuslt />
            || <ChatsList />}
        </section>
      </main>
    </>
  )
}
