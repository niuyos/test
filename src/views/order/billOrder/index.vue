<!-- <template>
  <div class="ele-body">
    
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-form-item>
            <a-button type="primary">
              <template #icon> <DownloadOutlined /> </template>导出数据
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button v-privilege="'order:batchFailed'">
              <template #icon> <setting-outlined /> </template>批量失败商户
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button>
              <template #icon> <CloseOutlined /> </template>批量失败当前页
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button>
              <template #icon> <CloseOutlined /> </template>批量失败手机号
            </a-button>
          </a-form-item>
        </a-form>
        <a-space>
          <a-row style="margin-top: 20px">
            <a-button type="primary" @click="reload">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-row>
        </a-space>
      </a-card>
    </div>

    <div>
      <a-card :bordered="false" class="table-height">
        <BasicTable
          :canResize="false"
          ref="tableRef"
          :api="SysRoleApi.findPage"
          :where="where"
          :columns="columns"
          :scroll="{ x: 2000 }"
          showTableSetting
          rowKey="roleId"
          :rowSelection="{
            type: 'checkbox',
            selectedRowKeys: checkedKeys,
          }"
        >
          
          <template #toolbar>
            <div class="table-toolbar">
              <a-space>
                <a-button type="primary">
                  <template #icon>
                    <plus-outlined />
                  </template>
                  <span>新建</span>
                </a-button>
              </a-space>
            </div>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'roleName'">
              <a @click="openEdit(record)">{{ record.roleName }}</a>
            </template>

      
            <template v-if="column.key === 'action'">
              <div style="font-size: 12px; display: flex; justify-content: flex-end">
                <a-button type="link" v-if="record.orderStatus === 3" size="small">查单</a-button>
                <a-button type="link" v-if="record.orderStatus === 1" size="small"
                  >关闭订单</a-button
                >
                <a-popover placement="bottomRight">
                  <template #content>
                    <div>
                      <span
                        style="color: #1890ff; margin: 10px; cursor: pointer; font-size: 13px"
                        @click="toViewImg(record, '1')"
                        >旗舰出图</span
                      >
                      <span
                        style="color: #1890ff; margin: 10px; cursor: pointer; font-size: 13px"
                        @click="toViewImg(record, '2')"
                        >财付通出图</span
                      >
                      <span
                        style="color: #1890ff; margin: 10px; cursor: pointer; font-size: 13px"
                        @click="toViewImg(record, '3')"
                        >SP出图</span
                      >
                    </div>
                  </template>
                  <a-button size="small">更多</a-button>
                </a-popover>
              </div>
            </template>
          </template>
        </BasicTable>
      </a-card>
    </div>


    <sys-role-edit v-model:visible="showEdit" :data="current" @done="reload" v-if="showEdit" />
  </div>
</template> -->
<template>
  <div>
    <a-form
      layout="inline"
      class="smart-query-form"
      style="padding: 15px 20px; margin-bottom: 20px"
    >
      <a-form-item>
        <a-button type="primary" @click="visible = true">
          <template #icon>
            <SearchOutlined />
          </template>
          查询条件
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="downloadFile">
          <template #icon> <DownloadOutlined /> </template>导出数据
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="batchFailed" v-privilege="'order:batchFailed'">
          <template #icon> <setting-outlined /> </template>批量失败商户
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="currentFailed">
          <template #icon> <CloseOutlined /> </template>批量失败当前页
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="phoneFailed">
          <template #icon> <CloseOutlined /> </template>批量失败手机号
        </a-button>
      </a-form-item>
      <div style="margin-top: 10px; width: 100%">
        <a-tag color="blue" v-for="(item, key) in orderCacheObj" :key="key">{{
          key.split('data')[1] + '缓存' + item.cache + '/' + item.stock
        }}</a-tag>
      </div>

      <div style="margin-top: 10px; width: 100%">
        <span style="margin-right: 10px">到账中各地区单数：</span>
        <span style="" v-for="(item, index) in areaQuantityObj" :key="index">
          <a-tag v-if="item.area !== null">{{ item.area + ' ' + item.quantity }}</a-tag>
        </span>
      </div>
      <div style="margin-top: 10px; width: 100%">
        <span>今日退款单数：</span>
        <a-tag v-for="(item, index) in refundTodayObj" :key="index">
          {{ item.area + ' ' + item.quantity }}
        </a-tag>
      </div>
      <div style="margin-top: 10px; width: 100%">
        <span style="margin-right: 20px"
          >禁用地区单数：总单数 (<span style="color: blue">{{ banQuanttSum }}</span
          >)</span
        >
        <span v-for="(item, index) in banQuantityObj" :key="index">
          {{ item.type }}：
          <a-tag color="green" v-for="(items, indexs) in item.areaDetail" :key="indexs">
            <span>{{ item.area }}</span>
            {{ items.quantity }}
          </a-tag>
        </span>
      </div>
    </a-form>
    <!-- 查询条件 -->
    <a-drawer
      class="custom-class"
      :width="500"
      :placement="placement"
      v-model:visible="visible"
      :mask="false"
      :maskClosable="true"
    >
      <a-form :model="queryParams" class="smart-query-form">
        <a-form-item
          label="手机号码"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-input v-model:value="queryParams.account" placeholder="按手机号码查询" allow-clear />
        </a-form-item>
        <a-form-item
          label="平台订单号"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-input
            v-model:value="queryParams.platformSn"
            placeholder="按平台订单号查询"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="供货订单号"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-input
            v-model:value="queryParams.partnerSn"
            placeholder="按供货订单号查询"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="供货商ID"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-input v-model:value="queryParams.partnerNo" placeholder="按供货商ID查询" allow-clear />
        </a-form-item>
        <a-form-item
          label="金额"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-input
            v-model:value="queryParams.amount"
            placeholder="按金额查询,例如输入100查询"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="创建时间"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-range-picker
            format="YYYY-MM-DD"
            :placeholder="['创建开始时间', '创建结束时间']"
            style="width: 100%"
            @change="createDateChange"
          />
        </a-form-item>
        <a-form-item
          label="支付时间"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-range-picker
            format="YYYY-MM-DD"
            :placeholder="['支付开始时间', '支付结束时间']"
            style="width: 100%"
            @change="payDateChange"
          />
        </a-form-item>
        <a-form-item
          label="回调状态"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-select
            v-model:value="queryParams.callStatus"
            show-search
            placeholder="回调状态"
            :options="callbackStatusOptions"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="充值状态"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-select
            v-model:value="queryParams.orderStatus"
            show-search
            placeholder="充值状态"
            :options="rechargeStatusOptions"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="到账状态"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-select
            v-model:value="queryParams.isArrival"
            show-search
            placeholder="到账状态"
            :options="arrivalStatusOptions"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="运营商"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-select
            v-model:value="queryParams.accountType"
            show-search
            placeholder="运营商"
            :options="operatorStatusoptions"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="归属地"
          labelAlign="right"
          :labelCol="{ span: 5 }"
          style="margin-bottom: 15px"
        >
          <a-input v-model:value="queryParams.area" placeholder="按归属地查询" allow-clear />
        </a-form-item>
        <a-form-item style="display: flex; align-items: center; width: 100%">
          <div style="display: flex; margin: 0 auto; width: 100%; justify-content: center">
            <a-button
              ref="confirmbtn"
              a-button
              type="primary"
              @click="confirmQuery"
              :loading="loading"
              >{{ loading ? '查询中' : '确认' }}</a-button
            >
            <a-button style="margin-right: 8px" @click="visible = false">取消</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-drawer>

    <a-table
      size="small"
      :dataSource="tableData"
      :columns="columns"
      bordered
      :pagination="false"
      :loading="tableLoading"
      :scroll="{ x: 2000 }"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'orderStatus'">
          <a-tag
            @click="query"
            color="#909399"
            style="margin: 0 auto; font-size: 14px; cursor: pointer"
            v-if="record.orderStatus === 1"
            >待充值<reload-outlined
          /></a-tag>
          <a-tag
            @click="query"
            color="warning"
            style="margin: 0 auto; font-size: 14px; cursor: pointer"
            v-if="record.orderStatus === 2"
          >
            充值中<reload-outlined />
          </a-tag>
          <a-tag
            color="success"
            style="margin: 0 auto; font-size: 14px"
            v-if="record.orderStatus === 3"
          >
            充值成功
          </a-tag>
          <a-tag
            color="error"
            style="margin: 0 auto; font-size: 14px"
            v-if="record.orderStatus === 4"
          >
            充值失败
          </a-tag>
        </template>
        <!-- background-color: #909399; color: #909399; font-size: 14px;cursor: pointer; -->
        <template v-if="column.dataIndex === 'callStatus'">
          <a-tag
            @click="query"
            style="margin: 0 auto; color: #909399; font-size: 14px; cursor: pointer"
            v-if="record.callStatus === 1"
            >未回调<reload-outlined
          /></a-tag>
          <a-tag
            color="success"
            style="margin: 0 auto; border-color: #c2e7b0; font-size: 14px"
            v-if="record.callStatus === 2"
          >
            回调成功
          </a-tag>
          <a-tag
            color="error"
            style="margin: 0 auto; font-size: 14px"
            v-if="record.callStatus === 3"
          >
            回调失败
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'isArrival'">
          <a-tag
            @click="query"
            style="margin: 0 auto; color: #909399; font-size: 14px; cursor: pointer"
            v-if="record.isArrival === 0"
            >未到账<reload-outlined
          /></a-tag>
          <a-tag
            @click="query"
            color="warning"
            style="margin: 0 auto; font-size: 14px; cursor: pointer"
            v-if="record.isArrival === 1"
          >
            到账中<reload-outlined />
          </a-tag>
          <a-tag
            color="success"
            style="margin: 0 auto; border-color: #c2e7b0; font-size: 14px"
            v-if="record.isArrival === 2"
          >
            已到账
          </a-tag>
          <a-tag
            color="error"
            style="margin: 0 auto; font-size: 14px"
            v-if="record.isArrival === 3"
          >
            已退款
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'area'">
          <span style="color: #096dd9">{{ text }}</span>
        </template>
        <template v-if="column.dataIndex === 'accountType'">
          <span style="color: #096dd9">{{
            text === 1 ? '移动' : text === 2 ? '联通' : '电信'
          }}</span>
        </template>
        <template v-if="column.dataIndex === 'useTime'">
          <span>{{
            (record.time === null ? '---' : record.time) +
            '/' +
            (record.timeout === null ? '---' : record.timeout)
          }}</span>
        </template>
        <template v-if="column.dataIndex === 'prePayNames'">
          <span>{{
            (record.prePayName === null ? '' : record.prePayName) +
            (record.prePayId === null ? '' : record.prePayId)
          }}</span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div style="font-size: 12px; display: flex; justify-content: flex-end">
            <a-button
              @click="checkList(record)"
              type="link"
              v-if="record.orderStatus === 3"
              size="small"
              >查单</a-button
            >
            <a-button
              @click="closeList(record)"
              type="link"
              v-if="record.orderStatus === 1"
              size="small"
              >关闭订单</a-button
            >
            <a-popover placement="bottomRight">
              <template #content>
                <div>
                  <span
                    style="color: #1890ff; margin: 10px; cursor: pointer; font-size: 13px"
                    @click="toViewImg(record, '1')"
                    >旗舰出图</span
                  >
                  <span
                    style="color: #1890ff; margin: 10px; cursor: pointer; font-size: 13px"
                    @click="toViewImg(record, '2')"
                    >财付通出图</span
                  >
                  <span
                    style="color: #1890ff; margin: 10px; cursor: pointer; font-size: 13px"
                    @click="toViewImg(record, '3')"
                    >SP出图</span
                  >
                </div>
              </template>
              <a-button size="small">更多</a-button>
            </a-popover>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 批量失败商户 -->
    <a-modal
      v-model:visible="batchFailedVisible"
      title="根据商户号批量失败"
      @ok="confirmBatchFailed"
    >
      <div>
        <a-form
          class="smart-query-form"
          :model="batchFailedObj"
          ref="batchFailedFormRef"
          name="custom-validation"
          :rules="rules1"
        >
          <a-form-item label="商户号" name="partnerNo" :labelCol="{ span: 4 }">
            <a-input
              type="text"
              style="width: 100%"
              v-model:value="batchFailedObj.partnerNo"
              placeholder="请输入商户号"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 批量失败手机号 -->
    <a-modal
      v-model:visible="phoneFailedVisible"
      title="根据手机号批量失败"
      @ok="confirmPhoneFailed"
    >
      <div>
        <a-form
          class="smart-query-form"
          :model="phoneFailedObj"
          ref="phoneFailedFormRef"
          name="custom-validation"
          :rules="rules1"
        >
          <a-form-item label="手机号" name="phoneFailedStr" :labelCol="{ span: 4 }">
            <a-textarea
              type="text"
              style="width: 100%"
              v-model:value="phoneFailedObj.phoneFailedStr"
              :rows="10"
              placeholder="请输入手机号，回车换行输入，请按格式输入，否则无效 例如：
13697894946
16487956484"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 查单弹窗 -->
    <a-modal v-model:visible="checkListVisible" title="查单" :footer="null">
      <div>
        <a-spin tip="Loading..." v-if="checkListLodaing" style="margin: 0 auto; width: 100%" />
        <div v-if="checkListLodaing === false">
          <!-- {{ checkListObj.status }} -->
          {{ '时间：' + checkListObj.addTime }}
          {{
            '----平台订单号' +
            checkListObj.platformSn +
            '----查单订单号' +
            checkListObj.forderId +
            '，渠道-xiaomang'
          }}
          <br />
          {{ '，查单结果-' }}
          {{
            checkListObj.status === '0'
              ? '待充值'
              : checkListObj.status === '-1'
              ? '已取消'
              : checkListObj.status === '1'
              ? '充值中'
              : checkListObj.status === '-2'
              ? '已退款'
              : checkListObj.status === '4'
              ? '已到账'
              : 'status状态非0、-1、1、-2、4'
          }}
          <br />
          <span>
            {{ '，手机号:' + checkListObj.account + '，支付金额:' + checkListObj.amount }}
          </span>
        </div>
      </div>
    </a-modal>

    <div class="smart-query-table-page" style="float: left">
      <a-pagination
        v-if="total > 0"
        showSizeChanger
        showQuickJumper
        show-less-items
        :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryParams.pageNum"
        v-model:current="queryParams.pageNum"
        v-model:pageSize="queryParams.pageSize"
        :total="total"
        @change="query"
        @showSizeChange="query"
        :show-total="(total) => `共${total}条`"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { SysRoleApi } from '/@/api/system/role/SysRoleApi';
  import SysRoleEdit from './role-edit.vue';
  import { message } from 'ant-design-vue';
  // 查询条件
  const where = reactive({
    roleName: '',
    roleCode: '',
  });

  // 多选选中列表
  const checkedKeys = ref<Array<string | number>>([]);

  // 当前行数据
  const current = ref<any>(null);

  // 是否显示新增编辑弹框
  const showEdit = ref<boolean>(false);

  // 表格配置
  const columns = ref<object[]>([
    { title: '角色名称', dataIndex: 'roleName' },
    { title: '平台订单号', dataIndex: 'roleCode' },
    { title: '供货订单号', dataIndex: 'dataScopeType' },
    { title: '金额', dataIndex: 'roleSort' },
    { title: '充值号码', dataIndex: 'roleSort' },
    { title: '供货商', dataIndex: 'roleSort' },
    { title: '提交时间', dataIndex: 'roleSort' },
    { title: '充值状态', dataIndex: 'roleSort' },
    { title: '回调状态', dataIndex: 'roleSort' },
    { title: '到账状态', dataIndex: 'roleSort' },
    { title: '归属地', dataIndex: 'roleSort' },
    { title: '运营商', dataIndex: 'roleSort' },
    { title: '订单用时', dataIndex: 'roleSort' },
    { title: '下单信息', dataIndex: 'roleSort' },
    { title: '匹配时间', dataIndex: 'roleSort' },
    {
      title: '操作',
      key: 'action',
      width: 280,
      align: 'center',
    },
  ]);

  // ref
  const tableRef = ref(null);

  /**
   * 点击查询
   * @author: nxy
   * @Date: 2022-10-12 09:38:18
   */
  const reload = () => {
    checkedKeys.value = [];
    tableRef.value.reload({ page: 1 });
  };

  /**
   * 点击重置
   * @author: nxy
   * @Date: 2022-10-12 09:38:29
   */
  const reset = () => {
    where.roleCode = '';
    where.roleName = '';
    reload();
  };

  /**
   * 删除单个
   *
   * @author chenjinlong
   * @date 2021/4/2 17:03
   */
  const remove = async (row: any) => {
    const result = await SysRoleApi.del({ roleId: row.roleId });
    message.success(result.message);
    reload();
  };

  /**
   * 打开编辑弹窗
   *
   * @author chenjinlong
   * @date 2021/4/2 17:03
   */
  const openEdit = (row: any) => {
    current.value = row;
    showEdit.value = true;
  };
</script>
