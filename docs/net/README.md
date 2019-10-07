# 网络内容相关

## 2019最全前端网络相关知识总结大全

本文将涉及一下方面的知识：
```markdown
1. HTTP协议以及相关知识
2. TCP/IP协议族
3. 浏览器缓存
4. 网络安全
```

### 1. HTTP协议

所谓的协议就是完成某项任务的一种通用规则，HTTP协议（超文本传输协议）就是为了完成从WWW服务器传输超文本到本地浏览器的传输协议。HTTP协会定义在七层协议中的**应用层**，默认使用的是80端口，使用TCP协议建立起连接，而不是使用UDP协议的原因是因为在于打开一个网页需要传输很多数据，而TCP协议提供了**传输控制以及按顺序组织数据和错误纠正**。

#####  1.1 HTTP/1.0 与 HTTP/1.1 的区别

+ 缓存处理

  > 在HTTP1.0中主要使用header里的If-Modified-Since,Expires来做为缓存判断的标准，HTTP1.1则引入了更多的**缓存控制策略**例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略

+ 带宽优化以及网络连接的使用

  > HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，**HTTP1.1则在请求头引入了range头域，它允许只请求资源的某个部分，**即返回码是206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。

+ 长连接

  > HTTP 1.1支持**长连接**（PersistentConnection）和请求的**流水线**（Pipelining）处理，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，在HTTP1.1中默认开启Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点。

+ 消息传递

  > 通过connection这个Header来进行client与server的长连接的相关通信，或者通过其他请求头或者响应头来进行客户端与服务端的通信。

+ Host头域

  > 1. 在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）。
  >
  > 2. 在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）。

+ 错误通知的管理

  > 在HTTP1.1中新增了24个错误状态响应码，如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。

+ 内容协商与安全性

  > HTTP 1.1还提供了与身份认证、状态管理和Cache缓存等机制相关的请求头和响应头。HTTP/1.0不支持**文件断点续传**，<code>RANGE:bytes</code>是HTTP/1.1新增内容，HTTP/1.0每次传送文件都是从文件头开始，即0字节处开始。<code>RANGE:bytes=XXXX</code>表示要求服务器从文件XXXX字节处开始传送，这就是我们平时所说的断点续传！

##### 1.2  HTTP 1.x与 HTTP 2.0的关键区别

+ 多路复用(MultiPlexing)

  > 1. 指在同一个域名下，开启一个TCP的connection，每个请求以stream的方式传输，每个stream有唯一标识，connection一旦建立，后续的请求都可以复用这个connection并且可以同时发送，server端可以根据stream的唯一标识来相应对应的请求。
  > 2. 多路复用也称**连接共享**，HTTP/2 建立起一次连接便可以发起多重的request-response消息，并且发起的这些请求处理都是并行的进行，而不是串行的。一个请求对应一个id,一个连接上可以有多个请求，每个连接的request可以随机的混杂在一起，接收方可以根据request的 id将request再归属到各自不同的服务端请求里面。

  + 多路复用与HTTP/1.1的长连接的区别

    在HTTP1.*中一次连接，一次请求-响应用完便关闭，每发起一次请求都要建立一次TCP连接（而TCP又有慢启动等的问题），这样就造成了请求响应的**时延**比较长，性能低，用户体验不友好。而在HTTP1.1中默认使用**Keep—Alive模式（长连接也叫持久连接）**这个模式使得建立起的一次连接能够发送多次请求，解决了一次连接一次请求的问题（复用TCP的问题）。但是使用长连接发起的多个请求并没有解决**线头阻塞**（Head-Of-Line Blocking），所谓的线头阻塞问题就是建立起一条TCP的连接在同一时间只能允许一个请求经过，后续的请求想要复用这条Connection必须等到前面的请求依次处理完毕才行（以串行方式处理请求）。

+ 二进制分帧(Binary Format)

  + 二进制协议代替文本协议，更加简洁高效。HTTP1.x的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合。基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮。
  + HTTP/2在 应用层(HTTP/2)和传输层(TCP or UDP)之间增加一个**二进制分帧层**解决了HTTP1.1 的性能限制，改进传输性能，实现低延迟和高吞吐量。在二进制分帧层中， HTTP/2 会将所有传输的信息分割为更小的消息和帧（frame）,并对它们采用二进制格式的编码 ，其中 HTTP1.x 的首部信息会被封装到 HEADER frame，而相应的 Request Body 则封装到 DATA frame 里面。

+ 头部压缩(Head Compression)

  + HTTP/1.1并不支持 HTTP 首部压缩，为此 SPDY 和 HTTP/2 应运而生， SPDY 使用的是通用的DEFLATE 算法，而 HTTP/2 则使用了专门为首部压缩而设计的 HPACK 算法。
  + 为什么需要头部压缩？ 
    + HTTP1.x的header带有大量信息，而且每次都要重复发送，造成不必要的数据冗余以及流量消费
    + HTTP2.0可以维护一个字典，差量更新HTTP头部，大大降低因头部传输产生的流量。
    + HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小。

+ 服务器推送（Server Push）
  + 服务端推送能把客户端所需要的资源伴随着index.html一起发送到客户端，省去了客户端重复请求的步骤。正因为没有发起请求，建立连接等操作，所以静态资源通过服务端推送的方式可以极大地提升速度。



##### 1.3 HTTP与HTTPS的区别

+ **需要认证证书**，HTTPS协议需要到CA申请证书，一般免费证书很少，需要交费
+ **传输的数据经过加密**，HTTP协议运行在TCP之上，所有传输的内容都是明文，HTTPS运行在**SSL/TLS协议**之上，SSL/TLS运行在TCP之上，所有传输的内容都经过加密的。
+ **二者使用的端口不一样**，HTTP和HTTPS使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。
+ **有效解决数据劫持问题**，HTTPS可以有效的防止运营商劫持，解决了防劫持的一个大问题

>  为什么说HTTPS是安全的？

> HTTPS加密过程
>
> 1. 发送数据需要进行一次握手
>
> 2. 获得网站证书之后的浏览器需要做的工作
>
> 3. 网站接受浏览器发过来的请求数据之后所要做的工作
> 4. 浏览器解密并计算握手消息的HASH，如果与服务端发来的HASH一致，此时握手过程结束，之后所有的通信数据将由之前浏览器生成的随机密码并利用对称加密算法进行加密

##### 1.4 常见的响应状态码

+ 1xx 临时响应 需要请求者继续执行操作的状态代码 **信息行状态码**  
  
  > **100** （继续） 请求者应当继续提出请求。 服务器返回此代码表示已收到请求的第一部分，正在等待其余部分。  
  **101** (切换协议） 请求者已要求服务器切换协议，服务器已确认并准备切换  
**102** 由WebDAV（RFC 2518）扩展的状态码，代表处理将被继续执行
  
+ 2xx 表明请求已经被正常处理 **成功状态码**
  >常见的状态吗有  
  **200**  OK 表明服务器已经正常处理客户端的请求  
  **201** （已创建）  请求成功并且服务器创建了新的资源  
  **202** （已接受）  服务器已接受请求，但尚未处理。  
  **203** （非授权信息）  服务器已成功处理了请求，但返回的信息可能来自另一来源  
  **204** （无内容）  服务器成功处理了请求，但没有返回任何内容。  
  **205** （重置内容） 服务器成功处理了请求，但没有返回任何内容。  
  **206**  （部分内容）  服务器成功处理了部分 GET 请求

+ 3xx 指重定向， 浏览器要完成处理请求需要执行某些特殊的操作   **重定向状态码**
  > 常见的有  
  **300**  （多种选择）请求的资源可在多处得到  
  **301**  （Moved Permanently 永久移动）**永久重定向** 表示请求的网页已经永久移动到新的位置上去，会自动请求者转至新的位置（URI）  
  **302** （Found 临时移动）**临时重定向** 服务器目前(本次)从不同位置（URI）的网页响应请求，但请求者应继续使用原有位置（URI）来进行以后的请求。  
  **303** （See Other）与302有着相同的功能，但303明确表示本次请求使用的是**Get方法**  
  **304** （Not Modified 未修改） 涉及缓存 超重点 表示自从上次请求后，本次再请求该文件，而该文件并没修改，服务器只返回响应头，不包含响应体（文件）  
  **305**   使用代理） 请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理。  
  **307** （Temporary redirect）**临时重定向** 与302有着相同含义 服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。 307准售标准不会从POST请求方法编程Get请求方法

+ 4xx  指客户端发生错误 **客户端错误状态码**
  > 常见的有  
  **400** （Bad Request） 错误请求 请求报文中存在语法错误  重点  
  **401**  （Unauthorized）请求未授权 重点    
  **402**  保留有效ChargeTo头响应  
  **403**  （Forbidden）请求不允许 请求资源的访问被服务器拒绝 重点  
  **404**  （Not Found）表明请求的资源无法在服务器上查找到， 资源不存在 重点  
  **405**  用户在Request-Line字段定义的方法不允许  


+ 5xx 这类状态通常指服务器端的生的错误  **服务器错误状态码**
  > 常见的有  
  **500**（Internal Server Error 内部资源错误）   
  **501**（服务器不支持请求的函数）  
  **502**（服务器暂时不可用，有时是为了防止发生系统过载）  
  **503**（Service Unavaliable 服务不可用 服务器停机或者超负载）   
  **504**（关口过载，服务器使用另一个关口或服务来响应用户，等待时间设定值较长）  
  **505**（服务器不支持或拒绝支请求头中指定的HTTP版本）

##### 1.5 HTTP/1.1首部常见的字段（47种首部字段）

HTTP首部字段按照实际用途可以分为以下4种类型：

1. 通用首部字段（Gener Header Fileds）
2. 请求首部字段（Request Header Fileds）
3. 响应首部字段（Response Header Fileds）
4. 实体首部字段（Entity Header Fileds）

###### 通用首部字段（9种）

| 首部字段名 | 说明   |
| :--- | ---- |
|  Cache-Control  |  控制缓存行为  （重点掌握）  |
| Connection | 连接管理、逐条首部 |
| Date | 创建报文的日期 |
| Pragma | 报文指令 |
| Trailer | 报文末端的首部一览 |
| Upgrade | 升级为其他协议 |
| via | 代理服务器的相关信息 |
| Wraning | 错误和警告通知 |
| Transfor-Encoding | 报文主体的传输编码格式 |

+ Cache-Control字段的属性值

  ![attr](https://user-gold-cdn.xitu.io/2018/9/10/165c139afae16409?imageslim)

###### 请求首部字段（19种）

| 首部字段名 | 说明   |
| :--- | ---- |
| If-Match | 比较实体标记（ETage） （协商缓存相关）重点 |
| `If-None-Match` | 比较实体标记（ETage）与 If-Match相反  重点 |
| `If-Modified-Since` | 比较资源更新时间（Last-Modified）（协商缓存相关）重点 |
| If-Unmodified-Since | 比较资源更新时间（Last-Modified），与 If-Modified-Since相反 （重点） |
| `Authorization` | web的认证信息 （JWT鉴权相关）重点 |
| Proxy-Authorization | 代理服务器要求web认证信息  重点 |
| Host | 请求资源所在服务器  重点 |
| `User-Agent` | 客户端程序信息   重点 |
| Accept | 客户端或者代理能够处理的媒体类型 |
| Accept-Language | 优先可处理的自然语言 |
| Accept-Encoding | 优先可处理的编码格式 |
| Accept-Charset | 优先可以处理的字符集 |
| From                                    | 用户的邮箱地址 |
| Max-Forwrads | 最大的逐跳次数 |
| Referer | 请求原始放的url （可以结合后端起到一个网站防盗链的作用） |
| Expect | 期待服务器的特定行为 |

###### 响应首部字段（9种）

| 首部字段名         | 说明                                                     |
| :----------------- | -------------------------------------------------------- |
| `ETag`             | 能够表示资源唯一资源的字符串 （协商缓存相关）重点        |
| Age                | 推算资源创建经过时间                                     |
| `vary`             | 代理服务器的缓存信息                                     |
| WWW-Authenticate   | 服务器要求客户端的验证信息                               |
| Proxy-Authenticate | 代理服务器要求客户端的验证信息                           |
| Server             | 服务器的信息                                             |
| `Retry-After`      | 和状态码503 一起使用的首部字段，表示下次请求服务器的时间 |
| Location           | 令客户端重定向的URI                                      |
| Accept-Ranges      | 能接受的字节范围                                         |

###### 实体首部字段（10种）

请求报文和响应报文的实体部分使用的首部字段

| 首部字段名         | 说明                                   |
| :----------------- | -------------------------------------- |
| `Content-Type`     | 实体媒体类型  重点                     |
| `Content-Encoding` | 实体的编码格式  重点                   |
| Content-Length     | 实体的大小（字节）                     |
| Content-Language   | 实体的资源语言                         |
| Content-MD5        | 实体报文的摘要                         |
| Content-Location   | 代替资源的uri                          |
| Content-Rnages     | 实体主体的位置返回                     |
| `Last-Modified`    | 资源最后的修改资源 (协商缓存相关) 重点 |
| `Expires`          | 实体主体的过期资源 （协商缓存）重点    |
| Allow              | 资源可支持http请求的方法               |

+ Content-Type的MIME类型属性值

  [完整的MIME格式类型请自行参考](http://tools.jb51.net/table/http_content_type)

  + 常见的媒体格式类型
  
    > `text/html` ： HTML格式
    > `text/plain` ：纯文本格式      
    > text/xml ：  XML格式
    > image/gif ：gif图片格式    
    > `image/jpeg` ：jpg图片格式 
	  > `image/png`：png图片格式
	
	+ 以application开头的媒体格式类型：
	
	  >  application/xhtml+xml ：XHTML格式
	  >  application/xml     ： XML数据格式
	  >  application/atom+xml  ：Atom XML聚合格式    
	  >  `application/json`    ： JSON数据格式
	  >  application/pdf       ：pdf格式  
	  >  application/msword  ： Word文档格式
	  >  application/octet-stream ： 二进制流数据（如常见的文件下载）
	  >  `application/x-www-form-urlencoded` ： `<form encType="">`中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式） Post方法提交
	
	+ 上传文件之时使用的媒体格式
	
	  > `multipart/form-data` ： 需要在表单中进行文件上传时，就需要使用该格式


###### 其他首部字段

| 首部字段名          | **说明**                                                     |
| ------------------- | ------------------------------------------------------------ |
| `Cookie`            | `请求首部字段` 服务器接收到的Cookie信息，同样可以以多个 Cookie 形式发送 |
| `Set-Cookie`        | 开始状态管理所使用的Cookie信息，`响应首部字段`               |
| X-Frame-Options     | (`响应首部`)<br/> 用于控制网站内容在其他 Web 网站的 Frame 标签内的显示问题。其主要目的是为了防止点击劫持（clickjacking） 攻击。<br/>DENY: 拒绝，SAMEORIGIN:仅同源域名下的页面允许显示加载，其他域名则不行 |
| X-XSS-Protection    | (`响应首部`) <br/>是针对跨站脚本攻击（XSS） 的一种对策， 用于控制浏览器 XSS 防护机制的开关<br/>0:将XSS过来设置为无效状态，1：将XSS过滤设置成有效状态 |
| DNT                 | (`请求首部`)<br/> 其中DNT(Do Not Track),拒绝个人信息被收集，表示拒绝被精准广告追踪的一种方法<br/>0: 同意被追踪，1：拒绝被追踪 |
| P3P                 | (`响应首部`)<br/> P3P（The Platform forPrivacy Preferences， 在线隐私偏好平台） 技术，可以让 Web 网站上的个人隐私变成一种仅供程序可理解的形式， 以达到保护用户隐私的目的。P3P设定步骤：  1：创建P3P隐私 2: 创建P3P隐私对照文件后，保存命名在/w3c/p3p.xml 3：从P3P隐私中新建Compact plicies后，输出到HTTP响应中 |
| Content-Disposition | 表示服务器回复的内容该以何种形式展示，是以内联的形式（即网页或者页面的一部分），还是以附件的形式下载并保存到本地 |

+ 对与Set-Cookie首部字段的各种属性取值如下：

  + expires 

    > 指定浏览器可发送Cookie的有效日期
    > 当expires省略，有效期仅限于维持浏览器会话(Session)时间段内，通常用于浏览器关闭之前

  + path

    > path 属性可用于限制指定 Cookie 的发送范围的文件目录
    > 不过另有办法可避开这项限制， 看来对其作为安全机制的效果不能抱有期待

  + domain

    > 指定的域名可做到与结尾匹配一致。
    > 例如当指定example.com后，除了该域名，[www.example.com](https://link.juejin.im/?target=http%3A%2F%2Fwww.example.com) 或www2.expample.com等都可以发送cookie

  + secure 

    > 限制 Web 页面仅在 HTTPS 安全连接时， 才可以发送 Cookie。当`无该属性`，不论是http,还是https都可以回收该行为
    > 例如：`Set-Cookie: name=value; secure`，仅当在`https://www.example.com/（HTTPS`） 安全连接的情况下才会进行 Cookie 的回收

  + HttpOnly 

    > 它使 JavaScript 脚本无法获得 Cookie。 其主要目的为防止跨站脚本攻击（Cross-sitescripting， XSS） 对 Cookie 的信息窃取
    > 例如：`Set-Cookie: name=zhaoxxx; HttpOnly`,在Web页面可以对Cookie进行读取操作，但是使用javascript的`document.cookie`就无法读取。因此也就无法在 XSS 中利用 JavaScript 劫持Cookie 了

### 2. TCP/IP协议族

##### 2.1 TCP的三次握手

##### 2.2 TCP的四次挥手

##### 2.3 TCP协议与UDP协议



### 3. OSI五层／七层模型
**５层模型**：由底往上可分为　　
+ 物理层
+ 数据链路层
+ 网络层
+ 传输层
+ 应用层  


**７层模型：**
+ 物理层
+ 数据链路层
+ 网络层
+ 传输层
+ 会话层
+ 表示层
+ 应用层

### 4. 浏览器缓存
##### 4.1 浏览器缓存的分类
可以分类**强缓存**以及**协商缓存**
##### 4.2 强缓存
当我们在浏览器请求资源时，先会进行强缓存，所谓的强缓存就是请求资源的时候浏览器首先检
##### 4.3 协商缓存



### 5. 网络安全

+ 主动攻击
+ 被动攻击
+ 防范





---

相关参考文章:

1. [HTTP1.0、HTTP1.1 和 HTTP2.0 的区别](https://juejin.im/entry/5981c5df518825359a2b9476)

2. [如何优雅的谈论HTTP／1.0／1.1／2.0](https://www.jianshu.com/p/52d86558ca57)