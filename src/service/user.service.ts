import { Provide } from '@midwayjs/core';
// import { IUserOptions } from '../interface';
import { GameUser } from '../interface';

const userList = [];

@Provide()
export class UserService {
  async getUser(options: GameUser) {
    const { uid } = options;
    if (!uid) {
      return '此用户不存在';
    } else if (userList.length === 0) {
      return '用户列表为空';
    } else {
      const user = userList.find(user => user.uid === uid);
      return {
        uid: user.uid,
        username: user.name,
        phone: user.phone || '--',
        email: user.email || '--',
      };
    }
  }
  async getUserList() {
    // const { uid } = options;
    if (userList.length === 0) {
      return '用户列表为空';
    } else {
      // const user = userList.find(user => user.uid === uid);
      return userList.map(user => {
        return {
          uid: user.uid,
          username: user.name,
          phone: user.phone || '--',
          email: user.email || '--',
        };
      });
    }
  }
}
