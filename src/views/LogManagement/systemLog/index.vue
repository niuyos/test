<template>
  <div>
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="支付订单号:">
              <a-input
                v-model:value.trim="where.paySn"
                placeholder="请输入支付订单号"
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
          :api="LogManagementaApi.getRechargeSystemList"
          :where="where"
          :columns="columns"
          showTableSetting
          rowKey="userId"
          :rowSelection="{
            type: 'checkbox',
          }"
          :scroll="{ x: 1300, y: 10000 }"
        />
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
    paySn: '',
  });
  //表格配置
  const columns = ref<object[]>([
    { title: '商户号', dataIndex: 'merchantNo' },
    { title: '商户账号', dataIndex: 'account' },
    { title: '商户名称', dataIndex: 'nickName' },
    { title: '余额', dataIndex: 'balance' },
    { title: '状态', dataIndex: 'statusFlag', align: 'center' },
    { title: '授信', dataIndex: 'creditOperation', width: 100 },
    { title: '入驻时间', dataIndex: 'createTime', width: 150 },
  ]);
  // 查询
  const tableRef = ref();
  const reload = () => {
    tableRef.value.reload({ page: 1 });
  };

  // 重置
  const reset = () => {
    where.paySn = '';
    reload();
  };
</script>

<style></style>
