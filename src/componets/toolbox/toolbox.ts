import * as Blockly from 'blockly'
import {javascriptGenerator} from 'blockly/javascript';
  Blockly.common.defineBlocksWithJsonArray([
    {
      "type": "walk",
      "message0": "walk",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 355
    }, 
    {
      "type": "jump",
      "message0": "jump",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 355
    }
  ]);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
javascriptGenerator['walk'] = function(_block:unknown){
    const code = `(() => {
     counter++
    })();`
    return code;
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
javascriptGenerator['jump'] = function(_block:unknown){
    const code = `(() => {
     ++counter
     jumpIndex.push(counter)
    })();`
    return code;
  }

export const toolbox = {
    "kind": "flyoutToolbox",
    "contents": [
      {'kind':'block', 'type':'walk'},
    ]
  };


export const toolboxWithReaptBlock = {
    "kind": "flyoutToolbox",
    "contents": [
      {
        "kind": "block",
        "type": "controls_repeat_ext",
        "inputs":{
          'TIMES': {
            'shadow': {
              'type': 'math_number',
              'fields': {
                'NUM': 4
              }
            }
          }
        }
      },
      {'kind':'block', 'type':'walk'},
    ]
  };


 export const toolboxWithJump = {
    "kind": "flyoutToolbox",
    "contents": [
      {"kind": "block", "type": "jump"},
      {'kind':'block', 'type':'walk'},
    ]
  };
 



  /* 
  {
        "kind": "block",
        "type": "controls_repeat_ext",
        "inputs":{
          'TIMES': {
            'shadow': {
              'type': 'math_number',
              'fields': {
                'NUM': 4
              }
            }
          }
        }
      },

  */

