class Filter {
  constructor(initial = {}) {
    this.__filterItems = []
    this.__initialState = JSON.parse(JSON.stringify(initial))
    this.__startingActive = null
    this.__filterMap = JSON.parse(JSON.stringify(initial)) //deep copy initial
    this._filters = initial
    this._btnTogglerClass = 'active'
    this._hideClass = 'd-none'
    this._itemClass = 'filter-item'
    this._btnClass = 'filter-btn'
    this._eventType = 'click'
    this._isAdditive = true
    this._isExclusive = false
    //this is binded because below methods are called in an event handler.
    this.filter = this.filter.bind(this)
    this.resetAllUi = this.resetAllUi.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
    this.resetFilterGrpUi = this.resetFilterGrpUi.bind(this)

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
  get initialState() {
    return this.__initialState
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

  setAdditive() {
    this._isAdditive = true
  }

  setSubtractive() {
    this._isAdditive = false
  }

  setExclusive() {
    this._isAdditive = false
    this._isExclusive = true
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
    const parent = el.parentNode
    const { filter, value, reset = false } = el.dataset
    let hasFilters = false

    //TODO - see if conditional logic can be tidied up
    //TODO - consider renaming resetFilter to something that contextually makes better sense
    if (!reset) { //if not a reset button
      if (this._isExclusive || (parent.dataset && parent.dataset.filterType === 'exclusive')) {
        this.resetFilterGrpUi(el)
        this.resetFilter(el)
      }

      el.classList.toggle(this.toggler) //toggle active class

      //check for active class on current element after .toggle() is called. if active, adds element data to filters object. if false, removes data 
      if (el.classList.contains(this.toggler)) {
        this.filters[filter][value] = true //add value to filter obj
        document.querySelector(`[data-filter=${filter}][data-reset="filter"]`).classList.remove(`${this.toggler}`)//remove active from reset button

        //current behaviour assumes that all filters on = resetting the filter to show all. This also assumes that if there is a local reset button it is used as the show all button
        if ((this._isAdditive || (parent.dataset && parent.dataset.filterType === 'additive')) && Filter.isEqualObj(this.filters[filter], this.__filterMap[filter])) {
          this.resetFilter(el)
          this.resetFilterGrpUi(el)
          // set the reset button (used as a show all) to active
          document.querySelector(`[data-filter=${filter}][data-reset="filter"]`).classList.add(`${this.toggler}`)
        }
      } else {
        delete this.filters[filter][value]
      }
    } else {
      if (reset === 'all') {
        //if reset is a reset all, revert to starting button state
        this.resetAllUi()
        this.__startingActive.forEach(item => item.classList.add(`${this.toggler}`))
      }
      else if (reset === 'filter') {
        //again, this assumes the filter reset is a show all button
        this.resetFilter(el)
        this.resetFilterGrpUi(el)
        if (this._isAdditive) el.classList.add(`${this.toggler}`);
      }
    }

    // start filtering process
    for (let type in this.filters) {
      if (!Filter.isEmptyObj(this.filters[type])) {
        hasFilters = true
        this.filterByType(type, result)
      }
    }

    //render results on page
    if (!Filter.isEmptyObj(result) || hasFilters) {
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

  resetAllUi() {
    document.querySelectorAll(`.${this.selector}.${this.toggler}`).forEach(el => el.classList.remove(this.toggler))
    this._filters = JSON.parse(JSON.stringify(this.initialState))
  }

  resetFilterGrpUi(el) {
    el = document.querySelector(`[data-filter="${el.dataset.filter}"]`).parentNode.firstElementChild
    do {
      el.classList.remove(`${this.toggler}`)
    } while (el = el.nextElementSibling)
  }

  resetFilter(el) {
    if (!el.dataset.filter) return Error('filter attribute must be set');
    this._filters[el.dataset.filter] = {}
  }



  init() {
    // create a local list of items to filter
    this.__filterItems = document.querySelectorAll(`.${this.itemClass}`)
    // adds keys to items for easier referencing
    this.__filterItems.forEach((item, index) => {
      item.dataset['key'] = index
    })


    //build a map of all filters
    document.querySelectorAll(`.${this._btnClass}`).forEach(item => {
      if (!item.dataset.reset) this.__filterMap[item.dataset.filter][item.dataset.value] = true;
    })

    //build the initial button states
    this.__startingActive = document.querySelectorAll(`.${this._btnClass}.${this._btnTogglerClass}`)

    //add listener to filter interface. filter logic is run every time the user triggers a filter event
    document.body.querySelectorAll(`.${this.selector}`).forEach(btn => {
      btn.addEventListener(this.eventType, this.filter, false)
    })

  }
}
