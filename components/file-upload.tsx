"use client"

import { X } from 'lucide-react'
import Image from 'next/image'

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"

interface FileUploadProps {
    endpoint: 'serverImage' | 'messageFile'
    value: string
    onChange: (url?: string) => void
}

export default function FileUpload({ endpoint, onChange, value }: FileUploadProps) {

    const fileType = value.split('.').pop()

    if (value && fileType !== 'pdf') {
        return (
            <div className='relative h-20 w-20'>
                <Image fill src={value} alt="Upload" className='rounded-full'></Image>
                <button onClick={() => onChange("")} className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm' type='button'>
                    <X className='h-4 w-4'></X>
                </button>
            </div>
        )
    }



    return (
        <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
        }}
            onUploadError={(error: Error) => {
                console.log(error)
            }}>

        </UploadDropzone>
    )
}