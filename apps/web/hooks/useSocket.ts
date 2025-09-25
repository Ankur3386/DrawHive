'use client'
import { useEffect, useState } from "react";
import { ws_backend } from "../app/room/[slug]/config";

 export function useSocket(){
   const  [loading , setLoading] =useState(true)
   const [socket ,setSocket] =useState<WebSocket>();
   useEffect(()=>{
   const ws = new  WebSocket(`${ws_backend}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5NjAxOTgyLWExMjUtNDNiNS05YTM1LWYxNGZhZmQxN2MwMiIsImlhdCI6MTc1ODgxMDg2NSwiZXhwIjoxNzU5Njc0ODY1fQ.Q7ef0D4IwiGJEMKzk2Fa_7u3vA8rbZ1rTIIv-mKyDuc`) ;
   ws.onopen=()=>{
   setLoading(false)
    setSocket(ws)
   }
   
   
   },[])
   return{
    loading , socket
   }
}