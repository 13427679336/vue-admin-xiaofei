<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShow" />
    </el-card>
    <el-card style="margin-top: 30px">
      <el-button
        type="primary"
        round
        icon="el-icon-plus"
        :disabled="!category3Id"
        @click="addAttr"
        v-show="isShow"
        style="margin-bottom: 25px"
        >主要按钮</el-button
      >

      <div v-show="isShow">
        <el-table border :data="attrList" style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="100">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue"
                style="margin: 0 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            :data="attrInfo.attrValueList"
            label="操作"
            width="150"
          >
            <template slot-scope="{ row, $index }">
              <!-- 修改按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                circle
                @click="updateAttr(row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名"
              style="margin-bottom: 30px"
              v-model="attrInfo.attrName"
            ></el-input>
            <el-button
              type="primary"
              round
              icon="el-icon-plus"
              @click="addAttrValueList"
              :disabled="!attrInfo.attrName"
              >添加属性</el-button
            >
            <el-button round @click="isShow = !isShow">取消</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="attrInfo.attrValueList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="name" label="属性名称">
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                ref="gain"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span v-else @click="fucking(row)" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}`"
                @onConfirm="deleteAttrValueList($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                  circle
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin: 30px 0px 0px 100px"
          @click="addOrUndate"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShow = !isShow" style="margin-left: 20px"
          >取消</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShow: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
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
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.Attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    addAttrValueList() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
    },
    addAttr() {
      this.isShow = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    updateAttr(row) {
      this.isShow = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请输入属性值，属性值不能为空");
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message("属性值重复，请重新输入");
        return;
      }
      row.flag = false;
    },
    fucking(row) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs.gain.focus();
      });
    },
    deleteAttrValueList($index) {
      this.attrInfo.attrValueList.splice($index, 1);
    },
    async addOrUndate() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.Attr.reqAddOrUpdateAttr(this.attrInfo);

        this.isShow = true;

        this.$message({ type: "success", message: "保存成功" });

        this.getAttrList();
      } catch (error) {}
    },
    async deleteAttr(row) {
      const attrId = row.id;
      try {
        await this.$API.Attr.reqdeleteAttr(attrId);
        this.$message({ type: "success", message: "删除成功" });
        this.getAttrList();
      } catch (error) {}
    },
  },
};
</script>

<style>
</style>