import loadingSVG from '../assets/image/loading.svg'

export default function Loading() {
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-black'>
     <div className="loading">
        <img src={loadingSVG} alt="" />
     </div>
    </div>
  )
}
