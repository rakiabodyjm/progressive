function isObject(object: any) {
  return object != null && typeof object === 'object' && !!object
}
function isFunction(fn: any) {
  return fn !== null && typeof fn === 'function' && !!fn
}
function deepEqual(object1: Record<string, any>, object2: Record<string, any>) {
  if (!isObject(object1) || !isObject(object2)) {
    return false
  }
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    const areFunctions = isFunction(val1) && isFunction(val2)

    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && !areFunctions && val1 !== val2)) {
      return false
    }
  }

  return true
}

export { isObject }

export default deepEqual
