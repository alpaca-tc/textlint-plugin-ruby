import * as assert from "assert";
import { readFileSync } from "fs";
import RubyPlugin from "../src/index";
import { TextlintKernel, TextlintPluginOptions } from "@textlint/kernel";
import { join } from "path";

const rules = [
  { ruleId: "no-todo", rule: require("textlint-rule-no-todo").default },
];

const lintFile = (
  filePath: string,
  options: boolean | TextlintPluginOptions | undefined = true
) => {
  const kernel = new TextlintKernel();
  const text = readFileSync(filePath, "utf-8");

  return kernel.lintText(text, {
    filePath,
    ext: ".rb",
    plugins: [
      {
        pluginId: "ruby",
        plugin: RubyPlugin,
        options,
      },
    ],
    rules,
  });
};

const lintText = (
  text: string,
  options: boolean | TextlintPluginOptions | undefined = true
) => {
  const kernel = new TextlintKernel();
  return kernel.lintText(text, {
    ext: ".rb",
    plugins: [
      {
        pluginId: "ruby",
        plugin: RubyPlugin,
        options,
      },
    ],
    rules,
  });
};

describe("RubyProcessor", () => {
  context("when target file is a Text", () => {
    it("should report error", async () => {
      const fixturePath = join(__dirname, "fixtures/test.rb");
      const results = await lintFile(fixturePath);
      assert(results.messages.length > 0);
      assert(results.filePath === fixturePath);
    });
  });

  context("when extensions option is specified", () => {
    it("should report error", async () => {
      const fixturePath = join(__dirname, "fixtures/test.custom");
      const results = await lintFile(fixturePath, { extensions: [".custom"] });
      assert(results.messages.length > 0);
      assert(results.filePath === fixturePath);
    });
  });

  context("when target is text", () => {
    it("should report error", async () => {
      const results = await lintText('"TODO: this is todo"');
      assert(results.messages.length === 1);
      assert(results.filePath === "<ruby>");
    });
  });
});
