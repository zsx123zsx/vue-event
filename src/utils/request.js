// 基于axios封装，网络请求的函数
import axios from 'axios'

// axios.create()创建一个带配置项的自定义axios函数
// myAxios请求的时候，地址baseURL+url,然后去请求后台
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net',
})

export default myAxios
