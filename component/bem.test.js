import bem from './bem';

describe('bem', () => {
  test('bem', () => {
    expect(bem('block__element', { foo: true, bar: false })).toEqual('block__element block__element--foo');
    expect(bem('block', { foo: true, bar: false })).toEqual('block block--foo');
  });
});
