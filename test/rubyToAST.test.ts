import { isTxtAST } from "@textlint/ast-tester";
import { readFileSync } from "fs";
// your implement
import { rubyToAST } from "../src/rubyToAST";
import * as assert from "assert";
import { join } from "path";
import { Client } from "../src/Client";

describe("rubyToAST", () => {
  context("textlint AST", () => {
    it("returns true", async () => {
      const client = new Client();
      const filePath = join(__dirname, "fixtures/test.rb");
      const text = readFileSync(filePath, "utf-8");
      const AST = await rubyToAST(client, text, filePath);

      assert(isTxtAST(AST));
      client?.enqueueShutdown();
    });
  });
});
