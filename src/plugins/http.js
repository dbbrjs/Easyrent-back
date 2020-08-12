// 插件模块

import axios from 'axios'
import { config } from 'shelljs'
import {Message} from 'element-ui'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://47.115.31.127/rent_manager/'
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  // const AUTH_TOKEN = localStorage.getItem('token')
  // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config 请求头的信息
    console.log('请求拦截器触发')
    console.log(config.url)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN // 给headers添加一个属性
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(
    response => {
      if (response.data.code == 403) { // 判断token是否失效
        Message.error({
          message: '请输入正确的账号密码', // 错误描述信息
          duration: 1000
        })
        localStorage.clear()
        window.location.href="#/login"
        return Promise.reject('error')
      }else if(response.data.code == 407){
        window.location.href="#/fail"
        return Promise.reject('error')
      } else {
        return response
      }
    },
    error => {
      Message.error({
        message: '网络繁忙',
        duration: 1000
      })
      return Promise.reject(error)
    }
  
  )

  // 在请求发起之前  设置头部
  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
