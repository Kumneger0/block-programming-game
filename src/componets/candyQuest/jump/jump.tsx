import './jump.css'
import onstart from '../../../assets/image/onstart.png'
import jump from   '../../../assets/image/jump.png'
import obstackle from '../../../assets/image/obstackle.webp'
import gum from   '../../../assets/image/54650f8684aafa0d7d00004c.webp'
import walk from '../../../assets/image/walk.webp'
import emoji from '../../../assets/images/walking/index.webp'
import shadow from '../../../assets/image/535805e584aafa4e55000016.webp'
import  { DragEventHandler, useRef, useState, useEffect } from "react"
import { ModalPart } from '../../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'
import { flushSync } from 'react-dom'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}
const eating = import.meta.glob('../../../assets/Eating/*')
const imagesEating:string[] = []
Object.keys(eating).forEach(key => {
  eating[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    imagesEating.push(path)
  })
})

const allimages = import.meta.glob('../../../assets/images/walking/*')
const images:string[] = []
Object.keys(allimages).forEach(key => {
  allimages[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    images.push(path)
  })
})

function Jump():JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const blockesRef = useRef<HTMLDivElement[]>([])
  const [Dots, setDots] = useState<number[]>([]);
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const [item, setItem] = useState<'jump' | 'walk' | null>(null)
  const gumRef = useRef<HTMLButtonElement>(null)
  const dragedItemRef = useRef<HTMLElement | null>(null);
  const deleteRef = useRef<HTMLDivElement>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [deleteIndex, setDeleteIndex]  = useState<number>()
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [program, setProgram] = useState<Program[]>([{text:'onstart', style:null}]);
  const  dragItems:DragEventHandler = (e)  => {
    const element = e.target as HTMLImageElement
    const blockName = element.src.split('/').slice(-1)[0].split(".")[0] as 'jump' | 'walk'
    console.log(blockName)
    flushSync(() => setItem(blockName))
    dragedItemRef.current = e.target as HTMLElement
  }

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('delete')) {
      deleteRef.current?.classList.remove('invisible');
    }
  };
  

  const dropItem:DragEventHandler  = (e) => {
    e.preventDefault();
       if(dragedItemRef.current?.classList.contains('dragged')) return
        const temp = [...program]
        temp.push({text:item as string, style:null})
        setProgram(temp)
  };

const deleteItem = () => {
  const temp = [...program].filter((_program, i) => i !== deleteIndex)
  setProgram(temp)
}

function startMoving(){
let emojiPosition = 0
if(emojiRef.current){
 emojiPosition = emojiRef.current.getBoundingClientRect().x
}
 const childs = gameAreaRef.current?.childNodes as NodeListOf<HTMLElement>
 const jumpIndex:number[] = []
 const walkIndex:number[] = []
 program.forEach(({text}:{text:string}, i) => {
    if(i > 4)return
    if(text === 'jump'){
      jumpIndex.push(i)
    }
    if(text === 'walk'){
      walkIndex.push(i)
    }
 }) 
 const jumpingPostions:{x:number, isJump:boolean}[] = []
 const walkingPostions:{x:number, isJump:boolean}[] = []
 childs.forEach((child, i) => {
  if(jumpIndex.includes(i)){
    jumpingPostions.push({x:child.getBoundingClientRect().x - emojiPosition, isJump:true})
  }
  if(walkIndex.includes(i)){
   walkingPostions.push({x:child.getBoundingClientRect().x - emojiPosition, isJump:false})
  }
 })
 const animationPosition = [...jumpingPostions, ...walkingPostions].sort((a, b) => a.x - b.x)
 console.log(animationPosition)
  const keyFrames = [
    {transform:`translate(0, 0)`}
  ]
   animationPosition.forEach(({x, isJump}, i, arr) => {
   if(isJump){
    const prv = arr[i-1]?.x
    console.log(prv)
    const transform = {transform:`translate(${prv - 50}, -50px)`}
    const transform2 = {transform:`translate(${prv + 50}px, -50px)`}
    const transform3 = {transform:`translate(${prv + 50}px, 0)`}
    keyFrames.push(transform)
    keyFrames.push(transform2)
    keyFrames.push(transform3)
   }
   if(!isJump){
    const px = i == arr.length - 1 ? x : x - 100
    const transform = {transform:`translate(${px}px)`}
    keyFrames.push(transform)
   }
  })
  console.log(keyFrames)
 applyAnimation(keyFrames)
}

function applyAnimation(keyFrames:Keyframe[]){
    emojiRef.current?.animate(keyFrames, {duration: 5000, fill: 'forwards'})
  emojiRef.current?.getAnimations().forEach(animation => {
    let index = 0
    const interval = setInterval(() => {
      if(images.length <= index) {
         index = -1
      }
      ++index
      if(!imageRef.current) return
      imageRef.current.src = images[index]
    }, 200)
    animation.finished.then(() => {
      clearInterval(interval)
    })
  })
}

useEffect(() => {
    setDots([1, 2, 3, 4])
}, [])

  return (
    <div className='w-screen playArea h-screen' onDragOver={(e) => e.preventDefault()} onDrop={() => deleteRef.current?.classList.add('invisible')}>

      {gameStatus.text && <ModalPart isOpen={isOpen} onClose={closeModal} gameStatus={gameStatus} /> }
    <div className="w-4/5 h-auto flex mx-auto flex-wrap justify-center responsive md:w-full">
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
        <img src={jump} alt="" />
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
            {text == 'onstart' ? <img src={onstart} alt="" className='w-auto m-0 p-0' />  :  <img src={text == 'walk' ? walk : jump} alt="" className='w-auto m-0 p-0 dragged  border-white' />}
          </div>
        })
       }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea md:w-11/12">
          <div className='character'>
        <div ref={emojiRef} className="w-24 -mt-4">
          <img ref={imageRef} src={emoji} alt="" className='w-full h-auto' />
        </div>
      </div>
      {Dots.length > 0 && Dots.map((_dot, i) => <div key={i} className="dot w-6 h-6 rounded-full self-end">
        <img src={shadow} alt="" className={i == 1 ? 'sm:-mt-1 sm:-ml-6 w-6' : ''} />
        {i == 1 && <img src = {obstackle} className='ml-10 -mt-6 sm:-mt-10 w-16' />}
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

export default Jump;
