/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
  name: string;
  phone?: string;
  email?: string;
}
export interface GameUser {
  uid: string;
  name: string;
  phone?: string;
  email?: string;
  password?: string;
}

export interface WeatherInfo {
  weatherinfo: {
    city: string;
    cityid: string;
    temp: string;
    WD: string;
    WS: string;
    SD: string;
    AP: string;
    njd: string;
    WSE: string;
    time: string;
    sm: string;
    isRadar: string;
    Radar: string;
  };
}
