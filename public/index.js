const socket = io();

Vue.component('add-transformation-dialog', {
  methods: {
    cloneTransformation: function (transformation) {
      this.$root.closeModalDialog();

      return {
        id: uuidv4(),
        isInstance: true,
        name: transformation.name,
        value: 0,
        needsSubTransformation: transformation.needsSubTransformation
      }
    }
  },
  template: `
    <div class="add-transformation-dialog">
      <draggable
        v-bind:list="$root.availableTransformations"
        v-bind:group="{ name: 'transformations', pull: 'clone', put: false }"
        v-bind:clone="cloneTransformation"
        v-bind:sort="false"
      >
        <transformation-view
          v-for="transformation in $root.availableTransformations"
          v-bind:key="transformation.id"
          v-bind:transformation="transformation"
        ></transformation-view>
      </draggable>
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
  props: ['transformation', 'isSubTransformation'],
  template: `
    <div class="transformation" v-bind:class="{ 'is-instance': transformation.isInstance }">
      <img src="/assets/arrow-down.png" class="arrow" v-if="!isSubTransformation">
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
    modalDialog: {
      visible: false,
      component: null,
    },
    pattern: { steps: [5, 0, 3, 2], scaleSteps: 6 },
    availableTransformations: [
      { id: uuidv4(), name: 'pitch' },
      { id: uuidv4(), name: 'every', needsSubTransformation: true },
      { id: uuidv4(), name: 'chance' }
    ],
    transformations: [
      { id: uuidv4(), isInstance: true, name: 'pitch', value: 2 },
      { id: uuidv4(), isInstance: true, name: 'every', value: 2, needsSubTransformation: true, transformation: { id: uuidv4(), name: 'chance', value: 0.5 } }
    ]
  },
  methods: {
    showModalDialog: function (component) {
      this.modalDialog.component = component;
      this.modalDialog.visible = true;
    },
    closeModalDialog: function () {
      this.modalDialog.visible = false;
    }
  }
});
