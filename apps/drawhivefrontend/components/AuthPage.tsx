import {Input} from '@repo/ui/input'
import {Button} from '@repo/ui/button'

export function AuthPage({isSignin}:{isSignin:boolean}){
return(
    <div className=" w-screen h-screen flex justify-center items-center">
        <div className='w-[50%] h-[70%] bg-white flex flex-col justify-center items-center rounded-3xl shadow-2xl gap-2'>
 <div >
    <Input className={"bg-green-400 border-4 rounded-4xl p-3 m-2  w-[120%]"}  placeholder={"Email"} />
    </div> 
 <div>
    <Input className={"bg-green-400 border-4 rounded-4xl p-3 m-2 w-[120%] "}  placeholder={"Password"} />
    </div> 
  <div>
    
  </div>
        <Button  className={"p-3 m-4 w-[20%]  border rounded-3xl bg-gray-500 "}> {isSignin ? "Login" :"SignUp"} </Button>
        </div>
    </div>
)
}