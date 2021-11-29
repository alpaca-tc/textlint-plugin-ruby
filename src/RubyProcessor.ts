import type {
  TextlintPluginOptions,
  TextlintPluginProcessor,
} from "@textlint/types";
import { rubyToAST } from "./rubyToAST";

export class RubyProcessor implements TextlintPluginProcessor {
  execCommand: string[];
  extensions: string[];

  constructor(options?: TextlintPluginOptions) {
    this.execCommand = options?.execCommand ?? ["textlint-ruby"];
    this.extensions = options?.extensions ?? [];
  }

  public availableExtensions() {
    return [".rb", ...this.extensions];
  }

  public processor() {
    const execCommand = this.execCommand;

    return {
      preProcess(text: string, filePath?: string) {
        return rubyToAST(execCommand, text, filePath);
      },

      postProcess(messages: any[], filePath?: string) {
        return {
          messages,
          filePath: filePath ?? "<ruby>",
        };
      },
    };
  }
}
