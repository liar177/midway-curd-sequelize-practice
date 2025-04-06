import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1743854134902_6123',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
  cors: {
    origin: '*',
  },
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
} as MidwayConfig;
