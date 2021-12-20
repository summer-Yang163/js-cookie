/* eslint-disable no-var */
import assign from './assign.mjs'
import defaultConverter from './converter.mjs'

function init(converter, defaultAttributes) {
  function set(name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    //cookie name 编码name
    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    var stringifiedAttributes = ''
    // 遍历传入的attributes
    for (var attributeName in attributes) {
      // 如果某个参数不存在,便直接进入下一个循环
      if (!attributes[attributeName]) {
        continue
      }
      // 为stringifiedAttributes 加参数名
      stringifiedAttributes += '; ' + attributeName

      // 如果当前参数为true 则进入下一个循环,不需要记录=后面的值
      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      // 组装stringifiedAttributes  attributes
      //Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
      // attributes配置具体有哪些,有些神奇,如果只是,不需要这样才对
      /**
       * attributes:{
       * Expires:"Wed, 21 Oct 2015 07:28:00 GMT"
       * }
       */
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
    }
    //组装好的stringifiedAttributes进行写入,如果cookie本身已经有a,那再加入a,也不做判断,直接由cookie本身去处理吗
    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get(name) {
    // 判断document对象是否存在 并且arguments需要有值,name不为空(为0好像也会获取失败,不过应该也不需要用到0)
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    // 获取cookies对象,并将cookies对象以; 分割,列为数组
    var cookies = document.cookie ? document.cookie.split('; ') : []
    var jar = {}
    for (var i = 0; i < cookies.length; i++) {
      // 将单个cookie,用=进行分割
      var parts = cookies[i].split('=')
      // 去除了parts[0] 将剩下的数组用=聚合
      var value = parts.slice(1).join('=')

      try {
        // 对cookie key进行解码
        var found = decodeURIComponent(parts[0])
        // 然后又再解码%20 这种,不理解
        jar[found] = converter.read(value, found)

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    // 返回
    return name ? jar[name] : jar
  }

  //Object.create 创建一个对象,第一个参数是原型__proto__ 第二个是属性
  return Object.create(
    {
      set: set,
      get: get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        )
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      //冻结的参数与转换器,不太明白为啥要放到第二个参数来赋值
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

export default init(defaultConverter, { path: '/' })
/* eslint-enable no-var */
