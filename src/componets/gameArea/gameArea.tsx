import React from 'react';
import DotsComponent from '../dots/dots';
import { IRefs } from '../candyQuest/walk/walk';
const GameArea = React.forwardRef(
  (
    props: {
      emoji: string;
      Dots: number[];
      gum: string;
      shadow: string;
      showObstacle: boolean;
    },
    ref: React.ForwardedRef<IRefs>,
  ) => {
    const { emoji, Dots, gum, shadow, showObstacle } = props;
    return (
      <div
        ref={(el) => {
          if (ref && 'current' in ref && ref.current) {
            ref.current.gameArea = el;
          }
        }}
        className="w-4/5 mx-auto flex justify-around animationArea sm:-ml-3 sm:min-w-full sm:justify-center mt-10"
      >
        <div className="character">
          <div
            ref={(el) => {
              if (ref && 'current' in ref && ref.current) {
                ref.current.emojiRef = el;
              }
            }}
            className="w-24 -mt-4"
          >
            <img
              ref={(el) => {
                if (ref && 'current' in ref && ref.current) {
                  ref.current.imageRef = el;
                }
              }}
              src={emoji}
              alt=""
              className="w-full h-auto"
            />
          </div>
        </div>
        {Dots.length > 0 && (
          <>
            <DotsComponent
              showObstacle={showObstacle}
              Dots={Dots}
              shadow={shadow}
            />
          </>
        )}
        <div className="w-1/2 sm:-ml-8 -mt-4">
          <button
            ref={(el) => {
              if (ref && 'current' in ref && ref.current) {
                ref.current.gumRef = el;
              }
            }}
            className="w-8 h-8 -ml-16 sm:-ml-2 z-10"
          >
            <img src={gum} alt="" />
          </button>
        </div>
      </div>
    );
  },
);

export default GameArea;
