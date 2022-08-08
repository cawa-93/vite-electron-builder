import {mount} from '@vue/test-utils';
import {expect, test, vi} from 'vitest';
import ElectronVersions from '../src/components/ElectronVersions.vue';

vi.mock('#preload', () => {
  return {
    versions: {lib1: 1, lib2: 2},
  };
});

test('ElectronVersions component', async () => {
  expect(ElectronVersions).toBeTruthy();
  const wrapper = mount(ElectronVersions);

  const lis = wrapper.findAll<HTMLElement>('li');
  expect(lis.length).toBe(2);
  expect(lis[0].text()).toBe('lib1: v1');
  expect(lis[1].text()).toBe('lib2: v2');
});
