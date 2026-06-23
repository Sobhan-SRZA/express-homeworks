import Message from "./Message";
import type { MessageListProbs } from "./types";

export default function MessageList({
    messages = [],
    from,
    ref
}: MessageListProbs) {
    return (
        <div
            ref={ref}
            className="flex-1 overscroll-y-contain overflow-y-scroll custom-scroll max-h-screen scroll-smooth p-4 py-20 space-y-3 w-3/4 justify-center items-center self-center"
        >
            {
                (messages && messages.length > 0) &&

                messages.map((msg) => {
                    const isOwn = msg.from === from;

                    return (
                        <Message
                            key={msg.id}
                            isOwnMessage={isOwn}
                            message={msg}
                        />
                    );
                })

                ||
                <p>پیامی وجود ندارد</p>
            }
        </div>
    )
}