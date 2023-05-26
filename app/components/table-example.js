import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

import { headlessTable } from 'ember-headless-table';
import { meta, columns } from 'ember-headless-table/plugins';
import {
  ColumnResizing,
  isResizing,
  resizeHandle,
} from 'ember-headless-table/plugins/column-resizing';
import {
  ColumnReordering,
  moveLeft,
  moveRight,
  cannotMoveLeft,
  cannotMoveRight,
} from 'ember-headless-table/plugins/column-reordering';
import {
  ColumnVisibility,
  hide,
  show,
  isVisible,
  isHidden,
} from 'ember-headless-table/plugins/column-visibility';
import {
  DataSorting,
  sort,
  isAscending,
  isDescending,
} from 'ember-headless-table/plugins/data-sorting';

export const DATA = [
  {
    // Red stuff
    A: 'Apple',
    B: 'Berry',
    C: 'Cranberry',
    D: 'Da Chile Pepper',
    E: 'Pomegranate',
    F: 'Cherry',
    G: 'Watermelon',
  },
  {
    // Green stuff
    A: 'Avocado',
    B: 'Plantain',
    C: 'Cucumber',
    D: 'Dill',
    E: 'Kiwi',
    F: 'Broccoli',
    G: 'Spinach',
  },
  {
    // Yellow stuff
    A: 'A Squash',
    B: 'Banana',
    C: 'Corn',
    D: 'Durian',
    E: 'Pineapple',
    F: 'Lemon',
    G: 'Jackfruit',
  },
];

export default class extends Component {
  resizeHandle = resizeHandle;

  table = headlessTable(this, {
    columns: () => [
      {
        name: 'column A',
        key: 'A',
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))],
      },
      {
        name: 'column B',
        key: 'B',
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))],
      },
      {
        name: 'column C',
        key: 'C',
        pluginOptions: [ColumnResizing.forColumn(() => ({ minWidth: 200 }))],
      },
    ],
    data: () => this.data,
    plugins: [
      ColumnReordering,
      ColumnVisibility,
      ColumnResizing,
      DataSorting.with(() => ({
        sorts: this.sorts,
        onSort: (sorts) => (this.sorts = sorts),
      })),
    ],
  });

  @tracked sorts = [];

  get columns() {
    return columns.for(this.table);
  }

  get data() {
    return localSort(DATA, this.sorts);
  }

  get resizeHeight() {
    return htmlSafe(`${this.table.scrollContainerElement.clientHeight - 32}px`);
  }

  /**
   * Plugin Integration - all of this can be removed in strict mode, gjs/gts
   *
   * This syntax looks weird, but it's read as:
   *   [property on this component] = [variable in scope]
   */
  hide = hide;
  show = show;
  isVisible = isVisible;
  isHidden = isHidden;

  moveLeft = moveLeft;
  moveRight = moveRight;
  cannotMoveRight = cannotMoveRight;
  cannotMoveLeft = cannotMoveLeft;

  sort = sort;
  isAscending = isAscending;
  isDescending = isDescending;

  isResizing = isResizing;
}

/**
 * Utils, not the focus of the demo.
 * but sorting does need to be handled by you.
 */

import { compare } from '@ember/utils';

function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getValue(obj, key) {
  if (hasOwnProperty(obj, key)) return obj[key];
}

export function localSort(data, sorts) {
  // you'll want to sort a duplicate of the array, because Array.prototype.sort mutates.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  //
  // Beware though that if the array is reactive,
  //   this will lose the reactivity if copying this function.
  return [...data].sort((itemA, itemB) => {
    for (let { direction, property } of sorts) {
      let valueA = getValue(itemA, property);
      let valueB = getValue(itemB, property);

      let result = compare(valueA, valueB);

      if (result) {
        return direction === 'descending' ? -result : result;
      }
    }

    return 0;
  });
}
