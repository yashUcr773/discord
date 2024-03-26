import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { channel } from "diagnostics_channel"
import { ChannelType } from "@prisma/client"
import ServerHeader from "./server-header"

interface ServerSidebarProps {
    serverId: string
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {

    const profile = await currentProfile()

    if (!profile) {
        return redirect('/')
    }

    const server = await prisma.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    if (!server) {
        return redirect('/')
    }

    const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)

    const members = server?.members.filter(member => member.profileId !== profile.id)
    const role = server?.members.find(member => member.profileId === profile.id)?.role



    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ServerHeader server={server} role={role}></ServerHeader>
        </div>
    )
}