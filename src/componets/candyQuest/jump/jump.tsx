import './jump.css'
import onstart from '../../../assets/image/onstart.png'
import {  toast } from 'react-toastify';
import jump from   '../../../assets/image/jump.png'
import obstackle from '../../../assets/image/obstackle.webp'
import gum from   '../../../assets/image/54650f8684aafa0d7d00004c.webp'
import { Helmet } from 'react-helmet';
import walk from '../../../assets/image/walk.webp'
import emoji from '../../../assets/image/initial.webp'
import shadow from '../../../assets/image/535805e584aafa4e55000016.webp'
import  { DragEventHandler, useRef, useState, useEffect } from "react"
import { ModalPart } from '../../modal/modal'
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'
import { flushSync } from 'react-dom'

type Program = { text: string; style: string | null }
export type GameStatus = {text:string | null; type:'fail' | 'seccuss'}
const eating = import.meta.glob('../../../assets/image/Eating/*')
const imagesEating:string[] = []
Object.keys(eating).forEach(key => {
  eating[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default
    imagesEating.push(path)
  })
})

const allimages = import.meta.glob('../../../assets/image/images/walking/*')
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

function Jump():JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const blockesRef = useRef<HTMLDivElement[]>([])
  const [Dots, setDots] = useState<number[]>([]);
  const closeModal = () => setIsOpen(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>({text:null, type:'seccuss'});

  const dragItemsParent = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null)
  const [itemTouch, setItemTouch] = useState<string | null>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const [Images, setImages] = useState<string[]>([])
  const [item, setItem] = useState<'jump' | 'walk' | null>(null)
  const gumRef = useRef<HTMLButtonElement>(null)
  const dragedItemRef = useRef<HTMLElement | null>(null);
  const deleteRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const  draggabele1 =  useRef<HTMLButtonElement | null>(null)
  const  draggabele2 =  useRef<HTMLButtonElement | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [touchStartPosition, setTouchStartPosition] = useState({x: 0, y: 0})
  const [elementStartPosition, setElementStartPosition] = useState({x: 0, y: 0})
  const [deleteIndex, setDeleteIndex]  = useState<number>()
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [program, setProgram] = useState<Program[]>([{text:'onstart', style:null}]);
  const  dragItems:DragEventHandler = (e)  => {
    const element = e.target as HTMLImageElement
    const blockName = element.id as 'jump' | 'walk'
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
const removeItem = (idx:number) => {
  const temp = [...program].filter((_program, i) => i !== idx)
    setProgram(temp) 
}
let gumPosition=0
let isCorrect = false;
function startMoving() {
  if(program.length <= 1){
    toast.error('Please Connect The blocks properly', { 
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
  const emojiPosition = getEmojiPosition();
  const { jumpIndex, walkIndex } = getJumpAndWalkIndices();
  const { jumpingPositions, walkingPositions } = getJumpingAndWalkingPositions(emojiPosition, jumpIndex, walkIndex);

  const animationPosition = [...jumpingPositions, ...walkingPositions].sort((a, b) => a.x - b.x);
  console.log(animationPosition);

  const keyFrames = createKeyFrames(animationPosition);
  console.log(keyFrames);

  applyAnimation(keyFrames);
}

function getEmojiPosition() {
  let emojiPosition = 0;
  if (emojiRef.current) {
    emojiPosition = emojiRef.current.getBoundingClientRect().x;
  }
  return emojiPosition;
}

function getJumpAndWalkIndices() {
  const jumpIndex:number[] = [];
  const walkIndex:number[] = [];

  program.forEach(({ text }, i) => {
    if (i > 4) return;
    if (text === "jump") {
      jumpIndex.push(i);
    }
    if (text === "walk") {
      walkIndex.push(i);
    }
  });

  return { jumpIndex, walkIndex };
}

function getJumpingAndWalkingPositions(emojiPosition:number, jumpIndex:number[], walkIndex:number[]) {
  const childs = gameAreaRef.current?.childNodes as NodeListOf<HTMLElement>;
   gumPosition = childs[childs.length - 2].getBoundingClientRect().x
  const jumpingPositions:{x:number, isJump:boolean}[] = []
  const walkingPositions:{x:number, isJump:boolean}[] = []
  let shouldContinue = true
  childs.forEach((child, i) => {
    if (jumpIndex.includes(i)) {
     if(!shouldContinue) return
      if(i !== 3){
        shouldContinue = false
      }
      if(i == 3){
        isCorrect = true
      }
      jumpingPositions.push({ x: child.getBoundingClientRect().x - emojiPosition, isJump: true });
    }
    if (walkIndex.includes(i)) {
      walkingPositions.push({ x: child.getBoundingClientRect().x - emojiPosition, isJump: false });
    }
  });

  return { jumpingPositions, walkingPositions };
}
function createKeyFrames(animationPosition:{x:number, isJump:boolean}[] = []) {
  const keyFrames = [{ transform: `translate(0, 0)` }];

  animationPosition.forEach(({ x, isJump }, i, arr) => {
    if (isJump) {
      const prv = arr[i - 1]?.x ?? 0;
      console.log(prv)
      const transform = { transform: `translate(${prv - 100}, -50px)` };
      const transform2 = { transform: `translate(${prv + 50}px, -50px)` };
      const transform3 = { transform: `translate(${prv + 50}px, 0)` };
      keyFrames.push(transform, transform2, transform3);
    }
    if (!isJump) {
      const px = i === arr.length - 1 ? x - 50 : x - 100;
      const transform = { transform: `translate(${px}px)` };
      keyFrames.push(transform);
    }
  });

  return keyFrames;
}

function applyAnimation(keyFrames:Keyframe[]) {
  emojiRef.current?.animate(keyFrames, { duration: 5000, fill: "forwards" });

  emojiRef.current?.getAnimations().forEach((animation) => {
    let index = 0;
    const interval = setInterval(() => {
      if (images.length <= index) {
        index = -1;
      }
      ++index;
      if (!imageRef.current) return;
      imageRef.current.src = images[index];
    }, 200);

    animation.finished.then(() => {
      clearInterval(interval);
      let isGameOver = false
      if(emojiRef.current){
       isGameOver = Math.floor(gumPosition - 50) == Math.floor(emojiRef.current.getBoundingClientRect().x) && isCorrect
      }
      setTimeout(() => {
          if(isGameOver){
            if(gumRef.current == null) return
            gumRef.current.style.display = 'none'
            if(imageRef.current){
             imageRef.current.src = emoji
            }
            setTimeout(() => {
              setGameStatus({text:"good", type:'seccuss'})
              setIsOpen(true)
            }, 500)
            return
          }
          setGameStatus({text:"failed", type:'fail'})
          setIsOpen(true)
      }, 1000)
    });
  });
}
useEffect(() => {
  const images = returnImages()
  if(images.length){
    setImages(images)
  }
    setDots([1, 2, 3, 4])
   draggabele1.current?.addEventListener('touchstart', handleTouchStart, {passive:false})
   draggabele1.current?.addEventListener('touchmove', handleTouchMove, {passive:false})
   draggabele1.current?.addEventListener('touchend', handleTouchEnd, {passive:false})
   draggabele2.current?.addEventListener('touchstart', handleTouchStart, {passive:false})
   draggabele2.current?.addEventListener('touchmove', handleTouchMove, {passive:false})
   draggabele2.current?.addEventListener('touchend', handleTouchEnd, {passive:false})
   const details = navigator.userAgent;
   const regexp = /android|iphone|kindle|ipad/i;
   const isMobileDevice = regexp.test(details);
   setIsMobile(isMobileDevice)
   return () => {
    draggabele1.current?.removeEventListener('touchstart', handleTouchStart, false)
   draggabele1.current?.removeEventListener('touchmove', handleTouchMove, false)
   draggabele1.current?.removeEventListener('touchend', handleTouchEnd, false)
   draggabele2.current?.removeEventListener('touchstart', handleTouchStart, false)
   draggabele2.current?.removeEventListener('touchmove', handleTouchMove, false)
   draggabele2.current?.removeEventListener('touchend', handleTouchEnd, false)
   }
}, [])


function handleTouchStart(evt:Event){
  evt.preventDefault();
  const e = evt as TouchEvent
  console.log(e.target)
  setTouchStartPosition({x: e.touches[0].clientX,
    y: e.touches[0].clientY})
    const target = e.target as HTMLElement
    const id  = target.id
  
    if(id == 'walk' && draggabele1.current){
      setElementStartPosition({
        x: parseInt(draggabele1.current.style.left) || 0,
        y: parseInt(draggabele1.current.style.top) || 0
      })
    }
    if(id == 'jump' && draggabele2.current){
      setElementStartPosition({
        x: parseInt(draggabele2.current.style.left) || 0,
        y: parseInt(draggabele2.current.style.top) || 0
      })
    }
}
function handleTouchMove(evt:Event){
  evt.preventDefault();
  const e = evt as TouchEvent
  const target = e.target as HTMLElement;
  const id = target.id
  const deltaX = e.touches[0].clientX - touchStartPosition.x;
  const deltaY = e.touches[0].clientY - touchStartPosition.y;
   if(id == 'walk' && draggabele2.current){
      draggabele2.current.style.left = elementStartPosition.x + deltaX + 'px';
      draggabele2.current.style.top = elementStartPosition.y + deltaY + 'px';
   }
   if(id == 'jump' && draggabele1.current){
      draggabele1.current.style.left = elementStartPosition.x + deltaX + 'px';
      draggabele1.current.style.top = elementStartPosition.y + deltaY + 'px';
   }
}


function handleTouchEnd(evt:Event) {
 evt.preventDefault()
const e = evt as TouchEvent
 const touch = e.changedTouches[0];
 const target = e.target as HTMLElement;
 const dropZone = dropZoneRef.current;
 const element = document.elementFromPoint(touch.clientX, touch.clientY);
 if (element === dropZone) {
  setItemTouch(target.id as "walk" | "jump")
 }
 if(draggabele1.current && draggabele2.current){
   draggabele1.current.style.left = touchStartPosition.x + 'px'
   draggabele1.current.style.top = touchStartPosition.y + 'px'
   draggabele2.current.style.left = touchStartPosition.x + 'px'
   draggabele2.current.style.top = touchStartPosition.y + 'px'
 }
 setTouchStartPosition({x:0, y:0})
 setElementStartPosition({x:0, y:0})
}

useEffect(() => { 
if(itemTouch == null) return
const temp = [...program]
temp.push({text:itemTouch as string, style:null})
setProgram(temp)
}, [itemTouch])
  return (
<>{Images.length ? <Helmet>{Images.map(img => {
  return <link rel="preload" href={img} as="image" />
 })

  } </Helmet> : <></>

 }
<div className='w-screen playArea h-screen overflow-x-hidden' onDragOver={(e) => e.preventDefault()} onDrop={() => deleteRef.current?.classList.add('invisible')}>

      {gameStatus.text && <ModalPart isOpen={isOpen} onClose={closeModal} gameStatus={gameStatus} shouldDisplayNext = {false} /> }
    <div className="w-4/5 h-auto flex mx-auto flex-wrap justify-center responsive md:w-full overflow-x-hidden">
      <div ref={deleteRef}  onDrop = {deleteItem} onDragOver={handleDragOver} className="delete w-48 h-full bg-slate-50 absolute left-0 flex justify-center items-center invisible">
        <div className='w-9'>
            <RiDeleteBinFill className = 'w-full h-auto' />
        </div>
      </div>
      <div ref={dragItemsParent} className="w-1/2 justify-self-start">
        <button
          draggable={true}
          onDragStart={dragItems}
          className="w-20 relative select-none"
          ref = {draggabele2}
        >
          <img id='walk' src={walk} alt="" className='w-full' />
        </button>
        <button draggable={true}
          onDragStart={dragItems}
          className="w-20 relative select-none"
          ref = {draggabele1}
          >
        <img id='jump' src={jump} alt="" />
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return <div ref={(el) => blockesRef.current[i] = el!} onDragStart={(e) => {
            deleteRef.current?.classList.remove('invisible')
            setDeleteIndex(i)
            dragedItemRef.current = e.target as HTMLElement
          }} draggable = {i !== 0 ? true : false}  key={i} className="w-24 -m-2 overflow-x-hidden dragged relative">
            {text == 'onstart' ? <img src={onstart} alt="" className='w-auto m-0 p-0' />  :  <img src={text == 'walk' ? walk : jump} alt="" className='w-auto m-0 p-0 dragged  border-white' />}
           {i !== 0 && isMobile && <div onClick = {() => removeItem(i)} role = "button" className = 'absolute right-0 top-0 z-index-10 bg-black text-white'>
              X
            </div>}
          </div>
        })
       }
      </div>
    </div>
    <div ref={gameAreaRef}  className="w-4/5 mx-auto flex justify-around animationArea sm:-ml-3 sm:min-w-full sm:justify-center mt-3 relative">
          <div className='character'>
        <div ref={emojiRef} className="w-24 -mt-4">
          <img ref={imageRef} src={emoji} alt="" className='w-full h-auto' />
        </div>
      </div>
      {Dots.length > 0 && Dots.map((_dot, i) => <div key={i} className="dot w-6 h-6 rounded-full self-end sm:w-10 sm:h-10 sm:mx-3">
       {i !== 2 ?  <img src={shadow} alt=""  /> :
      <div className='flex justify-between items-start'>
        <img className='-ml-5 -mt-2' src = {obstackle} />
        <img src={shadow} alt=""  />
        </div>
 } </div> )
    }
      <div className="w-1/2">
        <button ref={gumRef} className='w-8 h-8 -ml-12 sm:-ml-1 z-10'>
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
 </> );
}

export default Jump;
