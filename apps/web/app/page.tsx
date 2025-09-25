'use client'
import css from "styled-jsx/css";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const[storeSlug,setStoreSlug]=useState("");
  const router =useRouter();
  return (
    <div style={{
      width:'screen',
      height:"screen",
      padding:"4px",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }}>
 <input  style={{
      width:'276px',
      height:"54px",
      padding:"4px",}} value={storeSlug} type="text" placeholder="Enter the slug" onChange={(e)=>{setStoreSlug(e.target.value)}} />
 <button style={{
      width:'56px',
      height:"54px",
      padding:"4px",
      }}  onClick={()=>{
        router.push(`/room/${storeSlug}`)
      }}>click</button>

    </div>
  );
}
