/* eslint-disable no-var */
/**
 * encodeURIComponent: 编码
 * decodeURIComponent: 解码
 * value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
 * 原来replace 第二个参数可以使用函数,以前只是觉得能用字符串
 */
export default {
  read: function (value) {
    // 对value为"b" 这样的字符串进行匹配,去掉前后的""
    if (value[0] === '"') {
      //slice 开始索引,终止处索引,负值表示在原数组的倒数第几个元素抽取
      value = value.slice(1, -1)
    }
    //对value中含有的%XX进行解码
    //%d/D a-f A-F 都是一些特殊字符,可参考https://www.w3school.com.cn/tags/html_ref_urlencode.asp
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  /**
   * 如:'<script>alert(1)</script>'
   * 编码之后会变成%3Cscript%3Ealert(1)%3C%2Fscript%3E
   * 对部分特殊字符进行解码,则得到'<\script>alert(1)<\/script>' 通过编解码,防止js注入等问题
   */
  write: function (value) {
    return encodeURIComponent(value).replace(
      //比如/222/ 编码之后会变成 %2F222%2F 需要再进行一次解码
      /**
       * %2[346BF]: #,$, &,+,/
       * %3A: :
       * %3C-%3F: <,=,>,?
       * %40: @
       * %5[BDE]:[,],^
       * %60: `
       * %7[BCD]: {,|,}
       */
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
}
/* eslint-enable no-var */
