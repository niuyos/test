import { defHttp } from '/@/utils/http/axios';

export class LogManagementaApi {
  // 获取余额日志
  static getRechargeLogList(params) {
    return defHttp.post({ url: `/rechargeLog/list`, params });
  }
  // 获取系统费用
  static getRechargeSystemList(params) {
    return defHttp.post({ url: `/rechargeSystem/list`, params });
  }
}
