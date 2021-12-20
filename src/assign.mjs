/* eslint-disable no-var */
// 将arguments中的各个参数和内容 浅复制 到第一个对象中去
export default function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]
    for (var key in source) {
      target[key] = source[key]
    }
  }
  return target
}
/* eslint-enable no-var */
