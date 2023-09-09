<template>
  <div style="padding: 20px">
    <div class="md:flex" style="margin-bottom: 20px">
      <Card
        :loading="loading1"
        size="small"
        :title="'下单总数'"
        class="md:w-1/4 w-full !md:mt-0 !md !mt-5"
        style="margin-right: 10px"
      >
        <template #extra>
          <Tag color="green">日</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo :startVal="1" :endVal="homeViewObj.totalCount" class="text-2xl" />
          <Icon icon="total-sales|svg" :size="40" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span>下单总数{{ homeViewObj.totalCount }}</span>
          <CountTo :startVal="1" :endVal="homeViewObj.totalCount" />
        </div>
      </Card>
      <Card
        :loading="loading1"
        size="small"
        :title="'今日成功金额'"
        class="md:w-1/4 w-full !md:mt-0 !md !mt-5"
        style="margin-right: 10px"
      >
        <template #extra>
          <Tag color="blue">日</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo prefix="$" :startVal="1" :endVal="homeViewObj.successMoney" class="text-2xl" />
          <Icon icon="transaction|svg" :size="40" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span>今日成功金额{{ homeViewObj.successMoney }}</span>
          <CountTo prefix="$" :startVal="1" :endVal="homeViewObj.successMoney" />
        </div>
      </Card>
      <Card
        :loading="loading1"
        size="small"
        :title="'今日成功单数'"
        class="md:w-1/4 w-full !md:mt-0 !md !mt-5"
        style="margin-right: 10px"
      >
        <template #extra>
          <Tag color="red">日</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo :startVal="1" :endVal="homeViewObj.successCount" class="text-2xl" />
          <Icon icon="total-sales|svg" :size="40" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span>今日成功单数{{ homeViewObj.successCount }}</span>
          <CountTo :startVal="1" :endVal="homeViewObj.successCount" />
        </div>
      </Card>
      <Card
        :loading="loading1"
        size="small"
        :title="'微信成功金额'"
        class="md:w-1/4 w-full !md:mt-0 !md !mt-5"
        style="margin-right: 10px"
      >
        <template #extra>
          <Tag color="orange">日</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo prefix="$" :startVal="1" :endVal="homeViewObj.wxPayMoney" class="text-2xl" />
          <Icon icon="transaction|svg" :size="40" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span>微信成功金额{{ homeViewObj.wxPayMoney }}</span>
          <CountTo prefix="$" :startVal="1" :endVal="homeViewObj.wxPayMoney" />
        </div>
      </Card>
      <Card
        :loading="loading1"
        size="small"
        :title="'支付宝成功金额'"
        class="md:w-1/4 w-full !md:mt-0 !mt-5"
      >
        <template #extra>
          <Tag color="purple">日</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo prefix="$" :startVal="1" :endVal="homeViewObj.aliPayMoney" class="text-2xl" />
          <Icon icon="transaction|svg" :size="40" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span>支付宝成功金额{{ homeViewObj.aliPayMoney }}</span>
          <CountTo prefix="$" :startVal="1" :endVal="homeViewObj.aliPayMoney" />
        </div>
      </Card>
    </div>
    <div class="md:flex">
      <Card :loading="loading2" size="small" class="md:w-2/5 w-full !md:mt-0 !md !mt-5">
        <template #title>
          <div>
            <div>
              库存缓存<a style="margin-left: 20px">可用小号：{{ smallCount }}</a>
            </div>
          </div>
        </template>
        <template #extra>
          <Tag color="green">日</Tag>
        </template>
        <div
          class="py-4 px-4 flex justify-between items-center"
          style="display: flex; justify-content: space-between; align-items: center; width: 100%"
        >
          <div style="width: 10%; text-align: center">金额</div>
          <div style="width: 80%; text-align: center">库存</div>
          <div style="width: 10%; text-align: center">缓存</div>
        </div>
        <div
          v-for="(item, index) in moneys"
          :key="index"
          class="py-4 px-4 flex justify-between items-center"
          style="display: flex; justify-content: space-between; align-items: center; width: 100%"
        >
          <div style="width: 10%; text-align: center">{{ item }}</div>
          <div style="width: 80%; text-align: center">{{ stockCacheInfo[index].stock }}</div>
          <div style="width: 10%; text-align: center">{{ stockCacheInfo[index].cache }}</div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';

  import { CountTo } from '/@/components/CountTo/index';
  import { Icon } from '/@/components/Icon';
  import { HomeApi } from '/@/api/home/HomeApi';
  import { Tag, Card } from 'ant-design-vue';
  import { number, string } from 'vue-types';

  function init() {
    getHomeView();
    getHomeStore();
  }

  let loading1 = ref(true);
  let loading2 = ref(true);

  let homeViewObj: object = reactive<object>({
    totalCount: 0,
    successMoney: 0,
    successCount: 0,
    wxPayMoney: 0,
    aliPayMoney: 0,
  });
  let stockCacheInfo: Array<Object> = reactive<Array<object>>([]);
  let moneys: Array<String> = reactive<Array<String>>([]);
  let smallCount = ref(0);

  async function getHomeView() {
    const result = await HomeApi.getHomeView({});
    loading1.value = false;
    homeViewObj = result;
  }
  async function getHomeStore() {
    const result = await HomeApi.getHomeStore({});
    loading2.value = false;
    moneys = result.smallCount;
    let resultArr = Object.keys(result);
    resultArr.pop();
    let arr: Array<String> = [];
    resultArr.forEach((item) => {
      arr.push(item.replace('data', ''));
    });
    moneys = arr;

    let resultArr2 = Object.values(result);
    resultArr2.pop();
    let arr2: Array<String> = [];
    resultArr2.forEach((item) => {
      arr2.push(item);
    });
    stockCacheInfo = arr2;
  }

  onMounted(async () => {
    init();
  });
</script>
