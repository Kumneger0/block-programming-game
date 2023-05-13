import './App.css'
import {useState}from 'react'
import Header from './componets/header/header';
import Auth from './componets/Auth';
import Dashboard from './componets/dashboad';
import {Routes, Route} from 'react-router-dom'
import { createContext} from 'react';
import Verify from './componets/Verify/Verify';
import {useEffect} from 'react'

export type User = {
  email: string
}

export interface IUser {
  user:{email:string} | null
  setUser?:(user:User) => void
} 
export const userContext = createContext<IUser>({user:null})
function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
   const token = localStorage.getItem('token')
   if (token) {
    (async() => {
    const url = new URL('https://server-rtdf.onrender.com/verifyToken')
    url.searchParams.append('token', token)
     const response = await fetch(url.href)
     const data = await response.json()
     if(data.responce.email){
      setUser({email: data.responce.email})
     }
    })()
   }
  }, [])
  return <>
  <Header/>
  <Routes>
    <Route path="/" element={<userContext.Provider value={{user, setUser}}>
    {user ? <Dashboard/> : <Auth />}
    </userContext.Provider>} /> 
    <Route path="/verify" element = {<Verify user = {user} setUser = {setUser} />} />
  </Routes>
  </>
}

export default App;
