import './App.css'
import Header from './componets/header/header';
import Auth from './componets/Auth';
import Dashboard from './componets/dashboad';
import {useUser} from "@clerk/clerk-react";

import { createContext } from 'react';

export type User = Awaited<ReturnType<typeof useUser>>

export interface IUser {
  user:User | null
  setUser?:(user:User | ((user:User) => User)) => void
} 

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<IUser>({user:null})
function App(): JSX.Element {
  const user = useUser()

  return <>
  <userContext.Provider value={{user}}>
    <Header />
    {user ? <Dashboard /> : <Auth />}
  </userContext.Provider>
  </>
}

export default App;
