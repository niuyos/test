import { defHttp } from '/@/utils/http/axios';

export class blanceApi {
  // 获取系统费用余额
  static getRechargeSystemBalance(params) {
    return defHttp.get({ url: `/rechargeSystem/balance`, params });
  }
}
