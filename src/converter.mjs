/* eslint-disable no-var */
/**
 * encodeURIComponent: 编码
 * decodeURIComponent: 解码
 * value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
 * 原来replace 第二个参数可以使用函数,以前只是觉得能用字符串
 */
export default {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1)
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      //这些正则是什么功能还不知道
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
}
/* eslint-enable no-var */
