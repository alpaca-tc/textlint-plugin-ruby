import type { TextlintPluginCreator } from '@textlint/types';
import processor from './rubyProcessor';

const creator: TextlintPluginCreator = {
  Processor: processor,
};

export default creator;
