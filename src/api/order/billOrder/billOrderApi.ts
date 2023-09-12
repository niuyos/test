import { defHttp } from '/@/utils/http/axios';

export class BillOrderApiApi {
  // 供货单列表
  static getAccountOrderList(params) {
    return defHttp.post({ url: `/accountOrder/phone/list`, params });
  }
  // 供货数据
  static getRechargeOrderList(params) {
    return defHttp.post({ url: `/accountOrder/phone/rechargeOrder`, params });
  }
  // 添加话单
  static addStock(params) {
    return defHttp.post({ url: `/accountOrder/phone/addStock`, params });
  }
  // 上传话单表格
  static uploadBill(params) {
    return defHttp.post({ url: `/accountOrder/phone/upload`, params });
  }
  // 关闭指定单号
  static closeOrder(params) {
    return defHttp.post({ url: `/accountOrder/phone/closeOrder`, params });
  }
  // 关闭手机号
  static closePhone(params) {
    return defHttp.post({ url: `/accountOrder/phone/closePhone?phones=${params.phones}`, params });
  }
  // 关闭指定核销及运营商
  static closeMerchant(params) {
    return defHttp.post({ url: `/accountOrder/phone/closeMerchant`, params });
  }
  // 补发回调
  static callback(params) {
    return defHttp.post({ url: `/accountOrder/phone/callback?id=${params.id}`, params });
  }
  // 话单补单
  static issueOrder(params) {
    return defHttp.post({ url: `/accountOrder/phone/issueOrder?id=${params.id}`, params });
  }
  // 话单解冻
  static lockOrder(params) {
    return defHttp.post({ url: `/accountOrder/phone/lockOrder?id=${params.id}`, params });
  }
}
