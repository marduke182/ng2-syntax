import { Component, View, exportAsNgModule, exportFactoryAsNgModule, exportFilterAsNgModule,  } from './index';
import 'angular-mocks';


describe('ng2Syntax', () => {
  describe('Component', () => {

    it('Without attributes must throw a error', () => {
      expect(Component()).to.throw(Error);
    })

    it('Must create function component in the target and must return an object when is executed', () => {
      @Component({
        selector: 'myComponent'
      })
      class MyComponent {}
      

      expect(MyComponent).to.have.property('component');
      expect(MyComponent.component).to.be.a('function');

      const directiveAttributes = MyComponent.component();

      expect(directiveAttributes).to.be.a('object');
      expect(directiveAttributes.controller).to.be.equals(MyComponent);

    })
  });

  describe('View', () => {
    it('Template must be setted as metada', () => {
      @View({
        template: '<div>Hello World</div>'
      })
      class MyComponent {}

      expect(MyComponent).to.have.property('$componentTemplate');
      expect(MyComponent.$componentTemplate).to.be.a('string');
      expect(MyComponent.$componentTemplate).to.be.equals('<div>Hello World</div>');
    });
    it('Template url must be setted as metada', () => {
      @View({
        templateUrl: '/myComponent.html'
      })
      class MyComponent {}

      expect(MyComponent).to.have.property('$componentTemplateUrl');
      expect(MyComponent.$componentTemplateUrl).to.be.a('string');
      expect(MyComponent.$componentTemplateUrl).to.be.equals('/myComponent.html');
    });
    it('Must throw an error if not set anything', () => {
      expect(View()).to.throw(Error);
    });

  });

  describe('exportAsNgModule', () => {
    // TODO
  });

  describe('exportFactoryAsNgModule', () => {
    // TODO
  });

  describe('exportFilterAsNgModule', () => {
    // TODO
  });
});