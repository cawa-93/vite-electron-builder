import {mount} from '@vue/test-utils';
import {expect, test, vi} from 'vitest';
import ReactiveHash from '../src/components/ReactiveHash.vue';
import type {BinaryLike} from 'crypto';

/**
 * Mock expected global api exposed by {@link module:preload}
 */
(window as Window & typeof globalThis & { nodeCrypto: { sha256sum: (s: BinaryLike) => string } }).nodeCrypto = {
  sha256sum: vi.fn((s: BinaryLike) => `${s}:HASHED`),
};

test('ReactiveHash component', async () => {
  expect(ReactiveHash).toBeTruthy();
  const wrapper = mount(ReactiveHash);

  const dataInput = wrapper.get<HTMLInputElement>('input:not([readonly])');
  const hashInput = wrapper.get<HTMLInputElement>('input[readonly]');

  const dataToHashed = 'Raw data from unit test';
  await dataInput.setValue(dataToHashed);
  expect(hashInput.element.value).toBe(`${dataToHashed}:HASHED`);
});
