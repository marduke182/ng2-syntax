# ng2-syntax
It is well known that syntax  is going to change in the new major version of angular. But you could use a similar syntax in your current code, if you are coding in ES6 or are planning to migrate to ES6  in the future.

# Angular1 code on ES6

I have been migrating all my angular applications to ES6 and I have been using an evolutive approach for it the last months. In this series of posts i'm going to explain the different approaches used and why this was my final solution.

## Angular Module as ES6 modules

This approach is easy:

* Each directive, service, factory, filter, etc. is an angular module that lives in an ES6 Module whose default export is the name of the angular module. (Angular performance is not affected by the number of modules, only the initial load)..
* Each module imports all its dependencies. (Fully testable without requiring all the context).

This allows me to do this:

```javascript
// todoComponent/todoComponent.js
import template from './todoComponent.html';
class TodoController {};
export const name = 'todoComponent';

export default angular
                .module('todo.component', [])
                .directive(name, () => ({
                  controller: TodoController,
                  controllerAs: 'vm',
                  bindToController: true,
                  scope: {},
                  template
                }))
                .name
```

```javascript
import todoComponentModule, {name as todoComponent} from '../todoComponent/todoComponent.js';
import template from 'todoItem.html';
class ItemController {};

export default angular
                .module('todo.item', [todoComponentModule])
                .directive('todoItem', () => ({
                  controller: ItemController,
                  controllerAs: 'vm',
                  bindToController: true,
                  scope: {},
                  require: [todoComponent],
                  template
                }))
                .name
```

## Using Decorators and minimizing code duplication

I realized that I had been repeating the same code in almost all of my directives.

```javascript
{
  controller: TodoController,
  controllerAs: 'vm',
  bindToController: true,
  scope: {},
  template
}
```

Looking at the new syntax I thought, why not use ES7 Decorators to remove boilerplate code?, Now the previous example can be written like this:

```javascript
// todoComponent/todoComponent.js
import { Component, View } from 'ng2-syntax';
import template from './todoComponent.html';

export const name = 'todoComponent';

@Component({
  selector: name
})
@View({
  template
})
class TodoController {};

export default angular
                .module('todo.component', [])
                .directive(name, TodoController.component).name
```

```javascript
import todoComponentModule, {name as todoComponent} from '../todoComponent/todoComponent.js';
import template from 'todoItem.html';

export const name = 'todoItem';
@Component({
  selector: name,
  require: [todoComponent]
})
@View({
  template
})
class ItemController {};

export default angular
                .module('todo.item', [todoComponentModule])
                .directive('todoItem', ItemController.component).name
```

## Using Utils for exporting modules

Angular modules has a big caveat. If two modules with the same name are instanced, the last one is the one that is registered. This could mask your errors and make it really hard to debug. My solution for this was the creation of an Utils function to create a module with an unique name (The name is not needed, every time you need to use it import the module and use the default value). The original code with the new utils looks like this:

```javascript
// todoComponent/todoComponent.js
import { Component, View, exportAsNgModule} from 'ng2-syntax';
import template from './todoComponent.html';

export const name = 'todoComponent';

@Component({
  selector: name
})
@View({
  template
})
class TodoController {};

export default exportAsNgModule(TodoController);
```

```javascript
import { Component, View, exportAsNgModule} from 'ng2-syntax';
import todoComponentModule, {name as todoComponent} from '../todoComponent/todoComponent.js';
import template from 'todoItem.html';

export const name = 'todoItem';
@Component({
  selector: name,
  require: [todoComponent]
})
@View({
  template
})
class ItemController {};

export default exportAsNgModule(ItemController, {
  dependencies: [todoComponentModule]
});
```

# Api

TODO

## Component

## View

## exportAsNgModule

## exportFactoryAsNgModule

## exportFilterAsNgModule

# Improvements

* Finish the test suite
* Add code coverage (Try isparta-loader for webpack)
* Finish documentation

