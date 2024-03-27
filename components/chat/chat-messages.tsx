"use client";

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

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

export default function ChatMessages({ apiUrl, chatId, member, name, paramKey, paramValue, socketQuery, socketUrl, type }: ChatMessagesProps) {

    const queryKey = `chat:${chatId}`

    const {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status
    } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

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
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1"></div>
            <ChatWelcome type={type} name={name}></ChatWelcome>
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageMemberProfile) => (
                            <div key={message.id}>{message.content}</div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}