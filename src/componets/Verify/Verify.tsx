import {useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
let shouldReturn = false;

export default function Verify() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)
  useEffect(() => {
  const token = searchParams.get('token')
   const id = searchParams.get('id')
   if(token && id && !shouldReturn){
     verifyUser(token, id)
     console.log('hafkljal')
     shouldReturn = true
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
    console.log(data)
    if(data.status == 200){
      setSuccess(true)
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.token)
      return
    } 
    if(success) return
    console.log('excuted')
      setSuccess(false)
  
}
  return (
    <div>
        <h1>Verify</h1>
        {success && <div>
          <h2>You have successfully verified your account</h2>
          <a href="/">back to home page</a>
          </div>}
        {!success && <h2>failed to verify your account</h2>}
    </div>
  )
}
