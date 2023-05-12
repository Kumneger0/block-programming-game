import { MutableRefObject } from 'react';
import * as Blockly from 'blockly';
import { IRefs } from '../componets/candyQuest/walk/walk';

export function areAllBlocksConnected(
  workspaceRef: MutableRefObject<Blockly.Workspace | null>,
) {
  if (!workspaceRef.current) return;
  const workspace = workspaceRef.current as unknown as Blockly.Workspace;

  const blocks = workspace.getAllBlocks(false);

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

export function generateKeyFrames({
  indexs,
  walkIndex,
  gameAreaChildRefs,
  counter,
}: {
  indexs: number[];
  walkIndex: number[]|null;
  gameAreaChildRefs: MutableRefObject<IRefs>;
  counter: number;
}) {
  const { gameArea, emojiRef } = gameAreaChildRefs.current as IRefs;
  const childs = gameArea?.childNodes as NodeListOf<HTMLElement>;
  const emojiPosition = emojiRef?.getBoundingClientRect().x as number;
  if (!indexs.length) {
    const destinationX =
      childs[counter]?.getBoundingClientRect().x - emojiPosition;
    return { isCorrect: false, position: destinationX };
  }
  const postionForWalk: { x: number; isJump: boolean }[] = [];

  const forJump: { x: number; isJump: boolean }[] = [];

//   const totalItem = workspaceRef.current?.getAllBlocks(false);
//   if (!totalItem?.length) return;
  walkIndex?.forEach((index) => {
    const element = childs[index] || null;
    if (element) {
      const position = element.getBoundingClientRect().x - emojiPosition;
      if (position <= 0) return;
      postionForWalk.push({ x: position, isJump: false });
    }
  });
  indexs.forEach((number) => {
    const element = childs[number] || null;
    if (element) {
      const position = element.getBoundingClientRect().x - emojiPosition;
      forJump.push({ x: position, isJump: true });
    }
  });
  const sorted = [...forJump, ...postionForWalk].sort((a, b) => a.x - b.x);
  const isCorrect = indexs.length == 1 && indexs[0] == 3 && sorted.length == 5;
  return { isCorrect, sorted };
}



export const clearWorkspace = (workspaceRef: MutableRefObject<Blockly.Workspace | null>) => {
  const blocks = workspaceRef.current?.getAllBlocks(false)
  if(!blocks?.length) return
  blocks?.forEach(block => {
    block.dispose(true)
  })
}