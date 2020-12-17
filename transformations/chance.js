exports.name = 'chance';
exports.description = 'trigger steps of the pattern with a chance';
exports.valueType = 'float';
exports.min = 0;
exports.max = 1;
exports.f = function(pattern) {
  // TODO how do you calculate these live
  return {
    ...pattern,
    steps: pattern.steps.map(value => {
      return Math.random() > 1-this.value ? value : null;
    })
  };
};
