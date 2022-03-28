// 平台管理请求
import request from "@/utils/request";


// 一级分类
export const reqCaregory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })



// 二级分类
export const reqCaregory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })


// 三级分类
export const reqCaregory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取商品列表
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get', })

// 添加||修改接口
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: "post", data })

// 删除
export const reqdeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })