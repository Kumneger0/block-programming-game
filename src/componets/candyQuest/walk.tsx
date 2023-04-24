import './walk.css'
import  { DragEventHandler, useRef, useState, useContext, useEffect } from "react"
import { levelcontext } from '../dashboad'
import { ModalPart } from '../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'
import { flushSync } from 'react-dom'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}



const images = [
  "src\\images\\walking\\535ed2d984aafa0b43000085.webp",
  "src\\images\\walking\\535ed2d984aafa0443000074.webp",
  "src\\images\\walking\\535ed2d984aafa0643000072.webp",
  "src\\images\\walking\\535ed2d984aafaae4300004b.webp",
  "src\\images\\walking\\535ed2d984aafaf742000075.webp"
]


function Walk() {
  const {level, setLevel} = useContext(levelcontext)
  const [isOpen, setIsOpen] = useState(false);
  const blockesRef = useRef<HTMLDivElement[]>([])
  const [Dots, setDots] = useState<any[]>([]);
  const [numberOfrequiredAnimation, setnumberOfrequiredAnimation] = useState<number>(2);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState< GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>()
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
let initialEmojiDOMRect 
const startMoving = () => {
  initialEmojiDOMRect = emojiRef.current.getBoundingClientRect()
  program.forEach(async(program, i, arr) => {
   const animation = emojiRef.current?.getAnimations()
   if(!animation?.length){
     if(i == 1){
     blockesRef.current[i].childNodes[0].classList.add('border-2')
     flushSync(() => animate(i, false))  
     blockesRef.current[i].childNodes[0].classList.remove('border-2')
     }
     return
   }
   else{
    animation.map(animation => animation.finished.then(res => {
     addStyle(i, 'ADD')
     flushSync(() => animate(i, arr.length - 1 == i))
     addStyle(i, 'REMOVE')
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
   diffrence = destination.x - initialEmojiDOMRect.x
   console.log(diffrence)
   emojiRef.current?.animate([{transform:`translateX(${0})px`}, {transform:`translateX(${diffrence}px)`}], {
      duration: 1000 * item,
      iterations: 1,
      fill:'forwards',
     })
     addStyle(item, 'ADD')
    const currentEmojiDOMRect = emojiRef.current?.getBoundingClientRect()
    const animations = emojiRef.current?.getAnimations()
    let isActive = false
    animations?.forEach(async(animation, i) => {
      if(!i) return
      if(isActive) await animation.finished;
    })
    if(animations?.length >= 2){
    animations[animations?.length - 1].finished.then(res=> {
      setTimeout(() => {
       gumRef.current.style.display = 'none'
       setTimeout(() => {
        setGameStatus({text:"you are seccussfully finished", type:'seccuss'})
          setIsOpen(true)
       }, 1000)
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
    emojiRef.current?.getAnimations().forEach((animation, i) => {
      let interval = setInterval(() => {
        if(!imageRef.current?.src) return
        imageRef.current.src = images[Math.floor(Math.random() * images.length)]
      }, 200)
       animation.finished(() => {
        clearInterval(interval)
       })
    })
}

const addStyle = (index:number, status:'ADD' | 'REMOVE') => {
  console.log(index, 'index', )
if(status == 'ADD'){
  const childs = blockesRef.current[index].childNodes[0]
  childs.classList.add('border-2')
  return true
}
  const childs = blockesRef.current[index].childNodes[0]
  childs.classList.remove('border-2')
  return false
}
useEffect(() => {
  if(level ==1){
    setDots([1, 2])
  }
  if(level == 2){
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
          return <div ref={(el) => blockesRef.current[i] = el} onDragStart={(e) => {
            deleteRef.current?.classList.remove('invisible')
            setDeleteIndex(i)
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               //@ts-ignore
            dragedItemRef.current = e.target
          }} draggable = {i !== 0 ? true : false}  key={i} className="w-24 -m-2 overflow-x-hidden dragged">
            {text == 'onstart' ? <img src="public\image\onstart.png" alt="" className='w-auto m-0 p-0' />  : <img src="public\image\walk.webp" alt="" className='w-auto m-0 p-0 dragged  border-white' />}
          </div>
        })
       }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea">
          <div className='character'>
        <div onAnimationEnd={() => alert('animation end')} ref={emojiRef} className="w-24">
          <img ref={imageRef} src="src\images\walking\index.webp" alt="" className='w-full h-auto' />
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
