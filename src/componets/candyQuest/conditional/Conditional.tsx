import * as Blockly from 'blockly';
import GameArea from '../../gameArea/gameArea';
import { javascriptGenerator } from 'blockly/javascript';
import { Helmet } from 'react-helmet';
import { areAllBlocksConnected, generateKeyFrames } from '../../../utils';
import { toolboxForConditional } from '../../toolbox/toolbox';
import gum from '../../../assets/image/54650f8684aafa0d7d00004c.webp';
import { Workspace2 } from '../../workspace/Workspace';
import LevelToggler from '../../levelToggler/levelToggler';
import emoji from '../../../assets/image/initial.webp';
import shadow from '../../../assets/image/535805e584aafa4e55000016.webp';
import { useRef, useState, useEffect } from 'react';
import { ModalPart} from '../../modal/modal';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
export type GameStatus = { text: string | null; type: 'fail' | 'seccuss' };
const allimages = import.meta.glob('../../../assets/image/images/walking/*');
const images: string[] = [];
Object.keys(allimages).forEach((key) => {
  allimages[key]().then((res) => {
    //@ts-expect-error b/c no types available
    const path = res.default;
    images.push(path);
  });
});
function returnImages() {
  return images;
}

export interface IRefs {
  gameArea: HTMLDivElement | null;
  emojiRef: HTMLDivElement | null;
  imageRef: HTMLImageElement | null;
  gumRef: HTMLButtonElement | null;
}

function Conditional() {
  const [isOpen, setIsOpen] = useState(false);
  const [Dots, setDots] = useState<number[]>([]);
  const closeModal = () => setIsOpen(false);
  const workspaceRef = useRef<Blockly.Workspace | null>(null);
  const [walkIndex, setWalkIndex] = useState<number[] | null>(null)
  const [indexs, setIndexes] = useState<number[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean | null>(null);
  const [Images, setImages] = useState<string[]>([]);
  const [counter, setCounter] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    text: null,
    type: 'seccuss',
  });

  const gameAreaChildRefs = useRef<IRefs>({
    gameArea: null,
    emojiRef: null,
    imageRef: null,
    gumRef: null,
  });

  useEffect(() => {
    const images = returnImages();
    if (images.length) {
      setImages(images);
    }
  }, []);

  
  function startMoving() {
    if (!workspaceRef.current) return;
    //@ts-expect-error b/c i can't find other ways
    const size = workspaceRef.current.blockDB.size;
    if (size == 0) {
      toast.error('Connect Blocks To Play', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    const isConnected =  areAllBlocksConnected(workspaceRef);
    if (!isConnected) {
      toast.error('Blocks Must be Connected Together ', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    console.log(code);
    // eslint-disable-next-line prefer-const,
    let counter = 0;
    const jumpIndex: number[] = [];
    const walkIndex: number[] = [];
    setTimeout(() => {
      setIndexes(jumpIndex);
      setWalkIndex(walkIndex)
      setIsUpdated((prv) => {
        if(prv == null) return true
        if(prv == true) return false
        return true
      });
    }, 100);
    eval(code);
    setCounter(counter)
  }

  type Block = { x: number; isJump: boolean }[];

  function applyAnimation(posFromLeft?: Block | null, isCorrect?: boolean | null, position?:number) {
    const { emojiRef } = gameAreaChildRefs.current as IRefs;
    if(position){
      emojiRef?.animate([{transform:`translate(0, 0)`}, {transform:`translate(${position}px, 0)`}], {
        duration: 5000,
        fill: 'forwards',
        easing: 'linear',
        delay: 0,
      });
      changeImages(false)
      return
    }
    
    const keyFrames = [{ transform: `translate(0, 0)` }];
    if (posFromLeft)
      posFromLeft.forEach(
        ({ x, isJump }: { x: number; isJump: boolean }, i: number, arr) => {
          if (isJump) {
            const prv = arr[i - 1]?.x ?? 0;
            const transform = {
              transform: `translate(${i == 0 ? prv : prv - 50}px, -50px)`,
            };
            const transform2 = { transform: `translate(${prv + 20}px, -50px)` };
            const transform3 = { transform: `translate(${prv + 20}px, 0)` };
            keyFrames.push(transform, transform2, transform3);
          }
          if (!isJump) {
            const px = x - 50;
            const transform = { transform: `translate(${px}px, 0)` };
            keyFrames.push(transform);
          }
        },
      );
    if(keyFrames.length <= 1) return
    emojiRef?.animate(keyFrames, {
      duration: 5000,
      fill: 'forwards',
      easing: 'linear',
      delay: 0,
    });
    if (emojiRef) {
      changeImages(isCorrect as boolean)
    }
  }
  
function changeImages(isCorrect:boolean){
  const { emojiRef, imageRef } = gameAreaChildRefs.current as IRefs;
  if(emojiRef){
    const animations = emojiRef.getAnimations();
    if (!animations.length) return;
    emojiRef.getAnimations().forEach((animation) => {
      let idx = 0;
      const interval1 = setInterval(() => {
        if (images.length - 1 <= idx) {
          idx = 0;
        }
        ++idx;
        if (imageRef === null) return;
        imageRef.src = images[idx];
      }, 100);
  
      animation.finished.then(() => {
        clearInterval(interval1);
        setTimeout(() => {
          if (isCorrect) {
            setGameStatus({ text: 'Great!', type: 'seccuss' });
          } else {
            setGameStatus({ text: 'Failed!', type: 'fail' });
          }
          setIsOpen(true);
        }, 1000);
      });
    })
  }
}

  useEffect(() => {
    setDots([1, 2, 3, 4, 5]);
  }, []);

  useEffect(() => {
    if(isUpdated === null) return
    const paramsToGenKeyFrames = {indexs, gameAreaChildRefs, walkIndex, counter}
    const resObect = generateKeyFrames(paramsToGenKeyFrames)
    console.log(resObect)
    if(resObect.position){
      applyAnimation(null, false, resObect.position)
    }
    if(resObect.sorted){
      applyAnimation(resObect.sorted, resObect.isCorrect)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  const workspaceToCode = (workspace: Blockly.Workspace) => {
    if (workspace) {
      workspaceRef.current = workspace;
    }
  };

  return (
    <>
      {Images.length ? (
        <Helmet>
          {Images.map((img) => {
            return <link key={img} rel="preload" href={img} as="image" />;
          })}{' '}
        </Helmet>
      ) : (
        <></>
      )}
      <div className="absolute top-3 right-16">
        <LevelToggler jumpOrWalk="JUMP" />
      </div>
      <div className="w-screen playArea h-screen  overflow-x-hidden">
        {gameStatus.text && (
          <ModalPart
            isOpen={isOpen}
            onClose={closeModal}
            gameStatus={gameStatus}
            shouldDisplayNext={true}
          />
        )}
        <div className="max-w-5xl h-auto flex mx-auto flex-nowrap justify-end responsive">
          <div className="md:w-full w-3/4 sm:w-full h-80 justify-self-end relative">
            <Workspace2
              toolbox={toolboxForConditional}
              workspaceToCode={workspaceToCode}
            />
          </div>
        </div>
        <GameArea
          showObstacle={true}
          ref={gameAreaChildRefs}
          emoji={emoji}
          gum={gum}
          shadow={shadow}
          Dots={Dots}
        />
        <div className="playBTN fixed bottom-0 right-24 w-9 p-8">
          <div
            role="button"
            onClick={startMoving}
            className="playBtn w-full hover:cursor-pointer"
          >
            <AiOutlinePlayCircle className="w-24 h-24 " />
          </div>
        </div>
      </div>
    </>
  );
}

export default Conditional;
