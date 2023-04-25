// import './walk.css'
import onstart from '../../../assets/image/onstart.png'
import gum from   '../../../assets/image/54650f8684aafa0d7d00004c.webp'
import walk from '../../../assets/image/walk.webp'
import repeat from '../../../assets/image/reaptblock4.png'
import repeatWithWalk from '../../../assets/image/reaptblock4withwalk.png'
import {flushSync} from 'react-dom'
import emoji from '../../../assets/images/walking/index.webp'
import shadow from '../../../assets/image/535805e584aafa4e55000016.webp'
import  { DragEventHandler, useRef, useState, useContext, useEffect, LegacyRef } from "react"
import { levelcontext } from '../../dashboad'
import { ModalPart } from '../../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'

type Program = { text: string; style: string | null, isWalkAdded: boolean}
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}
const eating = await import.meta.glob('../../../assets/Eating/*')
const allimages =  await import.meta.glob('../../../assets/images/walking/*')

const imagesEating:string[] = []
const images:string[] = []


Object.keys(eating).forEach(key => {
  eating[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    imagesEating.push(path)
  })
})

Object.keys(allimages).forEach(key => {
  allimages[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    images.push(path)
  })
})


function Repeat() {
const {level } = useContext(levelcontext)
const [item, setItem] = useState<'reaptblock4' | 'walk' | null>(null)
  const [isOpen, setIsOpen] = useState(false);
  const blockesRef = useRef<HTMLDivElement[]>([])
  const [Dots, setDots] = useState<number[]>([]);
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState< GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const gumRef = useRef<HTMLButtonElement>(null)
  const dragedItemRef = useRef<HTMLElement | null>(null);
  const deleteRef = useRef<HTMLDivElement>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [deleteIndex, setDeleteIndex]  = useState<number>()
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [program, setProgram] = useState<Program[]>([{text:'onstart', style:null, isWalkAdded:false}]);
  const  dragItems:DragEventHandler = (e)  => {
    dragedItemRef.current = e.target as HTMLElement
    const element = e.target as HTMLImageElement
    const blockName = element.src.split('/').slice(-1)[0].split(".")[0] as 'reaptblock4' | 'walk'
    console.log(blockName)
    flushSync(() => setItem(blockName))
    dragedItemRef.current = e.target as HTMLElement
  }

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault()
  };
  
  useEffect(() => {
   if(gameStatus.type == 'fail'){
    setIsOpen(true)
   }
  }, [gameStatus.type, gameStatus.text])

 const dropItem: DragEventHandler = (e) => {
  e.preventDefault();

  if (dragedItemRef.current?.classList.contains('dragged')) return;

  const temp = [...program];

  const lastItem = temp[temp.length - 1];
  const isLastItemWalkRelated =
    lastItem.text === "onstart" || lastItem.text === "walk";

  if (item === "walk" && !lastItem.isWalkAdded && !isLastItemWalkRelated) {
    if (lastItem.text === "reaptblock4" && !lastItem.isWalkAdded) {
      lastItem.isWalkAdded = true;
      setProgram(temp);
      return;
    }
  }

  temp.push({ text: item as string, style: null, isWalkAdded: false });
  setProgram(temp);
};

const deleteItem = () => {
  const temp = [...program].filter((_program, i) => i !== deleteIndex)
  setProgram(temp)
}
function startMoving() {
    const childs = gameAreaRef.current?.childNodes as NodeListOf<HTMLElement>;
    const isReadyToStart = isProperlyAdded();
  
    if (isReadyToStart?.isTrue) {
      const targetRect = childs[childs.length - 2].getBoundingClientRect().x;
      const adjustment = isReadyToStart.idx ? 100 : -40;
      if (emojiRef.current) {
        const difference = targetRect - emojiRef.current.getBoundingClientRect().x;
        applyAnimation(difference + adjustment, 2000, !isReadyToStart.idx);
      }
    } else {
      const emojiDOMrect = emojiRef.current?.getBoundingClientRect().x as number;
      const destination = childs[program.length - 2].getBoundingClientRect().x;
      const difference = destination - emojiDOMrect;
      applyAnimation(difference + 50, 2000, false);
    }
  }
  
  function isProperlyAdded() {
    const isRepeatAvail: { isTrue: boolean; idx: number | null } = {
      isTrue: false,
      idx: null,
    };
    program.forEach((program, idx) => {
      if (program.text == "reaptblock4" && program.isWalkAdded) {
        isRepeatAvail.isTrue = true;
        isRepeatAvail.idx = idx;
      }
    });
  
    const isProper =
      program[program.length - 1].text == "reaptblock4" &&
      program[program.length - 1].isWalkAdded &&
      program.length == 2;
    if (isProper) return { isTrue: true, idx: 0 };
    if (isRepeatAvail.isTrue) return isRepeatAvail;
  }
  
function applyAnimation(diffrence: number, duration: number, isLast: boolean) {
  emojiRef.current?.animate([{ transform: `translateX(${0})` }, { transform: `translateX(${diffrence}px)` }], { duration, fill: 'forwards' });

  emojiRef.current?.getAnimations().forEach(animation => {
    let idx = 0;
    const interval1 = setInterval(() => {
      if (images.length - 1 <= idx) {
        idx = 0;
      }
      ++idx;
      if (imageRef.current === null) return;

      imageRef.current.src = images[idx];
    }, 100);

    animation.finished.then(() => {
      clearInterval(interval1);
       handleAnimationEnd(isLast)
    });
  });
}

function handleAnimationEnd(isLast: boolean) {
  if (isLast) {
    setTimeout(() => {
        if(gumRef.current !== null){
            gumRef.current.style.display = 'none';
        }
        setTimeout(() => {
         setGameStatus({ text: 'you are finished', type: 'seccuss' });
        }, 500)
      }, 500)
  } else {
    setGameStatus({ text: 'you are failed', type: 'fail' });
  }
  setIsOpen(true);
}


useEffect(() => {
  if(level == 3){
    setDots([1, 2, 3, 4])
  }
}, [level])

  return (
    <div className='w-screen playArea h-screen' onDragOver={(e) => e.preventDefault()} onDrop={() => deleteRef.current?.classList.add('invisible')}>

      {gameStatus.text && <ModalPart isOpen={isOpen} onClose={closeModal} gameStatus={gameStatus} /> }
    <div className="w-4/5 h-auto flex mx-auto flex-wrap justify-center responsive">
      <div ref={deleteRef}  onDrop = {deleteItem} onDragOver={handleDragOver} className="delete w-48 h-full bg-slate-50 absolute left-0 flex justify-center items-center invisible">
        <div className='w-9'>
            <RiDeleteBinFill className = 'w-full h-auto' />
        </div>
      </div>
      <div ref={dragItemsParent} className="w-1/2 justify-self-start">
      <button
          draggable={true}
          onDragStart={dragItems}
          className="w-20"
        >
          <img src={walk} alt="" className='w-full' />
        </button>
        <button  draggable={true}
          onDragStart={dragItems}
          className="w-20">
        <img src={repeat} alt="" />
        </button>
      </div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDrop={dropItem}
        className="w-28"
        style={{maxHeight:'500px', height:'300px', overflowY:'auto'}}
      >{
        program.map(({ text, isWalkAdded }, i) => (
            <ProgramBlock
              text={text}
              isWalkAdded={isWalkAdded}
              index={i}
              blockRef={(el: HTMLDivElement) => (blockesRef.current[i] = el!)}
              onDragStart={(e: React.DragEvent) => {
                deleteRef.current?.classList.remove('invisible');
                setDeleteIndex(i);
                dragedItemRef.current = e.target as HTMLElement;
              }}
            />
          )) 
          }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea">
          <div className='character'>
        <div ref={emojiRef} className="w-24 -mt-4">
          <img ref={imageRef} src={emoji} alt="" className='w-full h-auto' />
        </div>
      </div>
      {Dots.length > 0 && Dots.map((_dot, i) => <div key={i} className="dot w-6 h-6 rounded-full self-end">
        <img src={shadow} alt="" />
      </div> )
    }
      <div className="w-1/2">
        <button ref={gumRef} className='w-8 h-8 -ml-16 sm:-ml-12 z-10'>
          <img src={gum} alt="" />
        </button>
      </div>
      </div>
    <div className="playBTN fixed bottom-0 right-24 w-9 p-8">
      <div role='button' onClick={startMoving} className='playBtn w-full hover:cursor-pointer'>
        <AiOutlinePlayCircle className='w-24 h-24 '  />
      </div>
    </div>
    </div>
  );
}

export default Repeat;

interface IProgram {
    text:string
    isWalkAdded:boolean
    index:number,
    blockRef:LegacyRef<HTMLDivElement>
    onDragStart:DragEventHandler
}

const ProgramBlock = ({ text, isWalkAdded, index, blockRef, onDragStart }:IProgram) => {
  const getImageSource = () => {
    if (text === 'onstart') {
      return onstart;
    } else if (text === 'reaptblock4' && isWalkAdded) {
      return repeatWithWalk;
    } else if (text === 'walk') {
      return walk;
    } else {
      return repeat;
    }
  };

  return (
    <div
      ref={blockRef}
      onDragStart={onDragStart}
      draggable={index !== 0}
      key={index}
      className="w-24 -m-2 overflow-x-hidden dragged"
    >
      <img src={getImageSource()} alt="" className="w-auto m-0 p-0 dragged border-white" />
    </div>
  );
};