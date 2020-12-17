const transformations = require('../server/transformations');

exports.name = 'every';
exports.description = 'apply another transformation every x times';
exports.needsSubTransformation = true;
exports.valueType = 'int';
exports.min = 2;
exports.max = 16;
exports.f = function(pattern) {
  if (!this.transformation) return pattern;

  let steps = []
  for (let i = 0; i < this.value-1; i++) {
    steps = steps.concat(pattern.steps)
  }

  steps = steps.concat(transformations.applyTransformation(this.transformation, pattern).steps)

  return { ...pattern, steps };
};
