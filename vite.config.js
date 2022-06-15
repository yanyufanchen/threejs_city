export default {
    server: {
        port: 3005, // 你需要定义的端口号
        open: true, // open支持boolean/string类型，为true时打开默认浏览器，为string类型时，打开指定浏览器，具体查看官网即可
        // proxy: { // 配置本地代理地址
        //   '/dev': 'http://xxx.xxx.com/api'
        // }
    },
    base: './',
}