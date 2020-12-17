exports.name = 'chance';
exports.description = 'trigger steps of the pattern with a chance';
exports.valueType = 'float';
exports.min = 0;
exports.max = 1;
exports.f = function(pattern) {
  // TODO how do you calculate these live
  return pattern.map(value => {
    return Math.random() > this.value ? value : null;
  });
};
