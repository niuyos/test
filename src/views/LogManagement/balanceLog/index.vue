<template>
  <div>
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="支付商户订单号:">
              <a-input
                v-model:value.trim="where.orderId"
                placeholder="请输入支付商户订单号"
                allow-clear
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item label="手机号:">
              <a-input
                v-model:value.trim="where.phoneNumber"
                placeholder="请输入手机号"
                allow-clear
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item label="通道编码:">
              <a-input
                v-model:value.trim="where.queryCode"
                placeholder="请输入通道编码"
                allow-clear
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item label="话单订单号:">
              <a-input
                v-model:value.trim="where.phoneOrderId"
                placeholder="请输入话单订单号"
                allow-clear
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item class="ele-text-center">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </a-card>
    </div>
    <div>
      <a-card :bordered="false">
        <BasicTable
          :canResize="false"
          ref="tableRef"
          :api="LogManagementaApi.getRechargeLogList"
          :where="where"
          :columns="columns"
          showTableSetting
          rowKey="userId"
          :rowSelection="{
            type: 'checkbox',
          }"
          :scroll="{ x: 1300, y: 10000 }"
        >
          <template #bodyCell="{ text, column, record }">
            <template v-if="column.dataIndex === 'payStatus'">
              {{ text }}
            </template>
          </template>
        </BasicTable>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable } from '/@/components/Table';
  import { reactive, ref } from 'vue';
  import { LogManagementaApi } from '/@/api/LogManagement/LogManagementaApi';

  // 搜索数据
  const where = reactive({
    orderId: '',
    phoneNumber: '',
    queryCode: '',
    phoneOrderId: '',
  });
  //表格配置
  const columns = ref<object[]>([
    { title: '支付商户订单号', dataIndex: 'orderId' },
    { title: '话单订单号', dataIndex: 'phoneOrderId' },
    { title: '支付渠道号', dataIndex: 'payChannelSn' },
    { title: '查询通道', dataIndex: 'queryCode' },
    { title: '手机号', dataIndex: 'phoneNumber' },
    { title: '余额', dataIndex: 'amount', align: 'center' },
    { title: '状态', dataIndex: 'payStatus', width: 100 },
  ]);
  // 查询
  const tableRef = ref();
  const reload = () => {
    tableRef.value.reload({ page: 1 });
  };

  // 重置
  const reset = () => {
    where.orderId = '';
    where.phoneNumber = '';
    where.queryCode = '';
    where.phoneOrderId = '';
    reload();
  };
</script>

<style></style>
