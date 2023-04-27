import styles from './auth.module.css'
import {useState} from 'react'
import { ModalPart } from '../modal/authmodal'

export default function Auth() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
 

const onClose  = () =>  {
  setIsOpen(false)
}
  return (
    <> { isOpen ? <ModalPart isOpen = {isOpen} onClose={onClose} /> :
    <div className={`${styles.container} w-screen h-screen overflow-y-hidden`}>
    <div className="w-4/5 mx-auto h-4/5">
      <div className='text-xl text-fuchsia-200 w-full text-center mt-11'>
        <div>Wellcome  to Tynker.com</div>
        <div>Learn coding by collecting candies</div>
      </div>
      <div className="authentication flex w-full h-full justify-center items-center flex-col gap-2">
       <div role='button' onClick={() => setIsOpen(true)} className='border-2 border-red-300 bg-blue-600 p-2 hover:bg-blue-800 text-white'>sign in</div>
      </div>
    </div>
    </div>
   } </>
  )
}
