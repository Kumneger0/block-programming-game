import { levelcontext } from "../dashboad"
import {useContext} from 'react'
function LevelToggler() {
  const {level, setLevel} = useContext(levelcontext)
  return (
    <div className="w-1/3 flex gap-4 justify-start">
      <div>
        <button onClick={() => setLevel && setLevel(1)} className={`rounded-full ${level == 1 ? 'bg-slate-700 text-white' : 'bg-white'}  p-1 w-7 h-7`}>1</button>
      </div>
      <div>
      <button onClick={() => setLevel && setLevel(2)} className={`rounded-full ${level == 2 ? 'bg-slate-700 text-white' : 'bg-white'}  p-1 w-7 h-7`}>2</button>
      
      </div>
      <div>
      <button onClick={() => setLevel && setLevel(3)} className={`rounded-full ${level == 3 ? 'bg-slate-700 text-white' : 'bg-white'}  p-1 w-7 h-7`}>3</button>
       
      </div>
      
    </div>
  )
}

export default LevelToggler
