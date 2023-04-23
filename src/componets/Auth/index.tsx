import styles from './auth.module.css'
import { useContext } from 'react'
import { userContext } from '../../App'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";

export default function Auth() {
  const {setUser} = useContext(userContext)
  

  const singInUser = () => {
    return
    if(!setUser) return
    setUser(() => ({name:'kumneger', email:'kumneger@gmail.com'}))
  }

const singUpUser = () => {
  if(!setUser) return
  setUser(() => ({name:'kumneger', email:'kumneger@gmail.com'}))
}


  return (
    <div className={`${styles.container} w-screen h-screen overflow-y-hidden`}>
    <div className="w-4/5 mx-auto h-4/5">
      <div className='text-xl text-fuchsia-200 w-full text-center mt-11'>
        <div>Wellcome  to Tynker.com</div>
        <div>Learn coding by collecting candies</div>
      </div>
      <div className="authentication flex w-full h-full justify-center items-center flex-col gap-2">
       <button onClick={singInUser} className='border-2 border-red-300 bg-blue-600 p-2 hover:bg-blue-800 text-white'><SignInButton redirectUrl='http://localhost:5173' mode='modal' /></button>
       <div>Or</div>
       <button onClick={singUpUser} className='border-2  border-red-300 text-white bg-blue-800 p-2 hover:bg-blue-400'>Sign Up</button>
      </div>
    </div>
    </div>
  )
}
