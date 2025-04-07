## midway-curd-practice

> tech-stack：midwayjs、nodejs、sequelize-typescript

使用midway实现的一个用户信息的增删改查 实践，我觉得作为一个非科班出身的前端，能从curd的实践中认识到非常多东西，也能帮助你无门槛上手其他用nodejs作为基础的前端全栈框架，没错说的就是nuxt和nest，和这两者相比，midway的好处就是无需会vue和react就能直接开发。

#### 学习路线

我在决定玩midway之后，看到需要ts（公司不用所以了解的少）、甚至需要数据库相关的知识，就先去把这两个强关联的知识体系补充了一下：

1. ts：主要就是把各种类型声明、断言以及interface了解了一下（大概时间30分钟），不用太深入，只要你大概能知道为什么报错、怎么解决就行（虽然coplit可以直接一键修复。。）；

2. 数据库:basketball_woman::我选择的是mysql，因为要实现的需求只是用户的增删改查，只要一张表就可以满足，所以sql很合适，而且sql导出数据库很方便。。
   1. 数据库连接、创建（数据库工具使用）；表和表字段的增删改
   2. sql的查询，这是一个庞大的知识体系，只需要知道常见的查询就行，其实和数据库的操作都会有sequelize完成，我们实际上只是操作了sequelize的模型方法；

### 具体已实现功能

1. 获取用户列表（暂时还没有查询条件）
2. 根据用户id（uid）获取用户信息， 接口返回的数据里都把密码给去掉了嘿嘿
3. 新增用户信息
4. 修改（更新）用户信息

当然还有用vue3搭建的一个前端工程做测试，因为实现很简单就不收录到仓库里了（开发态在vite中配一下代理就行）

#### 跨域处理

因为node服务和vue项目都是在本地各占一个端口，前端在vite中配置代理转发就行，midway中是使用了官方推荐的[crossDomain][https://www.midwayjs.org/docs/extensions/cross_domain]这个组件,可以使用origin字段指定允许跨域的url，我直接是全都允许了

```js
  cors: {
    origin: '*',
  },
```

### 面向对象的设计规范

1. controller中编写接口和路由，也只编写接口和路由！

2. service中编写具体的业务逻辑，本次需求是用户的curd，那么service中就自然是与数据库的交互逻辑；

3. 装饰器的概念：我觉得 带有 @开头的指定都可以视为一个对类（或者说对 对象的）装饰器，用于修饰类，用于补充、增加类的功能，有一种锦上添花的感觉，当然，装饰器的使用一定要符合框架规范，最好是根据文档的实践范式去写（有中文文档是一种很幸福的事哈哈）；

   1. 例如@provide和@inject，你在一个controller中使用service需要在开头@provide,实际上**provide**就起到一个**被依赖注入的容器托管，且能被容器中的class注入**，而**inject** 很明显就是指定了冒号后的class注入当前class，由此可窥见一些装饰器的效果，其他的装饰器也应该是类似的效果。

   2. ```js
      // service
      @Provide()
      export class UserService {
        //...
      }
      
      // controller
      @Provide()                      // <------ 由于有 Controller 包含了 Provide 的能力，这里展示的更加完整
      @Controller('/api/user')
      export class APIController {
      
        @Inject()
        userService: UserService;     // <------ 这里的类型是 Class，即会注入一个该类型的实例
      
        //...
      }
      ```

### 数据库连接——sequelize的简单使用

首先，因为每个全栈框架都可能对接入数据库这部分逻辑根据自己框架的设计思路、优势去做一些优化，所以很可能每个框架的**初始配置**都是有些不同的，比如midway：

#### sequelize的初始化配置

[sequelize-midway][https://www.midwayjs.org/docs/extensions/sequelize#%E5%90%AF%E7%94%A8%E7%BB%84%E4%BB%B6]

1. 安装依赖，除了sequelize相关的依赖，数据库driver我选的是和文档一样的mysql2;

2. 启用组件(引用和注册)，就是在src/configuration.ts中添加midway自己的sequelize 组件;

3. 🤠关键点，模型定义：你要创建entity文件夹并根据你设计的表字段（就一个用户表，也没啥好设计的）创建一个模型（user.entity.ts）, 很显然每个属性都对应了表的一个字段

 ```typescript
   import { Table, Model, Column } from 'sequelize-typescript';
   
   @Table
   export class User extends Model {
     @Column({ primaryKey: true })
     uid: string;
     @Column
     name: string;
     @Column
     email: string;
     @Column
     phone: string;
     @Column
     password: string;
   }
 ```
4. 数据源配置（大胆猜测这是和其他框架不同的配置）：大部分配置都可以参照文档中的来，唯一要关注的就是entities属性，entities属性的值就是你刚才创建的user.entity.ts 的User类
   1. ⚠️注意⚠️🤖：**User**这个类名在midway中就表示你的数据库表名叫：**users**  ,midway初始化时会根据你配置中的数据库名称直接去测试是否这个数据库是否存在 这张表，如果不按照这个规范起名字，当然就会报错！

```typescript
  sequelize: {
    dataSource: {
      // 第一个数据源，数据源的名字可以完全自定义
      default: {
        database: 'lstgame1',
        username: 'root',
        password: 'Abc123+++',
        host: 'localhost',
        port: 3306,
        encrypt: false,
        dialect: 'mysql',
        define: { charset: 'utf8' },
        timezone: '+08:00',
        timestamps: true,
        // 本地的时候，可以通过 sync: true 直接 createTable
        sync: false,
        // 实体形式
        // 支持如下的扫描形式，为了兼容我们可以同时进行.js和.ts匹配️
        entities: [
          User,
          // 'entity',                        // 指定目录
          // '**/entity/*.entity.{j,t}s',     // 通配加后缀匹配
        ],
      },

      // 第二个数据源
      // default2: {
      //   // ...
      // },
    },
  },
```

只要完成了这四步之后，就可以根据**sequelize**的文档，注意是sequelize的文档，因为实际用到的能力方法都是sequelize的，所以具体怎么使用要去查看sequelize的文档，这里贴一个[中文文档地址][https://www.sequelize.cn/core-concepts/model-querying-basics]

🙏感谢翻译文档的大佬🙏