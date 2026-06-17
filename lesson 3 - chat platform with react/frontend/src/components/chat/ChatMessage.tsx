import type {
    ChatMessageProbs,
    UserChat
} from "./types";
import type { MouseEvent } from "react";
import DisplayUserAvatar from "../user/DisplayUserAvatar";

export default function ChatMessage({
    chat,
    onSelect
}: ChatMessageProbs) {
    const handleClickChat = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>, chat: UserChat) => {
        e.preventDefault();

        onSelect({ isOpen: true, ...chat })
    }

    return (
        <li className="flex justify-between items-center cursor-pointer p-4 w-full min-w-xs hover:bg-(--hover)/20 transition-colors rounded-2xl"
            key={chat.id}
            accessKey={chat.id}
            onClick={(e) => handleClickChat(e, chat)}
        >

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
}

export const showTime = (time: number): string => {
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