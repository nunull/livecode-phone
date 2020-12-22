exports.store = {
  state: {
    // TODO improve data structure for the pattern
    pattern: { steps: [0, 3, 2, 0, 8], scaleSteps: 12, scale: [], octave: 3 },
    channels: {},
  },

  findTransformationById: function(transformations, id) {
    for (const t of transformations) {
      if (t.id === id) return t;

      if (!t.transformation) continue;

      const subTransformation = this.findTransformationById([t.transformation], id);
      if (subTransformation) return subTransformation;
    }

    return null;
  }
};
