
## Demo Getting Start

### 下载Demo

```sh
$ git clone https://github.com/wangcheng714/fisp-lsdiff-demo.git
$ cd fisp-lsdiff-demo
$ git submodule init
$ git submodule update
```

关于[git submodule](http://git-scm.com/docs/git-submodule)可以参考这里。

### 运行Demo

```sh
$ fisp release -cmpr common
$ fisp release -cmpr home
$ fisp server init
$ fisp server start
```

### 查看效果

* 浏览页面http://127.0.0.1:8080/查看效果

        1. 查看network首次请求和第二次请求，发送的请求数和请求内容
        2. 查看localStorage存贮的内容
        3. 清空localStorage重新请求页面查看请求
        4. 试着修改一个静态资源文件，重新发布，刷新页面查看请求效果

* 页面闪了一下？

这是因为css也采用了增量更新的方式(异步加载)，导致页面重绘出现闪屏。对此我们也支持css的不同加载方案。
修改common模块"page/layout.tpl"

    删除 cssDiff=true

重新发布预览可以看到一切正常了。详细信息参考下面css增量更新。

## 接入指导

下面是介绍已有产品线如何接入增量更新方案：

### [1]接入fis-postpackager-lsdiff-map插件

* 安装插件

```sh
$ npm install -g fis-postpackager-lsdiff-map
```

* 使用插件

fis-config.js中增加如下配置

	fis.config.merge({
		modules : {
			postpackager : "lsdiff-map"
		}
	});

* 确认效果

```sh
$ fisp release -d output
```

会在output/config目录中生成module.lslist.json和module.lsdata.json文件。

### [2]升级新版Smarty插件

从[这里](https://github.com/wangcheng714/fis-plus-lsidff-plugin)下载支持增量更新的Smarty插件，替换本地的plugin。

### [3]升级新版组件加载类库modjs

从[这里](https://github.com/2betop/mod/mod-ls.js)下载新版支持增量更新的组件类库，替换本地mod.js。

### [4]配置增量更新请求

* 首先你需要下载提供增量更新服务的后端文件ls-diff.php

从[这里](https://github.com/wangcheng714/fis-localstorage-php-backend)下载ls-diff.php文件，部署到模块中(建议common模块)。

配置fis-config.js，讲ls-diff.php发布到config目录.具体配置参考下面：

```javascript
fis.config.get("roadmap.path").unshift({
    reg : /lsdiff\-backend\/ls\-diff\.php/i,
    release : '/config/ls-diff.php'
});
```

* 其次你需要配置服务器将前端更新请求转发到该文件。

对于Fis本地调试：server.conf增加如下配置

	rewrite \/fis-diff /config/ls-diff.php

对于线上服务：

	如果你是apache服务器

### [5]Finish

至此我们已经完成了接入增量更新方案的所有操作。编译看看效果吧。

```sh
$ fisp release -cmpr common
$ fisp release -cmpr home
```


## 使用说明

### 关于统计和收益

增量更新方案在运行中会统计一些请求、下载相关的数据，用以衡量方案对整体项目带来的收益。

统计前需要设置如下配置：

    {%html fid="" sampleRate=%}
    //fid 产品线在fis中的id,如没有请咨询Fis小组
    //sampleRate 统计的采样率，默认为0，必须设置。 sampleRate=0.001 采样率为千分之一

如果你还不了解{html}是神马，请移步[这里](http://oak.baidu.com/docs/fis-plus/user/smarty-plugin.html#html)

想进一步了解统计那些数据、如何衡量、怎么展现请参考[这里](http://fe.baidu.com/doc/oak/docs/framework/localStorage-diff.text#统计与收益)。

### 关于Css增量更新

css默认没有采用增量更新方案，而是通过link全量更新。主要是css的异步加载会带来页面加载初始闪屏的问题。
当然你也可以通过加载进度指示条，延迟渲染来解决，实现css异步加载。开启方式:

    {%html cssDiff=true%}
    //开启css异步加载

### 关于调试

默认的资源加载通过Ajax增量更新，通过Script内嵌到页面不方便功能调试，因此提供了通过Script、Link(src)的方式请求单独的包或者文件的方案。

使用方法 ： 请求页面是添加debug参数

    /home/index?debug=pkg  //通过资源包加载文件
    /home/index?debug=file //通过单独文件独立加载


## FAQ

### 如果静态资源文件很多，内容很大，全部内嵌到页面会导致页面挂掉么？

经测试确认文件多(500个)，内容大(5M)，全都内嵌到页面也没有问题。localStorage存满后会单独请求缺失的内容，不会影响正常功能。

详细的测试案例参考[这里](./tools/readme.md)