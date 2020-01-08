This script adds filtering functionality to a bootstrap supported website with minimal configuration.


Filter class must be instatiated with an object of filter objects that will be used. HTML elements must have a data attribute that corresponds with the filter property name
example:
declaring a filter of object of:
```js
filterObj= {
  x:{},
  y:{},
  z:{}
}
```

and creating a button element of:
`<button data-filter"x" data-value="0"> x0 </button>`

will show:
`<element data-x="0" data-y="1" data-z="2"/>`

and hide:
`<element data-x="1" data-y="1" data-z="2"/>`

data value is arbitrary.


example usage:
```html
<div>
  <button data-filter='type' data-value='value'>filter value</button>
</div>
<ul>
  <li class="filter-item" data-type="value"></li>
  <li class="filter-item" data-type="value"></li>
  <li class="filter-item" data-type="value"></li>
</ul>
```
```js
const filter = new Filter({type: {}}) //property name matches data attribute name
filter.init()
```