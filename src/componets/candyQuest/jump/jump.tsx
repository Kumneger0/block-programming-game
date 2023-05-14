import './jump.css';
import { Workspace } from 'blockly';
import LoadImages from '../../loadImages/loadImages';
import { Record } from '../walk/walk';
import GameArea from '../../gameArea/gameArea';
import { Helmet } from 'react-helmet';
import LevelToggler from '../../levelToggler/levelToggler';
import gum from '../../../assets/image/54650f8684aafa0d7d00004c.webp';
import { Workspace2 } from '../../workspace/Workspace';
import { toolboxWithJump } from '../../toolbox/toolbox';
import emoji from '../../../assets/image/initial.webp';
import shadow from '../../../assets/image/535805e584aafa4e55000016.webp';
import { useRef, useState, useEffect } from 'react';
import { ModalPart } from '../../modal/modal';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
export type GameStatus = { text: string | null; type: 'fail' | 'seccuss' };
const allimages = import.meta.glob('../../../assets/image/images/walking/*');
const images: string[] = [];
Object.keys(allimages).forEach((key) => {
  allimages[key]().then((res) => {
    const record = res as Record;
    const path = record.default;
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

function Jump() {
  const [isOpen, setIsOpen] = useState(false);
  const [Dots, setDots] = useState<number[]>([]);
  const closeModal = () => setIsOpen(false);
  const workspaceRef = useRef<Workspace | null>(null);
  const [indexs, setIndexes] = useState<number[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [Images, setImages] = useState<string[]>([]);
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

  function areAllBlocksConnected() {
    if (!workspaceRef.current) return;
    const blocks = workspaceRef.current.getAllBlocks(false);

    let isConnected = true;
    const size = blocks.length;
    if (size == 1) return true;
    blocks.forEach((block, i) => {
      if (i == 0 || !isConnected) return;
      const parent = block.getParent();
      if (!parent) {
        isConnected = false;
        return;
      }
      isConnected = true;
    });
    return isConnected;
  }

  async function startMoving() {
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
    const { javascriptGenerator } = await import('blockly/javascript');
    const isConnected = areAllBlocksConnected();
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const walkIndex: number[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
    let counter = 0;
    const jumpIndex: number[] = [];
    const strToExcute = `(() => {
    ${code}
  })();`;
    setTimeout(() => {
      setIndexes(jumpIndex);
      setIsUpdated((prv) => !prv);
    }, 100);
    eval(strToExcute);
    console.log(counter);
    console.log(walkIndex);
  }

  type Block = { x: number; isJump: boolean }[];

  function applyAnimation(posFromLeft: Block, isCorrect: boolean) {
    const { emojiRef, imageRef } = gameAreaChildRefs.current as IRefs;
    const keyFrames = [{ transform: `translate(0, 0)` }];

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
    emojiRef?.animate(keyFrames, {
      duration: 5000,
      fill: 'forwards',
      easing: 'linear',
      delay: 0,
    });
    if (emojiRef) {
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
              const levelFromLocalStorage = JSON.parse(
                localStorage.getItem('level-status-jump') as string,
              ) || { completedJUMP: [] };
              levelFromLocalStorage.completedJUMP.push(1);
              localStorage.setItem(
                'level-status-jump',
                JSON.stringify(levelFromLocalStorage),
              );
              setGameStatus({ text: 'Great!', type: 'seccuss' });
            } else {
              setGameStatus({ text: 'Failed!', type: 'fail' });
            }
            setIsOpen(true);
          }, 1000);
        });
      });
    }
  }

  useEffect(() => {
    setDots([1, 2, 3, 4]);
  }, []);

  useEffect(() => {
    generateKeyFrames(indexs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  function generateKeyFrames(indexs: number[]) {
    const postionForWalk: { x: number; isJump: boolean }[] = [];
    const { gameArea, emojiRef } = gameAreaChildRefs.current as IRefs;

    const emojiPosition = emojiRef?.getBoundingClientRect().x as number;
    const forJump: { x: number; isJump: boolean }[] = [];

    const childs = gameArea?.childNodes as NodeListOf<HTMLElement>;
    const totalItem = workspaceRef.current?.getAllBlocks(false);

    if (!totalItem?.length) return;
    totalItem?.forEach((item, i) => {
      if (item.type == 'walk') {
        const element = childs[i + 1] || null;
        if (element) {
          const position = element.getBoundingClientRect().x - emojiPosition;
          postionForWalk.push({ x: position, isJump: false });
        }
      }
    });
    indexs.forEach((number) => {
      const element = childs[number] || null;
      if (element) {
        const position = element.getBoundingClientRect().x - emojiPosition;
        forJump.push({ x: position, isJump: true });
      }
    });
    const isCorrect =
      indexs.length == 1 && indexs[0] == 3 && totalItem.length == 4;
    const sorted = [...forJump, ...postionForWalk].sort((a, b) => a.x - b.x);
    applyAnimation(sorted, isCorrect);
  }

  const workspaceToCode = (workspace: Workspace) => {
    if (workspace) {
      workspaceRef.current = workspace;
    }
  };

  return (
    <>
      {Images.length ? <LoadImages images={Images} /> : <></>}
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
          <div className="md:w-11/12 w-4/5 sm:w-full h-80 justify-self-end relative">
            <Workspace2
              toolbox={toolboxWithJump}
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
        <div className="playBTN fixed bottom-0 right-10 w-9 p-8">
          <div
            role="button"
            onClick={startMoving}
            className="playBtn w-full hover:cursor-pointer"
          >
            <AiOutlinePlayCircle className="w-16 h-20 sm:w-10 sm:h-10" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Jump;
