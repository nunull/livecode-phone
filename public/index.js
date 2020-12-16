const socket = io();

Vue.component('pattern-view', {
  props: ['pattern'],
  data: function () {
    const height = 120;
    console.log(this)
    return {
      stepHeight: 120,
      valueHeight: 120/this._props.pattern.scaleSteps
    }
  },
  methods: {
    stepTopMargin: function (step) {
      return (this._props.pattern.scaleSteps - step - 1 ) * this._data.valueHeight;
    },
  },
  template: `
    <div class="pattern">
      <div class="step" v-for="step in pattern.steps" v-bind:style="{ height: stepHeight + 'px' }">
        <div class="value" v-bind:style="{ height: valueHeight + 'px', marginTop: stepTopMargin(step) + 'px' }"></div>
      </div>
    </div>
  `
})

Vue.component('transformation-view', {
  props: ['transformation', 'isSubTransformation'],
  template: `
    <div class="transformation">
      <img src="/assets/arrow-down.png" class="arrow" v-if="!isSubTransformation">
      <div class="value" v-bind:class="{ 'has-sub-transformation': !!transformation.transformation }">
        {{ transformation.name }}
        {{ transformation.value }}
        <div class="sub-transformation" v-if="transformation.transformation">
          <transformation-view
            v-bind:transformation="transformation.transformation"
            v-bind:isSubTransformation="true"
          ></transformation-view>
        </div>
      </div>
    </div>
  `
})

const app = new Vue({
  el: '#app',
  data: {
    pattern: { steps: [5, 0, 3, 2], scaleSteps: 6 },
    transformations: [
      { name: 'pitch', value: 2 },
      { name: 'every', value: 2, transformation: { name: 'chance', value: 0.5 } }
    ]
  }
})
