"use client"

import { Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import Picker from '@emoji-mart/react'
import Data from '@emoji-mart/data'
import { useTheme } from "next-themes"

interface EmojiPickerProps {
    onChange: (value: string) => void
}

export default function EmojiPicker({ onChange }: EmojiPickerProps) {

    const {resolvedTheme} = useTheme()

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"></Smile>
            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
                <Picker data={Data} theme={resolvedTheme} onEmojiSelect={(emoji: any) => onChange(emoji.native)}></Picker>
            </PopoverContent>
        </Popover>
    )
}