import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { GameUser } from '../interface';
@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid: string) {
    const user = await this.userService.getUser({
      uid: uid,
      name: '',
    });
    return { success: true, message: 'OK', data: { user, ctx: this.ctx } };
  }
  @Get('/list')
  async getList() {
    const list = await this.userService.getUserList();
    return {
      success: typeof list === 'string' ? false : true,
      message: 'OK',
      data: { list: typeof list === 'string' ? [] : list },
    };
  }

  @Post('/addOrUpdateUser')
  async addOrUpdateUser() {
    const { ctx } = this;
    const { uid } = ctx.request.body as {
      uid: string;
      name: string;
      phone: string;
      email: string;
    };
    console.log('addOrUpdateUser', ctx.request.body);
    const res = await this.userService.addOrUpdateUser(
      ctx.request.body as GameUser
    );
    return {
      success: true,
      message: uid ? 'update user success' : 'add user success!',
      data: res,
    };
    // return { success: true, message: 'OK', data: user };
  }

  @Post('/deleteUser')
  async deleteUser() {
    const { ctx } = this;
    const { uid } = ctx.request.body as {
      uid: string;
    };
    if (uid) {
      console.log('addOrUpdateUser', ctx.request.body);
      return {
        success: true,
        message: 'delete user success',
        data: null,
      };
    } else {
      return {
        success: false,
        message: 'delete user failed',
        data: null,
      };
    }
    // return { success: true, message: 'OK', data: user };
  }
}
