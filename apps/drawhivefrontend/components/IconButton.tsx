import { ReactNode } from "react"
export  function IconButton({icon,onClick,activated,className} : {
    icon:ReactNode,
    onClick:()=>void,
    activated:boolean,
    className?:string
}){
return(
    <div className={`pointer m-2 p-2 rounded-xl border  border-slate-800 hover:bg-gray-500 ${activated ?"text-green-500":"text-white"} ${className}`}  onClick={onClick}>
        {icon}
    </div>
)
}