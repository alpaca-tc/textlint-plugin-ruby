import * as assert from "assert";
import { Client } from "../src/Client";
import { Writable } from "stream";
import { join } from "path";

describe("Client", () => {
  const utf8 = new TextDecoder("utf-8");

  const buildWritable = (): { writable: Writable; messages: string[] } => {
    const writable = new Writable();
    const messages: string[] = [];

    writable._write = (message) => {
      messages.push(utf8.decode(message));
    };

    return { writable, messages };
  };

  const bootedClients: Client[] = [];

  const buildClient = () => {
    const client = new Client();
    bootedClients.push(client);

    const stdoutWritable = buildWritable();
    client._process.stdout!.pipe(stdoutWritable.writable);

    return { client, stdout: stdoutWritable.messages };
  };

  after(() => {
    let client: Client | undefined;

    while ((client = bootedClients.pop())) {
      client.enqueueShutdown();
    }
  });

  describe("#available", () => {
    it("returns boolean", async () => {
      const { client, stdout } = buildClient();

      assert(await client.available());

      const message = JSON.parse(stdout[0]);

      assert.equal(message["request_seq"], client._seq);
      assert.match(message["result"], /^\d+\.\d+\.\d+$/);
    });
  });

  describe("#parse", () => {
    it("returns boolean", async () => {
      const { client, stdout } = buildClient();

      const filePath = join(__dirname, "fixtures/test.rb");
      const ast = await client.parse(filePath);
      assert.equal(ast["type"], "Document");
    });
  });
});
