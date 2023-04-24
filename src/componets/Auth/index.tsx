import styles from './auth.module.css'
import {
  SignInButton,
} from "@clerk/clerk-react";

export default function Auth() {
  return (
    <div className={`${styles.container} w-screen h-screen overflow-y-hidden`}>
    <div className="w-4/5 mx-auto h-4/5">
      <div className='text-xl text-fuchsia-200 w-full text-center mt-11'>
        <div>Wellcome  to Tynker.com</div>
        <div>Learn coding by collecting candies</div>
      </div>
      <div className="authentication flex w-full h-full justify-center items-center flex-col gap-2">
       <div role='button' className='border-2 border-red-300 bg-blue-600 p-2 hover:bg-blue-800 text-white'><SignInButton redirectUrl='http://localhost:5173' mode='modal'>sign in</SignInButton></div>
      </div>
    </div>
    </div>
  )
}
