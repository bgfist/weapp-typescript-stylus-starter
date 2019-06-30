/**
 *
 * @param newData 新的数据，可能是部分
 * @param oldData 老的数据，为全部
 *
 * 只比较新数据中的字段
 */
export default function shallowEqual(newData: any, oldData: any) {
  if (newData === oldData) {
    return true
  }

  const keysA = Object.keys(newData)

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (const key of keysA) {
    if (!hasOwn.call(oldData, key) || newData[key] !== oldData[key]) {
      return false
    }
  }

  return true
}
