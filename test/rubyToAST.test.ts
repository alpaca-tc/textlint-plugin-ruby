import { isTxtAST } from "@textlint/ast-tester";
import { readFileSync } from "fs";
// your implement
import { rubyToAST } from "../src/rubyToAST";
import * as assert from "assert";
import { join } from "path";

describe("rubyToAST", () => {
  context("textlint AST", () => {
    it("returns true", () => {
      const filePath = join(__dirname, "fixtures/test.rb");
      const text = readFileSync(filePath, "utf-8");
      const AST = rubyToAST(["textlint-ruby"], text, filePath);

      assert(isTxtAST(AST));
    });
  });
});
