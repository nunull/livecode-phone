const socket = io();

Vue.component('add-transformation-dialog', {
  template: `
    <div class="add-transformation-dialog">
      <transformation-view
        v-for="transformation in $root.availableTransformations"
        v-bind:transformation="transformation"
      ></transformation-view>
    </div>
  `
});

Vue.component('pattern-view', {
  props: ['pattern'],
  data: function () {
    const height = 120;
    return {
      stepHeight: 120,
      valueHeight: 120/this._props.pattern.scaleSteps
    }
  },
  methods: {
    stepTopMargin: function (step) {
      return (this._props.pattern.scaleSteps - step - 1) * this._data.valueHeight;
    },
  },
  template: `
    <div class="pattern">
      <div class="step" v-for="step in pattern.steps" v-bind:style="{ height: stepHeight + 'px' }">
        <div class="value" v-bind:style="{ height: valueHeight + 'px', marginTop: stepTopMargin(step) + 'px' }"></div>
      </div>
    </div>
  `
});

Vue.component('transformation-view', {
  props: ['transformation', 'isInstance', 'isSubTransformation'],
  template: `
    <div class="transformation">
      <img src="/assets/arrow-down.png" class="arrow" v-if="isInstance && !isSubTransformation">
      <div class="value" v-bind:class="{ 'has-sub-transformation': !!transformation.transformation }">
        {{ transformation.name }}
        {{ transformation.value }}
        <div class="sub-transformation" v-if="transformation.needsSubTransformation">
          <transformation-view
            v-if="transformation.transformation"
            v-bind:transformation="transformation.transformation"
            v-bind:isSubTransformation="true"
          ></transformation-view>
          <transformation-placeholder-view v-else></transformation-placeholder-view>
        </div>
      </div>
    </div>
  `
});

Vue.component('transformation-placeholder-view', {
  template: `
    <div class="transformation-placeholder">transformation</div>
  `
})

Vue.component('round-button', {
  props: ['text'],
  template: `
    <div class="round-button" v-on:click="$emit('click')">
      {{ text }}
    </div>
  `
});

const app = new Vue({
  el: '#app',
  data: {
    currentModalDialogComponent: null,
    pattern: { steps: [5, 0, 3, 2], scaleSteps: 6 },
    availableTransformations: [
      { name: 'pitch' },
      { name: 'every', needsSubTransformation: true },
      { name: 'chance' }
    ],
    transformations: [
      { name: 'pitch', value: 2 },
      { name: 'every', value: 2, needsSubTransformation: true, transformation: { name: 'chance', value: 0.5 } }
    ]
  },
  methods: {
    modalDialog: function (componentName) {
      this.currentModalDialogComponent = componentName
    }
  }
});
