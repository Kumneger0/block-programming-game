import './style.css';
import {
  BlocklyWorkspace,
  WorkspaceSvg,
  ToolboxDefinition,
} from 'react-blockly';

export const Workspace2 = ({
  toolbox,
  workspaceToCode,
}: {
  toolbox: ToolboxDefinition;
  workspaceToCode: (workspace: WorkspaceSvg) => void;
}) => {
  return (
    <BlocklyWorkspace
      className="w-full h-full"
      toolboxConfiguration={toolbox}
      onWorkspaceChange={workspaceToCode}
    />
  );
};
