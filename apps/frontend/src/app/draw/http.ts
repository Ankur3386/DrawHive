import axios from "axios";

export async function getExistingShapes(roomId:string,token:string){
  if (!token) {
    console.error("No token provided");
    return [];
  }
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${roomId}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    const messages = res.data.message
    console.log(messages)
    const shapes =messages.map((x:{message:string})=>{
      const messageData = JSON.parse(x.message)
      return messageData
    })
    return shapes

}