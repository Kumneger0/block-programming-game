import './walk.css';
import { Workspace } from 'blockly';
import GameArea from '../../gameArea/gameArea';
import LevelToggler from '../../levelToggler/levelToggler';
import { Helmet } from 'react-helmet';
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

  async function startMoving() {
    if (!workspaceRef.current) return;
    const { toast } = await import('react-toastify');
    //@ts-expect-error b/c i can't find other ways
    const size = workspaceRef.current.blockDB.size;
    if (size == 0) {
      toast.error('Connect Blocks To Play ', {
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
    const { areAllBlocksConnected } = await import('../../../utils');
    const isConnected = areAllBlocksConnected(workspaceRef);
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
    const { javascriptGenerator } = await import('blockly/javascript');
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    // eslint-disable-next-line prefer-const
    let counter = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const walkIndex: number[] = [];
    const strToExcute = `(() => {
    ${code}
  })();`;
    eval(strToExcute);
    console.log(walkIndex);
    let isCorrect: boolean;
    if (Dots.length == counter) {
      isCorrect = true;
    } else {
      isCorrect = false;
    }
    let diffrence = 0;
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
      diffrence = targetPosition - emojiRef.getBoundingClientRect().x;
      applyAnimation(diffrence, isCorrect);
    }
  }

  function applyAnimation(diffrence: number, isCorrect: boolean) {
    const { emojiRef, imageRef, gumRef } = gameAreaChildRefs.current as IRefs;
    if (!diffrence) return;
    if (emojiRef) {
      emojiRef.animate(
        [
          { transform: `translateX(${0})` },
          { transform: `translateX(${diffrence}px)` },
        ],
        { duration: 2000, fill: 'forwards' },
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
      {Images.length ? (
        <Helmet>
          {Images.map((img) => {
            return <link key={img} rel="preload" href={img} as="image" />;
          })}{' '}
        </Helmet>
      ) : (
        <></>
      )}
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
          <div className="md:w-full w-3/4 sm:w-full h-80 justify-self-end relative">
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

export default Walk;
