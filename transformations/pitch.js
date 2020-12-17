exports.name = 'pitch';
exports.description = 'change the pitch';
exports.valueType = 'float';
exports.min = -24;
exports.max = 24;
exports.f = function(pattern) {
  return {
    ...pattern,
    steps: pattern.steps.map(value => value + this.value)
  };
};