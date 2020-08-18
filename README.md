# 网络
### 1. https 连接时如何保证证书是有效的:
1. **CRL（Certificate Revocation List，证书撤销名单）**。PKI 体系中由 CA 维护的一个被撤销证书的列表，浏览器会定时拉
取这个文件。但这个文件的实时性及性能都可能有问题
2. **OCSP（Online Certificate Status Protocol，在线证书状态协议）**。客户端通过 OSCP 服务请求接口来判断某个证书是
否有效

# WEBPACK
### 1. import moduleName from 'xxModule'和import('xxModule')经过webpack编译打包后最终变成了什么？在浏览器中是怎么运行的？
第一个import就不用说了，可以说现在的前端项目随处可见，第二个import可以在需要懒加载的地方看到.
import经过webpack打包以后变成一些Map对象，key为模块路径，value为模块的可执行函数；
代码加载到浏览器以后从入口模块开始执行，其中执行的过程中，最重要的就是webpack定义的__webpack_require__函数，负责实
际的模块加载并执行这些模块内容，返回执行结果，其实就是读取Map对象，然后执行相应的函数；
当然其中的异步方法（import('xxModule')）比较特殊一些，它会单独打成一个包，采用动态加载的方式，具体过程：当用户触发其
加载的动作时，会动态的在head标签中创建一个script标签，然后发送一个http请求，加载模块，模块加载完成以后自动执行其中的
代码，主要的工作有两个，更改缓存中模块的状态，另一个就是执行模块代码。

# 总结