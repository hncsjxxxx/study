function deep(root) {
    if(!root) {
        return null;
    }
    let res = [];
    let stack = [];
    stack.push(root)
    while(stack.length > 0) {
        let temp = stack.pop();
        res.push(temp);
        let child = temp.children;
        for(let i = child.length - 1 ; i >= 0; i++) {
            stack.push(child[i]);
        }
    } 
    return res;
}

function deep(root) {
    let res = [];
    if(!root) {
        return root;
    }
    res.push(root);
    let child = root.children;
    for(let i = 0; i< child.length; i++) {
        deep(child[i]);
    }
    return root;
}

function guangdu(root) {
    if(!root) {
        return null;
    }
    let res = [];
    let stack = [];
    stack.push(root);
    while(stack.length > 0) {
        let temp = stack.shift();
        res.push(temp);
        let child = temp.children;
        for(let i = 0 ; i< child.length; i++) {
            stack.push(child[i]);
        }
    }
    return res
}

function quickSort(arr) {
    if(arr.length <= 1) {
        return arr;
    }
    let index = Math.floor(arr.length / 2) ;
    let temp = arr.splice(index,1)[0];
    let left = [];
    let right = [];
    for(let i = 0 ; i< arr.length; i++) {
        if(arr[i] < temp) {
            left.push(arr[i]);
        }else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([temp],quickSort(right))
}

function mergeSort(arr) {
    if(arr.length === 1) {
        return arr;
    }
    let index = Math.floor(arr.length / 2);
    let left = arr.slice(0,index);
    let right = arr.slice(index);
    return merge(mergeSort(left),mergeSort(right));
}
function merge(left,right) {
    let res = []
    while(left.length > 0 && right.length > 0) {
        if(left[0] < right[0]) {
            res.push(left.shift());
        }else {
            res.push(right.shift())
        }
    }
    return res.concat(left).concat(right)
}


function handleRequest(urls,max,callback) {
    let count = 0;
    let result =[]
    function request() {
        count++;
        fetch(urls.shift()).then((res) => {
            count--;
            if(urls.length) {
                fetch(urls.shift());
            }else if(count ===0) {
                callback(result);
            }
        }).catch((error) => {

        })
        if(count < max) {
            request();
        }
    }
    request();
}

function myGetData(getData,times,delay) {
    return new Promise((resolve,reject) => {
        function attemp() {
            getData().then(resolve).catch((e) => {
                if(0 === times) {
                    reject(e)
                }else {
                    times--;
                    setTimeout(attemp(),delay);
                }
            })
        }
        attemp();
    })
}

function Promise(executor) {
    let self = this;
    self.data = '';
    self.status = 'pending';
    self.onResolvedCallback = [];
    self.onRejectedCallback = [];
    function resolve(value) {
         // 少写了for循环判断pending状态
        self.data = value;
        self.status = 'resolved';
        for(let i = 0; i < self.onRejectedCallback.length; i++) {
            self.onRejectedCallback[i](value);
        }
    }
    function reject(e) {

    }
    try{
        executor(resolve,reject);
    }catch(e) {
        reject(e);
    }
}

Promise.prototype.then = function(onResolve,onReject) {
    let  self = this;
    let promise2;
    onResolve = typeof onResolve === 'function'?onResolve:function(value) {
        return value;
    }
    onReject = typeof onReject === 'function'? onReject : function(e) {
        throw e
    }
    if(self.status === 'resolve') {
        return promise2 = new Promise((resolve,reject) => {
            // 少写了try catch包裹
            let x = onResolve(self.data);
            if(x instanceof Promise) {
                x.then(resolve,reject);
            }else {
                resolve(x);
            }
        })
    }
    if(self.status === 'reject') {
        return promise2 = new Promise((resolve,reject) => {
            try{
                let x = onReject(self.data);
                if(x instanceof Promise) {
                    x.then(resolve,reject)
                }else {
                    resolve(x);
                }
            }catch{

            }
        })
    }
    if(self.status === 'pending') {
        return promise2 = new Promise((resolve,reject) => {
            self.onResolvedCallback.push(function (value) {
                
            })
        })
    }
}

Promise.all = function(promises) {
    return new Promise((resolve,reject) => {
        let result = [];
        let index = 0;
        let len = promises.length;
        if(len === 0 ) {
            resolve(result);
            return;
        }
        for(let i = 0 ; i < len; i++) {
            Promise.resolve(promises[i]).then((data) => {
                result[i] = data;
                index++;
                if(index === len) {
                    resolve(result);
                }
            }).catch((e) => {
                reject(e);
            })
        }
    })
}

Promise.race = function(promises) {
    return new Promise((resolve,reject) => {
        let len = promises.length;
        if(len === 0 ) {
            return;
        }
        for(let i =0 ; i< len; i++) {
            Promise.resolve(promises[i]).then((data) => {
                resolve(data);
                return;
            }).catch((e) => {
                reject(e);
                return;
            })
        }
    })
}

function debounce(fn,delay) {
    let timer = null;
    return function(...args) {
        let context = this;
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(context,args)
        }, delay);
    }
}

function throttle(fn, delay) {
    let previous = 0;
    return function(...args) {
        let context = this;
        let now = new Date();
        if(now - previous > wait) {
            fn.apply(context,args);
            previous = now;
        }
    }
}

function objectFactory() {
    var obj = new Object();
    Constructor = [].shift.call(arguments);
    obj._proto_ = Constructor.prototype;
    let result = Constructor.apply(obj,arguments);
    return typeof result === 'object'?result:obj;
}

Function.prototype.bind = function(context) {
    let arg1 = Array.prototype.slice.call(arguments,1);
    let self = this;
    return function() {
        let args2 = Array.prototype.slice.call(arguments);
        let args = arg1.concat(args2);
        return self.apply(context,args);

    }
}

function deepCopy(obj) {
    if(typeof obj !== 'object') {
        return ;
    }
    let newObj  = obj instanceof Array ? [] : {};
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj(key) === 'object' ? deepCopy(obj[key]) : obj[key]
        }
    }
}