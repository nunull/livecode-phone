exports.name = 'every';
exports.description = 'apply another transformation every x times';
exports.needsSubTransformation = true;
exports.valueType = 'int';
exports.min = 1;
exports.max = 16;
exports.f = function(pattern) {
  let result = []
  for (let i = 0; i < this.value-1; i++) {
    result = result.concat(pattern)
  }
  result = result.concat(this.transformation.f(pattern))

  return result
};
