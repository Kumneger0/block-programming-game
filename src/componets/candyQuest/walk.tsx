import './walk.css'
import  { DragEventHandler, useRef, useState } from "react"
import {AiOutlinePlayCircle} from 'react-icons/ai'
import {RiDeleteBinFill} from 'react-icons/ri'

type Program = { text: string; style: string | null }


function Walk() {
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
        console.log(text)
        setProgram(temp)
    
  };

const deleteItem = () => {
  const temp = [...program].filter((_program, i) => i !== deleteIndex)
  setProgram(temp)
}


const moveAndEat = () => {
  if(program.length == 1 && program[0].text == 'onstart') return
  const length = program.length
  const destination= gameAreaRef.current?.childNodes
  const emojiDOMRect = emojiRef.current?.getBoundingClientRect()
  let diffrence;
  if(length == 2){
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    destinationRef.current = destination[1]
    const gumDOMRect = destinationRef.current?.getBoundingClientRect()
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  diffrence = (gumDOMRect.x - emojiDOMRect.x) - 50
  }
  if(length == 3){
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    destinationRef.current = destination[3]
    const gumDOMRect = destinationRef.current?.getBoundingClientRect()
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    diffrence = (gumDOMRect.x - emojiDOMRect.x) - 150
  }
  if(length >= 4){
    diffrence = 600
  }
  emojiRef.current?.animate([{transform:`translateX(0)px`}, {transform:`translateX(${diffrence}px)`}], {
    duration: 2000,
    iterations: 1,
    fill:'forwards'
  })
 const animation = emojiRef.current?.getAnimations().map(animation => animation.finished.then(res => {
    if(length == 2){
      setGameOver(true)
      return res
    }
    if(length >= 4){
       setGameOver(true)
      return
    }
    if(gumRef.current){
      gumRef.current.style.display = 'none'
    }
 }))
 console.log(animation)
}

  return (
    <div className='w-screen playArea h-screen' onDragOver={(e) => e.preventDefault()} onDrop={() => deleteRef.current?.classList.add('invisible')}>

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
            {text == 'onstart' ? <img src="public\image\onstart.png" alt="" className='w-auto m-0 p-0' />  : <img src="public\image\walk.webp" alt="" className='w-auto m-0 p-0 dragged' />}
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
      <div className="dot w-6 h-6 rounded-full bg-black self-end"></div>
      <div className="dot w-6 h-6 rounded-full bg-black self-end"></div>
      <div className="w-1/2">
        <button ref={gumRef} className="border bg-red-400 -ml-16 gum">gum</button>
      </div>
      </div>
    <div className="playBTN fixed bottom-0 right-24 w-9 p-8">
      <div role='button' onClick={moveAndEat} className='playBtn w-full hover:cursor-pointer'>
        <AiOutlinePlayCircle className='w-24 h-24 '  />
      </div>
    </div>
    </div>
  );
}

export default Walk;
