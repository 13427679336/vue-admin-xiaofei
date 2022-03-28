<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称" :model="spuData">
        <el-input placeholder="SPU名称" v-model="spuData.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌..." v-model="spuData.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input
          type="textarea"
          placeholder="描述"
          rows="4"
          v-model="spuData.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImgList"
          :on-success="hanler"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSale.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="un.name"
            :value="`${un.id}:${un.name}`"
            v-for="un in unSale"
            :key="un.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性值</el-button
        >
        <el-table border style="width: 100%" :data="spuData.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名">
          </el-table-column>
          <el-table-column prop="address" label="属性值名称列表">
            <template slot-scope="{ row, index }">
              <el-tag
                closable
                :disable-transitions="false"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                >{{ tag.saleAttrValueName }}</el-tag
              >
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="gain"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                icon="el-icon-plus"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="spuData.spuSaleAttrList.splice($index, 1)"
            >
            </el-button>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdata">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuData: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],

        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [],
      spuImgList: [], //有两个服务器不需要的参数在里面
      saleAttr: [],
      attrIdAndAttrName: "", //临时变量
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImgList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    hanler(response, file, fileList) {
      this.spuImgList = fileList;
    },
    cancel() {
      this.$emit("changeScene", 0);
      Object.assign(this._data, this.$options.data());
    },
    // 修改spu
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.Spu.reqGetSpu(spu.id);
      if (spuResult.code == 200) {
        this.spuData = spuResult.data;
      }
      // 获取spu品牌信息
      let spuTradeMark = await this.$API.Spu.reqTradeMark();
      if (spuTradeMark.code == 200) {
        this.tradeMarkList = spuTradeMark.data;
      }
      // 获取spu图片
      let spuImg = await this.$API.Spu.reqImgList(spu.id);
      if (spuImg.code == 200) {
        let imgArr = spuImg.data;
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImgList = imgArr;
      }
      // 获取销售属性
      let spuSale = await this.$API.Spu.reqBaseSaleAttr();
      if (spuSale.code == 200) {
        this.saleAttr = spuSale.data;
      }
    },
    // 添加spu
    async spuAdd(category3Id) {
      this.spuData.category3Id = category3Id;
      // 获取spu品牌信息
      let spuTradeMark = await this.$API.Spu.reqTradeMark();
      if (spuTradeMark.code == 200) {
        this.tradeMarkList = spuTradeMark.data;
      }
      // 获取销售属性
      let spuSale = await this.$API.Spu.reqBaseSaleAttr();
      if (spuSale.code == 200) {
        this.saleAttr = spuSale.data;
      }
    },
    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");

      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuData.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    // 添加销售属性值
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.gain.focus();
      });
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message("请输入属性值，属性值不能为空");
        return;
      }
      let result2 = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == inputValue
      );
      if (result2) {
        this.$message("属性值重复，请重新输入");
        return;
      }
      let result = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(result);
      row.inputVisible = false;
    },
    async addOrUpdata() {
      this.spuData.spuImageList = this.spuImgList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.url) || item.url,
        };
      });
      if (this.spuData.id) {
        let result = await this.$API.Spu.reqaddOrUpdataSpu(this.spuData);
        if (result.code == 200) {
          this.cancel();
          this.$message({ type: "success", message: "修改成功" });
        }
      } else {
        let result = await this.$API.Spu.reqaddOrUpdataSpu(this.spuData);
        if (result.code == 200) {
          this.cancel();
          this.$message({ type: "success", message: "添加成功" });
        }
      }
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    unSale() {
      return this.saleAttr.filter((item) => {
        return this.spuData.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>