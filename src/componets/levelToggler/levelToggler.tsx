import { toast } from 'react-toastify';
import { levelcontext } from '../dashboad';
import { useContext } from 'react';
import { flushSync } from 'react-dom';
function LevelToggler({jumpOrWalk}:{
  jumpOrWalk: "JUMP" | "WALK"
}) {
  const { level, setLevel, setJumpOrWalk } = useContext(levelcontext);
  return (
    <div className="w-1/3 flex gap-4 justify-start">
      <div>
        <button
          onClick={() => {
            flushSync(() =>{  
              setLevel && setLevel(0)
              setJumpOrWalk && setJumpOrWalk(jumpOrWalk)
            })
            setLevel && setLevel(() => 1)
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
          onClick={() => {
            const levelStatus = JSON.parse(
              localStorage.getItem('level-status') as string,
            );
            if (!levelStatus?.completed?.includes(1)) {
              toast.error('You need to complete the level 1 to play level 2', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              });
              return;
            }

            flushSync(() =>{  
              setLevel && setLevel(0)
              setJumpOrWalk && setJumpOrWalk(jumpOrWalk)
            })
            setLevel && setLevel(() => 2);
          }}
          className={`rounded-full ${
            level == 2 ? 'bg-slate-700 text-white' : 'bg-white'
          }  p-1 w-7 h-7`}
        >
          2
        </button>
      </div>
      <div>{jumpOrWalk == "WALK" && 
        <button
          onClick={() => {
            const levelStatus = JSON.parse(
              localStorage.getItem('level-status') as string,
            );
            if (!levelStatus?.completed?.includes(2)) {
              toast.error('You need to complete the level 2 to play level 3', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              });
              return;
            }
            flushSync(() =>{  
              setLevel && setLevel(0)
              setJumpOrWalk && setJumpOrWalk(jumpOrWalk)
            })
             setLevel && setLevel(() => 3)
          }}
          className={`rounded-full ${
            level == 3 ? 'bg-slate-700 text-white' : 'bg-white'
          }  p-1 w-7 h-7`}
        >
          3
        </button>
}</div>
    </div>
  );
}

export default LevelToggler;
