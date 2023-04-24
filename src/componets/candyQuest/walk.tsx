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
import { flushSync } from 'react-dom'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}
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
    if(gameAreaRef.current){
      const childrens = gameAreaRef.current.childNodes as  NodeListOf<HTMLElement>
      const targetPlace = childrens[childrens.length - 2].getBoundingClientRect()
     setGumPosition({top: targetPlace.top, left: targetPlace.left})
    }
  }, [])

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
let initialEmojiDOMRect: DOMRect 
const startMoving = () => {
  if(emojiRef.current !== null){
   initialEmojiDOMRect = emojiRef.current.getBoundingClientRect()
  }
  program.forEach(async(_program, i) => {
   const animation = emojiRef.current?.getAnimations()
   if(!animation?.length){
     if(i == 1){
     flushSync(() => animate(i))  
     }
     return
   }
   else{
    animation.map(animation => animation.finished.then(() => {
     addStyle(i, 'ADD')
     flushSync(() => animate(i))
     addStyle(i, 'REMOVE')
    }))
   }
  })
}
let diffrence = 0
function animate(item :number) {
  const childrens = gameAreaRef.current?.childNodes as NodeListOf<Element>
  const destination = childrens[item].getBoundingClientRect()
   destinationRef.current = childrens[item] as HTMLDivElement;
   diffrence = destination.x - initialEmojiDOMRect.x
   emojiRef.current?.animate([{transform:`translateX(${0})px`}, {transform:`translateX(${diffrence}px)`}], {
      duration: 1000 * item,
      iterations: 1,
      fill:'forwards',
     })
     addStyle(item, 'ADD')
    const animations = emojiRef.current?.getAnimations() as Animation[]
    const isActive = false
    animations?.forEach(async(animation, i) => {
      if(!i) return
      if(isActive) await animation.finished;
    })
    const animeLength = animations?.length ?? 0
    if(animeLength >= 2){
    animations[animeLength - 1].finished.then(() => {
      setTimeout(() => {
        if(gumRef.current !== null){
          gumRef.current.style.display = 'none'
          setTimeout(() => {
           setGameStatus({text:"you are seccussfully finished", type:'seccuss'})
             setIsOpen(true)
          }, 1000)
        }
      }, 500)
    })
    }

    if(numberOfrequiredAnimation > program.length -1){
    const  animations =  emojiRef.current?.getAnimations()
    animations?.map((animation) => animation.finished.then(() => {
      setGameStatus({text:"Try Connecting one or more walk blocks", type:'fail'})
      setIsOpen(true)
    }))
    }
    emojiRef.current?.getAnimations().forEach((animation) => {
      let idx = 0
      const interval = setInterval(() => {    
        if(idx < images.length){
          ++idx
        }
        else{
          idx = 0
        }
        if(!imageRef.current?.src) return
        imageRef.current.src = images[idx]
      }, 200)
       animation.finished.then(() => {
        clearInterval(interval)
       })
    })
}

const addStyle = (index:number, status:'ADD' | 'REMOVE') => {
if(status == 'ADD'){
  const childs = blockesRef.current[index].childNodes[0] as HTMLImageElement
  childs.classList.add('border-2')
  return true
}
  const childs = blockesRef.current[index].childNodes[0] as HTMLImageElement
  childs.classList.remove('border-2')
  return false
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
