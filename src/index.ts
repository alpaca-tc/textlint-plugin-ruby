import type { TextlintPluginCreator } from '@textlint/types';
import type {
  TextlintPluginOptions,
  TextlintPluginProcessor,
} from '@textlint/types';
import { rubyToAST } from "./rubyToAST";

class Processor implements TextlintPluginProcessor {
  public execPath: string;
  private extensions: string[];

  constructor(options?: TextlintPluginOptions) {
    this.execPath = options?.execPath ?? 'textlint-ruby'
    this.extensions = options?.extensions ?? [];
  }

  availableExtensions() {
    return [".rb", ...this.extensions]
  }

  public processor() {
    const self = this

    return {
      preProcess(text: string, filePath?: string) {
        return rubyToAST(self.execPath, text, filePath);
      },

      postProcess(messages: any[], filePath?: string) {
        return {
          messages,
          filePath: filePath ?? '<ruby>',
        };
      },
    };
  }
}

const creator: TextlintPluginCreator = {
  Processor,
};

export default creator;
