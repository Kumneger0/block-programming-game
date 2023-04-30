import  { useContext} from 'react';
import type { ILevel } from '../dashboad';
import { flushSync } from 'react-dom';
import { levelcontext } from '../dashboad';
import type { GameStatus } from '../candyQuest/walk';

export const ModalPart = ({ isOpen, onClose, gameStatus, shouldDisplayNext }:{
isOpen: boolean
onClose:() => void;
gameStatus:GameStatus;
shouldDisplayNext?: boolean;
}) => {

  
  const {level, setLevel} = useContext<Partial<ILevel>>(levelcontext)

if (!isOpen) return null;

const closeAndReplay = () => {
  flushSync(() => setLevel && setLevel(0))
  setLevel && setLevel(() => level as number)
  onClose()
}

const loadNextLesson = () => {
  flushSync(() => setLevel && setLevel(prv => {
    return prv - 1
  }))
 setLevel && setLevel((prv:number) => prv + 2)
  onClose()
}
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-bold mb-4">{gameStatus.type == 'seccuss' ? 'successfully finished' : 'OOPS'}</h2>
            <p className="mb-4">{gameStatus.text}</p>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              onClick={closeAndReplay}
            >
              replay
            </button>
            {gameStatus.type == 'seccuss' && level && level !== 3 &&  shouldDisplayNext &&
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ml-4"
              onClick={loadNextLesson}
            >
              next lessons
            </button>
}
          </div>
        </div>
      </div>
    </div>
  );
};






