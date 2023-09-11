<template>
  <div>
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-form-item label="账号">
            <a-input
              v-model:value.trim="where.cardName"
              placeholder="请输入账号"
              allow-clear
              style="width: 160px"
            />
          </a-form-item>
          <a-form-item label="账号状态">
            <a-select
              v-model:value="where.cardStatus"
              @change="handleChangeCardStatus"
              style="width: 160px"
              allowClear
            >
              <a-select-option value="1">正常</a-select-option>
              <a-select-option value="2">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="CK状态">
            <a-select
              v-model:value="where.cardOnline"
              @change="handleChangeCardOnline"
              style="width: 160px"
              allowClear
            >
              <a-select-option value="1">正常</a-select-option>
              <a-select-option value="2">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item label="CK值">
            <a-input v-model:value.trim="where.webCookie" placeholder="请输入CK值" allow-clear />
          </a-form-item> -->
          <a-form-item class="ele-text-center">
            <a-space>
              <a-button type="primary" @click="reload">查询</a-button>
              <a-button @click="reset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
        <a-tag closable style="margin-top: 10px; width: 100%; padding: 5px">
          <a>正常小号数量: {{ smallNum }}</a>
        </a-tag>
      </a-card>
    </div>
    <div>
      <a-card :bordered="false">
        <BasicTable
          :canResize="false"
          ref="tableRef"
          :api="ckAccount1Api.getSmallList"
          :where="where"
          :columns="columns"
          showTableSetting
          rowKey="id"
          :rowSelection="{
            type: 'checkbox',
          }"
          :scroll="{ x: 1500, y: 10000 }"
        >
          <template #toolbar>
            <div class="table-toolbar">
              <a-space>
                <a-upload
                  :file-list="fileList"
                  name="file"
                  :customRequest="customRequest"
                  :headers="headers"
                  method="post"
                  accept=".txt"
                  :maxCount="1"
                >
                  <a-button type="primary">
                    <template #icon>
                      <upload-outlined />
                    </template>
                    <span>导入</span>
                  </a-button>
                </a-upload>
              </a-space>
              <a-divider type="vertical" />
              <a-space>
                <a-button type="primary" @click="allSmallLogin">
                  <template #icon>
                    <send-outlined />
                  </template>
                  <span>全部登录</span>
                </a-button>
              </a-space>
              <a-divider type="vertical" />
              <a-space>
                <a-button type="primary" @click="allSmallOpen(1)">
                  <template #icon>
                    <thunderbolt-outlined />
                  </template>
                  <span>全部开启</span>
                </a-button>
              </a-space>
              <a-divider type="vertical" />
              <a-space>
                <a-button @click="allSmallOpen(2)">
                  <template #icon>
                    <lock-outlined />
                  </template>
                  <span>全部关闭</span>
                </a-button>
              </a-space>
            </div>
          </template>
          <template #bodyCell="{ text, column, record }">
            <template v-if="column.dataIndex === 'password'">
              <a-tooltip placement="topLeft" :title="record.password">
                <div
                  style="
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                  @click="copyPassword(record.password)"
                  tile="点击复制"
                  >{{ record.password }}</div
                >
              </a-tooltip>
            </template>
            <template v-if="column.dataIndex === 'webCookie'">
              <a-tooltip placement="topLeft" :title="record.webCookie">
                <div
                  style="
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                  @click="copyWebCookie(record.webCookie)"
                  tile="点击复制"
                  >{{ record.webCookie }}</div
                >
              </a-tooltip>
            </template>
            <template v-if="column.dataIndex === 'param'">
              <a-tooltip placement="topLeft" :title="record.param">
                <div
                  style="
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                  @click="copyParam(record.param)"
                  tile="点击复制"
                  >{{ record.param }}</div
                >
              </a-tooltip>
            </template>
            <template v-if="column.dataIndex == 'cardStatus'">
              <a-tag :color="text === 1 ? '#87d068' : '#b6b6b6'">{{
                text === 1 ? '正常' : '禁用'
              }}</a-tag>
            </template>
            <template v-if="column.dataIndex == 'createTime'">
              {{ text.replace('T', ' ') }}
            </template>
            <template v-if="column.dataIndex == 'cardType'">
              {{ text === 1 ? '小芒' : '其他' }}
            </template>
            <template v-if="column.dataIndex == 'cardOnline'">
              <a-badge :dot="text === 1 ? true : false" color="#87d068">
                <span :style="text === 1 ? 'color: #87d068;' : 'color: #b6b6b6'">{{
                  text === 1 ? '在线' : '离线'
                }}</span>
              </a-badge>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-popconfirm @confirm="smallIsLogin(record.id)" title="确认登录?">
                  <a>登录</a>
                </a-popconfirm>
                <a-divider type="vertical" />
                <a-popconfirm
                  v-if="record.cardStatus === 2"
                  title="确认开启?"
                  @confirm="smallIsOpen(record.id, 1)"
                >
                  <a style="font-weight: bold">开启</a>
                </a-popconfirm>
                <a-divider
                  v-if="record.cardOnline === 2 && record.cardStatus === 1"
                  type="vertical"
                />
                <a-popconfirm
                  v-if="record.cardOnline === 1 && record.cardStatus === 1"
                  @confirm="smallIsOpen(record.id, 2)"
                  title="确认关闭?"
                >
                  <a>关闭</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </BasicTable>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable } from '/@/components/Table';
  import { reactive, ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { ckAccount1Api } from '/@/api/ckAccountManage/ckAccount1Api';
  import { useUserStore } from '/@/store/modules/user';
  import useClipboard from 'vue-clipboard3';

  // 搜索数据
  const where = reactive({
    cardType: 1,
    cardName: '',
    cardStatus: '',
    // webCookie: '',
    cardOnline: '',
  });

  const handleChangeCardStatus = (value) => {
    console.log(value);
    where.cardStatus = value;
  };
  const handleChangeCardOnline = (value) => {
    console.log(value);
    where.cardOnline = value;
  };

  // 上传文件时候要带header
  const useStore = useUserStore();
  const headers = reactive({
    Authorization: useStore.getToken,
    'content-Type': 'application/json',
  });
  const fileList = ref([]);
  async function customRequest(options) {
    var testmsg = options.file.name.substring(options.file.name.lastIndexOf('.') + 1);
    if (testmsg !== 'txt') {
      fileList.value = [];
      message.warning('上传文件只能是 .txt文件!');
      return false;
    }
    let formData = new FormData();
    formData.append('cardType', 1);
    formData.append('file', options.file);
    await ckAccount1Api.smallUpload(formData);
    message.success('上传成功');
    reload();
  }

  //全部登录
  async function allSmallLogin() {
    let params = {
      id: '',
      cardType: where.cardType,
    };
    await ckAccount1Api.smallLogin(params);
    message.success('全部登录成功');
    reload();
  }
  //全部开启
  async function allSmallOpen(cardStatus) {
    let params = {
      id: '',
      cardStatus,
      cardType: where.cardType,
    };
    await ckAccount1Api.smallOpen(params);
    message.success('全部' + (cardStatus === 1 ? '开启' : '关闭') + '成功');
    reload();
  }
  // 登录单个
  async function smallIsLogin(id) {
    let params = {
      id,
      cardType: where.cardType,
    };
    await ckAccount1Api.smallLogin(params);
    message.success('登录成功');
    reload();
  }
  //开启单个或关闭单个
  async function smallIsOpen(id, cardStatus) {
    let params = {
      id,
      cardStatus,
      cardType: where.cardType,
    };
    await ckAccount1Api.smallOpen(params);
    message.success((cardStatus === 1 ? '开启' : '关闭') + '成功');
    reload();
  }

  //表格配置
  const columns = ref<object[]>([
    { title: 'ID', dataIndex: 'id', width: 100 },
    { title: '账号状态', dataIndex: 'cardStatus', width: 80 },
    { title: '帐号', dataIndex: 'cardName' },
    { title: '密码', dataIndex: 'password' },
    { title: 'CK值', dataIndex: 'webCookie' },
    { title: '参数', dataIndex: 'param' },
    { title: '创建时间', dataIndex: 'createTime', width: 150 },
    { title: 'CK类型', dataIndex: 'cardType' },
    { title: 'CK状态', dataIndex: 'cardOnline' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      hideInSetting: true,
    },
  ]);

  const { toClipboard } = useClipboard();
  // 复制
  async function copyPassword(info) {
    try {
      await toClipboard(info);
      message.success('密码复制成功');
    } catch (e) {
      message.error('浏览器不支持复制，请您手动选择复制');
    }
  }
  // 复制
  async function copyWebCookie(info) {
    try {
      await toClipboard(info);
      message.success('CK值复制成功');
    } catch (e) {
      message.error('浏览器不支持复制，请您手动选择复制');
    }
  }
  // 复制
  async function copyParam(info) {
    try {
      await toClipboard(info);
      message.success('参数复制成功');
    } catch (e) {
      message.error('浏览器不支持复制，请您手动选择复制');
    }
  }

  //小号数量
  let smallNum = ref(0);
  async function getSmallNum() {
    let result = await ckAccount1Api.getSmallNum(where);
    smallNum.value = result;
  }

  // 查询
  const tableRef = ref();
  const reload = () => {
    tableRef.value.reload({ page: 1 });
  };

  // 重置
  const reset = () => {
    where.cardName = '';
    where.cardStatus = '';
    // where.webCookie = '';
    where.cardOnline = '';
    reload();
  };

  onMounted(() => {
    getSmallNum();
  });
</script>

<style></style>
