class Filter {
  constructor(initial = {}) {
    this.__filterItems = []
    this._filters = initial
    this._btnTogglerClass = 'active'
    this._hideClass = 'd-none'
    this._itemClass = 'filter-item'
    this._btnClass = 'filter-btn'
    this._eventType = 'click'

    //filter this is binded because it's called in an event handler.
    this.filter = this.filter.bind(this)
  }

  static isEmpty(obj) {
    //Utility function to check if an object is empty
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
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

  filterByType(type, resultObj) {
    // takes a string denoting filter type, and a result obj to store results in
    if (!Filter.isEmpty(resultObj)) {
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
    //handler that is called on filter event
    const result = {}
    const el = event.target
    const { filter, value } = el.dataset


    el.classList.toggle(this.toggler)
    //check for active class on current element after .toggle() is called. if active, adds element data to filters object. if false, removes data 
    if (el.classList.contains(this.toggler)) {
      this.filters[filter][value] = true
    } else {
      delete this.filters[filter][value]
    }

    // start filtering process
    for (let type in this.filters) {
      if (!Filter.isEmpty(this.filters[type])) {
        this.filterByType(type, result)
      }
    }

    //render results on page
    if (!Filter.isEmpty(result)) {
      const toHide = Array.from(this.__filterItems).reduce((map, obj) => {
        if (!result.hasOwnProperty(obj.dataset.key)) {
          map[obj.dataset.key] = obj
        }
        return map
      }, {})

      //Add and remove hider class to corresponding elements
      for (let key in toHide) {
        toHide[key].classList.add(this.hider)
      }
      for (let key in result) {
        result[key].classList.remove(this.hider)
      }
    } else {
      this.__filterItems.forEach(item => item.classList.remove(this.hider))
    }
  }


  init() {
    // create a local list of items to filter
    this.__filterItems = document.querySelectorAll(`.${this.itemClass}`)
    // adds keys to items for easier referencing
    this.__filterItems.forEach((item, index) => {
      item.dataset['key'] = index
    })


    //add listener to filter interface. filter logic is run every time the user triggers a filter event
    document.body.querySelectorAll(`.${this.selector}`).forEach(btn => {
      btn.addEventListener(this.eventType, this.filter, false)
    })
  }
}
