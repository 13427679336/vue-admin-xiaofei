import request from '@/utils/request'

// 获取SKu列表
export const reqGetSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 下架接口
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 上架接口
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 删除Sku
export const reqDel = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' })

// 查    
export const reqLook = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
