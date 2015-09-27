import angular from 'angular';
import uniqueId from './unique';

/**
 * Generate a generic link function that inject the transclude method, and require controllers inside his controller.
 * @param  {[Array]} require
 * @param  {Boolean} transclude
 * @return {[Function]}
 */
function generateLinkFunction(require, transclude = false) {
  return ($scope, $element, $attrs, ctrls, ...extra) => {
    if (require.length <= 0) {
      return;
    }

    const directiveCtrl = ctrls[0];

    if (transclude) {
      ([directiveCtrl.$transclude] = extra);
    }

    const length = ctrls.length;
    for (let index = 1; index < length; index++) {
      const nameWithoutAngular1Conditions = require[index - 1].replace(/^[?^]+/g, '');
      directiveCtrl[`${nameWithoutAngular1Conditions}Ctrl`] = ctrls[index];
    }
    if (directiveCtrl.link && typeof directiveCtrl.link === 'function') {
      directiveCtrl.link($scope, $element, $attrs, ctrls, ...extra);
    }
  };
}

/**
 * Annotation to create components in the Angular2 way. Receive extra parameters to give flexibility to the current angular2 ,modules
 * @param {String} selector
 * @param {Object} properties
 * @param {String} restrict
 * @param {String} controllerAs
 * @param {Boolean} transclude
 * @param {String} templateNamespace
 * @param {Array} require
 */
export function Component({
  selector,
  properties = {},
  restrict = 'E',
  controllerAs = 'vm',
  transclude = false,
  templateNamespace = 'html',
  require = []
} = {}) {
  return (controller) => {
    if (!selector) {
      throw new Error('Cannot create a component without a selector');
    }
    controller.$moduleName = uniqueId({prefix: `${selector}_`});
    controller.$componentName = selector;

    Object.defineProperty(controller, 'component', {
      get: () => {
        return () => ({
          controller: controller,
          restrict,
          controllerAs,
          scope: properties,
          transclude,
          templateNamespace,
          bindToController: true,
          require: (require.length > 0 ? [selector, ...require] : []),
          template: controller.$componentTemplate,
          templateUrl: controller.$componentTemplateUrl,
          link: generateLinkFunction(require, transclude)
        });
      }
    });
  };
}

/**
 * Annotation to convert a directive into a component
 * @param {String} template
 * @param {String[Url]} templateUrl
 */
export function View({template, templateUrl} = {}) {
  return (controller) => {
    if (template && templateUrl) {
      throw new Error('Cannot choose both methods must choose or template or templateUrl');
    }
    controller.$componentTemplate = template;
    controller.$componentTemplateUrl = templateUrl;
  };
}

/**
 * Given a target function or class, generate a unique angular module with the given directive, filter, service, etc.
 * @param  {Class|Function|Array} target
 * @param  {String} name
 * @param  {Array} dependencies
 * @return {String} Angular module name
 */
export function exportAsNgModule(target, {name = target.$moduleName, dependencies = []} = {}) {
  const module = angular
  .module(name, dependencies);

  if (__DEV__) {
    console.log(`Module name is: ${name}, with dependencies as: ${JSON.stringify(dependencies)}, `,target.component ? target.component() : {}) //eslint-disable-line
  }

  // The structure else if to assure the single responsability in each module (Each angular module only have exact one element)
  if (target.$componentName) {
    module.directive(target.$componentName, target.component);
  } else if (target.$factoryName) {
    module.factory(target.$factoryName, target);
  } else if (target.$filterName) {
    module.filter(target.$filterName, target);
  }

  return module.name;
}

/**
 * Given a function create a angular module with a factory
 * @param  {Function|Array} target Function to be created in the angular module
 * @param  {String} name Factory name to be used in anothers elements
 * @param  {String} moduleName Optional
 * @param  {Array} dependencies
 * @return {String} Angular module name
 */
export function exportFactoryAsNgModule(target, { name, moduleName, dependencies = []  } = {}) {
  if (!name) {
    throw new Error('Cannot create a factory without a name');
  }
  target.$moduleName = uniqueId({prefix: `${moduleName || name}_`});
  target.$factoryName = name;

  return exportAsNgModule(target, { dependencies });
}

/**
 * @param  {Function|Array} target
 * @param  {String} name Filter function to be created in the angular module
 * @param  {String} moduleName Optional
 * @param  {Array} dependencies
 * @return {String} Angular module name
 */
export function exportFilterAsNgModule(target, { name, moduleName, dependencies = [] } = {}) {
  if (!name) {
    throw new Error('Cannot create a filter without a name');
  }
  target.$moduleName = uniqueId({prefix: `${moduleName || name}_`});
  target.$filterName = name;

  return exportAsNgModule(target, { dependencies });
}