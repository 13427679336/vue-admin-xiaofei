<template>
  <div>
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column prop="address" label="默认图片" width="150">
        <template slot-scope="{ row, index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row, index }">
          <el-button
            type="success"
            icon="el-icon-download"
            circle
            v-if="row.isSale == 1"
            @click="cancle(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-upload2"
            circle
            v-else
            @click="Sale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            circle
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="Del(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="skuList"
      :current-page="page"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="limit"
      :pager-count="5"
      layout="prev, pager, next, jumper, ->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="40%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              style="margin-right: 10px"
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="680px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: "1",
      limit: "10",
      total: "0",
      records: [],
      skuInfo: {}, //存储sku信息用于展示
      show: false,
    };
  },
  mounted() {
    this.skuList();
  },
  methods: {
    async skuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.Sku.reqGetSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.skuList();
    },
    // 上架
    async Sale(row) {
      let result = await this.$API.Sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 下架
    async cancle(row) {
      let result = await this.$API.Sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    // 删除
    async Del(row) {
      let result = await this.$API.Sku.reqDel(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.skuList(this.page.length > 1 ? this.page : this.page - 1);
      }
    },
    // 查看
    async getSkuInfo(row) {
      // 显示抽屉效果
      this.show = true;

      let result = await this.$API.Sku.reqLook(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style>
.el-row .el-col-5 {
  font-size: 20px;
  text-align: right;
  font-weight: bold;
}

.el-row .el-col {
  margin: 10px 15px;
}
</style>
<style>
.el-carousel__item img {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 680px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>