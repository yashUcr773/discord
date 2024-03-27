import { currentProfile } from "@/lib/current-profile"
import { redirectToSignIn } from "@clerk/nextjs"
import { prisma } from '@/lib/db'
import { redirect } from "next/navigation"
import ChatHeader from "@/components/chat/chat-header"

interface ChannelIdPageProps {
    params: {
        channelId: string,
        serverId: string
    }
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {

    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn()
    }

    const channel = await prisma.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await prisma.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    })

    if (!channel || !member) {
        return redirect("/")
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel"></ChatHeader>
        </div>
    )
}