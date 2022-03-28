// 将四个模块同一暴露
import * as tradeMark from '@/api/product/tradeMark'
import * as Attr from '@/api/product/Attr'
import * as Sku from '@/api/product/Sku'
import * as Spu from '@/api/product/Spu'

//引入权限相关的接口文件
import * as user from './acl/user';
import role from './acl/role';
import permission from './acl/permission'


export default {
    tradeMark,
    Attr,
    Sku,
    Spu,
    user,
    role,
    permission
}