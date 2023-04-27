import { userContext } from '../../App'
import { useContext, useRef, useState} from 'react'

export const ModalPart = ({ isOpen, onClose}:{
isOpen: boolean
onClose:() => void;
}) => {
    const {setUser} = useContext(userContext)
    const emailRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState<boolean | string>('initial')
    const [success, setSuccess] = useState<boolean>(false)
    if (!isOpen) return null;
     const closeModal = () => {
    onClose()
}

async function authenticateUser() {
const {value} = emailRef.current as HTMLInputElement
console.log(value)
if(!value) return
setIsLoading(true)
const response = await fetch('http://localhost:3000/register', {
  method:'POST', 
  headers:{
    'Content-Type':'application/json',
    'Accept':'application/json'
  },
  body: JSON.stringify({
    email: value
  })
})
setIsLoading(false)
const data =  await response.json()
console.log(data)

if(data.message == 'Email sent'){
    setSuccess(true)
    return
}
setSuccess(false)
} 


async function newUser(){
  setIsLoading(true)
const { value } = emailRef.current as HTMLInputElement
const url = new URL('http://localhost:3000/register')
const response =  await fetch(url, {
  method:'post', 
  headers:{
    'Content-Type': 'application/json',
  }, 
  body:JSON.stringify({
    email:value
  })
})
if(response.ok){
  const data = await response.json()
  console.log(data)
 }
 console.log(response)
 setIsLoading(false)
}

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="bg-white w-2/6 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-11/12 relative">
          <div className="px-4 py-5 sm:p-6 flex items-center flex-col">
           <> {isLoading == 'initial' && !success ? <>
            <h2 className="text-xl font-bold mb-4 text-center font-serif">Register</h2>
            <div className="mb-4">
            <input ref={emailRef} type="text" placeholder="Enter your Email Address" className="px-4 py-2 w-full max-w-md text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
                <button onClick={authenticateUser} className="m-3 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">sing in</button>
                <button onClick={newUser} className="m-3 bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700">sing up</button>
            </div>
</> : isLoading ? <>please wait</> : success ? <>verifiaction email sent to you email addres check your inbox or spam folder</> : <>we are unble to sent verifiaction email</>} </>
            <div className="w-full flex flex-col items-center">
                <hr className="w-4/5 mx-auto border border-black"/>
                <div>or</div>
            </div>
            <div>
                <button disabled = {isLoading == true} className={`bg-gray-500 text-white font-bold py-2 px-4 rounded ${isLoading == true ? 'hover:cursor-not-allowed' : 'hover:bg-gray-700'} `} onClick = {() =>setUser && setUser({email:'Guest'})}>Sign in as Guest</button>
            </div>
            <button
              type="button"
              className="absolute top-0 right-1"
              onClick={closeModal}
            >
                 X
            </button>
       </div>
        </div>
      </div>
    </div>
  );
};