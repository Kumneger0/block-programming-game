import {useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
let shouldReturn = false;
let count = 0
interface IUser {
  email:string;
}
export default function Verify({user, setUser}:{user:IUser, setUser:(user:IUser) => void}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)
  useEffect(() => {
  const token = searchParams.get('token')
   const id = searchParams.get('id')
   if(token && id && !shouldReturn){
    console.log(count)
     verifyUser(token, id)
     console.log('hello')
     shouldReturn = true
     count++
   }
   return () => { 
    shouldReturn = false
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 async function verifyUser(token:string, id:string) {
    const url = new URL('http://localhost:3000/verify',)
    url.searchParams.append('token', token)
    url.searchParams.append('id', id)
    console.log(url.href)
    const response =  await fetch(url)
    const data = await response.json()
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
          <div>Email successfully verified <a href="/">Go Back Home</a></div>
        </div>: <div>Email is Not verified</div> }
      </div>
    </div>
  )
}
