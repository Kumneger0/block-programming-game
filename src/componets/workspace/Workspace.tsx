import { ToolboxDefinition } from 'blockly/core/utils/toolbox';
import {useState} from 'react'
import { BlocklyWorkspace, WorkspaceSvg } from 'react-blockly';

export const Workspace2 = ({toolbox, workspaceToCode}:{
  toolbox:ToolboxDefinition, 
  workspaceToCode:(workspace: WorkspaceSvg) => void
}) => {
    const [xml, setXml] = useState<string>()
    return (
        <BlocklyWorkspace
          className="w-full h-full" 
          toolboxConfiguration={toolbox}
          initialXml={xml}
          onWorkspaceChange={workspaceToCode}
          onXmlChange={(xml) => setXml(xml)}
        />
      )
}

  