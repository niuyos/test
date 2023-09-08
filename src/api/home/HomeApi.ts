import { defHttp } from '/@/utils/http/axios';

export class HomeApi {
  // 获取首页面板信息
  static getHomeView(params) {
    return defHttp.get({ url: '/index/view', params });
  }

  //   获取首页缓存数据
  static getHomeStore(params) {
    return defHttp.get({ url: '/index/store', params });
  }
}
