import type { ChildProcess } from "child_process";
import type { AnyTxtNode } from "@textlint/ast-node-types";
import { spawn } from "child_process";
import { StringDecoder } from "string_decoder";
import { Interface, createInterface } from "readline";
import { Deferred } from "./Deferred";

export interface Request {
  action: string;
}

export interface InfoRequest extends Request {
  action: "info";
}

export interface ParseRequest extends Request {
  action: "parse";
  path: string;
}

export interface Response<T> {
  request_seq: number;
  version: string;
  result: T;
}

export class Client {
  public _process: ChildProcess;
  public _seq: number = 0;
  private _readlineInterface: Interface;
  private _enqueuedShutdown: boolean = false;
  private readonly _requests: { [seq: number]: Deferred<any> } = {};

  constructor(execCommand: string[] = ["textlint-ruby", "--stdio"]) {
    this._process = this.bootTextlintRuby(execCommand);

    const { stdout, stderr } = this._process;

    stdout!.setEncoding("utf-8");

    this._readlineInterface = createInterface(stdout!, undefined, undefined);
    this._readlineInterface.on("line", (line) => this.receive(line));

    const decoder = new StringDecoder("utf-8");
    stderr!.addListener("data", (data: Buffer | string) => {
      const errorRequest =
        typeof data === "string" ? data : decoder.write(data);
      this.receiveError(errorRequest);
    });

    this._process.on("exit", () => {
      this.enqueueShutdown();
    });
  }

  public async available(): Promise<boolean> {
    if (this._process.killed) {
      return false;
    }

    const message: InfoRequest = { action: "info" };
    const textlintRubyVersion = await this.send<Response<string>>(message);

    return !!textlintRubyVersion;
  }

  public parse(path: string): Promise<AnyTxtNode> {
    const message: ParseRequest = { action: "parse", path };
    return this.send<AnyTxtNode>(message);
  }

  public shutdown(): void {
    if (this._process.killed) {
      return;
    }

    this._readlineInterface?.close();
    this._process.stdin?.destroy();
    this._process.kill();
  }

  public enqueueShutdown(): void {
    if (this._enqueuedShutdown) {
      return;
    }

    this._enqueuedShutdown = true;

    const tryToShutdown = (): void => {
      setTimeout(() => {
        if (Object.keys(this._requests).length === 0) {
          this.shutdown();
        } else {
          tryToShutdown();
        }
      }, 0);
    };

    tryToShutdown();
  }

  private get packageVersion(): string {
    return require("../package.json").version;
  }

  private async send<K>(message: Request): Promise<K> {
    this._seq += 1;

    const jsonRequest = JSON.stringify({
      ...message,
      seq: this._seq,
      version: this.packageVersion,
    });
    this._process.stdin!.write(`${jsonRequest}\n`);

    const deferred = new Deferred<K>();

    this._requests[this._seq] = deferred;

    return deferred.promise;
  }

  private receive(untrimmedResponse: string): void {
    const rawResponse = untrimmedResponse.trim();
    const response: Response<any> = JSON.parse(rawResponse);

    const deferred = this._requests[response.request_seq];
    deferred.resolve(response.result);

    delete this._requests[response.request_seq];
  }

  private receiveError(message: string): void {
    console.error(message);
  }

  private bootTextlintRuby(execCommand: string[]): ChildProcess {
    const commandArgs = [...execCommand]; // Shallow cloned execCommand
    const command = commandArgs.shift();
    return spawn(command!, commandArgs);
  }
}
