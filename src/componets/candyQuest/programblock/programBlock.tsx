import React from 'react';

export const ProgramBlock = ({ text, isWalkAdded, index, blockRef, onDragStart }) => {
  const getImageSource = () => {
    if (text === 'onstart') {
      return onstart;
    } else if (text === 'reaptblock4' && isWalkAdded) {
      return repeatWithWalk;
    } else if (text === 'walk') {
      return walk;
    } else {
      return repeat;
    }
  };

  return (
    <div
      ref={blockRef}
      onDragStart={onDragStart}
      draggable={index !== 0}
      key={index}
      className="w-24 -m-2 overflow-x-hidden dragged"
    >
      <img src={getImageSource()} alt="" className="w-auto m-0 p-0 dragged border-white" />
    </div>
  );
};