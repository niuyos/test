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
}
