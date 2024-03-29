import {
  mergeUrl,
  UniAbortController,
  IUniHttpConfig,
  mergeConfig,
  removeHeaderContentType,
  jsonToSerialize,
  parseUrlParams,
  UniHttp,
  UniHttpInterceptors,
  urlWithParams,
} from "../src/";

describe("main", () => {
  it("test cancel 1", (done) => {
    new UniHttp().get("https://jsonplaceholder.typicode.com/todos/1", {
      interceptors: [
        new (class MyInterceptors implements UniHttpInterceptors {
          request(options: any) {
            options.cancel = true;
            return options;
          }
          fail(result: any) {
            expect(result).toEqual(
              expect.objectContaining({
                errMsg: "request:fail cancel",
              })
            );
            done();
            return result;
          }
        })(),
      ],
    });
  });

  it("test cancel 2", (done) => {
    new UniHttp()
      .get("https://jsonplaceholder.typicode.com/todos/1", {
        interceptors: [
          new (class MyInterceptors implements UniHttpInterceptors {
            request(options: any) {
              options.cancel = true;
              return options;
            }
          })(),
        ],
      })
      .catch((er) => {
        expect(er).toEqual(
          expect.objectContaining({
            errMsg: "request:fail cancel",
          })
        );
        done();
      });
  });

  it("test url and params 1", () => {
    expect(
      urlWithParams({
        baseURL: "http://localhost:3000",
        url: "/api/hello",
        params: { name: "ajanuw" },
      })
    ).toBe("http://localhost:3000/api/hello?name=ajanuw");

    expect(
      urlWithParams({
        baseURL: "http://localhost:3000",
        url: "/api/hello",
      })
    ).toBe("http://localhost:3000/api/hello");
  });

  it("test parseUrlParams", () => {
    const obj = JSON.stringify({ a: "b" });
    const r = parseUrlParams(
      `http://localhost:3000/api/hello?name=ajanuw&id=1&arr=a&arr=b&obj=${obj}`
    );
    expect(r.url).toBe("http://localhost:3000/api/hello");
    expect(r.params).toEqual(
      expect.objectContaining({
        name: "ajanuw",
        id: "1",
        arr: ["a", "b"],
        obj,
      })
    );
  });

  it("test jsonToSerialize", () => {
    const data = {
      name: "ajanuw",
      id: 1,
      arr: ["a", "b"],
      obj: { a: "b" },
    };
    expect(jsonToSerialize(data)).toBe(
      `name=ajanuw&id=1&arr=a&arr=b&obj=${JSON.stringify(data.obj)}`
    );
  });

  it("test removeHeaderContentType", () => {
    const headr = {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-id": 1,
    };
    expect(removeHeaderContentType(headr)).toEqual(
      expect.objectContaining({
        "x-id": 1,
      })
    );
  });

  it("test AbortController", (done) => {
    const token = new UniAbortController();
    token.completer.promise.then(() => {
      done();
    });
    token.abort();
  });

  it("test mergeUrl", () => {
    expect(mergeUrl("http://localhost:3000", "api/hello")).toBe(
      "http://localhost:3000/api/hello"
    );

    expect(mergeUrl("http://localhost:3000/", "/api/hello")).toBe(
      "http://localhost:3000/api/hello"
    );

    expect(mergeUrl("http://localhost:3000/", "api/hello")).toBe(
      "http://localhost:3000/api/hello"
    );

    expect(mergeUrl("http://localhost:3000", "/api/hello")).toBe(
      "http://localhost:3000/api/hello"
    );

    expect(mergeUrl(undefined, "/api/hello")).toBe("/api/hello");

    expect(mergeUrl("", "api/hello")).toBe("/api/hello");

    expect(
      mergeUrl("http://localhost:1000", "http://localhost:3000/api/hello")
    ).toBe("http://localhost:3000/api/hello");

    expect(mergeUrl("", "http://localhost:3000/api/hello")).toBe(
      "http://localhost:3000/api/hello"
    );

    expect(mergeUrl(undefined, "http://localhost:3000/api/hello")).toBe(
      "http://localhost:3000/api/hello"
    );
  });
});

describe("mergeConfig 1", () => {
  let globalOptions: IUniHttpConfig;
  let options: IUniHttpConfig;
  let mergeOptions: IUniHttpConfig;
  beforeAll(() => {
    globalOptions = {
      baseURL: "http://localhost:3000",
      method: "GET",
      params: {
        apiid: 1,
      },
      header: {
        "x-apiid": 1,
      },
      timeout: 5000,
      complete: () => {
        //
      },
    };
    options = {
      url: "/api/hello",
      method: "POST",
      data: {
        id: 1,
        name: "ajanuw",
      },
      params: {
        name: "ajanuw",
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: (r) => { },
      fail: (er) => { },
    };

    mergeOptions = mergeConfig(options, globalOptions);
  });

  it("test baseURL", () => {
    expect(mergeOptions.baseURL).toBe("http://localhost:3000");
  });

  it("test method", () => {
    expect(mergeOptions.method).toBe("POST");
  });

  it("test data", () => {
    expect(mergeOptions.data).toEqual(
      expect.objectContaining({
        id: 1,
        name: "ajanuw",
      })
    );
  });

  it("test params", () => {
    expect(mergeOptions.params).toEqual(
      expect.objectContaining({
        apiid: 1,
        name: "ajanuw",
      })
    );
  });

  it("test header", () => {
    expect(mergeOptions.header).toEqual(
      expect.objectContaining({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-apiid": 1,
      })
    );
  });

  it("test timeout", () => {
    expect(mergeOptions.timeout).toBe(5000);
  });

  it("test success", () => {
    expect(mergeOptions.success).toBeTruthy();
  });

  it("test complete", () => {
    expect(mergeOptions.complete).toBeTruthy();
  });

  it("test fail", () => {
    expect(mergeOptions.fail).toBeTruthy();
  });

  it("test file", () => {
    expect(mergeOptions.file).not.toBeTruthy();
  });
});

describe("mergeConfig 2", () => {
  let globalOptions: IUniHttpConfig;
  let options: IUniHttpConfig;
  let mergeOptions: IUniHttpConfig;
  beforeAll(() => {
    globalOptions = {
      baseURL: "http://localhost:3000",
    };
    options = {
      url: "/api/hello",
      data: {
        id: 1,
        name: "ajanuw",
      },
      params: {
        name: "ajanuw",
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: (r) => { },
      fail: (er) => { },
    };

    mergeOptions = mergeConfig(options, globalOptions);
  });

  it("test baseURL", () => {
    expect(mergeOptions.baseURL).toBe("http://localhost:3000");
  });

  it("test method", () => {
    expect(mergeOptions.method).toBe("GET");
  });

  it("test data", () => {
    expect(mergeOptions.data).toEqual(
      expect.objectContaining({
        id: 1,
        name: "ajanuw",
      })
    );
  });

  it("test params", () => {
    expect(mergeOptions.params).toEqual(
      expect.objectContaining({
        name: "ajanuw",
      })
    );
  });

  it("test header", () => {
    expect(mergeOptions.header).toEqual(
      expect.objectContaining({
        "Content-Type": "application/x-www-form-urlencoded",
      })
    );
  });

  it("test timeout", () => {
    expect(mergeOptions.timeout).toBeUndefined();
  });

  it("test success", () => {
    expect(mergeOptions.success).toBeTruthy();
  });

  it("test complete", () => {
    expect(mergeOptions.complete).not.toBeTruthy();
  });

  it("test fail", () => {
    expect(mergeOptions.fail).toBeTruthy();
  });

  it("test file", () => {
    expect(mergeOptions.file).not.toBeTruthy();
    expect(mergeOptions.files).toHaveLength(0);
    expect(mergeOptions.filePath).not.toBeTruthy();
  });
});
