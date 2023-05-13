import { toast } from 'react-toastify';
import { levelcontext } from '../dashboad';
import { useContext } from 'react';
import { flushSync } from 'react-dom';
function LevelToggler({ jumpOrWalk }: { jumpOrWalk: 'JUMP' | 'WALK' }) {
  function showToast(mesg: string) {
    toast.error(mesg, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }

  function checkLevelCompletion(levelStatusKey: string) {
    const localStorageKey =
      jumpOrWalk == 'JUMP' ? 'level-status-jump' : 'level-status';
    const levelStatus =
      JSON.parse(localStorage.getItem(localStorageKey) as string) || {};

    return levelStatus[levelStatusKey]?.includes(1);
  }

  function setNextLevel(nextLevel: number) {
    flushSync(() => {
      setLevel && setLevel(0);
      setJumpOrWalk && setJumpOrWalk(jumpOrWalk);
    });

    setLevel && setLevel(() => nextLevel);
  }

  function onClickHandler(nextLevel: number) {
    const levelStatusKey =
      jumpOrWalk === 'JUMP' ? 'completedJUMP' : 'completed';

    const levelCompletionStatus = checkLevelCompletion(levelStatusKey);
    if (!levelCompletionStatus) {
      showToast('You need to complete the level 1 to play level 2');
      return;
    }
    setNextLevel(nextLevel);
  }

  const { level, setLevel, setJumpOrWalk } = useContext(levelcontext);
  return (
    <div className="w-1/3 flex gap-4 justify-start">
      <div>
        <button
          onClick={() => {
            flushSync(() => {
              setLevel && setLevel(0);
              setJumpOrWalk && setJumpOrWalk(jumpOrWalk);
            });
            setLevel && setLevel(() => 1);
          }}
          className={`rounded-full ${
            level == 1 ? 'bg-slate-700 text-white' : 'bg-white'
          }  p-1 w-7 h-7`}
        >
          1
        </button>
      </div>
      <div>
        <button
          onClick={() => onClickHandler(2)}
          className={`rounded-full ${
            level == 2 ? 'bg-slate-700 text-white' : 'bg-white'
          }  p-1 w-7 h-7`}
        >
          2
        </button>
      </div>
      <div>
        {jumpOrWalk == 'WALK' && (
          <button
            onClick={() => {
              const levelStatus = JSON.parse(
                localStorage.getItem('level-status') as string,
              );
              if (!levelStatus?.completed?.includes(2)) {
                showToast('You need to complete the level 2 to play level 3');
                return;
              }
              flushSync(() => {
                setLevel && setLevel(0);
                setJumpOrWalk && setJumpOrWalk(jumpOrWalk);
              });
              setLevel && setLevel(() => 3);
            }}
            className={`rounded-full ${
              level == 3 ? 'bg-slate-700 text-white' : 'bg-white'
            }  p-1 w-7 h-7`}
          >
            3
          </button>
        )}
      </div>
    </div>
  );
}

export default LevelToggler;
