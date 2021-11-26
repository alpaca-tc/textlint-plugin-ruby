import { rubyToAST } from "./rubyToAST";
import type {
  TextlintPluginOptions,
  TextlintPluginProcessor,
} from '@textlint/types';

class RubyProcessor implements TextlintPluginProcessor {
  private execPath: string;
  private extensions: string[];

  constructor(options?: TextlintPluginOptions) {
    this.execPath = options?.execPath ?? 'textlint-ruby'
    this.extensions = options?.extensions ?? [];
  }

  availableExtensions() {
    return [".rb", ...this.extensions]
  }

  public processor() {
    return {
      preProcess(text: string, filePath?: string) {
        return rubyToAST(this.execPath, text, filePath);
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

export default RubyProcessor
