# study
### 1. https 连接时如何保证证书是有效的:
1. **CRL（Certificate Revocation List，证书撤销名单）**。PKI 体系中由 CA 维护的一个被撤销证书的列表，浏览器会定时拉
取这个文件。但这个文件的实时性及性能都可能有问题
2. **OCSP（Online Certificate Status Protocol，在线证书状态协议）**。客户端通过 OSCP 服务请求接口来判断某个证书是
否有效

### 2. import moduleName from 'xxModule'和import('xxModule')经过webpack编译打包后最终变成了什么？在浏览器中是怎么运行的？
    第一个import就不用说了，可以说现在的前端项目随处可见，第二个import可以在需要懒加载的地方看到.