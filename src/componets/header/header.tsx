import './header.css'
export default function Header({setLevel}) {


  const playGame = async (level: number,) => {
    setLevel(level);
    const loadingPromise = new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 3000);
    });
    await loadingPromise;
  };



  return (
 <header className='bg-amber-400'>
    <div className="w-4/5 mx-auto h-12 flex items-center justify-between sm:w-11/12">
          <div className="logo">Tynker</div>
         <div>
        <LevelToggler playGame = {playGame} />
         </div>
    </div>
 </header>
  )
}



function LevelToggler({playGame}:{playGame:(level: number, jumpOrWalk: 'JUMP' | 'WALK') => void}){
  return <>
    <div>
       <button onClick={() => playGame(1, 'WALK')} className='w-6 h-6 rounded-full bg-white border-2 border-red-300'>1</button>
      <button onClick={() => playGame(1, 'WALK')} className='w-6 h-6 rounded-full bg-white border-2 border-red-300'>2</button>
      <button onClick={() => playGame(1, 'WALK')} className='w-6 h-6 rounded-full bg-white border-2 border-red-300 '>3</button>
     </div>
  </>

}