import {useEffect} from 'react'
import {useSearchParams} from 'react-router-dom'
import { User as IUser } from '../../App';
let shouldReturn = false;

export default function Verify({user, setUser}:{user:IUser | null, setUser:(user:IUser) => void}) {
  const [searchParams] = useSearchParams()
  useEffect(() => {
  const token = searchParams.get('token')
   const id = searchParams.get('id')
   if(token && id && !shouldReturn){
     verifyUser(token, id)
     shouldReturn = true
   }
   return () => { 
    shouldReturn = false
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 async function verifyUser(token:string, id:string) {
    const url = new URL('https://server-rtdf.onrender.com/verify',)
    url.searchParams.append('token', token)
    url.searchParams.append('id', id)
    const response =  await fetch(url)
    const data = await response.json()
    console.log(data)
    if(data.status == 200){
      setUser({email: data.user.email})
      localStorage.setItem('token', data.token)
      return
    } 
}
  return (
    <div className='w-screen h-screen bg-slate-300 flex justify-center items-center'>
      <div>
      <h1>Email verification</h1>
        {user?.email ? <div>
          <div>Email successfully verified <a className='border-blue-600 hover:bg-blue-600 border-2 p-2 m-2 hover:text-white' href="/">Go Back Home</a></div>
        </div>: <div>Email is Not verified</div> }
      </div>
    </div>
  )
}
