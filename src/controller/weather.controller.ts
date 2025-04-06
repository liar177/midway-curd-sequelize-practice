import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { WeatherService } from '../service/weather.service';
import { Context } from '@midwayjs/koa';

@Controller('/')
export class WeatherController {
  @Inject()
  weatherService: WeatherService;

  @Inject()
  ctx: Context;

  @Get('/weather')
  async getWeatherInfo(@Query('cityId') cityId: string): Promise<void> {
    // const result = await this.ctx.render('test', { cityId: cityId });
    const result = await this.weatherService.getWeather(cityId);
    console.log('getWeatherInfo', result);
    if (result) {
      await this.ctx.render('info', result.weatherinfo);
    }
  }
}
