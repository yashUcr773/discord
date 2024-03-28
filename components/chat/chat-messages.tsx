"use client";

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import ChatItem from "./chat-item";
import { format } from 'date-fns'
import useChatSocket from "@/hooks/use-chat-socket";
import useChatScroll from "@/hooks/useChatScroll";

type MessageMemberProfile = Message & { member: Member & { profile: Profile } }

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const DATE_FORMAT = "d MMM yyyy, HH:mm"

export default function ChatMessages({ apiUrl, chatId, member, name, paramKey, paramValue, socketQuery, socketUrl, type }: ChatMessagesProps) {

    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)

    const {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status
    } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

    useChatSocket({ queryKey, addKey, updateKey })
    useChatScroll({ chatRef, bottomRef, loadMore: fetchNextPage, shouldLoadMore: !isFetchingNextPage && !!hasNextPage, count: data?.pages?.[0].items.length ?? 0 })

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"></Loader2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading Messages...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4"></ServerCrash>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
            </div>
        )
    }

    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1"></div>}
            {!hasNextPage && <ChatWelcome type={type} name={name}></ChatWelcome>}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"></Loader2>
                    ) : (
                        <button onClick={() => { fetchNextPage() }} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">Load previous messages</button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageMemberProfile) => (
                            <ChatItem currentMember={member} member={message.member} key={message.id} id={message.id} content={message.content} fileUrl={message.fileUrl} deleted={message.deleted} timestamp={format(new Date(message.createdAt), DATE_FORMAT)} isUpdated={message.updatedAt !== message.createdAt} socketUrl={socketUrl} socketQuery={socketQuery}></ChatItem>
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} ></div>
        </div >
    )
}