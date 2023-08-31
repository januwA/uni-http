## uniapp中使用http发送请求和上传文件

## install
```
$ npm i uni-http
```

## 基本使用
```js
// api.js
import { UniHttp } from 'uni-http';

class Api extends UniHttp {
	config = {
		baseURL: 'https://jsonplaceholder.typicode.com',
		header: {
			'Content-Type': 'application/json'
		}
	};
	
  // 你可以在这里制作一个简易的拦截器
	request(...args) {
		console.log(args);
		return super.request(...args).then(res => res.data);
	}

	async hello() {
		return this.get("/todos/1");
	}
}

const api = new Api();

export { api };
```

```js
import { api } from "api.js"
api.hello().then(data => { console.log(data); });
```

## Get
```js
import { UniHttp } from 'uni-http';

const api = new UniHttp({
  baseURL: 'http://localhost:3000'
});

const res = await api.get('/api/hello', {
  params: { name: 'ajanuw' },
  header: { 'x-id': 1 }
});

// or

const res = await api.get({
  url: '/api/hello',
  params: { name: 'ajanuw' },
  header: { 'x-id': 1 }
});
```

## Post
```js
import { UniHttp } from 'uni-http';

const api = new UniHttp({
  baseURL: 'http://localhost:3000',
  header: {
    'Content-Type': 'application/json'
  },
});

await api.post('/api/login', {
  data: {
    name: 'ajanuw'
  }
});
```

## 使用拦截器
```js
class MyInterceptors {
  request(options) {
    options.header['x-token'] = 'xxxyyy';
    uni.showLoading();
  }
  complete(result, options) {
    uni.hideLoading();
  }
}

const api = new UniHttp({
  baseURL: 'http://localhost:3000',
  interceptors: [new MyInterceptors()]
});
```

## 拦截器类型
```ts
type OrPromise<T> = T | Promise<T>;
type C = IUniHttpConfig;
type RSCR = UniApp.RequestSuccessCallbackResult;
type GCR = UniApp.GeneralCallbackResult;

export interface UniHttpInterceptors {
  /**
   * 发送前拦截
   */
  request?: (options: C) => void;

  /**
   * 在success拦截
   */
  success?: (result: RSCR, options: C) => OrPromise<RSCR>;

  /**
   * 在fail拦截
   */
  fail?: (result: GCR, options: C) => void;

  /**
   * 在complete拦截
   */
  complete?: (result: GCR, options: C) => void;
}
```

## 上传文件
```js
uni.chooseImage({
  success: async chooseImageRes => {
    const tempFilePaths = chooseImageRes.tempFilePaths;

    const r = await api.post('/api/upload', {
      name: 'file',
      filePath: tempFilePaths[0],
      data: {
        name: 'ajanuw'
      }
    });

  }
});
```


## 在h5上跨域，你可能需要设置一个拦截器
```js
class MyInterceptors {
  request(options) {
    // #ifdef H5
    if(process.env.NODE_ENV === 'development') options.baseURL = '';
    // #endif
  }
}

const api = new UniHttp({
  baseURL: 'http://xxx.fun/',
  interceptors: [new MyInterceptors()]
});
```

manifest.json:
```json
  "h5": {
    "devServer": {
      "https": false,
      "proxy": {
        "/api": {
          "target": "http://xxx.fun/",
          "changeOrigin": true,
          "secure": false
        }
      }
    }
  }
```

## 中断请求
```js
import { UniHttp, UniHttpInterceptors, UniAbortController } from 'uni-http';

class MyInterceptors {
  fail(result) {
    if (result.errMsg === 'request:fail abort') {
      console.log('请求被中断')
    }
    return result;
  }
}

const api = new UniHttp({
  baseURL: 'http://xxx.fun/',
  interceptors: [new MyInterceptors()]
});

const abortController = new UniAbortController();

api.get('/api/cats', {
  abortController: abortController,
}).then(console.log)

// 中断请求
abortController.abort();
```

## 在请求发送前结束请求
```js
class MyInterceptors {
  request(options) {
    // 将cancel设置为true，请求将不会发送
    // 并且会调用拦截器的fail和complete
    options.cancel = true;
  }

  fail(result) {
    // { errMsg: "request:fail cancel" }
  }
}
```

## 自定义发送请求的方式

这通常在h5上很有用

```js
const api = new UniHttp({
  baseURL: 'https://jsonplaceholder.typicode.com',

  // #ifdef H5
  async requestFunc(url, options, success, fail, complete) {
    // console.log(url,options,success,fail,complete);
    try {
      const res = await fetch(url)
      const d = await res.json();
      success(d);
      complete(d);
    } catch (e) {
      fail(e)
    }
  },
  // #endif
  
});

await api.get('/todos/1').then(res => {
  console.log(res);
});
```

## See also:
- [options 参数 IUniHttpConfig](https://github.com/januwA/uni-http/blob/main/src/http-config.ts)
- [拦截器超类](https://github.com/januwA/uni-http/blob/main/src/interceptors.ts)
- [发送过程](https://github.com/januwA/uni-http/blob/main/src/uni-http.ts)
- [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file?id=uploadfile)
- [uni.request](http://uniapp.dcloud.io/api/request/request?id=request)