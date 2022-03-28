<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类" v-model="category">
        <el-select
          placeholder="请选择.... "
          :disabled="show"
          v-model="category.category1Id"
          @change="hanler1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择...."
          :disabled="show"
          v-model="category.category2Id"
          @change="hanler2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择...."
          :disabled="show"
          v-model="category.category3Id"
          @change="hanler3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      // 列表数据
      list1: [],
      list2: [],
      list3: [],
      // 数据ID
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.Attr.reqCaregory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async hanler1() {
      // 初始化数据
      this.list2 = [];
      this.list3 = [];
      this.category.category2Id = "";
      this.category.category3Id = "";

      const { category1Id } = this.category;
      this.$emit("getCategoryId", { CategoryId: category1Id, level: 1 });
      let result = await this.$API.Attr.reqCaregory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async hanler2() {
      // 初始化数据
      this.list3 = [];
      this.category.category3Id = "";

      const { category2Id } = this.category;
      this.$emit("getCategoryId", { CategoryId: category2Id, level: 2 });
      let result = await this.$API.Attr.reqCaregory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    hanler3() {
      const { category3Id } = this.category;
      this.$emit("getCategoryId", { CategoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>