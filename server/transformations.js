const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.transformations = readTransformations();

exports.transformationByName = function(name) {
  return exports.transformations.find(t => t.name === name);
}

exports.instanciateTransformation = function(temporaryTransformation) {
  const transformation = exports.transformationByName(temporaryTransformation.name);
  return {
    id: uuidv4(),
    isInstance: true,
    name: transformation.name,
    value: Math.max(0, transformation.min),
    valueType: transformation.valueType,
    min: transformation.min,
    max: transformation.max,
    needsSubTransformation: transformation.needsSubTransformation
  };
};

exports.applyTransformation = function(t, pattern) {
  const transformation = exports.transformationByName(t.name);
  return transformation.f.call(t, pattern);
}

function readTransformations () {
  const files = fs.readdirSync(`${__dirname}/../transformations`);

  return files.map(file => {
    return require(`../transformations/${file}`);
  });
}
