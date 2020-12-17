exports.name = 'every';
exports.description = 'apply another transformation every x times';
exports.needsSubTransformation = true;
exports.valueType = 'int';
exports.min = 1;
exports.max = 16;
exports.f = function(pattern) {
  let steps = []
  for (let i = 0; i < this.value-1; i++) {
    steps = steps.concat(pattern.steps)
  }
  steps = steps.concat(this.transformation.f(pattern).steps)

  return { ...patern, steps };
};
