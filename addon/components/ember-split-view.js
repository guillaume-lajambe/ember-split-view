import Component from '@ember/component';
import { A } from '@ember/array';
import { next, scheduleOnce } from '@ember/runloop';
import { observer, computed } from '@ember/object';

import SplitChild from './ember-split-view/child';
import layout from '../templates/components/ember-split-view';

/**
 * This class represents a view that is split either vertically or horizontally.
 * The split view is composed of three child views: a left or top view, a sash
 * view, and a right or bottom view.  The sash may be dragged to change the
 * relative width or height of the child views.
 *
 * Vertical SplitView example:
 *
 * ```handlebars
 * {{#split-view isVertical=true}}
 *   {{#split-child}}
 *     Content of the left view here.
 *   {{/split-child}}

 *   {{#split-child}}
 *     Content of the right view here.
 *   {{/split-child}}
 * {{/split-view}}
 * ```
 *
 * Horizontal SplitView example:
 *
 * ```handlebars
 * {{#split-view isVertical=false}}
 *   {{#split-child}}
 *     Content of the top view here.
 *   {{/split-child}}

 *   {{#split-child}}
 *     Content of the bottom view here.
 *   {{/split-child}}
 * {{/split-view}}
 * ```
 *
 * @cLass SplitViewComponent
 * @extends Ember.Component
 */
export default Component.extend({
  layout,
  /**
   * @property {boolean} isVertical - the orientation of the split: true = vertical, false = horizontal
   * @default true
   */
  isVertical: true,

  /**
   * @property {Number} splitPosition - the position of the split in pixels
   * @default 50
   */
  splitPosition: 250,

  isDragging: false,
  isRoot: false,

  _childList: null,


  classNames: ['ember-split-view'],
  classNameBindings: ['isDragging:dragging', 'isVertical:vertical:horizontal'],

  init() {
    this._super(...arguments);

    this.set('_childList', A());
  },

  actions:{
    initChild(childInformation){
      let childList = this.get('_childList');

      childList.pushObject(childInformation);

      
      this.set('_childList', childList);
    },
    resize(identifier, modification, currentSize){
      const childs = this.get('_childList');
      let currentChild = childs.findBy('identifier', identifier);
      if (currentChild.size === 'auto'){
        currentChild.size = currentSize;
      }

      let currentChildIndex = childs.indexOf(currentChild);
      let indexOfImpectedItem = currentChildIndex == childs.get('length') - 1 ?
        currentChildIndex -1 : currentChildIndex + 1;

      let impactedChild = childs.objectAt(indexOfImpectedItem);

      currentChild.resize(currentChild.size + modification);
      impactedChild.resize(impactedChild.size - modification);


    }
  }
});
