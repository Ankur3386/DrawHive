import Link from 'next/link'
import React from 'react'


const Hero = () => {
   return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] font relative">


      <div className="top-0 left-0 absolute pointer-events-none select-none">
        <img src="/top1.png" alt="" draggable="false" />
      </div>
      <div className="top-0 right-0 absolute pointer-events-none select-none">
        <img src="/top2.png" alt="" draggable="false" />
      </div>
      <div className="bottom-0 absolute right-20 pointer-events-none select-none">
        <img src="/bottom.png" alt="" draggable="false" />
      </div>

     
      <div className="absolute top-5 right-6 flex items-center gap-2 z-10">
            <Link href="/sign-in">
        <span className="px-4 py-1.5 text-sm text-gray-500 hover:text-black cursor-pointer">
          Sign In
        </span>
      </Link>
      <Link href="/sign-up">
        <button className="px-4 py-1.5 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
          Sign Up
        </button>
        </Link>
      </div>

   
      <div className="flex flex-col lg:flex-row items-center gap-25 w-full max-w-5xl px-4  justify-center">

      
        <div className="text-6xl text-black z-10">
          𝒟𝓇𝒶𝓌𝐻𝒾𝓋𝑒
          <div className='bg-black h-2 mt-1 '></div>
        </div>
         
      </div>

    </div>
  )

}

export default Hero