import React from 'react'

interface cardProps {
    title: string
    desc: string
    startTime: string;
    endTime: string;
    priority?: priority;
};

type priority = "hi" | "lo" | "md";

const colorstyles: Record< priority, string> = {
    "hi": "bg-red-400 outline-red-300",
    "lo": "bg-green-500 outline-green-200",
    "md": "bg-yellow-300 outline-yellow-200"
};

export default function Card({ title, desc, startTime, endTime, priority }: cardProps) {
    const defaultcolor = "bg-green-500 outline-green-200";  
    const color: string = priority? colorstyles[priority]: defaultcolor;
    return (
        <div className={`m-5 w-5xl grid grid-cols-4 gap-4 ${color} rounded-xl outline-4`}>
            <div className='col-span-1 p-5 bg-gray-700 rounded-l-xl text-white'>
                <div className='text-3xl font-bold'>{title}</div>
                <div className='text-2xl'>{startTime}-{endTime}</div>
            </div>
            <div className={`col-span-3 p-4 text-2xl text-gray-700 flex justify-center items-center`}>
                {desc}
            </div>
        </div>
    )
}
