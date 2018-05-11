import { computed } from '@ember/object';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import EmberObject from '@ember/object';
import { htmlSafe } from '@ember/string';

import layout from '../../templates/components/ember-split-view/child';

export default Component.extend({
  layout,
  classNames: ['split-view-child'],
  classNameBindings: [
    'hidden'
  ],

  attributeBindings:['style'],


  isDragging: false,
  isOptional: false,

  isNotLast: true,

  minSize: 60,
  startingSize: null,
  maxSize: 250,

  style: computed('currentChildInformation.size', 'isVertical', function(){
    if (this.get('isVertical')){
      return htmlSafe(`width:${this.get('currentChildInformation.size')}px!important`);
    }

    return htmlSafe(`height:${this.get('currentChildInformation.size')}px!important`);
  }),

  currentChildInformation: computed(function(){
    const childList= this.get('childList');
    return EmberObject.create({
      identifier:this.get('identifier') || this.uuidv4(),
      hidden:false,
      index: childList.length,
      size: 'auto',
      isDragging: false,
      maxSize: this.get('maxSize'),
      minSize: this.get('minSize'),
      resize: (size, modification) => this._setSize(size, modification)
    });
  }),

  hidden: alias('currentChildInformation.hidden'),

  init() {
    this._super();
    this.get('initAction')(this.get('currentChildInformation'));
  },

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  didInsertElement() {
    this._super(...arguments);

    let size = this.get('isVertical') ? this.$().width() : this.$().height();
    let minSize = this.get('minSize') || size;
    let maxSize = this.get('maxSize') || size;
    if (size >= minSize && size <= maxSize){
      this.set('currentChildInformation.size', size);
    }
    else if (size > maxSize){
      this.set('currentChildInformation.size', maxSize);
    }
    else {
      this.set('currentChildInformation.size', minSize);
    }

    const childList = this.get('childList');
    this.set('isNotLast', childList.indexOf(this.get('currentChildInformation')) !== childList.length - 1);
  },


  _setSize(size, modification){
    let minSize = this.get('minSize');
    if (size){
      if (size < minSize)
        size = minSize;

      let maxSize = this.get('maxSize');
      if (maxSize && size > maxSize)
        size = maxSize;

      this.set('currentChildInformation.size', size);
    }else if (modification){
      let modifiedSize = this.get('currentChildInformation.size') + modification;

      if (modifiedSize < minSize)
        modifiedSize = minSize;

      let maxSize = this.get('maxSize');
      if (maxSize && modifiedSize > maxSize)
        modifiedSize = maxSize;

      this.set('currentChildInformation.size', modifiedSize);
    }
  },

  actions:{
    close(){
      this.get('closeAction')(this.get('currentChildInformation.identifier'));
    },
    startDrag(){
      this.set('currentChildInformation.isDragging', true);
    }
  }
});
