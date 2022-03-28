import request from '@/utils/request'

// 获取数据
export const reqGetSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

//获取spu信息
export const reqGetSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取spu品牌信息
export const reqTradeMark = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取spu图片
export const reqImgList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性
export const reqBaseSaleAttr = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 修改||添加
export const reqaddOrUpdataSpu = (spu) => {
    if (spu.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spu })
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spu })
    }
}

// 删除
export const deleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })


// 获取Sku平台属性
export const reqGetSkuList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 获取图片列表
export const resImgList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性列表
export const reqSaleList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 添加sku
export const reqAddSku = (skuInfo) => request({ url: "/admin/product/saveSkuInfo", method: 'post', data: skuInfo })

// 获取Sku  admin/product/findBySpuId/{spuId}
export const reqgetSku = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })