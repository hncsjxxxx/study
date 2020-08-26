# REACT
[生命周期执行顺序](https://www.cnblogs.com/soyxiaobi/p/9559117.html)
![avatar](/image/sm.png)
![avatar](/image/sm1.png)
![avatar](/image/sm2.png)
![avatar](/image/sm3.png)
![avatar](/image/sm4.png)
![avatar](/image/sm5.png)
![avatar](/image/sm6.png)
![avatar](/image/sm7.png)
![avatar](/image/sm8.png)

# 前端安全 XSS CSRF
[前端安全系列（一）：如何防止XSS攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)
[前端安全系列（二）：如何防止CSRF攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

# 前端代码如何做错误上报 前端监控...
![avatar](/image/jiankong.png)
![avatar](/image/jiankong1.png)
![avatar](/image/jiankong2.png)
![avatar](/image/jiankong3.png)
![avatar](/image/jiankong4.png)
![avatar](/image/jiankong5.png)
![avatar](/image/jiankong6.png)
![avatar](/image/jiankong7.png)

# 大规格文件上传优化
[大规格文件上传优化](https://mp.weixin.qq.com/s/0oVi1qYNe0QNiPmThco2qg)
![avatar](/image/sc.png)
![avatar](/image/sc1.png)
![avatar](/image/sc2.png)
![avatar](/image/sc3.png)
![avatar](/image/sc4.png)
![avatar](/image/sc5.png)
![avatar](/image/sc6.png)
![avatar](/image/sc7.png)
![avatar](/image/sc8.png)
![avatar](/image/sc9.png)
![avatar](/image/sc10.png)

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
           [Webpack揭秘——走向高阶前端的必经之路](https://imweb.io/topic/5baca58079ddc80f36592f1a) 1.2.4webpack输出结果解析,可搭配着看,文章也不错
           [Webpack源码解读：理清编译主流程](https://juejin.im/post/6844903987129352206)
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
* bundle.js 能直接运行在浏览器中的原因在于webpack通过__webpack_require__ 函数模拟了模块的加载（类似于node中的require语法），把定义的模块内容挂载到module.exports上。
* 原来一个个独立的模块文件被合并到了一个单独的 bundle.js 的原因在于浏览器不能像 Node.js 那样快速地去本地加载一个个模块文件，而必须通过网络请求去加载还未得到的文件。 如果模块数量很多，加载时间会很长，因此把所有模块都存放在了数组中，执行一次网络加载
* 如果仔细分析 __webpack_require__ 函数的实现，你还有发现 Webpack 做了缓存优化： 执行加载过的模块不会再执行第二次，执行结果会缓存在内存中，当某个模块第二次被访问时会直接去内存中读取被缓存的返回值。

#### WEBPACK模块异步加载 
以上webpack把所有模块打包到主文件中，所以模块加载方式都是同步方式。但在开发应用过程中，按需加载（也叫懒加载）也是经常使用的优化技巧之一。按需加载，通俗讲就是代码执行到异步模块（模块内容在另外一个js文件中），通过网络请求即时加载对应的异步模块代码，再继续接下去的流程。那webpack是如何执行代码时，判断哪些代码是异步模块呢？webpack又是如何加载异步模块呢？
最新的webpack4推荐使用新的import() api,而import()返回promise，这意味着可以使用最新的ES8 async/await语法，使得可以像书写同步代码一样，执行异步流程。
现在我们从webpack打包后的源码来看下，webpack是如何实现异步模块加载的。修改入口文件main.js，引入异步模块async.js：
``` javascript
// main.js
import Add from './add'
console.log(Add, Add(1, 2), 123)

// 按需加载
// 方式1: require.ensure
// require.ensure([], function(require){
//     var asyncModule = require('./async')
//     console.log(asyncModule.default, 234)
// })

// 方式2: webpack4新的import语法
// 需要加@babel/plugin-syntax-dynamic-import插件
let asyncModuleWarp = async () => await import('./async')
console.log(asyncModuleWarp().default, 234)

// async.js
export default function() {
    return 'hello, aysnc module'
}
```
以上代码打包会生成两个chunk文件，分别是主文件main.bundle.js以及异步模块文件0.bundle.js。同样，为方便读者快速理解，精简保留主流程代码。
```javascript
// 0.bundle.js

// 异步模块
// window["webpackJsonp"]是连接多个chunk文件的桥梁
// window["webpackJsonp"].push = 主chunk文件.webpackJsonpCallback
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [0], // 异步模块标识chunkId,可判断异步代码是否加载成功
  // 跟同步模块一样，存放了{模块路径：模块内容}
  {
  "./src/async.js": (function(module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.r(__webpack_exports__);
      __webpack_exports__["default"] = (function () {
        return 'hello, aysnc module';
      });
    })
  }
]);
```
以上知道，异步模块打包后的文件中保存着异步模块源代码，同时为了区分不同的异步模块，还保存着该异步模块对应的标识：chunkId。以上代码主动调用window["webpackJsonp"].push函数，该函数是连接异步模块与主模块的关键函数，该函数定义在主文件中，实际上window["webpackJsonp"].push = webpackJsonpCallback，详细源码咱们看看主文件打包后的代码
```javascript
// main.bundle.js

(function(modules) {
// 获取到异步chunk代码后的回调函数
// 连接两个模块文件的关键函数
function webpackJsonpCallback(data) {
  var chunkIds = data[0]; //data[0]存放了异步模块对应的chunkId
  var moreModules = data[1]; // data[1]存放了异步模块代码

  // 标记异步模块已加载成功
  var moduleId, chunkId, i = 0, resolves = [];
  for(;i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if(installedChunks[chunkId]) {
      resolves.push(installedChunks[chunkId][0]);
    }
    installedChunks[chunkId] = 0;
  }

  // 把异步模块代码都存放到modules中
  // 此时万事俱备，异步代码都已经同步加载到主模块中
  for(moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }

  // 重点：执行resolve() = installedChunks[chunkId][0]()返回promise
  while(resolves.length) {
    resolves.shift()();
  }
};

// 记录哪些chunk已加载完成
var installedChunks = {
  "main": 0
};

// __webpack_require__依然是同步读取模块代码作用
function __webpack_require__(moduleId) {
  ...
}

// 加载异步模块
__webpack_require__.e = function requireEnsure(chunkId) {
  // 创建promise
  // 把resolve保存到installedChunks[chunkId]中，等待代码加载好再执行resolve()以返回promise
  var promise = new Promise(function(resolve, reject) {
    installedChunks[chunkId] = [resolve, reject];
  });

  // 通过往head头部插入script标签异步加载到chunk代码
  var script = document.createElement('script');
  script.charset = 'utf-8';
  script.timeout = 120;
  script.src = __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".bundle.js"
  var onScriptComplete = function (event) {
    var chunk = installedChunks[chunkId];
  };
  script.onerror = script.onload = onScriptComplete;
  document.head.appendChild(script);

  return promise;
};

var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
// 关键代码： window["webpackJsonp"].push = webpackJsonpCallback
jsonpArray.push = webpackJsonpCallback;

// 入口执行
return __webpack_require__(__webpack_require__.s = "./src/main.js");
})
({
"./src/add.js": (function(module, __webpack_exports__, __webpack_require__) {...}),

"./src/main.js": (function(module, exports, __webpack_require__) {
  // 同步方式
  var Add = __webpack_require__("./src/add.js").default;
  console.log(Add, Add(1, 2), 123);

  // 异步方式
  var asyncModuleWarp =function () {
    var _ref = _asyncToGenerator( regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        // 执行到异步代码时，会去执行__webpack_require__.e方法
        // __webpack_require__.e其返回promise，表示异步代码都已经加载到主模块了
        // 接下来像同步一样，直接加载模块
        return __webpack_require__.e(0)
              .then(__webpack_require__.bind(null, "./src/async.js"))
      }, _callee);
    }));

    return function asyncModuleWarp() {
      return _ref.apply(this, arguments);
    };
  }();
  console.log(asyncModuleWarp().default, 234)
})
});
```
从上面源码可以知道，webpack实现模块的异步加载有点像jsonp的流程。在主js文件中通过在head中构建script标签方式，异步加载模块信息；再使用回调函数webpackJsonpCallback，把异步的模块源码同步到主文件中，所以后续操作异步模块可以像同步模块一样。
源码具体实现流程
* 遇到异步模块时，使用__webpack_require__.e函数去把异步代码加载进来。该函数会在html的head中动态增加script标签，src指向指定的异步模块存放的文件。
* 加载的异步模块文件会执行webpackJsonpCallback函数，把异步模块加载到主文件中。
* 所以后续可以像同步模块一样,直接使用__webpack_require__("./src/async.js")加载异步模块。

注意源码中的primose使用非常精妙，主模块加载完成异步模块才resolve()

* webpack对于ES模块/CommonJS模块的实现，是基于自己实现的webpack_require，所以代码能跑在浏览器中。
* 从 webpack2 开始，已经内置了对 ES6、CommonJS、AMD 模块化语句的支持。但不包括新的ES6语法转为ES5代码，这部分工作还是留给了babel及其插件。
* 在webpack中可以同时使用ES6模块和CommonJS模块。因为 module.exports很像export default，所以ES6模块可以很方便兼容 CommonJS：import XXX from 'commonjs-module'。反过来CommonJS兼容ES6模块，需要额外加上default：require('es-module').default。
* webpack异步加载模块实现流程跟jsonp基本一致。

## 了不起的 Webpack 构建流程学习指南
[了不起的 Webpack 构建流程学习指南](https://mp.weixin.qq.com/s/BKAdclv6UBNfJ7IVJ1WL9g)

## web工程化相关
[从零配置typescript项目](https://juejin.im/post/6856410900577026061)

# 总结
### 1. 一个对象如何复制给另一个对象，互不影响
* Object.assign();
```javascript
let obj1 = { a: 0 , b: { c: 0}};
  let obj2 = Object.assign({}, obj1);
  console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}
   
  obj1.a = 1;
  console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
  console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}
   
  obj2.a = 2;
  console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
  console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 0}}
   
  obj2.b.c = 3;
  console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 3}}
  console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 3}}
  ```

* 简单粗暴的方法  结束两个对象的关联性的问题
```javascript 
   let obj1 = { a: 0 , b: { c: 0}};
   let obj3 = JSON.parse(JSON.stringify(obj1));
   obj1.a = 4;
   obj1.b.c = 4;
   console.log(JSON.stringify(obj3)); // { a: 0, b: { c: 0}}
   ```

### 2.DOMContentLoaded 与 load 的区别 ?
* DOMContentLoaded事件触发时：仅当DOM解析完成后，不包括样式表，图片等资源。
* onload 事件触发时,页面上所有的 DOM,样式表,脚本,图片等资源已经加载完毕。

那我们可以聊一聊它们与async和defer区别

> 带async的脚本一定会在load事件之前执行，可能会在DOMContentLoaded之前或之后执行。
* 情况1：HTML 还没有被解析完的时候，async脚本已经加载完了，那么 HTML 停止解析，去执行脚本，脚本执行完毕后触发DOMContentLoaded事件
* 情况2：HTML 解析完了之后，async脚本才加载完，然后再执行脚本，那么在HTML解析完毕、async脚本还没加载完的时候就触发DOMContentLoaded事件
> 如果 script 标签中包含 defer，那么这一块脚本将不会影响 HTML 文档的解析，而是等到HTML 解析完成后才会执行。而 DOMContentLoaded 只有在 defer 脚本执行结束后才会被触发。
* 情况1：HTML还没解析完成时，defer脚本已经加载完毕，那么defer脚本将等待HTML解析完成后再执行。defer脚本执行完毕后触发DOMContentLoaded事件
* 情况2：HTML解析完成时，defer脚本还没加载完毕，那么defer脚本继续加载，加载完成后直接执行，执行完毕后触发DOMContentLoaded事件

### 3. 防抖节流使用场景
防抖
* search搜索，用户不断输入值时，用防抖来节约Ajax请求,也就是输入框事件。
* window触发resize时，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次

节流
* 鼠标的点击事件，比如mousedown只触发一次
* 监听滚动事件，比如是否滑到底部自动加载更多，用throttle判断
* 比如游戏中发射子弹的频率(1秒发射一颗)

### 4. 谈一谈你对requestAnimationFrame（rAF）理解
> window.requestAnimationFrame() 方法告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。-- MDN
``` javascript
var start = null;
var element = document.getElementById('SomeElementYouWantToAnimate');
element.style.position = 'absolute';

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```
##### rAF与 setTimeout 相比
rAF(requestAnimationFrame) 最大的优势是「由浏览器来决定回调函数的执行时机」。跟着浏览器的绘制走，如果浏览设备绘制间隔是16.7ms，那我就这个间隔绘制；如果浏览设备绘制间隔是10ms, 我就10ms绘制。这样就不会存在过度绘制的问题，动画不会掉帧，自然流畅的说~~</br>
另外它可以自动调节频率。如果callback工作太多无法在一帧内完成会自动降低为30fps。虽然降低了，但总比掉帧好</br>
内部是这么运作的：</br>
浏览器（如页面）每次要洗澡（重绘），就会通知我(requestAnimationFrame)：小丸子，我要洗澡了，你可以跟我一起洗哦！</br>
这是资源非常高效的一种利用方式。怎么讲呢？
* 就算很多个小丸子要一起洗澡，浏览器只要通知一次就可以了。而setTimeout貌似是多个独立绘制。
* 页面最小化了，或者被Tab切换关灯了。页面是不会洗澡的，自然，小丸子也不会洗澡的（没通知啊）。页面绘制全部停止，资源高效利用。有效节省了 CPU 开销</br>
##### CSS3动画不能应用所有属性
使用CSS3动画可以改变高宽，方位，角度，透明度等等。但是，就像六道带土也有弱点一样，CSS3动画也有属性鞭长莫及。比方说scrollTop值。如果我们希望返回顶部是个平滑滚动效果，就目前而言，CSS3似乎是无能为力的。
##### CSS3支持的动画效果有限

### 5. 能不能实现图片的懒加载
1. 拿到所以的图片img dom
2. 重点是第二步，判断当前图片是否到了可视区范围内
3. 到了可视区的高度以后，就将img的data-src属性设置给src
4. 绑定window的scroll事件

###### 第一种方式 clientHeight-scrollTop-offsetTop
``` javascript
let Img = document.getElementsByTagName("img"),
            len = Img.length,
            count = 0; 
        function lazyLoad () {
            let viewH = document.body.clientHeight, //可见区域高度
                scrollTop = document.body.scrollTop; //滚动条距离顶部高度
            for(let i = count; i < len; i++) {
                if(Img[i].offsetTop < scrollTop + viewH ){
                    if(Img[i].getAttribute('src') === 'default.png'){
                        Img[i].src = Img[i].getAttribute('data-src')
                        count++;
                    }
                }
            }
        }
        function throttle(fn, delay) {
            let flag = true,
                timer = null;
            return function (...args) {
                let context = this;
                if (!flag) return;
                flag = false;
                clearTimeout(timer)
                timer = setTimeout(() => {
                    fn.apply(context, args);
                    flag = true;
                }, delay);
            };
        };
        window.addEventListener('scroll', throttle(lazyLoad,1000))
        
        lazyLoad();  // 首次加载
```
###### 第二种方式 使用 element.getBoundingClientRect() API 直接得到 top 值。
``` javascript

let Img = document.getElementsByTagName("img"),
            len = Img.length,
            count = 0; 
        function lazyLoad () {
            let viewH = document.body.clientHeight, //可见区域高度
                scrollTop = document.body.scrollTop; //滚动条距离顶部高度
            for(let i = count; i < len; i++) {
                if(Img[i].getBoundingClientRect().top < scrollTop + viewH ){
                    if(Img[i].getAttribute('src') === 'default.png'){
                        Img[i].src = Img[i].getAttribute('data-src')
                        count++;
                    }
                }
            }
        }
        function throttle(fn, delay) {
            let flag = true,
                timer = null;
            return function (...args) {
                let context = this;
                if (!flag) return;
                flag = false;
                clearTimeout(timer)
                timer = setTimeout(() => {
                    fn.apply(context, args);
                    flag = true;
                }, delay);
            };
        };
        window.addEventListener('scroll', throttle(lazyLoad,1000))

        lazyLoad();  // 首次加载
```

### XSS CSRF
#### 存储型XSS
从图上看，存储型 XSS 攻击大致步骤如下：

* 首先黑客利用站点漏洞将一段恶意 JavaScript 代码提交到网站的数据库中；
* 然后用户向网站请求包含了恶意 JavaScript 脚本的页面；
* 当用户浏览该页面的时候，恶意脚本就会将用户的 Cookie 信息等数据上传到服务器。

比如常见的场景： </br>
在评论区提交一份脚本代码，假设前后端没有做好转义工作，那内容上传到服务器，在页面渲染的时候就会直接执行，相当于执行一段未知的JS代码。这就是存储型 XSS 攻击。</br>

#### 反射型XSS
反射型 XSS 攻击指的就是恶意脚本作为「网络请求的一部分」，随后网站又把恶意的JavaScript脚本返回给用户，当恶意 JavaScript 脚本在用户页面中被执行时，黑客就可以利用该脚本做一些恶意操作。</br>

#### 基于 DOM 的 XSS 攻击
基于 DOM 的 XSS 攻击是不牵涉到页面 Web 服务器的。具体来讲，黑客通过各种手段将恶意脚本注入用户的页面中，在数据传输的时候劫持网络数据包</br>

常见的劫持手段有：

* WIFI路由器劫持
* 本地恶意软件

#### 防范
### CSP
该安全策略的实现基于一个称作 Content-Security-Policy的 HTTP 首部。

可以移步MDN，有更加规范的解释。我在这里就是梳理一下吧。

CSP，即浏览器中的内容安全策略，它的核心思想大概就是服务器决定浏览器加载哪些资源，具体来说有几个功能👇

* 限制加载其他域下的资源文件，这样即使黑客插入了一个 JavaScript 文件，这个 JavaScript 文件也是无法被加载的；
* 禁止向第三方域提交数据，这样用户数据也不会外泄；
* 提供上报机制，能帮助我们及时发现 XSS 攻击。
* 禁止执行内联脚本和未授权的脚本；

### CSRF Token
#### 第一步:将CSRF Token输出到页面中
> 首先，用户打开页面的时候，服务器需要给这个用户生成一个Token，该Token通过加密算法对数据进行加密，一般Token都包括随机字符串和时间戳的组合，显然在提交时Token不能再放在Cookie中了（XSS可能会获取Cookie），否则又会被攻击者冒用。因此，为了安全起见Token最好还是存在服务器的Session中，之后在每次页面加载时，使用JS遍历整个DOM树，对于DOM中所有的a和form标签后加入Token。这样可以解决大部分的请求，但是对于在页面加载之后动态生成的HTML代码，这种方法就没有作用，还需要程序员在编码时手动添加Token。

#### 第二步:页面提交的请求携带这个Token
对于GET请求，Token将附在请求地址之后，这样URL 就变成 http://url?csrftoken=tokenvalue。而对于 POST 请求来说，要在 form 的最后加上：<input type=”hidden” name=”csrftoken” value=”tokenvalue”/>这样，就把Token以参数的形式加入请求了。

#### 第三步：服务器验证Token是否正确
当用户从客户端得到了Token，再次提交给服务器的时候，服务器需要判断Token的有效性，验证过程是先解密Token，对比加密字符串以及时间戳，如果加密字符串一致且时间未过期，那么这个Token就是有效的。
 
 ## 前端登录
 ### Session-cookie
 ### Token
 ### SSO单点登录
 ### OAuth第三方登录
 为什么会有登录这回事: 首先这是因为HTTP是无状态的协议,所谓无状态就是在两次请求之间服务器并不会保存任何的数据
 ### Session-cookie
 1.服务器在接受客户端首次访问时在服务器端创建session，然后保存session(我们可以将session保存在内存中，也可以保存在redis中，推荐使用后者)，然后给这个session生成一个唯一的标识字符串sessionId,然后在响应头中种下这个唯一标识字符串,并通过 Set-Cookie 头信息，将 SessionId 写入 Cookie 中。
 2.浏览器中收到请求响应的时候会解析响应头，然后将sid保存在本地cookie中，浏览器在下次http请求的请求头中会带上该域名下的cookie信息，
 3.服务器在接受客户端请求时会去解析请求头cookie中的sid，服务端通过cookie中的sessionId找到对应的session然后判断该请求是否合法
 #### Session-cookie存在的问题
*  由于服务器端需要对接大量的客户端，也就需要存放大量的 SessionId，这样会导致服务器压力过大。
*  如果服务器端是一个集群，为了同步登录态，需要将 SessionId 同步到每一台机器上，无形中增加了服务器端维护成本。
*  由于 SessionId 存放在 Cookie 中，所以无法避免 CSRF 攻击。常见的方式是使用csrf_token解决

### Token
> Token 是服务端生成的一串字符串，以作为客户端请求的一个令牌。当第一次登录后，服务器会生成一个 Token 并返回给客户端，客户端后续访问时，只需带上这个 Token 即可完成身份认证。无需再次带上用户名和密码。
#### Token 的优缺点
* 服务器端不需要存放 Token，所以不会对服务器端造成压力，即使是服务器集群，也不需要增加维护成本。
* Token 可以存放在前端任何地方，可以不用保存在 Cookie 中，提升了页面的安全性。
* Token 下发之后，只要在生效时间之内，就一直有效，如果服务器端想收回此 Token 的权限，并不容易。
* Token 完全由应用管理，所以它可以避开同源策略. (Cookie是不允许垮域访问的,token不存在)
* Token 支持手机端访问(Cookie不支持手机端访问)
* 服务器只需要对浏览器传来的token值进行解密，解密完成后进行用户数据的查询，如果查询成功，则通过认证.所以，即时有了多台服务器，服务器也只是做了token的解密和用户数据的查询，它不需要在服务端去保留用户的认证信息或者会话信息，这就意味着基于token认证机制的应用不需要去考虑用户在哪一台服务器登录了，这就为应用的扩展提供了便利，解决了session扩展性的弊端。

* 占带宽: 正常情况下token要比 session_id更大，需要消耗更多流量，挤占更多带宽.(不过几乎可以忽略)
* 性能问题: 相比于session-cookie来说，token需要服务端花费更多的时间和性能来对token进行解密验证.其实Token相比于session-cookie来说就是一个"时间换空间"的方案.

#### Token与session的区别 
* 使用Token,服务端不需要保存状态. 在session中sessionid 是一个唯一标识的字符串，服务端是根据这个字符串，来查询在服务器端保持的session，这里面才保存着用户的登陆状态。但是token本身就是一种登陆成功凭证，他是在登陆成功后根据某种规则生成的一种信息凭证，他里面本身就保存着用户的登陆状态。服务器端只需要根据定义的规则校验这个token是否合法就行。
* Token不需要借助cookie的. session-cookie是需要cookie配合的，那么在http代理客户端的选择上就只有浏览器了，因为只有浏览器才会去解析请求响应头里面的cookie,然后每次请求再默认带上该域名下的cookie。但是我们知道http代理客户端不只有浏览器，还有原生APP等等，这个时候cookie是不起作用的，或者浏览器端是可以禁止cookie的(虽然可以，但是这基本上是属于吃饱没事干的人干的事)，但是token 就不一样，他是登陆请求在登陆成功后再请求响应体中返回的信息，客户端在收到响应的时候，可以把他存在本地的cookie,storage，或者内存中，然后再下一次请求的请求头重带上这个token就行了。简单点来说cookie-session机制他限制了客户端的类型，而token验证机制丰富了客户端类型。
* 时效性。session-cookie的sessionid实在登陆的时候生成的而且在登出事时一直不变的，在一定程度上安全就会低，而token是可以在一段时间内动态改变的。
* 可扩展性。token验证本身是比较灵活的，一是token的解决方案有许多，常用的是JWT,二来我们可以基于token验证机制，专门做一个鉴权服务，用它向多个服务的请求进行统一鉴权。

#### Token过期与Refresh Token
token是访问特定资源的凭证，出于安全考虑,肯定是要有过期时间的。要不然一次登录便可能一直使用，那token认证还有什么意义? token可定是有过期时间的,一般不会很长,不会超高一个小时.</br>
为什么需要refresh token?</br>
如果token过期了，就要重新获取。继续重复第一次获取token的过程(比如登录，扫描授权等)，每一小时就必须获取一次! 这样做是非常不好的用户体验。为了解决这个问题,于是就有了refresh token.通过refresh token去重新获取新的 token.
refresh token，也是加密字符串，并且和token是相关联的。与获取资源的token不同，refresh token的作用仅仅是获取新的token，因此其作用和安全性要求都较低，所以其过期时间也可以设置得长一些,可以以天为最小单位。当然如果refresh token过期了,还是需要重新登录验证的.

#### Token 的生成方式
最常见的 Token 生成方式是使用 JWT（Json Web Token），它是一种简洁的，自包含的方法用于通信双方之间以 JSON 对象的形式安全的传递信息 </br>

使用 Token 后，服务器端并不会存储 Token，那怎么判断客户端发过来的 Token 是合法有效的呢？</br>
答案其实就在 Token 字符串中，其实 Token 并不是一串杂乱无章的字符串，而是通过多种算法拼接组合而成的字符串</br>
```javascript
header 头部
{
  "alg": "HS256",
  "typ": "JWT"
}
payload 负载
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1555341649998
}
signature 签名
```
header里面描述加密算法和token的类型，类型一般都是JWT；</br>
payload里面放的是用户的信息，也就是第一种登录方式中需要维护在服务器端session中的信息；</br>
signature是对前两部分的签名，也可以理解为加密；实现需要一个密钥（secret），这个secret只有服务器才知道，然后使用header里面的算法按照如下方法来加密：</br>
```javascript
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
  ```
总之，最后的 jwt = base64url(header) + "." + base64url(payload) + "." + signature</br>
jwt可以放在response中返回，也可以放在cookie中返回，这都是具体的返回方式，并不重要。</br>
客户端发起请求时，官方推荐放在HTTP header中：
```javascript
Authorization: Bearer <token>
```
这样子确实也可以解决cookie跨域的问题，不过具体放在哪儿还是根据业务场景来定，并没有一定之规。</br>
jwt失效的方法
[可看](https://juejin.im/post/6844903781704941576)

### 单点登录
单点登录（Single Sign On），简称为 SSO，是目前比较流行的企业业务整合的解决方案之一。SSO的定义是在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统。
SSO一般都需要一个独立的认证中心（passport），子系统的登录均得通过passport，子系统本身将不参与登录操作，当一个系统成功登录以后，passport将会颁发一个令牌给各个子系统，子系统可以拿着令牌会获取各自的受保护资源，为了减少频繁认证，各个子系统在被passport授权以后，会建立一个局部会话，在一定时间内可以无需再次向passport发起认证

* 用户访问系统1的受保护资源，系统1发现用户未登录，跳转至sso认证中心，并将自己的地址作为参数
* sso认证中心发现用户未登录，将用户引导至登录页面
* 用户输入用户名密码提交登录申请
* sso认证中心校验用户信息，创建用户与sso认证中心之间的会话，称为全局会话，同时创建授权令牌
* sso认证中心带着令牌跳转会最初的请求地址（系统1）
* 系统1拿到令牌，去sso认证中心校验令牌是否有效
* sso认证中心校验令牌，返回有效，注册系统1
* 系统1使用该令牌创建与用户的会话，称为局部会话，返回受保护资源
* 用户访问系统2的受保护资源
* 系统2发现用户未登录，跳转至sso认证中心，并将自己的地址作为参数
* sso认证中心发现用户已登录，跳转回系统2的地址，并附上令牌
* 系统2拿到令牌，去sso认证中心校验令牌是否有效
* sso认证中心校验令牌，返回有效，注册系统2
* 系统2使用该令牌创建与用户的局部会话，返回受保护资源
用户登录成功之后，会与sso认证中心及各个子系统建立会话，用户与sso认证中心建立的会话称为全局会话，用户与各个子系统建立的会话称为局部会话，局部会话建立之后，用户访问子系统受保护资源将不再通过sso认证中心，全局会话与局部会话有如下约束关系

局部会话存在，全局会话一定存在</br>
全局会话存在，局部会话不一定存在</br>
全局会话销毁，局部会话必须销毁</br>

## OAUth第三方登录，
* 首先，a.com 的运营者需要在微信开放平台注册账号，并向微信申请使用微信登录功能。
* 申请成功后，得到申请的 appid、appsecret。
* 用户在 a.com 上选择使用微信登录。这时会跳转微信的 OAuth 授权登录，并带上 a.com 的回调地址。
* 用户输入微信账号和密码，登录成功后，需要选择具体的授权范围，如：授权用户的头像、昵称等。
* 授权之后，微信会根据拉起 a.com?code=123 ，这时带上了一个临时票据 code。获取 code 之后， a.com 会拿着 code 、appid、appsecret，向微信服务器申请 token，验证成功后，微信会下发一个 token。
*有了 token 之后， a.com 就可以凭借 token 拿到对应的微信用户头像，用户昵称等信息了。a.com 提示用户登录成功，并将登录状态写入 Cooke，以作为后续访问的凭证。

## CDN加速原理
> CDN的全称是(Content Delivery Network)，即内容分发网络.其目的是通过在现有的Internet中增加一层新的CACHE(缓存)层，将网站的内容发布到最接近用户的网络”边缘“的节点，使用户可以就近取得所需的内容，提高用户访问网站的响应速度.提高用户访问网站的响应速度。 </br>
CDN的工作原理就是将您源站的资源缓存到位于全球各地的CDN节点上，用户请求资源时，就近返回节点上缓存的资源，而不需要每个用户的请求都回您的源站获取，避免网络拥塞、缓解源站压力，保证用户访问资源的速度和体验.
![avatar](/image/cdn.png)
![avatar](/image/cdn2.png)
需要使用DNS(域名解析)来引导用户来访问Cache服务器，由于用户访问网站的第一步就是域名解析,所以通过修改dns来引导用户访问是最简单有效的方式 </br>
智能调度DNS是CDN服务中的关键系统 </br>
当用户访问加入CDN服务的网站时，域名解析请求将最终由 “智能调度DNS”负责处理。它通过一组预先定义好的策略，将当时最接近用户的节点地址提供给用户，使用户可以得到快速的服务。同时它需要与分布在各地的CDN节点保持通信，跟踪各节点的健康状态、容量等信息，确保将用户的请求分配到就近可用的节点上.

## 事件循环
如何处理高优先级任务---微任务 ---引入微任务的原因,解决实时性的问题，比如操作dom，执行微任务过程中产生的新的微任务不会推迟到下个宏任务中进行， </br>
产生微任务的两种方式：</br>
* 监控某个DOM节点,当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务
* Promise.resolve Promise.reject
并且我们要知道：
* 宿主（如浏览器）发起的任务称为宏观任务
* JavaScript 引擎发起的任务称为微观任务
如何处理时间长的任务---回调  </br>

浏览器是怎么实现setTimeout的呢？
* setTimeout任务存到哪了？ --- Chrome还维护着一个延迟任务队列，渲染进程会将该定时器的回调任务添加到延迟任务队列中。回调任务的信息包含：回调函数、当前发起时间、延迟执行时间,
* setTimeout到时间后怎么触发？----当主线程执行完任务队列中的一个任务之后，主线程会对延迟任务队列中的任务，通过当前发起时间和延迟执行时间计算出已经到期的任务，然后依次的执行这些到期的任务，等到期的任务全部执行完后，主线程就进入到下一次循环中。
* 取消setTimeout是如何实现的？

* setTimeout存储到延迟任务队列中
* 当主线程执行完任务队列中的一个任务后，计算延迟任务队列中到期到任务，并执行所有到期任务
* 执行完所有到期任务后，让出主线程，进行下一次事件循环

## 十五张图带你彻底搞懂从URL到页面展示发生的故事
[十五张图带你彻底搞懂从URL到页面展示发生的故事](https://mp.weixin.qq.com/s/JbsJO2GCDBFjJztmhPMrcg)

##  在前端开发中，如何获取浏览器的唯一标识
由于不同的系统显卡绘制 canvas 时渲染参数、抗锯齿等算法不同，因此绘制成图片数据的 CRC 校验也不一样。</br>

但是对于常见的需求就有成熟的解决方案，若在生产环境使用，可以使用以下库

fingerprintjs2[3]
它依据以下信息，获取到浏览器指纹信息，「而这些信息，则成为 component」

* canvas
* webgl
* UserAgent
* AudioContext
* 对新式 API 的支持程度等

根据 canvas 可以获取浏览器指纹信息</br>
* 绘制 canvas，获取 base64 的 dataurl
* 对 dataurl 这个字符串进行 md5 摘要计算，得到指纹信息
若在生产环境使用，可以使用 fingerprintjs2，根据业务需求，如单设备是否可跨浏览器，以此选择合适的 component

## 在服务端应用中如何获得客户端 IP
「如果有 x-forwarded-for 的请求头，则取其中的第一个 IP，否则取建立连接 socket 的 remoteAddr。」</br>

而 x-forwarded-for 基本已成为了基于 proxy 的标准 HTTP 头，格式如下，可见第一个 IP 代表其真实的 IP，可以参考 MDN X-Forwarded-For

## CORS 如果需要指定多个域名怎么办
[另一份资料](https://zhuanlan.zhihu.com/p/38972475)
CORS 通过控制 Access-Control-Allow-Origin 控制哪些域名可以共享资源，取值如下</br>
> Access-Control-Allow-Origin: <origin> | *
其中 * 代表所有域名，origin 代表指定特定域名，那如何设置多个域名了？</br>
此时需要通过代码实现，「根据请求头中的 Origin 来设置响应头 Access-Control-Allow-Origin」，那 Origin 又是什么东西？ </br>
并不是所有请求都会自动带上 Origin，在浏览器中带 Origin 的逻辑如下

* 如果存在跨域，则带上 Origin，值为当前域名
* 如果不存在跨域，则不带 Origin
逻辑理清楚后，关于服务器中对于 Access-Control-Allow-Origin 设置多域名的逻辑也很清晰了

* 如果请求头不带有 Origin，证明未跨域，则不作任何处理
* 如果请求头带有 Origin，证明跨域，根据 Origin 设置相应的 Access-Control-Allow-Origin: <Origin>

此时可以给多个域名控制 CORS，但此时假设有两个域名访问 static.shanyue.tech 的跨域资源</br>

* foo.shanyue.tech，响应头中返回 Access-Control-Allow-Origin: foo.shanyue.tech
* bar.shanyue.tech，响应头中返回 Access-Control-Allow-Origin: bar.shanyue.tech
看起来一切正常，但如果中间有缓存怎么办？</br>

* foo.shanyue.tech，响应头中返回 Access-Control-Allow-Origin: foo.shanyue.tech，被 CDN 缓存
* 「bar.shanyue.tech，因由缓存，响应头中返回 Access-Control-Allow-Origin: foo.shanyue.tech，跨域出现问题」
此时，Vary: Origin 就上场了，代表为不同的 Origin 缓存不同的资源</br>

#### 如果服务器未使用“*”，而是指定了一个域，那么为了向客户端表明服务器的返回会根据Origin请求头而有所不同，必须在Vary响应头中包含Origin。

### 简要答案
CORS 如何指定多个域名？

「根据请求头中的 Origin 来设置响应头 Access-Control-Allow-Origin」，思路如下

* 总是设置 Vary: Origin，避免 CDN 缓存破坏 CORS 配置
* 如果请求头不带有 Origin，证明未跨域，则不作任何处理
* 如果请求头带有 Origin，证明浏览器访问跨域，根据 Origin 设置相应的 Access-Control-Allow-Origin: <Origin>

如果是写死的 Access-Control-Allow-Origin，一定不要加 Vary: Origin，如果是根据 Origin请求头动态计算出的Access-Control-Allow-Origin，一定要始终加上Vary: Origin，即便在没有 Origin请求头的情况。 </br>

当然，本文讨论的仅限可缓存的静态资源，如果是为动态接口设置 CORS，反正都不允许缓存，当然也就没这个问题了。

## 如何避免 CDN 为 PC 端缓存移动端页面
如果 PC 端和移动端是一套代码则不会出现这个问题。「这个问题出现在 PC 端和移动端是两套代码，却共用一个域名。」</br>
使用 nginx 配置如下，根据 UA 判断是否移动端，而走不同的逻辑 (判断 UA 是否移动端容易出问题)</br>
解决方案通常使用 Vary 响应头，来控制 CDN 对不同请求头的缓存。</br>

「此处可以使用 Vary: User-Agent ，代表如果 User-Agent 不一样，则重新发起请求，而非从缓存中读取页面」</br>
#### 简答
使用 Vary: User-Agent，根据 UA 进行缓存。</br>

Vary: User-Agent </br>
但最好不要出现这种情况，PC 端和移动端如果是两套代码，建议用两个域名，理由如下
* nginx 判断是否移动端容易出错
* 对缓存不友好

## 如何把 json 数据转化为 demo.json 并下载文件
json 视为字符串，可以利用 DataURL 进行下载</br>

Text -> DataURL </br>

除了使用 DataURL，还可以转化为 Object URL 进行下载 </br>

Text -> Blob -> Object URL </br>

可以把以下代码直接粘贴到控制台下载文件
``` javascript
function download (url, name) {
  const a = document.createElement('a')
  a.download = name
  a.rel = 'noopener'
  a.href = url
  // 触发模拟点击
  a.dispatchEvent(new MouseEvent('click'))
  // 或者 a.click()
}

const json = {
  a: 3,
  b: 4,
  c: 5
}
const str = JSON.stringify(json, null, 2)

// 方案一：Text -> DataURL
const dataUrl = `data:,${str}`
download(dataUrl, 'demo.json')

// 方案二：Text -> Blob -> ObjectURL
const url = URL.createObjectURL(new Blob(str.split('')))
download(url, 'demo1.json')
```
#### 总结
* 模拟下载，可以通过新建一个 <a href="url" download><a> 标签并设置 url 及 download 属性来下载
* 可以通过把 json 转化为 dataurl 来构造 URL
* 以通过把 json 转换为 Blob 再转化为 ObjectURL 来构造 URL

## 在浏览器中如何监听剪切板中内容
通过 Clipboard API 可以获取剪切板中内容，但需要获取到 clipboard-read 的权限</br>
剪贴板 Clipboard API 提供了响应剪贴板命令（剪切、复制和粘贴）与异步读写系统剪贴板的能力。从权限 Permissions API 获取权限之后，才能访问剪贴板内容；如果用户没有授予权限，则不允许读取或更改剪贴板内容</br>
> 例子见MDN

## 既然 cors 配置可以做跨域控制，那可以防止 CSRF 攻击吗 

「对 CORS 一点用也没有」

* 「form 提交不通过 CORS 检测」，你可以在本地进行测试
* 即使通过 xhr 及 fetch 进行提交被 CORS 拦住， 「但是对于简单请求而言，请求仍被发送」，已造成了攻击

## try...catch捕获异常的一个注意点
而 try catch 的作用仅仅是捕获当前调用栈的错误（上面异常传播部分已经讲过了）。因此异步的错误是无法捕获的，比如；
``` javascript
try {
  fs.readFile("something-not-exist.lucifer", (err, data) => {
    if (err) {
      throw err;
    }
  });
} catch (err) {
  console.log("catching an error");
}
```
上面的 catching an error 不会被打印。因为错误抛出的时候， 调用栈中不包含这个 catch 语句，而仅仅在执行fs.readFile的时候才会。</br>
如果我们换成同步读取文件的例子看看：
```javascript
try {
  fs.readFileSync("something-not-exist.lucifer");
} catch (err) {
  console.log("catching an error");
}
```
上面的代码会打印 catching an error。因为读取文件被同步发起，文件返回之前线程会被挂起，当线程恢复执行的时候， fs.readFileSync 仍然在函数调用栈中，因此 fs.readFileSync 产生的异常会冒泡到 catch 语句。</br>

#### 简单来说就是「异步产生的错误不能用 try catch 捕获，而要使用回调捕获。」
可能有人会问了，我见过用 try catch 捕获异步异常啊。比如：

```javascript
rejectIn = (ms) =>
  new Promise((_, r) => {
    setTimeout(() => {
      r(1);
    }, ms);
  });
async function t() {
  try {
    await rejectIn(0);
  } catch (err) {
    console.log("catching an error", err);
  }
}

t();
```
本质上这只是一个语法糖，是 Promise.prototype.catch 的一个语法糖而已。而这一语法糖能够成立的原因在于其用了 Promise 这种包装类型。如果你不用包装类型，比如上面的 fs.readFile 不用 Promise 等包装类型包装，打死都不能用 try catch 捕获。</br>

而如果我们使用 babel 转义下，会发现 try catch 不见了，变成了 switch case 语句。这就是 try catch “可以捕获异步异常”的原因，仅此而已，没有更多。
> 虽然浏览器并不像 babel 转义这般实现，但是至少我们明白了一点。目前的 try catch 的作用机制是无法捕获异步异常的。

## CSP性能优化相关
> CRP又称关键渲染路径,关键渲染路径是指浏览器通过把 HTML、CSS 和 JavaScript 转化成屏幕上的像素的步骤顺序。优化关键渲染路径可以提高渲染性能。关键渲染路径包含了 Document Object Model (DOM)，CSS Object Model (CSSOM)，渲染树和布局。
* 关键资源个数。关键资源个数越多，首次页面的加载时间就会越长。
* 关键资源大小。通常情况下，所有关键资源的内容越小，其整个资源的下载时间也就越短，那么阻塞渲染的时间也就越短。
* 请求关键资源需要多少个RTT（Round Trip Time）。RTT 是网络中一个重要的性能指标，表示从发送端发送数据开始，到发送端收到来自接收端的确认，总共经历的时延。
* 如何减少关键资源的个数？一种方式是可以将 JavaScript 和 CSS 改成内联的形式，比如上图的 JavaScript 和 CSS，若都改成内联模式，那么关键资源的个数就由 3 个减少到了 1 个。另一种方式，如果 JavaScript 代码没有 DOM 或者 CSSOM 的操作，则可以改成 sync 或者 defer 属性
* 如何减少关键资源的大小？可以压缩 CSS 和 JavaScript 资源，移除 HTML、CSS、JavaScript 文件中一些注释内容
* 如何减少关键资源 RTT 的次数？可以通过减少关键资源的个数和减少关键资源的大小搭配来实现。除此之外，还可以使用 CDN 来减少每次 RTT 时长。

* 避免DOM的回流。也就是尽量避免重排和重绘操作。

* 减少 JavaScript 脚本执行时间。有时JavaScript 函数的一次执行时间可能有几百毫秒，这就严重霸占了主线程执行其他渲染任务的时间。针对这种情况我们可以采用以下两种策略：

一种是将一次执行的函数分解为多个任务，使得每次的执行时间不要过久。</br>
另一种是采用 Web Workers。
* DOM操作相关的优化。浏览器有渲染引擎和JS引擎，所以当用JS操作DOM时，这两个引擎要通过接口互相“交流”，因此每一次操作DOM（包括只是访问DOM的属性），都要进行引擎之间解析的开销，所以常说要减少 DOM 操作。总结下来有以下几点：

缓存一些计算属性，如let left = el.offsetLeft。</br>
通过DOM的class来集中改变样式，而不是通过style一条条的去修改。</br>
分离读写操作。现代的浏览器都有渲染队列的机制。</br>
放弃传统操作DOM的时代，基于vue/react等采用virtual dom的框架</br>
* 合理利用 CSS 合成动画。合成动画是直接在合成线程上执行的，这和在主线程上执行的布局、绘制等操作不同，如果主线程被 JavaScript 或者一些布局任务占用，CSS 动画依然能继续执行。所以要尽量利用好 CSS 合成动画，如果能让 CSS 处理动画，就尽量交给 CSS 来操作。

* CSS选择器优化。我们知道CSS引擎查找是从右向左匹配的。所以基于此有以下几条优化方案：

尽量不要使用通配符</br>
少用标签选择器</br>
尽量利用属性继承特性</br>
* CSS属性优化。浏览器绘制图像时，CSS的计算也是耗费性能的，一些属性需浏览器进行大量的计算，属于昂贵的属性（box-shadows、border-radius、transforms、filters、opcity、:nth-child等），这些属性在日常开发中经常用到，所以并不是说不要用这些属性，而是在开发中，如果有其它简单可行的方案，那可以优先选择没有昂贵属性的方案。

* 避免频繁的垃圾回收。我们知道 JavaScript 使用了自动垃圾回收机制，如果在一些函数中频繁创建临时对象，那么垃圾回收器也会频繁地去执行垃圾回收策略。这样当垃圾回收操作发生时，就会占用主线程，从而影响到其他任务的执行，严重的话还会让用户产生掉帧、不流畅的感觉。

一般而言，浏览器解析DNS需要20-120ms，因此DNS解析可优化之处几乎没有。但存在这样一个场景，网站有很多图片在不同域名下，那如果在登录页就提前解析了之后可能会用到的域名，使解析结果缓存过，这样缩短了DNS解析时间，提高网站整体上的访问速度了，这就是DNS预解析。

> X-DNS-Prefetch-Control 头控制着浏览器的 DNS 预读取功能。DNS 预读取是一项使浏览器主动去执行域名解析的功能，其范围包括文档的所有链接，无论是图片的，CSS 的，还是 JavaScript 等其他用户能够点击的 URL。


我们这里就简单看一下如何去做DNS预解析：

在页面头部加入，这样浏览器对整个页面进行预解析
```javascript
<meta http-equiv="x-dns-prefetch-control" content="on">
```
通过 link 标签手动添加要解析的域名，比如：
```javascript
<link rel="dns-prefetch" href="//img10.360buyimg.com"/>
```

## JS继承 ---需要网上继续看完善资料
![avatar](/image/jicheng.png)
![avatar](/image/jicheng2.png)
![avatar](/image/jicheng3.png)
![avatar](/image/jicheng4.png)
![avatar](/image/jicheng5.png)
ES6的 extends的 ES5版本实现</br>
知道了 ES6extends继承做了什么操作和设置 __proto__的知识点后，把上面 ES6例子的用 ES5就比较容易实现了，也就是说实现寄生组合式继承，简版代码就是：
![avatar](/image/jicheng6.png)
![avatar](/image/jicheng7.png)





