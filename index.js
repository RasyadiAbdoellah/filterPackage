class Filter {
  constructor(initial = {}) {
    this.__filterItems = []
    this.__startingState = JSON.parse(JSON.stringify(initial))
    this.__filterMap = JSON.parse(JSON.stringify(initial)) //deep copy initial
    this._filters = initial
    this._btnTogglerClass = 'active'
    this._hideClass = 'd-none'
    this._itemClass = 'filter-item'
    this._btnClass = 'filter-btn'
    this._eventType = 'click'
    //this is binded because below methods are called in an event handler.
    this.filter = this.filter.bind(this)
    this.reset = this.reset.bind(this)
  }

  static isEmptyObj(obj) {
    //Utility function to check if an object is empty
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  static isEqualObj(obj1, obj2) {
    return JSON.stringify(obj1) == JSON.stringify(obj2)
  }

  // GETTERS
  get filters() {
    return this._filters
  }
  get startingState() {
    return this.__startingState
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
    if (!Filter.isEmptyObj(resultObj)) {
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

    if (value && value !== 'reset') {
      el.classList.toggle(this.toggler)
      //check for active class on current element after .toggle() is called. if active, adds element data to filters object. if false, removes data 
      if (el.classList.contains(this.toggler)) {
        this.filters[filter][value] = true
        // if (Filter.isEqualObj(this.filters[filter], this.__filterMap[filter])) {
        //   this.reset(el)
        //   this.filters[filter] = {}
        // }
      } else {
        delete this.filters[filter][value]
      }
    } else {
      this.reset(el)
      this.filters[filter] = {}
    }

    // start filtering process
    for (let type in this.filters) {
      if (!Filter.isEmptyObj(this.filters[type])) {
        this.filterByType(type, result)
      }
    }

    //render results on page
    if (!Filter.isEmptyObj(result)) {
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

  setReset(type) {
    if (type === "all") {
      this.reset = (el) => {
        document.querySelectorAll(`.${this.selector} .${this.toggler}`).forEach(el => el.classList.remove(`.${this.toggler}`))
        this.filters = JSON.parse(JSON.stringify(this.startingState))
      }
    } else if (type === 'filter') {
      this.reset = (el) => {
        el = el.parentNode.firstElementChild
        do {
          el.classList.remove(`.${this.toggler}`)
        } while (el = el.nextElementSibling)
      }
    }

  }


  init() {
    // create a local list of items to filter
    this.__filterItems = document.querySelectorAll(`.${this.itemClass}`)
    // adds keys to items for easier referencing
    this.__filterItems.forEach((item, index) => {
      item.dataset['key'] = index
    })
    //sets the reset function
    this.setReset('all')

    document.querySelectorAll(`.${this._btnClass}`).forEach(item => {
      if (item.dataset.value !== 'reset') this.__filterMap[item.dataset.filter][item.dataset.value] = true;
    })

    //add listener to filter interface. filter logic is run every time the user triggers a filter event
    document.body.querySelectorAll(`.${this.selector}`).forEach(btn => {
      btn.addEventListener(this.eventType, this.filter, false)
    })

  }
}
