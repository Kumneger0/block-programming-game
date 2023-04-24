import './walk.css'
import onstart from '../../assets/image/onstart.png'
import gum from   '../../assets/image/54650f8684aafa0d7d00004c.webp'
import walk from '../../assets/image/walk.webp'
import emoji from '../../assets/images/walking/index.webp'
import shadow from '../../assets/image/535805e584aafa4e55000016.webp'
import  { DragEventHandler, useRef, useState, useContext, useEffect } from "react"
import { levelcontext } from '../dashboad'
import { ModalPart } from '../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}
const eating = import.meta.glob('../../assets/Eating/*')
const imagesEating:string[] = []
Object.keys(eating).forEach(key => {
  eating[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    imagesEating.push(path)
  })
})

const allimages = import.meta.glob('../../assets/images/walking/*')
const images:string[] = []
Object.keys(allimages).forEach(key => {
  allimages[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    images.push(path)
  })
})

function Walk() {
  const {level } = useContext(levelcontext)
  const [isOpen, setIsOpen] = useState(false);
  const blockesRef = useRef<HTMLDivElement[]>([])
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [gumPosition, setGumPosition] = useState<{top:number | null, left:number | null}>({top:null, left:null})
  const [Dots, setDots] = useState<number[]>([]);
  const [numberOfrequiredAnimation, setnumberOfrequiredAnimation] = useState<number>(2);
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState< GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const gumRef = useRef<HTMLButtonElement>(null)
  const dragedItemRef = useRef<HTMLElement | null>(null);
  const deleteRef = useRef<HTMLDivElement>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const destinationRef = useRef<HTMLDivElement | null>(null)
  const [deleteIndex, setDeleteIndex]  = useState<number>()
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [program, setProgram] = useState<Program[]>([{text:'onstart', style:null}]);
  const  dragItems:DragEventHandler = (e)  => {
    dragedItemRef.current = e.target as HTMLElement
  }

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('delete')) {
      deleteRef.current?.classList.remove('invisible');
    }
  };
  
  useEffect(() => {
   if(gameStatus.type == 'fail'){
    setIsOpen(true)
   }
  }, [gameStatus.type, gameStatus.text])

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

const targetNodePostions:{ele:number, x:number}[] = [];
function startMoving(){
  if(program.length <= 1) return
  const childs = gameAreaRef.current?.childNodes as NodeListOf<HTMLElement>
  const targetRect = childs[numberOfrequiredAnimation].getBoundingClientRect().x
  
  childs.forEach((child, i) => {
    if(i == 0) return
    targetNodePostions.push({ele:i, x:child.getBoundingClientRect().x})
  })
  const emojiDOMRECT = emojiRef.current?.getBoundingClientRect() as  DOMRect
  const destination = childs[program.length - 1].getBoundingClientRect()
  const diffrence = destination.x - emojiDOMRECT.x
  console.log(targetRect - emojiDOMRECT.x, diffrence)
  if((targetRect - emojiDOMRECT.x) == diffrence){
     applyAnimation(diffrence - 30, 2000)
     return
  }
  applyAnimation(diffrence - 30, 1000)
}


function applyAnimation(diffrence:number, duration:number){
  emojiRef.current?.animate([{transform: `translateX(${0})`}, {transform: `translateX(${diffrence}px)`}],{duration, fill:'forwards'})
  emojiRef.current?.getAnimations().forEach(animation => {
    let idx = 0
   const interval1 = setInterval(() => {
    if(images.length - 1 <= idx){
      idx = 0
    }
    ++idx 
   if(imageRef.current === null) return
   
   imageRef.current.src = images[idx]
    }, 100)
    animation.finished.then(() =>{
      clearInterval(interval1)
      let idx = 0 
      const interval = setInterval(() => {
          if(imagesEating.length <= idx){
            idx = 0
          }
          ++idx
         if(imageRef.current === null) return
          imageRef.current.src = imagesEating[idx]
      }, 100)
      setTimeout(() => clearInterval(interval),300)
    })
  })
}

useEffect(() => {
  if(level ==1){
    setDots([1, 2])
  }
  if(level == 2){
    setDots([1, 2, 3, 4])
    setnumberOfrequiredAnimation(4)
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
      </div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDrop={dropItem}
        className="w-28"
        style={{maxHeight:'500px', height:'300px', overflowY:'auto'}}
      >
       {
        program.map(({text}:{text:string, style:string | null}, i:number) => {
          return <div ref={(el) => blockesRef.current[i] = el!} onDragStart={(e) => {
            deleteRef.current?.classList.remove('invisible')
            setDeleteIndex(i)
            dragedItemRef.current = e.target as HTMLElement
          }} draggable = {i !== 0 ? true : false}  key={i} className="w-24 -m-2 overflow-x-hidden dragged">
            {text == 'onstart' ? <img src={onstart} alt="" className='w-auto m-0 p-0' />  : <img src={walk} alt="" className='w-auto m-0 p-0 dragged  border-white' />}
          </div>
        })
       }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea">
          <div className='character'>
        <div ref={emojiRef} className="w-24">
          <img ref={imageRef} src={emoji} alt="" className='w-full h-auto' />
        </div>
      </div>
      {Dots.length > 0 && Dots.map((dot, i) => <div key={i} className="dot w-6 h-6 rounded-full self-end">
        <img src={shadow} alt="" />
      </div> )
    }
      <div className="w-1/2">
        <button ref={gumRef} className='w-8 h-8 -ml-16 sm:-ml-12'>
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

export default Walk;
