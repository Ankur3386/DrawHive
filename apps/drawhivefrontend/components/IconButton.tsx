import { ReactNode } from "react"
export  function IconButton({icon,onClick,activated} : {
    icon:ReactNode,
    onClick:()=>void,
    activated:boolean
}){
return(
    <div className={`pointer m-2 p-2 rounded-full border bg-black hover:bg-gray-500 ${activated ?"text-green-500":"text-white"}`} onClick={onClick}>
        {icon}
    </div>
)
}