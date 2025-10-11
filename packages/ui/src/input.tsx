
interface InputProps{
placeholder:string,
className:string
}
export const Input =({placeholder,className}:InputProps)=>{
    return(
       < input  className={className} placeholder={placeholder}/>
    )
}