import Component from '@ember/component';
import { A } from '@ember/array';

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

  _childList: null,

  classNames: ['ember-split-view'],
  classNameBindings: ['isVertical:vertical:horizontal'],


  mouseMove(event) {
    const childList = A(this.get('_childList').filter(child => !child.hidden));
    const isDragging = childList.any((child) => child.isDragging && !child.hidden);

    if (isDragging) {
      let offset = this.get('isVertical') ? this.$().offset().left : this.$().offset().top;
      let resizeNextChild = false;
      let nextChildSizeModification = 0;
      childList.forEach(child => {
        if (child.isDragging) {
          let elementSize = (this.get('isVertical') ? event.pageX : event.pageY) - offset;
          if ((!child.maxSize || elementSize < child.maxSize) && (!child.minSize || elementSize > child.minSize)){
            nextChildSizeModification = child.size - elementSize;
            child.resize(elementSize);
            resizeNextChild = childList.indexOf(child) !== childList.length - 1;
          }
          console.log(elementSize);
        } else {
          if (resizeNextChild) {
            console.log(nextChildSizeModification);
            child.resize(null, nextChildSizeModification);
            resizeNextChild = false;
          } else {
            offset += child.size;
            child.resize(child.size);
          }
        }
      })
    }

  },
  mouseLeave() {
    console.log('leaving');
    const childList = this.get('_childList');
    childList.forEach(child => child.set('isDragging', false));
  },
  mouseUp() {
    const childList = this.get('_childList');
    const isDragging = childList.any((child) => child.isDragging);

    console.log(isDragging);

    childList.forEach(child => child.set('isDragging', false));
  },

  init() {
    this._super(...arguments);

    this.set('_childList', A());
  },

  actions: {
    initChild(childInformation) {
      let childList = this.get('_childList');

      childList.pushObject(childInformation);

      this.set('_childList', childList);
    },
    closeChild(identifier){
      const childList = A(this.get('_childList').filter(child => !child.hidden));
      const closingChild = childList.find(child => child.identifier === identifier);
      const closingChildIndex = childList.indexOf(closingChild);

      let affectedChilds = childList
      .filter((child, index) => index === closingChildIndex - 1
        || index === closingChildIndex + 1);

      affectedChilds.forEach(child => child.resize(null, closingChild.size / affectedChilds.length));

      closingChild.set('hidden', true);

      console.log('closing');
      console.log(affectedChilds.length);
      console.log(closingChildIndex);
    },
    openChild(identifier){
      const childList = this.get('_childList');
      const childToOpen = childList.find(child => child.identifier === identifier);
      const childIndex = childList.indexOf(childToOpen);
      const modification = childIndex > 0 ? childToOpen.size / 2 : childToOpen.size;

      childList.forEach((child, index) => {
        if (index == childIndex - 1 || index == childIndex + 1){
          child.resize(null, -modification);
        }
      });

      childToOpen.set('hidden', false);
    }
  }
});
