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

###### 第一种方式
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
###### 第二种方式