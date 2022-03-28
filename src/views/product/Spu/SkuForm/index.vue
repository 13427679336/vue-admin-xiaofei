<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ Spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.saleAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          ref="multipleTable"
          :data="skuImg"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row, index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="chage(row)"
                >设置默认</el-button
              >
              <el-button type="success" plain v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: "",
        weight: "",
        skuDesc: "",
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        // 图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      attrInfoList: [], //平台属性
      skuImg: [], //sku图片
      spuSaleAttrList: [], //销售属性
      Spu: {},
      img: [], //临时变量
    };
  },
  methods: {
    async getSkuList(Sku, category1Id, category2Id, category3Id) {
      this.skuInfo.category3Id = category3Id;
      this.skuInfo.tmId = Sku.tmId;
      this.skuInfo.spuId = Sku.id;
      this.Spu = Sku;
      // 获取sku列表
      let skuResult = await this.$API.Spu.reqGetSkuList(
        Sku.id,
        category1Id,
        category2Id,
        category3Id
      );
      console.log(skuResult);
      if (skuResult.code == 200) {
        this.attrInfoList = skuResult.data;
      }
      // 获取图片
      let skuImgResult = await this.$API.Spu.resImgList(Sku.id);
      if (skuImgResult.code == 200) {
        let list = skuImgResult.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.skuImg = list;
      }
      // 获取销售属性
      let skuSaleResult = await this.$API.Spu.reqSaleList(Sku.id);
      if (skuSaleResult.code == 200) {
        this.spuSaleAttrList = skuSaleResult.data;
      }
    },
    handleSelectionChange(selection) {
      this.img = selection;
    },
    chage(row) {
      this.skuImg.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScene", 0);
      Object.assign(this._data, this.$options.data());
    },
    async save() {
      //整理参数
      //整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, img } = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrAndValueId) {
          const [attrId, valueId] = item.attrAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = img.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //发请求
      let result = await this.$API.Spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style>
</style>