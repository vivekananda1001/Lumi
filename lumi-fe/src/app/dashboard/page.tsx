import React from 'react'
import { Menu, Settings, Plus, Mic } from 'lucide-react';
import Card from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className='min-w-screen min-h-screen p-2 bg-blue-100'>
      <div className='fixed top-0 w-full bg-blue-100 z-10'>
        <div className='flex items-center text-7xl font-bold m-4 justify-between'>
          <div className='bg-gray-700 rounded-lg p-2 text-yellow-400 m-2'><Menu size={48}/></div>
          <div className='bg-gray-700 rounded-2xl p-3'>
            <span className='text-yellow-400'>L<span className='text-white'>umi</span></span>
          </div>
          <div className='bg-gray-700 rounded-lg p-2 text-yellow-400 m-2'><Settings size={48}/></div>
        </div>
      </div>
        <div className='flex flex-col justify-center items-center flex-grow overflow-y-auto pt-32 pb-30'> 
          <Card title="Go To Gym" desc="Check" startTime='8:00pm' endTime='10:00pm' priority='hi'/>
          <Card title="Visit doctor" desc="Check" startTime='4:00pm' endTime='5:00pm'/>
          <Card title="Take medicines" desc="Check" startTime='8:00pm' endTime='10:00pm' priority='md'/>
          <Card title="Visit mom" desc="Check" startTime='2:00pm' endTime='4:00pm'/>
          <Card title="Visit mom" desc="Check" startTime='2:00pm' endTime='4:00pm'/>
          <Card title="Visit mom" desc="Check" startTime='2:00pm' endTime='4:00pm'/>
          <Card title="Visit mom" desc="Check" startTime='2:00pm' endTime='4:00pm'/>
        </div>
        <div className='fixed bottom-0 w-full bg-blue-100 z-10'>
          <div className='flex justify-around items-center m-4'>
                <div className='bg-gray-600 rounded-lg p-2 text-yellow-400 m-2'><Plus size={48}/></div>
                <input className='bg-white p-4 w-5xl rounded-2xl outline-blue-400 outline-2'/>
                <div className='bg-gray-700 p-3 text-white m-2 rounded-full hover:text-yellow-400 transition-all duration-300 transform hover:scale-110 hover:w-[90px]'>
                  <Mic size={60}/>
                </div>
          </div>
        </div>
    </div>
  )
}
