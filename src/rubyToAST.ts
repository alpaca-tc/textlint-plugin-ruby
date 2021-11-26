// import { ASTNodeTypes } from '@textlint/ast-node-types';
import type {
  AnyTxtNode
} from '@textlint/ast-node-types';

import tmp from 'tmp'
import fs from "fs"
import { spawnSync } from "child_process"

const execTextlintRuby = (execPath: string, text: string, filePath: string | undefined): any => {
  let path: string;

  if (filePath) {
    path = filePath
  } else {
    path = tmp.tmpNameSync({ postfix: '.rb' }).toString();
    fs.writeFileSync(path, text)
  }

  const spawn = spawnSync(
    execPath,
    [path]
  )

  return JSON.parse(spawn.stdout.toString())
}

export const rubyToAST = (text: string, filePath: string | undefined): AnyTxtNode => {
  return execTextlintRuby(text, filePath) as AnyTxtNode
}
