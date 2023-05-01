import './App.css'
import {useState}from 'react'
import Header from './componets/header/header';
import Auth from './componets/Auth';
import Dashboard from './componets/dashboad';
import {Routes, Route} from 'react-router-dom'
import { createContext} from 'react';
import Verify from './componets/Verify/Verify';
import {useEffect} from 'react'


export interface IUser {
  user:{email:string} | null
  setUser?:(user:{email:string} | ((user:string) => string)) => void
} 

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<IUser>({user:null})
function App(): JSX.Element {
  const [user, setUser] = useState<{email:string} | null>(null)
  useEffect(() => {
   const token = localStorage.getItem('token')
   if (token) {
    (async() => {
    const url = new URL('https://auth-server.kumnegerwondimu.repl.co/verifyToken')
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
  { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
     {/*@ts-ignore */}
    <Route path="/" element={<userContext.Provider value={{user, setUser}}>
    {user ? <Dashboard/> : <Auth />}
    </userContext.Provider>} /> 
    { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
     {/*@ts-ignore */}
    <Route path="/verify" element = {<Verify user = {user} setUser = {setUser} />} />
  </Routes>
  </>
}

export default App;
