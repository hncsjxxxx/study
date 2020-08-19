# 网络
### 1. https 连接时如何保证证书是有效的:
* **CRL（Certificate Revocation List，证书撤销名单）**。PKI 体系中由 CA 维护的一个被撤销证书的列表，浏览器会定时拉
取这个文件。但这个文件的实时性及性能都可能有问题
* **OCSP（Online Certificate Status Protocol，在线证书状态协议）**。客户端通过 OSCP 服务请求接口来判断某个证书是
否有效

# WEBPACK
### 1. import moduleName from 'xxModule'和import('xxModule')经过webpack编译打包后最终变成了什么？在浏览器中是怎么运行的？###
* 第一个import就不用说了，可以说现在的前端项目随处可见，第二个import可以在需要**懒加载**的地方看到.  
* import经过webpack打包以后变成一些**Map对象**，key为模块路径，value为模块的可执行函数；  
* 代码加载到浏览器以后从入口模块开始执行，其中执行的过程中，最重要的就是webpack定义的__webpack_require__函数，负责实
际的模块加载并执行这些模块内容，返回执行结果，其实就是读取Map对象，然后执行相应的函数; 
* 当然其中的异步方法（import('xxModule')）比较特殊一些，它会单独打成一个包，采用动态加载的方式，具体过程：当用户触发其
加载的动作时，会动态的在head标签中创建一个script标签，然后发送一个http请求，加载模块，模块加载完成以后自动执行其中的
代码，主要的工作有两个，更改缓存中模块的状态，另一个就是执行模块代码。

#### 可能你学会了如何使用 Webpack ，也大致知道其工作原理，可是你想过 Webpack 输出的 bundle.js 是什么样子的吗？ 为什么原来一个个的模块文件被合并成了一个单独的文件？为什么 bundle.js 能直接运行在浏览器中？####

###### src/add ######
``` javascript
export default function(a, b) {
    let { name } = { name: 'hello world,'} // 这里特意使用了ES6语法
    return name + a + b
}
```

###### src/main.js ######
``` javascript
import Add from './add'
console.log(Add, Add(1, 2))
```

###### 打包后精简的bundle.js文件如下: ######
相关链接 [链接1](https://github.com/Pines-Cheng/blog/issues/45)
            [链接2](https://juejin.im/post/6844903802382860296)
```javascript
// modules是存放所有模块的数组，数组中每个元素存储{ 模块路径: 模块导出代码函数 }
(function(modules) {
// 模块缓存作用，已加载的模块可以不用再重新读取，提升性能,安装过的模块都存放在这里面
var installedModules = {};

// 关键函数，加载模块代码
// 去数组中加载一个模块，moduleId 为要加载模块在数组中的 index
// 形式有点像Node的CommonJS模块，但这里是可跑在浏览器上的es5代码
function __webpack_require__(moduleId) {
  // 缓存检查，有则直接从缓存中取得
  if(installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // 如果缓存中不存在需要加载的模块，就新建一个模块，并把它存在缓存中
  var module = installedModules[moduleId] = {
    i: moduleId, // 模块在数组中的 index
    l: false, // 标记是否已经加载
    exports: {}  // 该模块的导出值
  };

  // 从 modules 中获取 index 为 moduleId 的模块对应的函数
  // 再调用这个函数，同时把函数需要的参数传入
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  module.l = true; // 标记为已加载

  // 返回加载的模块，调用方直接调用即可
  return module.exports;
}

//补充的另一个博客的配置
{
        // Webpack 配置中的 publicPath，用于加载被分割出去的异步代码
        __webpack_require__.p = "";

        // 使用 __webpack_require__ 去加载 index 为 0 的模块，并且返回该模块导出的内容
        // index 为 0 的模块就是 main.js 对应的文件，也就是执行入口模块
        // __webpack_require__.s 的含义是启动模块对应的 index
        return __webpack_require__(__webpack_require__.s = 0);
}

// __webpack_require__对象下的r函数
// 在module.exports上定义__esModule为true，表明是一个模块对象
__webpack_require__.r = function(exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
};

// 启动入口模块main.js
return __webpack_require__(__webpack_require__.s = "./src/main.js");
})
({
  // add模块
  "./src/add.js": (function(module, __webpack_exports__, __webpack_require__) {
    // 在module.exports上定义__esModule为true
    __webpack_require__.r(__webpack_exports__);
    // 直接把add模块内容，赋给module.exports.default对象上
    __webpack_exports__["default"] = (function(a, b) {
      let { name } = { name: 'hello world,'}
      return name + a + b
    });
  }),

  // 入口模块
  "./src/main.js": (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__)
    // 拿到add模块的定义
    // _add__WEBPACK_IMPORTED_MODULE_0__ = module.exports，有点类似require
    var _add__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/add.js");
    // add模块内容: _add__WEBPACK_IMPORTED_MODULE_0__["default"]
    console.log(_add__WEBPACK_IMPORTED_MODULE_0__["default"], Object(_add__WEBPACK_IMPORTED_MODULE_0__["default"])(1, 2))
  })
});
```
bundle.js 能直接运行在浏览器中的原因在于webpack通过__webpack_require__ 函数模拟了模块的加载（类似于node中的require语法），把定义的模块内容挂载到module.exports上。
原来一个个独立的模块文件被合并到了一个单独的 bundle.js 的原因在于浏览器不能像 Node.js 那样快速地去本地加载一个个模块文件，而必须通过网络请求去加载还未得到的文件。 如果模块数量很多，加载时间会很长，因此把所有模块都存放在了数组中，执行一次网络加载
如果仔细分析 __webpack_require__ 函数的实现，你还有发现 Webpack 做了缓存优化： 执行加载过的模块不会再执行第二次，执行结果会缓存在内存中，当某个模块第二次被访问时会直接去内存中读取被缓存的返回值。

# 总结