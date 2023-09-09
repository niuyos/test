import { defHttp } from '/@/utils/http/axios';

export class merchantApi {
  // 获取商户信息
  static getMerchantList(params) {
    return defHttp.post({
      url: `/merchant/list?userType=${params.userType}&account=${params.account}`,
      params,
    });
  }
  // 新增商户
  static addMerchant(params) {
    return defHttp.post({ url: '/merchant/add', params });
  }
  // 修改商户
  static modifyMerchant(params) {
    return defHttp.post({ url: '/merchant/edit', params });
  }
  // 密钥重置
  static keyReset(params) {
    return defHttp.post({ url: `/merchant/key/reset?userId=${params.userId}`, params });
  }
  //授信
  static awardCredit(params) {
    return defHttp.post({ url: '/merchant/credit', params });
  }
}
