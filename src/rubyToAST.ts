import type {
  AnyTxtNode
} from '@textlint/ast-node-types';

import { tmpNameSync } from 'tmp'
import { writeFileSync } from "fs"
import { spawnSync } from "child_process"

const die = (error: Error): void => {
  console.error(error)
  process.exit(1)
}

const execTextlintRuby = (execPath: string, text: string, filePath: string | undefined): any => {
  let path: string;

  if (filePath) {
    path = filePath
  } else {
    path = tmpNameSync({ postfix: '.rb' }).toString();
    writeFileSync(path, text)
  }

  try {
    // Parse ruby source code with textlint-ruby
    const spawn = spawnSync(
      execPath,
      [path]
    )

    if (spawn.error) {
      die(spawn.error!)
    }

    const json = spawn.stdout.toString()
    return JSON.parse(json) as AnyTxtNode
  } catch(error) {
    if (error instanceof Error) {
      die(error)
    } else {
      die(new Error(String(error)))
    }
  }
}

export const rubyToAST = (execPath: string, text: string, filePath: string | undefined): AnyTxtNode => {
  return execTextlintRuby(execPath, text, filePath) as AnyTxtNode
}
