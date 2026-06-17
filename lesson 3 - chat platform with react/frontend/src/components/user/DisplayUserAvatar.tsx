import type { UserChat } from "../chat/types";

export default function DisplayUserAvatar({ chat }: {
    chat: UserChat;
}) {
    const userAvatarName = `${chat.name.toUpperCase().split(" ")[0].toString()[0]}${chat.name.toUpperCase().split(" ")[1]?.toString()![0] || ""}`

    return (
        chat.avatar
        && <img src={chat.avatar} alt="" className="size-13 rounded-full" />

        || <div className="size-13 rounded-full bg-(--primary) text-(--background) font-bold text-2xl content-center">
            <p>{userAvatarName}</p>
        </div>
    )
}