import { defHttp } from '/@/utils/http/axios';

export class FinancialManageApi {
  // 核销流水记录
  static getCreditList(params) {
    return defHttp.post({ url: `/credit/list`, params });
  }
}
