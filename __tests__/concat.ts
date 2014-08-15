///<reference path='../resources/jest.d.ts'/>
///<reference path='../dist/Immutable.d.ts'/>

jest.autoMockOff();

import I = require('Immutable');
import Sequence = I.Sequence;

declare function expect(val: any): ExpectWithIs;

interface ExpectWithIs extends Expect {
  is(expected: any): void;
  not: ExpectWithIs;
}

describe('concat', () => {

  beforeEach(function () {
    this.addMatchers({
      is: function(expected) {
        return I.is(this.actual, expected);
      }
    })
  })

  it('concats two sequences', () => {
    var a = Sequence(1,2,3);
    var b = Sequence(4,5,6);
    expect(a.concat(b)).is(Sequence(1,2,3,4,5,6))
    expect(a.concat(b).length).toBe(6);
    expect(a.concat(b).toArray()).toEqual([1,2,3,4,5,6]);
  })

  it('concats two object sequences', () => {
    var a = Sequence({a:1,b:2,c:3});
    var b = Sequence({d:4,e:5,f:6});
    expect(a.length).toBe(3);
    expect(a.concat(b).length).toBe(6);
    expect(a.concat(b).toObject()).toEqual({a:1,b:2,c:3,d:4,e:5,f:6});
  })

  it('concats objects', () => {
    var a = Sequence({a:1,b:2,c:3});
    var b = {d:4,e:5,f:6};
    expect(a.concat(b).toObject()).toEqual({a:1,b:2,c:3,d:4,e:5,f:6});
  })

  it('concats arrays', () => {
    var a = Sequence(1,2,3);
    var b = [4,5,6];
    expect(a.concat(b).length).toBe(6);
    expect(a.concat(b).toObject()).toEqual([1,2,3,4,5,6]);
  })

  it('concats values', () => {
    var a = Sequence(1,2,3);
    expect(a.concat(4,5,6).length).toBe(6);
    expect(a.concat(4,5,6).toObject()).toEqual([1,2,3,4,5,6]);
  })

  it('concats multiple arguments', () => {
    var a = Sequence(1,2,3);
    var b = [4,5,6];
    var c = [7,8,9];
    expect(a.concat(b, c).length).toBe(9);
    expect(a.concat(b, c).toObject()).toEqual([1,2,3,4,5,6,7,8,9]);
  })

  it('can concat itself!', () => {
    var a = Sequence(1,2,3);
    expect(a.concat(a, a).length).toBe(9);
    expect(a.concat(a, a).toObject()).toEqual([1,2,3,1,2,3,1,2,3]);
  })

  it('iterates repeated keys', () => {
    var a = Sequence({a:1,b:2,c:3});
    expect(a.concat(a, a).toObject()).toEqual({a:1,b:2,c:3});
    expect(a.concat(a, a).toArray()).toEqual([1,2,3,1,2,3,1,2,3]);
    expect(a.concat(a, a).keys().toArray()).toEqual(['a','b','c','a','b','c','a','b','c']);
  })

  it('lazily reverses un-indexed sequences', () => {
    var a = Sequence({a:1,b:2,c:3});
    var b = Sequence({d:4,e:5,f:6});
    expect(a.concat(b).reverse().keys().toArray()).toEqual(['f','e','d','c','b','a']);
  })

  it('lazily reverses indexed sequences', () => {
    var a = Sequence([1,2,3]);
    expect(a.concat(a, a).reverse().length).toBe(9);
    expect(a.concat(a, a).reverse().toArray()).toEqual([3,2,1,3,2,1,3,2,1]);
  })

  it('lazily reverses indexed sequences with unknown length, maintaining indicies', () => {
    var a = Sequence([1,2,3]).filter(x=>true);
    expect(a.concat(a, a).reverse(true).length).toBe(undefined);
    expect(a.concat(a, a).reverse(true).entries().toArray()).toEqual(
      [[8,3],[7,2],[6,1],[5,3],[4,2],[3,1],[2,3],[1,2],[0,1]]
    );
  })

})
