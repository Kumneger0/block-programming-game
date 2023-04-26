import styles from './dashboard.module.css';
import { useState, createContext } from 'react';
import Walk from '../candyQuest/walk';
import Jump from '../candyQuest/jump/jump';
import Repeat from '../candyQuest/reapt block/reapt';
import { flushSync } from 'react-dom';
import { UserButton } from '@clerk/clerk-react';
import Loading from '../../Loading/loading';

export interface ILevel {
  level: number | null;
  setLevel: (value: number | ((prv: number) => number)) => void;
}
export const levelcontext = createContext<Partial<ILevel>>({ level: null });

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(0);
  const [jumpOrWalk, setJumpOrWalk] = useState<'JUMP' | 'WALK' | null>(null);

  const playGame = async (level: number, jumpOrWalk: 'JUMP' | 'WALK') => {
    setIsLoading(true);
    flushSync(() => setLevel(level));
    setJumpOrWalk(jumpOrWalk);
    const loadingPromise = new Promise((res) => {
      setTimeout(() => {
        res(true);
        setIsLoading(false);
      }, 3000);
    });
    await loadingPromise;
  };

  return (
    <>
      {level ? (
        isLoading ? (
          <Loading />
        ) : (
          <levelcontext.Provider value={{ level, setLevel }}>
            {level === 3 ? (
              <Repeat />
            ) : jumpOrWalk === 'WALK' ? (
              <Walk />
            ) : (
              <Jump />
            )}
          </levelcontext.Provider>
        )
      ) : (
        <div className={`${styles.container} w-screen h-screen`}>
          <div className='fixed top-4 right-10'>
          </div>
          <div className={`w-4/5 mx-auto sm:w-11/12 flex mt-2 justify-between`}>
            <div className="flex gap-2">
              <div className="circle w-24 h-24 rounded-full bg-black sm:w-16 sm:h-16"></div>
              <div className="circle w-24 h-24 rounded-full bg-black sm:w-16 sm:h-16"></div>
              <div className="circle w-24 h-24 rounded-full bg-black sm:w-16 sm:h-16"></div>
            </div>
            <div>
              <UserButton />
            </div>
          </div>
          <div className="w-4/5 sm:w-11/12 flex justify-around mx-auto mt-4 items-center h-1/2 sm:flex-col sm:justify-center">
            <div>image</div>
            <div className="flex flex-col w-1/2 gap-2 items-end sm:items-center">
              <div className="w-1/2 text-center">Lessons</div>
              <button
                onClick={() => playGame(1, 'WALK')}
                className="bg-yellow-200 p-1 w-1/2 border-2 border-red-400 hover:bg-yellow-400"
              >
                level 1
              </button>
              <button
                onClick={() => playGame(2, 'JUMP')}
                className="bg-yellow-200 p-1 w-1/2 border-2 border-green-500 hover:bg-yellow-400"
              >
                level 2
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
