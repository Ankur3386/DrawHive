import Link from 'next/link'
import React from 'react'
import { Im500Px } from "react-icons/im"

const Header = () => {
  return (

   <div className=' w-screen p-5 bg-white '>
    <div className='px-5 flex items-center justify-between  ' >
        <div className='flex justify-between  text-lg '>
            <div className='flex justify-center gap-2 text-xl '>
                <Im500Px />
                <span>Draw Hive</span>
            </div>
            <div className=' px-16 '>
           <Link className='px-3 hover:text-orange-400' href='/features'> Use Cases</Link>
           <Link className='px-3 hover:text-orange-400' href='/features'> Features</Link>
           <Link className='px-3 hover:text-orange-400' href='/features'> Setting</Link>
            </div>
        </div>
            
        <div className='flex justify-center gap-7'>
            <div className='border rounded-xl p-1 font-medium bg-green-950'>
                <Link className='p-2 hover:text-orange-400' href='/features'> Login</Link>
            </div>
             <div className='border rounded-xl p-1 font-medium  bg-orange-400 hover:bg-orange-500  '>
                <Link className='p-2 hover:text-orange-400' href='/features'> Get Started</Link>
            </div>

        </div>
        
    </div> 
  
</div>
  )
}

export default Header