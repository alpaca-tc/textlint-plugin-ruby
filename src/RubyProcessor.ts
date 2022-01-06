import type {
  TextlintPluginOptions,
  TextlintPluginProcessor,
} from "@textlint/types";
import { rubyToAST } from "./rubyToAST";
import { Client } from "./Client";

interface ClientBuilder {
  get(execCommand: string[]): Client;
  shutdown(): void;
}

const clientBuilder = ((): ClientBuilder => {
  let client: Client | undefined;

  return {
    shutdown: () => {
      if (client) {
        client.enqueueShutdown().then(() => {
          client = undefined;
        });
      }
    },

    get: (execCommand: string[]) => {
      if (!client) {
        client = new Client(execCommand);
      }

      return client;
    },
  };
})();

export class RubyProcessor implements TextlintPluginProcessor {
  execCommand: string[];
  extensions: string[];

  constructor(options?: TextlintPluginOptions) {
    this.execCommand = options?.execCommand ?? ["textlint-ruby", "--stdio"];
    this.extensions = options?.extensions ?? [];
  }

  public availableExtensions() {
    return [".rb", ...this.extensions];
  }

  public processor() {
    return {
      preProcess: (text: string, filePath?: string) => {
        return rubyToAST(this.process, text, filePath);
      },

      postProcess: (messages: any[], filePath?: string) => {
        clientBuilder.shutdown();

        return {
          messages,
          filePath: filePath ?? "<ruby>",
        };
      },
    };
  }

  private get process(): Client {
    return clientBuilder.get(this.execCommand);
  }
}
