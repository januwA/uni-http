## uniapp中使用http发送请求和上传文件

## install
```
$ npm i uni-http
```

## Get
```js
import { UniHttp } from 'uni-http';

const api = new UniHttp({
  baseURL: 'http://localhost:3000'
});

const r = await api.get('/api/hello', {
  params: { name: 'ajanuw' },
  header: { 'x-id': 1 }
});
console.log(r);
```

## Post
```js
import { UniHttp } from 'uni-http';

const api = new UniHttp({
  baseURL: 'http://localhost:3000',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
});

const r = await api.post('/api/login', {
  data: {
    name: 'ajanuw'
  }
});
console.log(r);
```

## 使用拦截器
```js
import { UniHttp, UniHttpInterceptors } from 'uni-http';

class MyInterceptors extends UniHttpInterceptors {

  request(options) {
    options.header['x-token'] = 'xxxyyy';
    uni.showLoading();
    return options;
  }

  success(result) {
    return result;
  }

  fail(result) {
    return result;
  }

  complete(result) {
    uni.hideLoading();
    return result;
  }

}

const api = new UniHttp({
  baseURL: 'http://localhost:3000',
  interceptors: [new MyInterceptors()]
});

const r = await api.get('/api/hello', {
  params: { name: 'ajanuw' },
  header: { 'x-id': 1 }
});
console.log(r);
```

## 创建拦截器
```ts
class MyInterceptors  extends UniHttpInterceptors {
  request(options: IUniHttpConfig): IUniHttpConfig {
    throw new Error("Method not implemented.");
  }
  success(result: UniApp.RequestSuccessCallbackResult): UniApp.RequestSuccessCallbackResult {
    throw new Error("Method not implemented.");
  }
  fail(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult {
    throw new Error("Method not implemented.");
  }
  complete(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult {
    throw new Error("Method not implemented.");
  }
}
```



## 上传文件
```js
import { UniHttp } from 'uni-http';

const api = new UniHttp({
  baseURL: 'http://localhost:3000'
});

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
    console.log(r);
  }
});
```


## 在h5上跨域，你可能需要设置一个拦截器
```js
import { UniHttp, UniHttpInterceptors } from 'uni-http';

class MyInterceptors extends UniHttpInterceptors {
  request(options) {
    // #ifdef H5
    options.baseURL = '';
    // #endif
    return options;
  }

  success(result) {
    return result;
  }

  fail(result) {
    return result;
  }

  complete(result) {
    return result;
  }
}

const api = new UniHttp({
  baseURL: 'http://xxx.fun/',
  interceptors: [new MyInterceptors()]
});

const r = await api.get('/api/cats');
console.log(r);
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

class MyInterceptors extends UniHttpInterceptors {
  request(options) {
    // #ifdef H5
    options.baseURL = '';
    // #endif
    return options;
  }

  success(result) {
    return result;
  }

  fail(result) {
    if (result.errMsg === 'request:fail abort') {
      console.log('请求被中断')
    }

    return result;
  }

  complete(result) {
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

## test
> $ npm t

## build
> $ npm run build

## See also:
- [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file?id=uploadfile
- [uni.request](http://uniapp.dcloud.io/api/request/request?id=request)