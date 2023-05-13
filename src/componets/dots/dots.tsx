import obstackle from '../../assets/image/obstackle.webp';

export default function DotsComponent({
  Dots,
  shadow,
  showObstacle,
}: {
  Dots: number[];
  shadow: string;
  showObstacle: boolean;
}) {
  return (
    <>
      {Dots.map((_dot, i) => (
        <div
          key={i}
          className="dot w-7 h-6 sm:w-4 sm:h-4 rounded-full self-end sm:mx-2"
        >
          <img className="w-full" src={shadow} alt="" />
          {i == 1 && showObstacle && (
            <img
              className="w-full -mt-7 ml-7 sm:ml-4 sm:w-28 sm:-mt-4 sm:"
              src={obstackle}
              alt=""
            />
          )}
        </div>
      ))}
    </>
  );
}
