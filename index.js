
/* 
This script filtering functionality to a bootstrap supported website with minimal configuration.


Filter must be instatiated with an object of filter objects that will be used. HTML elements must have a data attribute that corresponds with the filter property name
example:
declaring a filter of object of:
filterObj= {
  x:{},
  y:{},
  z:{}
}

and creating a button element of:
<button data-filter"x" data-value="0"> x0 </button>

will show:
<element data-x="0" data-y="1" data-z="2"/>

and hide:
<element data-x="1" data-y="1" data-z="2"/>


data value is arbitrary, however 


example usage:
<div>
  <button data-filter='type' data-value='value'>filter value</button>
</div>
<ul>
  <li class="filter-item" data-type="value"></li>
  <li class="filter-item" data-type="value"></li>
  <li class="filter-item" data-type="value"></li>
</ul>

const filter = new Filter({type: {}}) //property name matches data attribute name
filter.init()
*/
//

class Filter {
  constructor(initial = {}) {
    this.__filterItems = []
    this._filters = initial
    this._btnTogglerClass = 'active'
    this._hideClass = 'd-none'
    this._itemClass = 'filter-item'
    this._btnClass = 'filter-btn'
    this._eventType = 'click'

    //filter needs binding because it's called in an event handler.
    this.filter = this.filter.bind(this)
  }




  // GETTERS
  get filters() {
    return this._filters
  }
  get toggler() {
    return this._btnTogglerClass
  }
  get hider() {
    return this._hideClass
  }
  get itemClass() {
    return this._itemClass
  }
  get selector() {
    return this._btnClass
  }
  get eventType() {
    return this._eventType
  }

  // SETTERS
  setFilters(val) {
    this._filters = val
  }
  setToggler(val) {
    this._btnTogglerClass = val
  }
  setHider(val) {
    this._hideClass = val
  }
  setItemClass(val) {
    this._itemClass = val
  }
  setSelector(val) {
    this._btnClass = val
  }
  setEventType(val) {
    this._eventType = val
  }



  // UTILITY FUNCTIONS
  static isEmpty(obj) {
    //Utility function to check if anything is empty
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  filterByType(type, resultObj) {
    // takes an object of filter values, a string denoting filter type, and a result obj to store results in
    if (!this.isEmpty(resultObj)) {
      for (let key in resultObj) {
        if (!this.filters[type].hasOwnProperty(resultObj[key].dataset[type])) {
          delete resultObj[key]
        }
      }
    } else {

      this.__filterItems.forEach(obj => {
        if (this.filters[type].hasOwnProperty(obj.dataset[type])) {
          resultObj[obj.dataset.key] = obj

        }
      })
    }
  }

  filter(event) {
    const result = {}
    const el = event.target
    const { filter, value } = el.dataset //type of filter and the filter value
    el.classList.toggle(this.toggler) //toggle active class


    //check for active class on current element after .toggle() is called. if active, adds element data to filters object. if false, removes data 
    if (el.classList.contains(this.toggler)) {
      this.filters[filter][value] = true
    } else {
      delete this.filters[filter][value]
    }

    // start filtering process
    for (let type in this.filters) { // for each type of filter
      if (!this.isEmpty(this.filters[type])) { //if there is active filters for this filter type
        this.filterByType(type, result) //calls filterByType with the current filter type object, the type name, and the result object
      }
    }

    //render results on page

    if (!this.isEmpty(result)) {// if there are results

      //toHide is an object that contains all items not included in the result object
      const toHide = Array.from(this.__filterItems).reduce((map, obj) => {
        if (!result.hasOwnProperty(obj.dataset.key)) {
          map[obj.dataset.key] = obj
        }
        return map
      }, {})

      //apply d-none to all html elements in toHide object
      for (let key in toHide) {
        toHide[key].classList.add(this.hider)
      }

      //remove d-none to all html elements in result object
      for (let key in result) {
        result[key].classList.remove(this.hider)
      }
    } else { //if result is empty, show all
      this.__filterItems.forEach(item => item.classList.remove(this.hider))
    }
    console.log(result)
    console.log(this.filters)
  }


  init() {
    //calling init creates a list of items to filter and attaches click handlers to each filter btn
    this.__filterItems = document.querySelectorAll(`.${this.itemClass}`)
    //assigns keys to each item based on their index for easy referencing
    this.__filterItems.forEach((item, index) => {
      item.dataset['key'] = index
    })


    //filter logic is run every time the user clicks a filter btn
    document.body.querySelectorAll(`.${this.selector}`).forEach(btn => {
      btn.addEventListener(this.eventType, this.filter, false)
    })
  }
}
