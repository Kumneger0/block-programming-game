import {useEffect} from 'react'
import {useSearchParams} from 'react-router-dom'
let shouldReturn = false;
let count = 0
interface IUser {
  email:string;
}
export default function Verify({user, setUser}:{user:IUser | null, setUser:(user:IUser | ((user:string) => string)) => void}) {
  const [searchParams] = useSearchParams()
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
    const url = new URL('https://auth-server.kumnegerwondimu.repl.co/verify',)
    url.searchParams.append('token', token)
    url.searchParams.append('id', id)
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
