import { defHttp, imgHttp } from '/@/utils/http/axios';

export class MyInfoApi {
  // 绑定谷歌验证
  static bindGoogle(params) {
    return defHttp.post({ url: `/merchant/bindGoogle`, params });
  }
  // 获取谷歌验证二维码
  static getQrcode(params) {
    return imgHttp.getImg({ url: `/merchant/qrcode`, params, responseType: 'blob' });
  }
  // 获取个人信息
  static getMerchantDetail(params) {
    return defHttp.post({ url: `/merchant/detail`, params });
  }
}
