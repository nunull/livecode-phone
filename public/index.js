const socket = io();

Vue.component('add-transformation-dialog', {
  methods: {
    cloneTransformation: function(transformation) {
      console.log('add-transformation-dialog.cloneTransformation');
      this.$root.hideModalDialog();

      return {
        id: uuidv4(),
        isInstance: true,
        name: transformation.name,
        value: 0,
        needsSubTransformation: transformation.needsSubTransformation
      };
    },
    onEnd: function() {
      console.log('add-transformation-dialog.onEnd');
      this.$root.closeModalDialog();
    }
  },
  template: `
    <div class="add-transformation-dialog">
      <draggable
        v-bind:list="$root.availableTransformations"
        v-bind:group="{ name: 'transformations', pull: 'clone', put: false }"
        v-bind:clone="cloneTransformation"
        v-bind:sort="false"
        v-on:end="onEnd"
      >
        <transformation-view
          v-for="transformation in $root.availableTransformations"
          v-bind:key="transformation.id"
          v-bind:transformation="transformation"
        ></transformation-view>
        <standard-button text="Cancel" v-on:click="$root.closeModalDialog"></standard-button>
      </draggable>
    </div>
  `
});

Vue.component('change-value-dialog', {
  props: ['dialogAttributes'],
  template: `
    <div class="change-value-dialog"
      v-on:mousemove="$refs.dial.onMouseMove($event)"
      v-on:mouseup="$refs.dial.onMouseUp($event)"
    >
      <dial v-model="dialogAttributes.transformation.value" ref="dial"></dial>
      <standard-button text="OK" v-on:click="$root.closeModalDialog"></standard-button>
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
        <div v-on:click="$emit('change-value', transformation)">
          {{ transformation.name }}
          {{ transformation.value }}
          <p class="description" v-if="!transformation.isInstance">{{ transformation.description }}</p>
        </div>
        <div class="sub-transformation" v-if="transformation.needsSubTransformation">
          <transformation-view
            v-if="transformation.transformation"
            v-bind:transformation="transformation.transformation"
            v-bind:isSubTransformation="true"
            v-on:change-value="$emit('change-value', $event)"
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

Vue.component('standard-button', {
  props: ['text'],
  template: `
    <div class="standard-button" v-on:click="$emit('click')">
      {{ text }}
    </div>
  `
});

Vue.component('round-button', {
  props: ['text'],
  template: `
    <div class="round-button" v-on:click="$emit('click')">
      {{ text }}
    </div>
  `
});

Vue.component('dial', {
  props: ['value'],
  data: function () {
    return {
      internalValue: this._props.value,
      drag: {
        start: null
      }
    }
  },
  computed: {
    valueRounded: function() {
      return Math.round(this.internalValue*10)/10;
    },
    dFull: function() {
      return this.describeArc(100, 100, 85, -150, 150)
    },
    dValue: function() {
      const normalizedValue = this.internalValue / 10; // TODO
      const deg = normalizedValue*150;
      return this.describeArc(100, 100, 85, -150, deg)
    }
  },
  methods: {
    // See https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    },
    describeArc: function(x, y, radius, startAngle, endAngle) {
      var start = this.polarToCartesian(x, y, radius, endAngle);
      var end = this.polarToCartesian(x, y, radius, startAngle);

      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
          'M', start.x, start.y,
          'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(' ');
    },
    onMouseDown: function(event) {
      this.onTouchStart(event);
    },
    onMouseUp: function(event) {
      if (!this.drag.start) return;
      this.onTouchEnd(event);
    },
    onMouseMove: function(event) {
      if (!this.drag.start) return;
      this.onTouchMove(event);
    },
    onTouchStart: function(event) {
      // this.internalValue = this._props.value;
      this.drag.start = { x: event.pageX, y: event.pageY, value: this.internalValue };
    },
    onTouchEnd: function(event) {
      this.onTouchMove(event);
      this.$emit('input', this.valueRounded);
      this.drag.start = null;
    },
    onTouchMove: function(event) {
      event.preventDefault();

      const abs = this.drag.start.y - event.pageY;
      const scaled = abs/30;
      const minValue = -10; // TODO
      const maxValue = 10; // TODO
      this.internalValue = Math.max(minValue, Math.min(maxValue, this.drag.start.value + scaled));
    }
  },
  template: `
    <div class="dial">
      <svg width="200" height="200"
        v-on:mousedown="onMouseDown"
        v-on:touchstart="onTouchStart"
        v-on:touchend="onTouchEnd"
        v-on:touchmove="onTouchMove"
      >
        <path v-bind:d="dFull" stroke="#121212" stroke-width="30" fill="none" />
        <path v-bind:d="dValue" stroke="white" stroke-width="30" fill="none" />
        <text x="100" y="110" fill="white" text-anchor="middle" font-size="28">{{ valueRounded }}</text>
      </svg>
    </div>
  `
});

const app = new Vue({
  el: '#app',
  data: {
    modalDialog: {
      visible: false,
      component: null,
      attributes: null
    },
    pattern: { steps: [5, 0, 3, 2], scaleSteps: 6 },
    availableTransformations: [
      { id: uuidv4(), name: 'pitch', description: 'change the pitch' },
      { id: uuidv4(), name: 'every', description: 'apply another transformation every x times', needsSubTransformation: true },
      { id: uuidv4(), name: 'chance', description: 'trigger steps of the pattern with a chance' }
    ],
    transformations: [
      { id: uuidv4(), isInstance: true, name: 'pitch', value: 2 },
      { id: uuidv4(), isInstance: true, name: 'every', value: 2, needsSubTransformation: true, transformation: { id: uuidv4(), name: 'chance', value: 0.5 } }
    ]
  },
  methods: {
    showModalDialog: function(component, attributes) {
      this.modalDialog.component = component;
      this.modalDialog.attributes = attributes;
      this.modalDialog.visible = true;
    },
    hideModalDialog: function() {
      this.modalDialog.visible = false;
    },
    closeModalDialog: function() {
      this.hideModalDialog();
      this.modalDialog.component = null;
    }
  }
});
