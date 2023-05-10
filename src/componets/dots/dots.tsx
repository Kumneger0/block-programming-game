import obstackle from "../../assets/image/obstackle.webp"

export default function DotsComponent({
  Dots,
  shadow,
  showObstacle
}: {
  Dots: number[];
  shadow: string;
  showObstacle:boolean
}) {
  return (
    <>
      {Dots.map((_dot, i) => (
        <div
          key={i}
          className="dot w-6 h-6 rounded-full self-end sm:w-10 sm:h-10 sm:mx-3"
        >
          <img className="w-full" src={shadow} alt="" />
          {i == 1  && showObstacle && <img className="w-full -mt-4 ml-7 sm:w-28 sm:-mt-8" src={obstackle} alt="" /> }
        </div>
      ))}
    </>
  );
}
