<template>
  <div style="height: 100%; padding: 50px">
    <a-card :bordered="false" class="user-info-tabs" style="height: 100%">
      <h1 style="text-align: center; font-weight: bold; margin-bottom: 30px">个人信息</h1>
      <div>
        <a-form
          ref="formRef"
          :model="form"
          :label-col="{ md: { span: 8 }, sm: { span: 24 } }"
          :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
        >
          <a-form-item label="账号" name="account">
            <span>{{ form.account }}</span>
          </a-form-item>
          <a-form-item label="商户号" name="account">
            <span>{{ form.userId }}</span>
          </a-form-item>
          <a-form-item label="秘钥" name="authKey" style="word-wrap: break-word">
            <div
              style="cursor: pointer"
              title="点击复制"
              @click="copyParam('gaegeag1561gaeghtrjntagb0a65a2rg52bavb')"
              >{{ form.authKey }}</div
            >
          </a-form-item>
          <a-form-item label="余额" name="account">
            <span>{{ form.balance }}元</span>
          </a-form-item>
          <a-form-item label="谷歌验证" name="account">
            <span v-if="form.authKey !== null">已绑定</span>
            <a v-else @click="openCode">去绑定</a>
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <!-- 生成谷歌二维码 -->
    <a-modal v-model:visible="operationVisible" :footer="null" title="谷歌二维码">
      <div class="qrcode">
        <img :src="imgUrl" style="margin: 0 auto; width: 200px; height: 200px" />
        <!-- <Qrcode style="margin: 0 auto" :value="imgUrl" :width="200" /> -->
        <div style="text-align: center">扫一扫</div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { MyInfoApi } from '/@/api/dockingManagement/myInfo';
  import useClipboard from 'vue-clipboard3';

  let form = ref({
    account: null,
    userId: null,
    authKey: null,
    balance: null,
  });

  // 复制
  const { toClipboard } = useClipboard();
  async function copyParam(info) {
    try {
      await toClipboard(info);
      message.success('密钥复制成功');
    } catch (e) {
      message.error('浏览器不支持复制，请您手动选择复制');
    }
  }

  //打开弹窗
  //生成谷歌二维码
  let operationVisible = ref(false);
  let imgUrl = ref('');
  async function openCode() {
    await MyInfoApi.bindGoogle({});
    let result = await MyInfoApi.getQrcode({});
    let img = window.URL.createObjectURL(result);
    console.log(img);
    imgUrl.value = img;
    operationVisible.value = true;
  }

  async function init() {
    let result = await MyInfoApi.getMerchantDetail({});
    form.value = result;
  }

  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .qrcode {
    div {
      width: 200px;
      margin: 0 auto;
      canvas {
        margin: 0 auto;
      }
    }
  }
</style>
