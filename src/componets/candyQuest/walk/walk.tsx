import './walk.css';
import { Workspace } from 'blockly';
import GameArea from '../../gameArea/gameArea';
import LoadImages from '../../loadImages/loadImages';
import LevelToggler from '../../levelToggler/levelToggler';
import gum from '../../../assets/image/54650f8684aafa0d7d00004c.webp';
import { Workspace2 } from '../../workspace/Workspace';
import { toolbox, toolboxWithReaptBlock } from '../../toolbox/toolbox';
import emoji from '../../../assets/image/initial.webp';
import shadow from '../../../assets/image/535805e584aafa4e55000016.webp';
import { useRef, useState, useContext, useEffect } from 'react';
import { levelcontext } from '../../dashboad';
import { ModalPart } from '../../modal/modal';
import { AiOutlinePlayCircle } from 'react-icons/ai';
export type GameStatus = { text: string | null; type: 'fail' | 'seccuss' };
const allimages = import.meta.glob('../../../assets/image/images/walking/*');

export interface Record {
  default: string;
}
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

function Walk() {
  const { level } = useContext(levelcontext);
  const [isOpen, setIsOpen] = useState(false);
  const [Dots, setDots] = useState<number[]>([]);
  const closeModal = () => setIsOpen(false);
  const workspaceRef = useRef<Workspace | null>(null);

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

  const showToast = async (toastMessage: string) => {
    const { toast } = await import('react-toastify');
    toast.error(toastMessage, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };
  async function startMoving() {
    if (!workspaceRef.current) return;
    const length = workspaceRef.current.getAllBlocks(false).length;
    if (length === 0) {
      showToast('Connect Blocks to Play');
      return;
    }
    const { areAllBlocksConnected } = await import('../../../utils');
    const isConnected = areAllBlocksConnected(workspaceRef);
    if (!isConnected) {
      showToast('Blocks Must be Connected Together');
      return;
    }
    const { javascriptGenerator } = await import('blockly/javascript');
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    // eslint-disable-next-line prefer-const
    let counter = 0;
    const walkIndex: number[] = [];
    eval(code);
    console.log(counter);
    console.log(walkIndex);
    const isCorrect = Dots.length === counter;
    let difference = 0;
    const { gameArea, emojiRef } = gameAreaChildRefs.current as IRefs;
    const childs = gameArea?.childNodes as NodeListOf<HTMLElement>;
    const targetPosition = childs[counter]?.getBoundingClientRect().x || 0;
    if (emojiRef) {
      if (targetPosition < emojiRef.getBoundingClientRect().x) {
        const lastElementPosition =
          childs[childs.length - 1].getBoundingClientRect().x;
        applyAnimation(lastElementPosition + 100, isCorrect);
        return;
      }
      difference = targetPosition - emojiRef.getBoundingClientRect().x;
      applyAnimation(difference, isCorrect);
    }
  }

  function applyAnimation(diffrence: number, isCorrect: boolean) {
    const { emojiRef, imageRef, gumRef } = gameAreaChildRefs.current as IRefs;
    if (!diffrence) return;
    if (emojiRef) {
      emojiRef.animate(
        [
          { transform: `translateX(${0})` },
          { transform: `translateX(${diffrence - 30}px)` },
        ],
        { duration: 2000, fill: 'forwards', easing: 'linear' },
      );
    }
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
          if (isCorrect) {
            if (gumRef) {
              gumRef.style.display = 'none';
            }
            setGameStatus({ text: 'Correct!', type: 'seccuss' });
            const levelFromLocalStorage = JSON.parse(
              localStorage.getItem('level-status') as string,
            ) || { completed: [] };
            levelFromLocalStorage.completed.push(level);
            localStorage.setItem(
              'level-status',
              JSON.stringify(levelFromLocalStorage),
            );
          } else {
            setGameStatus({ text: 'Wrong!', type: 'fail' });
          }
          setIsOpen(true);
        });
      });
    }
  }

  useEffect(() => {
    if (level == 1) {
      setDots([1, 2]);
    }
    if (level == 2 || level == 3) {
      setDots([1, 2, 3, 4]);
      const blocks = workspaceRef.current?.getAllBlocks(false);
      if (blocks?.length) {
        (async () => {
          const { clearWorkspace } = await import('../../../utils');
          clearWorkspace(workspaceRef);
        })();
      }
    }
  }, [level]);

  const workspaceToCode = (workspace: Workspace) => {
    if (workspace) {
      workspaceRef.current = workspace;
    }
  };

  return (
    <>
      {Images.length ? <LoadImages images={Images} /> : <></>}
      <div className="w-screen playArea h-screen  overflow-x-hidden">
        <div className="absolute top-3 right-16">
          <LevelToggler jumpOrWalk="WALK" />
        </div>
        {gameStatus.text && (
          <ModalPart
            isOpen={isOpen}
            onClose={closeModal}
            gameStatus={gameStatus}
            shouldDisplayNext={true}
          />
        )}
        <div className="max-w-5xl h-auto flex mx-auto flex-nowrap justify-end responsive">
          <div className="md:w-11/12 w-4/5 sm:w-full h-80 justify-self-end workspace mr-2">
            <Workspace2
              toolbox={
                level == 1 || level == 2 ? toolbox : toolboxWithReaptBlock
              }
              workspaceToCode={workspaceToCode}
            />
          </div>
        </div>
        <GameArea
          showObstacle={false}
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

export default Walk;
