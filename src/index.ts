import type { TextlintPluginCreator } from "@textlint/types";
import { RubyProcessor } from "./RubyProcessor";

const creator: TextlintPluginCreator = {
  Processor: RubyProcessor,
};

export default creator;
