function Ajax(options) {
  this.xhr = function() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  };

  this.send = function(options) {
    console.log(options);
    var method = (options.method || "GET").toUpperCase(); // 默认 GET
    var async = options.async || true; // 默认异步
    var url = options.url;  // url
    var data = options.data;  // 发送的数据
    var success = options.success; // 成功回调
    var error = options.error; // 失败回调 
    
    var xhr = this.xhr();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        // status：响应的 HTTP 状态码，以 2 开头的都是成功，304也是
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          success && success(xhr.responseText);
        } else {
          error && error(xhr.status);
        }
      }
    }

    if(method == 'POST') {
      xhr.open(method, url, async);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(this.formsParams(data));
    } else {
      xhr.open(method, url + '?' + this.formsParams(data), async);
      xhr.send(null);
    }
  };

  this.get = function (url, config) {
    this.send(Object.assign({}, config, {
      url: url,
      method: 'GET'
    }));
  };

  this.post = function (url, config) {
    this.send(Object.assign({}, config, {
      url: url,
      method: 'POST'
    }));
  };

  this.formsParams = function(data) {
    console.log(Object.prototype.toString.call(data));
    if(Object.prototype.toString.call(data) === '[object Object]') {
      var query = [];
      for (var key in data) {
        // query.push(key + '=' + data[key]);
        query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key])); // 用于对 URI 中的某一部分进行编码
      }
      // 添加一个随机数参数，防止缓存 
      query.push('timestamp=' + new Date().getTime());
      return query.join('&');
    }
    return 'timestamp=' + new Date().getTime();
  };

  this.isGet = function(method) {
    return /^GET$/i.test(method);
  }
}


// promise 版本
function AjaxP() {
  this.xhr = ()=> {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  };

  this.send = (options)=> {
    console.log(options);
    var method = (options.method || "GET").toUpperCase(); // 默认 GET
    var async = options.async || true; // 默认异步
    var url = options.url;  // url
    var data = options.data;  // 发送的数据

    var that = this;
    
    return new Promise((resolve, reject)=> {
      var xhr = that.xhr();

      xhr.onreadystatechange = ()=> {
        if(xhr.readyState == 4) {
          // status：响应的 HTTP 状态码，以 2 开头的都是成功，304也是
          if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.status);
          }
        }
      }

      if(method == 'POST') {
        xhr.open(method, url, async);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(that.formsParams(data));
      } else {
        xhr.open(method, url + '?' + that.formsParams(data), async);
        xhr.send(null);
      }
    })
  };

  this.get = (url, config)=> {
    return this.send(Object.assign({}, config, {
      url: url,
      method: 'GET'
    }));
  };

  this.post = (url, config)=> {
    console.log({
      ...config, 
      url: url, 
      method: 'POST'
    });
    return this.send({
      ...config, 
      url: url, 
      method: 'POST'
    });
  };

  this.formsParams =(data)=> {
    if(Object.prototype.toString.call(data) === '[object Object]') {
      var query = [];
      for (var key in data) {
        // query.push(key + '=' + data[key]);
        query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key])); // 用于对 URI 中的某一部分进行编码
      }
      // 添加一个随机数参数，防止缓存 
      query.push('timestamp=' + new Date().getTime());
      return query.join('&');
    }
    return 'timestamp=' + new Date().getTime();
  };
}