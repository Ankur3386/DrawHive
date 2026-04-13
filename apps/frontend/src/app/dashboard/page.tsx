import Left from "../../../components/dashboardComponent/Left"
import Right from "../../../components/dashboardComponent/Right"

const page = () => {
  return (
    <div className="flex w-screen h-screen bg-stone-100">
      <div className="w-[25%] h-full">
        <Left />
      </div>
      <div className="w-[75%] h-full">
        <Right />
      </div>
    </div>
  )
}
export default page