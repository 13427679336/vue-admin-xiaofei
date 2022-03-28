<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card style="margin-top: 30px">
      <div v-show="scene == 0">
        <!-- 添加SPU按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          round
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- 表格 -->
        <el-table :data="records" border style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="Spu名称"> </el-table-column>
          <el-table-column prop="description" label="Spu描述">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <!-- 按钮 -->
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                circle
                title="添加Sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                circle
                title="修改Sku"
                @click="updateSku(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-warning-outline"
                circle
                title="添加当前Spu全部Sku列表"
                @click="hanler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  title="删除Sku"
                  style="margin-left: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center; margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          :pager-count="5"
          layout=" prev, pager, next, jumper,->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <div v-show="scene == 1">
        <SpuForm @changeScene="changeScene" ref="Spu" />
      </div>
      <div v-show="scene == 2">
        <SkuForm @changeScene="changeScene" ref="Sku" />
      </div>
      <el-dialog
        :title="`${spu.spuName}的Sku列表`"
        :visible.sync="dialogTableVisible"
        :before-close="close"
      >
        <el-table
          :data="spuList"
          border
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column prop="skuName" label="名称"> </el-table-column>
          <el-table-column prop="price" label="价格"> </el-table-column>
          <el-table-column prop="weight" label="重量"> </el-table-column>
          <el-table-column prop="address" label="默认图片">
            <template slot-scope="{ row, index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/Spu/SpuForm";
import SkuForm from "@/views/product/Spu/SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      records: [],
      total: 0,
      show: true,
      page: 1,
      limit: 3,
      scene: 0, //控制页面场景，0是主页，1是spu，2是sku
      dialogTableVisible: false,
      spu: {},
      spuList: [],
      loading: true,
    };
  },
  methods: {
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    getCategoryId({ CategoryId, level }) {
      if (level == 1) {
        this.category1Id = CategoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = CategoryId;
        this.category3Id = "";
      } else {
        this.category3Id = CategoryId;
        this.getSpuList();
      }
    },
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.Spu.reqGetSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 添加
    addSpu() {
      this.$refs.Spu.spuAdd(this.category3Id);
      this.scene = 1;
    },
    // 修改
    updateSku(row) {
      this.$refs.Spu.initSpuData(row);
      this.scene = 1;
    },
    // 取消的回调
    changeScene(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    // 删除
    async deleteSpu(row) {
      let result = await this.$API.Spu.deleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加SKU
    addSku(row) {
      this.$refs.Sku.getSkuList(
        row,
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      this.scene = 2;
    },
    // 查看spu列表
    async hanler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      // 发请求
      let resulet = await this.$API.Spu.reqgetSku(spu.id);
      if (resulet.code == 200) {
        this.spuList = resulet.data;

        this.loading = false;
      }
    },
    close(done) {
      this.loading = true;
      this.spuList = [];
      done();
    },
  },
};
</script>

<style>
</style>