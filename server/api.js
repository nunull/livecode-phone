const express = require('express');
const router = express.Router();
const store = require('./store').store;
const sequencer = require('./sequencerWorker');
const transformations = require('./transformations');

router.get('/init', (req, res) => {
  res.json({
    channel: { name: req.channel.name },
    transformations: req.channel.transformations,
    availableTransformations: transformations.transformations,
    pattern: store.state.pattern
  });
});

router.post('/transformations', (req, res) => {
  req.channel.transformations = req.body.map(t => {
    return t.isTemporary ? transformations.instanciateTransformation(t) : t;
  });

  sequencer.postMessage(store.state);
  res.json(req.channel.transformations);
});

router.post('/transformations/:id', (req, res) => {
  const transformation = store.findTransformationById(req.channel.transformations, req.params.id);
  if (!transformation) {
    return res.status(404).json({});
  }

  if (req.body.value) {
    transformation.value = req.body.value;
  }

  if (req.body.transformation) {
    transformation.transformation = transformations.instanciateTransformation(req.body.transformation);
  }

  sequencer.postMessage(store.state);
  res.json(req.channel.transformations);
});

module.exports = router;
