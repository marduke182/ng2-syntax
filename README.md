# ng2-syntax
Is well know that the syntax in the new major version of angular change. But you could use a similar syntax in your current code, if you are writing in ES6 or you plan to migrate to es6 in a future.

# Angular1 code on ES6

I have been migrating my angular applications to ES6 and i have had an evolutive code the last months. In a series of post i`m going to explain my diferents approach and why this was my final solutions.

## Angular Module as ES6 modules

This approach is easy:

* Each directive, service, factory, filter, etc. Is an angular module and live in an ES6 Module that the default export is the name of the angular module. (Angular performances is not affected by the num of the modules, only the initial load).
* Each module import all his dependencies. (Fully testeable without require all the context).

This allow me to this:

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

## Using Decorators for less repeated code

I realize that i have been repeat the same code in almost all my directives.

```javascript
{
  controller: TodoController,
  controllerAs: 'vm',
  bindToController: true,
  scope: {},
  template
}
```

And looking the new syntax i thougth, why not use ES7 Decorator and remove the repeated code, Now i can write the before example like this:


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

## Using Utils for export modules

Angular modules has a big error. If both modules with the same name are instanced, the last one is the final registered. This could mask your errors and is hard to debug. Well my solutions was the creation of Utils function that create a module with an unique name (The name is not needed, everytime you need to used it import the module and use the default value). The original code with the new utils:

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