import styles from './dashboard.module.css';
import { useState, createContext } from 'react';
import Walk from '../candyQuest/walk';
import dashboardImage from '../../assets/image/Z.webp'
import dashboardImage2 from '../../assets/image/z2.webp'
import dashboardImage3 from '../../assets/image/9k2.webp'
import dashboardImg from '../../assets/image/dashboardImg.webp'
import Jump from '../candyQuest/jump/jump';
import Repeat from '../candyQuest/reapt block/reapt';
import { flushSync } from 'react-dom';
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
              <div className="circle w-24 h-24 rounded-full ">
                <img src={dashboardImage} alt="" className='w-36 h-auto rounded-full' />
              </div>
              <div className="circle w-24 h-24 rounded-full ">
              <img src={dashboardImage2} alt="" className='w-36 h-auto rounded-full' />

              </div>
              <div className="circle w-24 h-24 rounded-full ">
              <img src={dashboardImage3} alt="" className='w-36 h-auto rounded-full' />
              </div>
            </div>
            <div>
              test
            </div>
          </div>
          <div className="w-4/5 sm:w-11/12 flex justify-around mx-auto mt-4 items-center h-1/2 sm:flex-col sm:justify-center">
            <div className='md:w-1/2 mt-3'>
              <img className='w-4/5 mx-auto' src={dashboardImg} alt="" />
            </div>
            <div className="flex flex-col w-1/2 gap-2 items-end sm:items-center">
              <div className="w-1/2 text-center">Lessons</div>
              <button
                onClick={() => playGame(1, 'WALK')}
                className="bg-yellow-200 p-1 w-1/2 border-2 border-red-400 hover:bg-yellow-400"
              >
                3 Lessons 
              </button>
              <button
                onClick={() => playGame(2, 'JUMP')}
                className="bg-yellow-200 p-1 w-1/2 border-2 border-green-500 hover:bg-yellow-400"
              >
                1 Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
