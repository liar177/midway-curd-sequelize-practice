import { Provide } from '@midwayjs/core';
// import { IUserOptions } from '../interface';
import { GameUser } from '../interface';
import { User } from '../entity/user.entity';

// eslint-disable-next-line node/no-extraneous-require
const uniqueString = require('unique-string');
const userList = [];

@Provide()
export class UserService {
  async addOrUpdateUser(options: GameUser) {
    const { uid = '', name} = options;
    // if (!uid) {
    //   return 'uid不能为空';
    // }
    if (!name) {
      return '用户名不能为空';
    }
    const user = await User.findOne({
      where: {
        uid: uid,
      },
    });
    console.log('addOrUpdateUser-find', user);
    if (user) {
      const res = await this.updateUser(options);
      console.log('updateUser-res', res);
      return res;
    } else {
      const uniqueId = uniqueString(); // 生成一个唯一的字符串
      console.log('uniqueId', uniqueId); // 输出生成的唯一字符串
      const option = {
        uid: uniqueId,
        ...options,
      };
      const res = await this.createUser(option);
      userList.push({ uid: uniqueId, ...options });
      console.log('createUser', res, userList);
      return '添加用户成功';
    }
  }
  // 数据库操作-新增user
  async createUser(options: GameUser) {
    const user = new User({
      uid: options.uid || '',
      name: options.name || '',
      phone: options.phone || '',
      email: options.email || '',
      password: options.password || '',
    });
    const res = await user.save();
    return res;
  }
  // 数据库操作-修改user
  async updateUser(options: GameUser) {
    const user = await User.findOne({
      where: {
        uid: options.uid,
      },
    });
    console.log('updateuser-find',user, options);
    const res = await User.update(
      {
        ...options,
      },
      {
        where: { uid: options.uid },
      }
    );
    return res;
  }
  async getUser(options: GameUser) {
    const { uid } = options;
    const list = await User.findAll();
    if (!uid) {
      return '此用户不存在';
    } else if (list.length === 0) {
      return '用户列表为空';
    } else {
      const user = await User.findOne({
        where: {
          uid: options.uid,
        },
      });
      console.log('updateuser-find',user, options);
      return {
        uid: user.uid,
        name: user.name,
        phone: user.phone || '--',
        email: user.email || '--',
      };
    }
  }
  async getUserList() {
    // const { uid } = options;

    // const user = userList.find(user => user.uid === uid);
    const list = await User.findAll();
    console.log('userList', list);
    return list;
  }
}
