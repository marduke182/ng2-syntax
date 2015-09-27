import unique, { reset } from './unique.js';
import { expect } from 'chai';

describe('Unique', () => {

  it('Each value is unique', () => {
	const unique1 = unique();
	const unique2 = unique();

	expect(unique1).to.be.not.equal(unique2);
  });

  it('To unique value with the same prefix must be different', () => {
	const unique1 = unique('test_');
	const unique2 = unique('test_');

	expect(unique1).to.be.not.equal(unique2);
  });

  it('If i reset the unique value must be equal both values', () => {
  	reset();
  	const unique1 = unique();
  	reset();
	const unique2 = unique();

	expect(unique1).to.be.equal(unique2);
  })
});