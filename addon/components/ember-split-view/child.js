import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import { next , scheduleOnce } from '@ember/runloop';
import { alias } from '@ember/object/computed';
import EmberObject from '@ember/object';

import layout from '../../templates/components/ember-split-view/child';

export default Component.extend({
  layout,
  classNames: ['split-view-child'],
  classNameBindings: [
    'hidden'
  ],

  childSplitView: null,
  anchorSide: null,

  isDragging: false,
  isOptional: false,



  currentChildInformation: computed(function(){
    return EmberObject.create({
      identifier:this.get('identifier') || this.uuidv4(),
      hidden:false,
      index: this.get('childList.length'),
      size: 'auto',
      resize: (size) => this._setSize(size)
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


  willDestroyElement() {
    this.get('removeChild')(this.get('currentChildInformation.identifier'));
  },


  _setSize(modification){
    let size;
    if(this.get('isVertical')){
      size = this.$().width() + modification;
      this.$().width(size);
    }else{
      size = this.$().height() + modification;
      this.$().height(size);
    }

    this.set('currentChildInformation.size', size);
  },

  actions:{
    close(){
      const style = this.get('element').style;
      style.display = 'none';
    },
    startDrag(){
      this.set('isDragging', true);
    },
    mouseMove(event){

      if(this.get('isDragging')){
        let modification = 0;
        let currentSize = 0;
        if(this.get('isVertical')){
          modification = event.pageX;
          currentSize = this.$().width();
        } else{
          modification = event.movementY;
          currentSize = this.$().height();
        }

        console.log(event);

        this.get('resize')(this.get('currentChildInformation.identifier'), modification, currentSize);
      }
    },
    endDrag(){
      this.set('isDragging', false);
    }
  }

});
