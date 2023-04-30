import './walk.css'
import LevelToggler from '../levelToggler/levelToggler'
import onstart from '../../assets/image/onstart.png'
import {  toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import gum from   '../../assets/image/54650f8684aafa0d7d00004c.webp'
import walk from '../../assets/image/walk.webp'
import emoji from '../../assets/image/initial.webp'
import shadow from '../../assets/image/535805e584aafa4e55000016.webp'
import { DragEventHandler, useRef, useState, useContext, useEffect } from "react"
import { levelcontext } from '../dashboad'
import { ModalPart } from '../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}
const eating = import.meta.glob('../../assets/image/Eating/*')
const imagesEating:string[] = []
Object.keys(eating).forEach(key => {
  eating[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    imagesEating.push(path)
  })
})

const allimages = import.meta.glob('../../assets/image/images/walking/*')
const images:string[] = []
Object.keys(allimages).forEach(key => {
  allimages[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    images.push(path)
  })
})
function returnImages(){
  return images
}
function Walk() {
  const {level } = useContext(levelcontext)
  const [isOpen, setIsOpen] = useState(false);
  const blockesRef = useRef<HTMLDivElement[]>([])
  const [Dots, setDots] = useState<number[]>([]);
  const [numberOfrequiredAnimation, setnumberOfrequiredAnimation] = useState<number>(2);
  const [item, setItem] = useState<number|null>(null)
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState< GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const [Images, setImages] = useState<string[]>([])
  const imageRef = useRef<HTMLImageElement>(null)
  const draggableItemRef = useRef<HTMLButtonElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const gumRef = useRef<HTMLButtonElement>(null)
  const dragedItemRef = useRef<HTMLElement | null>(null);
  const deleteRef = useRef<HTMLDivElement>(null)
  const [isMobile,  setIsMobile] = useState<boolean | null>(null)
  const [touchStartPosition, setTouchStartPosition] = useState<{x:number, y:number}>({x:0, y:0})
  const [elementStartPosition, setElementStartPosition]= useState<{x:number, y:number}>({x:0, y:0})
  const gameAreaRef = useRef<HTMLDivElement>(null)
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
   const images = returnImages()
   if(images.length){
    setImages(images)
   }
 }, [])


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

const removeItem = (idx:number) => {
  const temp = [...program].filter((_program, i) => i !== idx)
  setProgram(temp)
}

const targetNodePostions:{ele:number, x:number}[] = [];
function startMoving(){
  if(program.length <= 1){
    toast.error('Please Connect Walk Block To On start Block', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    return
  } 
  const childs = gameAreaRef.current?.childNodes as NodeListOf<HTMLElement>
  const targetRect = childs[numberOfrequiredAnimation].getBoundingClientRect().x
  
  childs.forEach((child, i) => {
    if(i == 0) return
    targetNodePostions.push({ele:i, x:child.getBoundingClientRect().x})
  })
  const emojiDOMRECT = emojiRef.current?.getBoundingClientRect() as  DOMRect
  const destination = childs[program.length - 1].getBoundingClientRect()
  const targetPlace = childs[childs.length  - 2].getBoundingClientRect().x
  const diffrence = destination.x - emojiDOMRECT.x
  if((targetRect - emojiDOMRECT.x) == diffrence){
    const isLast = Math.floor(targetPlace)  == Math.floor(destination.x)
     applyAnimation(diffrence - 40, 2000, isLast)
     return
  }
  applyAnimation(diffrence - 40, 1000, false)
}


function applyAnimation(diffrence:number, duration:number, isLast:boolean){
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
      if(isLast){
        setTimeout(() => {
          if(gumRef.current)
           gumRef.current.style.display = 'none'
           if(imageRef.current){
            imageRef.current.src = emoji
           }
           setTimeout(() => {
            setGameStatus({text:'you are reached', type:'seccuss'})
            setIsOpen(true)
           }, 500)
        }, 500)   
        return
      }
      setTimeout(() => {
        setGameStatus({text:'you are failed', type:'fail'})
        setIsOpen(true)
      }, 1000)
    })
  })
}
useEffect(() => {
  if(level == 1){
    setDots([1, 2])
    setnumberOfrequiredAnimation(2)
  }
  if(level == 2){
    setDots([1, 2, 3, 4])
    setnumberOfrequiredAnimation(4)
  }
  const temp = [program[0]]
  setProgram(temp)
}, [level])



useEffect(() => {
 const images = returnImages()
  if(images.length){
  setImages(images)
}
const details = navigator.userAgent;
const regexp = /android|iphone|kindle|ipad/i;
const isMobileDevice = regexp.test(details);
setIsMobile(isMobileDevice)
if(draggableItemRef.current){
  draggableItemRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
  draggableItemRef.current.addEventListener('touchend', handleTouchEnd, { passive: false });
  draggableItemRef.current.addEventListener('touchstart', handleTouchStart, { passive: false })
}
return () => {
  draggableItemRef.current?.removeEventListener('touchmove', handleTouchMove, false);
  draggableItemRef.current?.removeEventListener('touchend', handleTouchEnd, false);
  draggableItemRef.current?.removeEventListener('touchstart', handleTouchStart, false)
}
}, [])
function handleTouchMove(event:Event){
  event.preventDefault();
  const e = event as TouchEvent
  const deltaX = e.touches[0].clientX - touchStartPosition.x;
  const deltaY = e.touches[0].clientY - touchStartPosition.y;
   if(draggableItemRef.current){
      draggableItemRef.current.style.left = elementStartPosition.x + deltaX + 'px';
     draggableItemRef.current.style.top = elementStartPosition.y + deltaY + 'px';
   }
}
function handleTouchStart (event:Event){
  event.preventDefault();
  const e = event as TouchEvent
  setTouchStartPosition({x: e.touches[0].clientX,
    y: e.touches[0].clientY})
    if(draggableItemRef.current){
      setElementStartPosition({
        x: parseInt(draggableItemRef.current.style.left) || 0,
        y: parseInt(draggableItemRef.current.style.top) || 0
      })
    }
}


function handleTouchEnd(event:Event) {
  const e = event as TouchEvent
  if (!draggableItemRef.current) return;
  const touch = e.changedTouches[0];
  const dropZone = dropZoneRef.current;
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element === dropZone) {
   setItem(Math.random())
   draggableItemRef.current.style.left = touchStartPosition.x + 'px'
   draggableItemRef.current.style.top = touchStartPosition.y + 'px'
   setTouchStartPosition({x:0, y:0})
   setElementStartPosition({x:0, y:0})
  }
}

useEffect(() => {
  if(item  == null) return
 const temp = [...program, {text:'', style:Math.random().toString()},]
setProgram(temp)
}, [item])
  return (
 <>{Images.length ? <Helmet>{Images.map(img => {
  return <link rel="preload" href={img} as="image" />
 })

  } </Helmet> : <></>

 }<div className='w-screen playArea h-screen  overflow-x-hidden' onDragOver={(e) => e.preventDefault()} onDrop={() => deleteRef.current?.classList.add('invisible')}>
      <div className='absolute top-3 right-16'>
        <LevelToggler />
      </div>
      {gameStatus.text && <ModalPart isOpen={isOpen} onClose={closeModal} gameStatus={gameStatus} shouldDisplayNext = {true} /> }
    <div className="w-4/5 h-auto flex mx-auto flex-wrap justify-center responsive">
      <div ref={deleteRef}  onDrop = {deleteItem} onDragOver={handleDragOver} className="delete w-48 h-full bg-slate-50 absolute left-0 flex justify-center items-center invisible">
        <div className='w-9'>
            <RiDeleteBinFill className = 'w-full h-auto' />
        </div>
      </div>
      <div ref={dragItemsParent} className="w-1/2 justify-self-start">
        <button
          draggable={true}
          ref = {draggableItemRef}
          onDragStart={dragItems}
          className="w-20 relative select-none"
        >
          <img src={walk} alt="" className='w-full' />
        </button>
      </div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        id = 'dropzone'
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
          }} draggable = {i !== 0 ? true : false}  key={i} className="w-24 -m-2 overflow-x-hidden dragged relative">
            {text == 'onstart' ? <img src={onstart} alt="" className='w-auto m-0 p-0' />  : <img src={walk} alt="" className='w-auto m-0 p-0 dragged  border-white' />}
            {i !== 0 && isMobile && <div onClick = {() => removeItem(i)} role = "button" className = 'absolute right-0 top-0 z-index-10 bg-black text-white'>
              X
            </div>}
          </div>
        })
       }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea sm:-ml-3 sm:min-w-full sm:justify-center mt-3">
          <div className='character'>
        <div ref={emojiRef} className="w-24 -mt-4">
          <img ref={imageRef} src={emoji} alt="" className='w-full h-auto' />
        </div>
      </div>
      {Dots.length > 0 && Dots.map((_dot, i) => <div key={i} className="dot w-6 h-6 rounded-full self-end sm:w-10 sm:h-10 sm:mx-3">
        <img className='w-full' src={shadow} alt="" />
      </div> )
    }
      <div className="w-1/2 sm:-ml-8 -mt-4">
        <button ref={gumRef} className='w-8 h-8 -ml-16 sm:-ml-2 z-10'>
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
 
  </>);
}

export default Walk;
