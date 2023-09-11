import { defHttp } from '/@/utils/http/axios';

export class ckAccount1Api {
  // 获取小号列表
  static getSmallList(params) {
    return defHttp.post({
      url: `/small/list?cardType=${params.cardType}`,
      params,
    });
  }
  // 获取小号数量
  static getSmallNum(params) {
    return defHttp.post({
      url: `/small/sum?cardType=${params.cardType}`,
      params,
    });
  }
  // 小号登录
  static smallLogin(params) {
    return defHttp.post({
      url: `/small/login?cardType=${params.cardType}`,
      params,
    });
  }
  // 小号开启
  static smallOpen(params) {
    return defHttp.post({
      url: `/small/open?cardType=${params.cardType}`,
      params,
    });
  }
  // 小号上传
  static smallUpload(params) {
    console.log('接口参数', params);
    return defHttp.post({ url: `/small/upload`, params }, { isTransformResponse: false });
  }
}
