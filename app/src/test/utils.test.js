import { ArrayIncludesObj , cmpObjEntries } from './utils'

test('cmp objects entries, not ref', () => { 

    const o = {y:9, x:9}
    const o2 = {name: 'Simpson'};
    const a = [{y:0 , x:0}, {y:9, x:9}, {y:-8, x:-8}];

    expect(cmpObjEntries(o, a[1])).toStrictEqual(true);
    expect(ArrayIncludesObj(a, o)).toStrictEqual(true);
    expect(ArrayIncludesObj(a, o2)).toStrictEqual(false);
});