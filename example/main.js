import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import {
  UniHttp,
  UniHttpInterceptors
} from '../dist/umd/uni-http';

class P1 {
  success(result, options) {
    // return Promise.reject('oooo')
    return result
  }
}

const api = new UniHttp({
  baseURL: 'https://jsonplaceholder.typicode.com',
  interceptors: [new P1()],
  
  // #ifdef H5
  // async requestFunc(url, options, success, fail, complete) {
  //   // console.log(url,options,success,fail,complete);
  //   try {
  //     const res = await fetch(url)
  //     const d = await res.json();
  //     success(d);
  //   } catch (e) {
  //     fail(e)
  //   } finally {
  //     complete();
  //   }
  // },
  // #endif
  
});

(async () => {
  try {
    await api.get('/todos/1').then(res => {
      console.log(res);
    });
    console.log('success');
  } catch (e) {
    console.log(1);
    console.log(e); // oooo
  }
})()

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()