# Overview

This script adds filtering functionality to a Bootstrap supported website with minimal configuration.


The filter must be first be instatiated with an object of filter objects that will be used. HTML elements must have a data attribute that corresponds with the filter property name
example:

instantiating a filter of:
```js
filterObj= {
  x:{},
  y:{},
  z:{}
}

const filter = new Filter(filterObj)
filter.init()
```

and creating a button element:

`<button class="filter-btn" data-filter"x" data-value="0"> x0 </button>`

will show:

`<element class="filter-item" data-x="0" data-y="1" data-z="2"/>`

and hide:

`<element class="filter-item" data-x="1" data-y="1" data-z="2"/>`

data value is arbitrary, as long as data-value in the button element has a corresponding value in the filtered element. The example usage is the bare minimum required to get it working:
```html
<div>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-1'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-2'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-3'>filter value</button>
</div>
<ul>
  <li class="filter-item" data-type="value-1"></li>
  <li class="filter-item" data-type="value-2"></li>
  <li class="filter-item" data-type="value-3"></li>
</ul>
```
```js
const filter = new Filter({type: {}}) //property name matches data attribute name
filter.init()
```

Note that by default the script uses Bootstrap's `d-none` class to hide and show elements, and Bootstrap's `active` class to show which filters are currently active. Setters are exposed to change the classes used.



# Under the hood


