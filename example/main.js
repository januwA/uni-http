import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import {
  UniHttp,
  UniHttpInterceptors
} from 'uni-http';

class P1 {
  async request(options) {
    return new Promise(res => {
      setTimeout(() => {
        // options.cancel = true;
        console.log('p1 request');
        res(options);
      }, 2000)
    })
  }
  
  async success(result, options) {
    return new Promise(res => {
      setTimeout(() => {
        console.log('p1 success');
        res(result);
      }, 2000)
    })
  }
}

class P2 {
  async request(options) {
    console.log('p2 request');
    return options;
  }
  async success(result, options) {
    console.log('p2 success');
    return result;
  }
}

const api = new UniHttp({
  baseURL: 'https://jsonplaceholder.typicode.com',
  interceptors: [new P1(), new P2()]
});

api.get('/todos/1', {}).then(res => {
  console.log(res);
});

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
