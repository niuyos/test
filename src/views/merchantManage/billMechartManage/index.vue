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
      <a-card :bordered="false">
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
          }"
          :scroll="{ x: 1300, y: 10000 }"
        >
          <template #toolbar>
            <div class="table-toolbar">
              <a-space>
                <a-button type="primary" @click="addBillMechart">
                  <template #icon>
                    <plus-outlined />
                  </template>
                  <span>新建</span>
                </a-button>
              </a-space>
            </div>
          </template>
          <template #bodyCell="{ text, column, record }">
            <template v-if="column.dataIndex == 'createTime'">
              {{ text.replace('T', ' ') }}
            </template>

            <!-- table列表状态栏 -->
            <template v-if="column.dataIndex === 'creditOperation'">
              <a @click="creditOperationLog(record)">授信</a>
            </template>
            <template v-if="column.dataIndex === 'statusFlag'">
              <a-switch
                style="margin: 0 10px"
                :disabled="record.statusFlag === '3' ? true : false"
                :checked="record.statusFlag === '1' ? true : false"
                @change="(checked) => changeDisabledFlag(checked, record)"
              />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="editBillMechart(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="modifyPassword(record)">修改密码</a>
                <a-divider type="vertical" />
                <a-popover placement="bottomRight" style="padding: 20px">
                  <template #content>
                    <div style="margin: 0 10px 0">
                      <a @click="viewKey(record)">查看密钥</a>
                      <a-divider type="vertical" />
                      <a @click="resetKey(record)">重置密钥</a>
                      <a-divider type="vertical" />
                      <a @click="deleteMerchant(record)">删除</a>
                    </div>
                  </template>
                  <a>更多</a>
                </a-popover>
              </a-space>
            </template>
          </template>
        </BasicTable>
      </a-card>
    </div>

    <!-- 授信 -->
    <a-modal
      v-model:visible="creditOperationVisible"
      title="余额增减"
      @ok="confirmCreditOperationLog"
    >
      <div>
        <a-form
          class="smart-query-form"
          :model="creditOperationObj"
          ref="creditOperationFormRef"
          name="custom-validation"
          :rules="rules1"
        >
          <a-form-item label="可用余额" name="type" :labelCol="{ span: 4 }">
            <span style="color: red">
              {{ Number(creditOperationObj.balance).toFixed(2) }}&nbsp;</span
            >元
          </a-form-item>
          <a-form-item has-feedback label="操作" name="type" :labelCol="{ span: 4 }">
            <a-radio-group v-model:value="creditOperationObj.type" name="type">
              <a-radio :value="1">增加金额</a-radio>
              <a-radio :value="2">减少金额</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item has-feedback label="金额" name="amount" :labelCol="{ span: 4 }">
            <a-input
              type="number"
              style="width: 100%"
              v-model:value="creditOperationObj.amount"
              placeholder="金额"
              min="0"
            />
          </a-form-item>
          <a-form-item has-feedback label="备注" name="remark" :labelCol="{ span: 4 }">
            <a-input
              style="width: 100%"
              v-model:value="creditOperationObj.remark"
              placeholder="备注"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 新增供货商户 -->
    <a-modal
      v-model:visible="addBillMechartVisible"
      title="新增供货商户"
      @ok="confirmAddBillMechart"
    >
      <div>
        <a-form
          class="smart-query-form"
          :model="addBillObj"
          ref="addBillFormRef"
          name="form_in_modal"
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
          <a-form-item has-feedback label="确认密码" name="repeatPassword" :labelCol="{ span: 4 }">
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
          <a-form-item has-feedback label="ip" name="ips" :labelCol="{ span: 4 }">
            <a-input style="width: 100%" v-model:value="addBillObj.ips" placeholder="ip" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 编辑供货商户-->
    <a-modal v-model:visible="editBillMechartVisible" title="编辑商户" @ok="confirmEditBillMechart">
      <a-form class="smart-query-form" :model="editBillObj" name="form_in_modal" :rules="rules1">
        <a-form-item v-bind="validateInfos.nickName" label="商户名称" :labelCol="{ span: 4 }">
          <a-input
            type="text"
            style="width: 100%"
            v-model:value="editBillObj.nickName"
            placeholder="商户名称"
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.weight" label="权重" :labelCol="{ span: 4 }">
          <a-input
            type="number"
            style="width: 100%"
            v-model:value="editBillObj.weight"
            placeholder="权重"
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.ips" label="绑定ip" :labelCol="{ span: 4 }">
          <a-input
            style="width: 100%"
            v-model:value="editBillObj.ips"
            placeholder="多个英文逗号隔开，例如：108.3.24.121,105.2.51.6"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 密码修改-->
    <a-modal
      v-model:visible="modifyPasswordVisible"
      title="修改商户密码"
      @ok="confirmModifyPassword"
    >
      <div>
        <a-form
          class="smart-query-form"
          :model="modifyPasswordObj"
          ref="modifyPasswordFormRef"
          name="custom-validation"
          :rules="rules2"
        >
          <a-form-item has-feedback label="密码" name="password" :labelCol="{ span: 4 }">
            <a-input
              style="width: 100%"
              type="password"
              v-model:value="modifyPasswordObj.password"
              placeholder="密码"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item has-feedback label="确认密码" name="repeatPassword" :labelCol="{ span: 4 }">
            <a-input
              style="width: 100%"
              type="password"
              v-model:value="modifyPasswordObj.repeatPassword"
              placeholder="确认密码"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 查看密钥-->
    <a-modal v-model:visible="viewKeyVisible" title="查看密钥" :footer="null">
      <div>
        <a-form class="smart-query-form" :model="viewKeyObj">
          <a-form-item label="商户名称" :labelCol="{ span: 7 }">
            <div>{{ viewKeyObj.nickName }}</div>
          </a-form-item>
          <a-form-item label="商户账号" :labelCol="{ span: 7 }">
            <div>{{ viewKeyObj.account }}</div>
          </a-form-item>
          <a-form-item label="商户密钥" :labelCol="{ span: 7 }">
            <span>{{ viewKeyObj.merchantKey }}</span>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable } from '/@/components/Table';
  import { reactive, ref, nextTick, createVNode } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { merchantApi } from '/@/api/merchantManage/merchantApi';
  import { Form } from 'ant-design-vue';
  const useForm = Form.useForm;

  // 搜索数据
  const where = reactive({
    userType: '1',
    account: '',
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
    account: [{ required: true, validator: validateAccount, trigger: ['change', 'blur'] }],
    nickName: [{ required: true, validator: validateNickName, trigger: 'change' }],
    password: [{ required: true, validator: validatePassword, trigger: 'change' }],
    repeatPassword: [{ required: true, validator: validateRepeatPassword, trigger: 'change' }],
    weight: [{ required: true, validator: validateWeight, trigger: 'change' }],
    ips: [{ required: true, validator: validateIps, trigger: 'change' }],
    type: [{ required: true, validator: validateType, trigger: 'change' }],
    amount: [{ required: true, validator: validateAmount, trigger: 'change' }],
    remark: [{ required: true, validator: validateRemark, trigger: 'change' }],
  };
  const rules2 = {
    password: [{ required: true, validator: validatePassword, trigger: 'change' }],
    repeatPassword: [
      { required: true, validator: validateModifyConfirmPassword, trigger: 'change' },
    ],
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
    } else if (value !== addBillObj.password) {
      return Promise.reject('两次输入密码不一样');
    } else {
      return Promise.resolve();
    }
  }
  function validateModifyConfirmPassword(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入确认密码');
    } else if (value !== modifyPasswordObj.password) {
      return Promise.reject('两次输入密码不一样');
    } else {
      return Promise.resolve();
    }
  }
  function validateWeight(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入权重');
    } else {
      return Promise.resolve();
    }
  }
  function validateIps(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入ip');
    } else {
      return Promise.resolve();
    }
  }
  function validateType(_rule, value) {
    if (value === '') {
      return Promise.reject('请选择操作类型');
    } else {
      return Promise.resolve();
    }
  }
  function validateAmount(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入金额');
    } else {
      return Promise.resolve();
    }
  }
  function validateRemark(_rule, value) {
    if (value === '') {
      return Promise.reject('请输入备注');
    } else {
      return Promise.resolve();
    }
  }

  //业务操作
  // 授信
  const creditOperationVisible = ref(false);
  const creditOperationObj = reactive({
    userId: '',
    type: 1,
    amount: '',
    remark: '',
    balance: '',
  });
  const creditOperationFormRef = ref();
  function creditOperationLog(record) {
    creditOperationObj.userId = record.userId;
    creditOperationObj.balance = record.balance;
    creditOperationVisible.value = true;
    nextTick(() => {
      creditOperationFormRef.value.resetFields();
    });
  }
  function confirmCreditOperationLog() {
    creditOperationFormRef.value
      .validate()
      .then(() => {
        confirmCreditOperationLogs();
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  async function confirmCreditOperationLogs() {
    console.log(creditOperationObj);
    try {
      await merchantApi.awardCredit(creditOperationObj);
      creditOperationVisible.value = false;
      message.success('操作成功');
      reload();
    } catch {
      message.error('添加失败');
    }
  }

  //新增商户
  const addBillObj = reactive({
    userType: 1,
    nickName: '',
    account: '',
    password: '',
    repeatPassword: '',
    ips: '',
    weight: '',
  });
  const addBillMechartVisible = ref(false);
  const addBillFormRef = ref();
  function addBillMechart() {
    addBillMechartVisible.value = true;
    nextTick(() => {
      addBillFormRef.value.resetFields();
    });
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
    await merchantApi.addMerchant(addBillObj);
    try {
      addBillMechartVisible.value = false;
      message.success('添加成功');
      reload();
    } catch {
      message.error('添加失败');
    }
  }

  // 编辑商户
  let editBillMechartVisible = ref(false);
  const editBillObj = reactive({
    userType: 1,
    userId: '',
    account: '',
    nickName: '',
    ips: '',
    weight: '',
  });
  const { validate, validateInfos } = useForm(editBillObj, rules1);
  function editBillMechart(record) {
    editBillMechartVisible.value = true;
    editBillObj.userId = record.userId;
    editBillObj.account = record.account;
    editBillObj.nickName = record.nickName;
    editBillObj.ips = record.ips;
    editBillObj.weight = record.weight;
  }
  function confirmEditBillMechart() {
    validate()
      .then(() => {
        confirmEditBillMecharts();
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  async function confirmEditBillMecharts() {
    await merchantApi.modifyMerchant(editBillObj);
    try {
      editBillMechartVisible.value = false;
      message.success('修改成功');
      reload();
    } catch {
      message.error('修改失败');
    }
  }

  // 密码修改
  const modifyPasswordVisible = ref(false);
  const modifyPasswordFormRef = ref();
  const modifyPasswordObj = reactive({
    userType: 1,
    userId: '',
    account: '',
    nickName: '',
    ips: '',
    weight: '',
    password: '',
    repeatPassword: '',
  });
  function modifyPassword(record) {
    modifyPasswordVisible.value = true;
    modifyPasswordObj.userId = record.userId;
    modifyPasswordObj.account = record.account;
    modifyPasswordObj.nickName = record.nickName;
    modifyPasswordObj.ips = record.ips;
    modifyPasswordObj.weight = record.weight;
    nextTick(() => {
      modifyPasswordFormRef.value.resetFields();
    });
  }
  function confirmModifyPassword() {
    modifyPasswordFormRef.value
      .validate()
      .then(() => {
        confirmModifyPasswords();
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  async function confirmModifyPasswords() {
    try {
      await merchantApi.modifyMerchant(modifyPasswordObj);
      message.success('修改成功');
      modifyPasswordVisible.value = false;
      reload();
    } catch (e) {
      message.error('修改失败');
    }
  }

  // 改变商户状态
  async function changeDisabledFlag(checked, { userId }) {
    try {
      let statusFlags: string;
      if (!checked) {
        statusFlags = '2';
      } else {
        statusFlags = '1';
      }
      await merchantApi.merchantOpen({ userId, statusFlag: statusFlags });
      message.success('修改成功');
      reload();
    } catch (e) {
      message.error('修改失败');
    }
  }

  // 查看密钥
  const viewKeyVisible = ref(false);
  const viewKeyObj = reactive({
    merchantKey: '',
    account: '',
    nickName: '',
  });
  function viewKey(record) {
    console.log('查看密钥');
    viewKeyObj.nickName = record.nickName;
    viewKeyObj.account = record.account;
    viewKeyObj.merchantKey = record.merchantKey;
    viewKeyVisible.value = true;
  }

  // 重置密钥
  function resetKey(record) {
    Modal.confirm({
      title: '确定重置密钥吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }),
      onOk() {
        confirmResetKey(record);
      },
      onCancel() {
        return false;
      },
      class: 'resetKey',
    });
  }
  async function confirmResetKey({ userId }) {
    try {
      await merchantApi.keyReset({ userId });
      message.success('操作成功');
      reload();
    } catch (e) {
      message.error('修改失败');
    }
  }

  // 删除商户
  function deleteMerchant(record) {
    Modal.confirm({
      title: `确定删除商户名称为【${record.nickName}】的数据吗?`,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }),
      onOk() {
        confirmDeleteMerchant(record);
      },
      onCancel() {
        return false;
      },
      class: 'deleteMerchant',
    });
  }
  async function confirmDeleteMerchant({ userId }) {
    try {
      await merchantApi.merchantDelete({ userId });
      message.success('操作成功');
      reload();
    } catch (e) {
      message.error('修改失败');
    }
  }

  // 查询
  const tableRef = ref();
  const reload = () => {
    tableRef.value.reload({ page: 1 });
  };

  // 重置
  const reset = () => {
    where.account = '';
    reload();
  };
</script>

<style></style>
