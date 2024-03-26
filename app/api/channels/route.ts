import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db"
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {

    try {

        const { name, type } = await req.json()
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId')

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId) {
            return new NextResponse('Server ID missing', { status: 400 })
        }

        if (name === 'general') {
            return new NextResponse("Name can not be 'general'", { status: 400 })
        }


        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (e) {
        console.log(e)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}