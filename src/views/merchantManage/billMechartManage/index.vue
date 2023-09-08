<template>
  <div>
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="供货商账号:">
              <a-input
                v-model:value.trim="where.account"
                placeholder="请输入供货商账号"
                allow-clear
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
      <a-card :bordered="false" class="table-height">
        <BasicTable
          :canResize="false"
          ref="tableRef"
          :api="merchantApi.getMerchantList"
          :where="where"
          :columns="columns"
          showTableSetting
          rowKey="userId"
          :rowSelection="{
            type: 'checkbox',
            selectedRowKeys: checkedKeys,
            onChange: onSelectChange,
          }"
          :scroll="{ x: 1300 }"
        >
          <template #toolbar>
            <div class="table-toolbar">
              <a-space>
                <a-button type="primary" @click="openEdit()">
                  <template #icon>
                    <plus-outlined />
                  </template>
                  <span>新建</span>
                </a-button>
              </a-space>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'realName'">
              <a @click="openEdit(record)">{{ record.realName }}</a>
            </template>

            <!-- table列表状态栏 -->
            <!-- 1是激活，2是禁用 -->
            <template v-if="column.key === 'status'">
              <a-switch
                :checked="record.statusFlag === 1"
                @change="(checked) => editState(checked, record)"
              />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">密码修改</a>
                <a-divider type="vertical" />
                <!-- <a-popconfirm title="确定要删除此用户吗？" @confirm="remove(record)">
                  <a class="guns-text-danger">删除</a>
                </a-popconfirm> -->
              </a-space>
            </template>
          </template>
        </BasicTable>
      </a-card>
    </div>

    <!-- 新增话费商户 -->
    <a-modal
      v-model:visible="addBillMechartVisible"
      title="新增话费商户"
      @ok="confirmAddBillMechart"
    >
      <div>
        <a-form
          class="smart-query-form"
          :model="addBillObj"
          ref="addBillFormRef"
          name="custom-validation"
          :rules="rules1"
        >
          <a-form-item has-feedback label="商户名称" name="nickName" :labelCol="{ span: 4 }">
            <a-input
              type="text"
              style="width: 100%"
              v-model:value="addBillObj.nickName"
              placeholder="商户名称"
            />
          </a-form-item>
          <a-form-item has-feedback label="账号" name="account" :labelCol="{ span: 4 }">
            <a-input
              type="text"
              style="width: 100%"
              v-model:value="addBillObj.account"
              placeholder="账号"
            />
          </a-form-item>
          <a-form-item has-feedback label="密码" name="password" :labelCol="{ span: 4 }">
            <a-input
              style="width: 100%"
              type="password"
              v-model:value="addBillObj.password"
              placeholder="密码"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item has-feedback label="确认密码" name="confirmPassword" :labelCol="{ span: 4 }">
            <a-input
              style="width: 100%"
              type="password"
              v-model:value="addBillObj.repeatPassword"
              placeholder="确认密码"
            />
          </a-form-item>
          <a-form-item has-feedback label="权重" name="weight" :labelCol="{ span: 4 }">
            <a-input
              type="number"
              style="width: 100%"
              v-model:value="addBillObj.weight"
              placeholder="权重"
            />
          </a-form-item>
          <a-form-item has-feedback label="ips" name="ips" :labelCol="{ span: 4 }">
            <a-input style="width: 100%" v-model:value="addBillObj.ips" placeholder="ips" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable } from '/@/components/Table';
  import { onMounted, reactive, ref, createVNode } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { merchantApi } from '/@/api/merchantManage/merchantApi';

  // 搜索数据
  const where = reactive({
    userType: '1',
    account: '',
  });
  //表格配置
  const columns = ref<object[]>([
    { title: '商户账号', dataIndex: 'account' },
    { title: '商户名称', dataIndex: 'nickName' },
    { title: '入驻时间', dataIndex: 'createTime' },
    { title: '商户号', dataIndex: 'merchantNo' },
    { title: '余额', dataIndex: 'balance' },
    { title: '利率', dataIndex: 'rate' },
    { title: '状态', key: 'status', dataIndex: 'status', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 300,
      hideInSetting: true,
    },
  ]);

  // 表验证规则
  const rules1 = {
    account: [{ required: true, validator: validateAccount, trigger: 'change' }],
    nickName: [{ required: true, validator: validateNickName, trigger: 'change' }],
    password: [{ required: true, validator: validatePassword, trigger: 'change' }],
    repeatPassword: [{ required: true, validator: validateRepeatPassword, trigger: 'change' }],
    weight: [{ required: true, validator: validateWeight, trigger: 'change' }],
    ips: [{ required: true, validator: validateIps, trigger: 'change' }],
  };

  function validateAccount(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入账号');
    } else {
      return Promise.resolve();
    }
  }
  function validateNickName(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入商户名称');
    } else {
      return Promise.resolve();
    }
  }
  function validatePassword(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入密码');
    } else {
      return Promise.resolve();
    }
  }
  function validateRepeatPassword(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入确认密码');
    } else if (value !== addBillObj.value.repeatPassword) {
      return Promise.reject('两次输入密码不一样');
    } else {
      return Promise.resolve();
    }
  }
  // function validateModifyConfirmPassword(_rule, value) {
  //   if (value === '') {
  //     return Promise.reject('请输入确认密码');
  //   } else if (value !== modifyPasswordObj.value.password) {
  //     return Promise.reject('两次输入密码不一样');
  //   } else {
  //     return Promise.resolve();
  //   }
  // }
  function validateWeight(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入权重');
    } else {
      return Promise.resolve();
    }
  }
  function validateIps(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入ips');
    } else {
      return Promise.resolve();
    }
  }

  const addBillObj = ref({
    userType: 1,
    nickName: '',
    account: '',
    password: '',
    repeatPassword: '',
    weight: '',
    ips: '',
  });
  const addBillMechartVisible = ref(false);
  const addBillFormRef = ref();

  //编辑
  function openEdit() {
    addBillMechartVisible.value = true;
  }
  function confirmAddBillMechart() {
    addBillFormRef.value
      .validate()
      .then(() => {
        confirmAddBillMecharts();
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  async function confirmAddBillMecharts() {
    let result = await merchantApi.addMerchant(addBillObj.value);
    if (result) {
      addBillMechartVisible.value = false;
      message.success('添加成功');
    } else {
      message.error('添加失败');
    }
  }

  const tableRef = ref(null);
  // 查询
  const reload = () => {
    checkedKeys.value = [];
    tableRef.value.reload({ page: 1 });
  };

  // async function getMerchantList() {
  //   const result = await merchantApi.getMerchantList(where);
  //   console.log(result);
  // }
  function init() {
    // getMerchantList();
    // tableRef.value.reload({ page: 1 });
  }

  // 重置
  const reset = () => {
    where.account = '';
    reload();
  };

  // 表格多选选中列表
  const checkedKeys = ref<Array<string | number>>([]);
  // 表格选中改变
  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    checkedKeys.value = selectedRowKeys;
  };

  //改变状态
  function editState() {}

  onMounted(async () => {
    init();
  });
</script>

<style></style>
