import './walk.css'
import  { DragEventHandler, useRef, useState, useContext, useEffect } from "react"
import { levelcontext } from '../dashboad'
import { ModalPart } from '../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}


function Walk() {
  const {level, setLevel} = useContext(levelcontext)
  const [isOpen, setIsOpen] = useState(false);
  const [Dots, setDots] = useState<any[]>([]);
  const [numberOfrequiredAnimation, setnumberOfrequiredAnimation] = useState<number>(2);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState< GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null)
  const gumRef = useRef<HTMLButtonElement>(null)
  const dragedItemRef = useRef<HTMLElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const destinationRef = useRef<HTMLDivElement>(null)
  const [deleteIndex, setDeleteIndex]  = useState<number>()
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [program, setProgram] = useState<Program[]>([{text:'onstart', style:null}]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameOver, setGameOver] = useState<boolean>(false)

  const  dragItems:DragEventHandler = (e)  => {
   //@ts-expect-error abc
    dragedItemRef.current = e.target
  }

  const handleDragOver:DragEventHandler = (e) => {
    e.preventDefault();
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (e.target.classList.contains('delete')){
       deleteRef.current?.classList.remove('invisible')
    }
  };

  const dropItem:DragEventHandler  = (e) => {
    e.preventDefault();
       if(dragedItemRef.current?.classList.contains('dragged')) return
        const text = dragedItemRef.current?.innerText as string
        const temp = [...program]
        temp.push({text, style:null})
        setProgram(temp)
    
  };

const deleteItem = () => {
  const temp = [...program].filter((_program, i) => i !== deleteIndex)
  setProgram(temp)
}
const startMoving = () => {
  program.forEach(async(program, i) => {
   const animation = emojiRef.current?.getAnimations()
   if(!animation?.length){
     if(i == 1){
       animate(i, false)
     }
     return
   }
   else{
    animation.map(animation => animation.finished.then(res => {
      if(i == 2){
        animate(i, true)
      }
    }))
   }
  })
}
let diffrence = 0
function animate(item :number, isLast:boolean) {
  const emojiDOMRect = emojiRef.current?.getBoundingClientRect()
  const childrens = gameAreaRef.current?.childNodes
  const destination = childrens[item].getBoundingClientRect()
   destinationRef.current = childrens[item];
  diffrence += destination.x - emojiDOMRect.x
   emojiRef.current?.animate([{transform:`translateX(${0})px`}, {transform:`translateX(${diffrence}px)`}], {
      duration: 1000,
      iterations: 1,
      fill:'forwards',
     })
    const currentEmojiDOMRect = emojiRef.current?.getBoundingClientRect()
    const animations = emojiRef.current?.getAnimations()
    if(animations?.length >= 2){
    animations[animations?.length - 1].finished.then(res=> {
      setTimeout(() => {
       gumRef.current.style.display = 'none'
       setTimeout(() => {
        setGameStatus({text:"you are seccussfully finished", type:'seccuss'})
          setIsOpen(true)
       }, 500)
      }, 500)
    })
    }

    if(numberOfrequiredAnimation > program.length -1){
    const  animations =  emojiRef.current?.getAnimations()
    animations?.map((animation) => animation.finished.then(res => {
      setGameStatus({text:"Try Connecting one or more walk blocks", type:'fail'})
      setIsOpen(true)
    }))
    }
}






useEffect(() => {
  if(level ==1){
    setDots([1, 2])
  }
  if(level == 2){
    setDots([1, 2, 3, 4])
    setnumberOfrequiredAnimation(4)
  }
}, [])

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
          <img src="public\image\walk.webp" alt="" className='w-full' />
        </button>
      </div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDrop={dropItem}
        className="w-28"
        style={{maxHeight:'500px', height:'300px', overflowY:'auto'}}
      >
       {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        program.map(({text}:{text:string, style:string | null}, i:number) => {
          return <div onDragStart={(e) => {
            deleteRef.current?.classList.remove('invisible')
            setDeleteIndex(i)
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               //@ts-ignore
            dragedItemRef.current = e.target
          }} draggable = {i !== 0 ? true : false}  key={i} className="w-24 -m-2 overflow-x-hidden dragged">
            {text == 'onstart' ? <img src="public\image\onstart.png" alt="" className='w-auto m-0 p-0' />  : <img src="public\image\walk.webp" alt="" className='w-auto m-0 p-0 dragged border-2 border-white' />}
          </div>
        })
       }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea">
          <div className='character'>
        <div onAnimationEnd={() => alert('animation end')} ref={emojiRef} className="w-24">
          <img src="public\image\ind.webp" alt="" className='w-full h-auto' />
        </div>
      </div>
      {Dots.length > 0 && Dots.map( () => <div className="dot w-6 h-6 rounded-full bg-black self-end"></div> )
    }
      <div className="w-1/2">
        <button ref={gumRef} className="border bg-red-400 -ml-16 gum">gum</button>
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

export default Walk;
