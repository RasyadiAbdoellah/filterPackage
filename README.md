# Overview

This script adds filtering functionality to a Bootstrap supported website with minimal configuration. To get it to work, download and import `index.js` or use jsdelivr to get a cdn: `https://cdn.jsdelivr.net/gh/RasyadiAbdoellah/filterPackage/index.js`.

The easiest way to import this is to put it in script tags:
```html
<!--if the script was saved in project parent directory -->
<script src="./filter.js"></script>

<!-- if using cdn -->
<script src="https://cdn.jsdelivr.net/gh/RasyadiAbdoellah/filterPackage/index.js"></script>
```


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

and creating a button element with a class of `filter-btn`:

`<button class="filter-btn" data-filter"x" data-value="0"> x0 </button>`

will show any element with a `filter-item` class and a data attribute that matches the button's `data-filter` and `data-value` attributes:

`<element class="filter-item" data-x="0" data-y="1" data-z="2"/>`

and hide any element with a `filter-item` class but does not match the button's data attributes:

`<element class="filter-item" data-x="1" data-y="1" data-z="2"/>`

the value of data-[value name] is arbitrary, as long as data-value in the button element has a corresponding value in the filtered element. 

Note that by default the script uses Bootstrap's `d-none` class to hide and show elements, and Bootstrap's `active` class to show which filters are currently active. The class names can be changed using setters mentioned in the ***Customization*** section.


# Basic Usage

The example usage below is the bare minimum required to get it working:
```html

<!-- Note that btn button-outline-primary are classes provided bootstrap for styling -->
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

## Reset buttons

Filter reset functions can be accessed by adding a button with a `data-reset` attribute set to either `all` or `filter`. If targeting a filter group, a `data-filter` attribute that corresponds to a filter type must be attached to the reset button.

For example to add a reset for a particular filter group...
```html
<div>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-1'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-2'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-3'>filter value</button>
<!-- The reset button below will reset the values for only this filter group-->
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-reset='filter'>reset filter group</button>
</div>
```
The filter reset button doesn't have to be placed in the same button group, as it finds the elements by its data attribute.
```html
<div>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-1'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-2'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-value='value-3'>filter value</button>
</div>

<!-- The reset button below will also reset the values for only the corresponding filter group-->
  <button class="btn button-outline-primary filter-btn" data-filter='type' data-reset='filter'>reset filter group</button>
```


To add a global reset button...

```html
<div>
  <button class="btn button-outline-primary filter-btn" data-filter='x' data-value='value-1'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='x' data-value='value-2'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='x' data-value='value-3'>filter value</button>
</div>

<div>
  <button class="btn button-outline-primary filter-btn" data-filter='y' data-value='value-1'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='y' data-value='value-2'>filter value</button>
  <button class="btn button-outline-primary filter-btn" data-filter='y' data-value='value-3'>filter value</button>
</div>

<!-- The reset button below will reset the values for all filter groups-->
  <button class="btn button-outline-primary filter-btn" data-reset='all'>reset all</button>

```

# Customization

You can override the default class names with custom ones. Below is a list of available setters:

```js
const filter = new Filter({type: {}})
// after instatiating you can...

filter.setFilters({ newFilter: {}})
filter.setToggler('new toggler class') //default: active
filter.setHider('new hider class') //default: d-none
filter.setItemClass('new filter item class')//default: filter-item
filter.setSelector('new filter button class')//default: filter-btn

//only click is currently supported
filter.setEventType('set a different event handler')//default: click
```


