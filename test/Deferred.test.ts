import * as assert from "assert";
import { Deferred } from "../src/Deferred";

describe("Deferred", () => {
  it("can resolve promise", async () => {
    const deferred = new Deferred<boolean>();
    deferred.resolve(true);
    assert.ok(await deferred.promise);
  });

  it("can reject promise", async () => {
    const deferred = new Deferred<boolean>();
    deferred.reject(true);

    let resolved = false;
    try {
      await deferred.promise;
      resolved = true;
    } catch (val) {
      assert.ok(val === true);
    } finally {
      assert.ok(resolved === false);
    }
  });
});
