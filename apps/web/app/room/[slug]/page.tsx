
import ChatRoom from "../../../components/ChatRoom";
import { http_Backend } from "./config";
import axios from 'axios'

const getRoomId = async (slug: string) => {
  try {
     console.log("Backend URL:", http_Backend);
    const response = await axios.get(`${http_Backend}/room/${slug}`);
    console.log("✅ Room response:", response.data);
    return response.data.id;
  } catch (error: any) {
    // Now this WILL run if it's a 404 or any error
    console.error("❌ Axios error:", error.message);
    console.error("📦 Full response (if available):", error.response?.data);
    throw error; // rethrow or handle as needed
  }
};


export default async function ChatRoom1({params}:{
    params:{slug:string}}){

  const  slug  = (await params).slug; 
  console.log(slug); 
  const roomId = await getRoomId(slug)
return(
  <ChatRoom id={roomId}/>
)

}