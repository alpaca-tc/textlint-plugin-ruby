import type { AnyTxtNode } from "@textlint/ast-node-types";

import { tmpNameSync } from "tmp";
import { writeFile } from "fs";
import { Client } from "./Client";
import { promisify } from "util";

const die = (error: Error): void => {
  console.error(error);
  process.exit(1);
};

const writeFileAsync = promisify(writeFile);

const execTextlintRuby = async (
  client: Client,
  text: string,
  filePath: string | undefined
): Promise<any> => {
  let path: string;

  if (filePath) {
    path = filePath;
  } else {
    path = tmpNameSync({ postfix: ".rb" }).toString();
    await writeFileAsync(path, text);
  }

  try {
    if (!(await client.available())) {
      die(new Error("textlint-ruby is not running"));
    } else {
      return await client.parse(path);
    }
  } catch (error) {
    if (error instanceof Error) {
      die(error);
    } else {
      die(new Error(String(error)));
    }
  }
};

export const rubyToAST = async (
  client: Client,
  text: string,
  filePath: string | undefined
): Promise<AnyTxtNode> => {
  return (await execTextlintRuby(client, text, filePath)) as AnyTxtNode;
};
