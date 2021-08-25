// @ts-ignore
import cssText from 'bundle-text:../../../dist/style.css';
import { html, property } from 'hybrids';
import * as browser from 'webextension-polyfill';
import { icons } from 'feather-icons';

const selectionChanged = (selectedItem) => (host) => {
  host.selected = selectedItem;
  browser.runtime.sendMessage({ action: 'CHANGE_BREAKPOINT_RULE', value: selectedItem });
  host.showDropdown = false;
};

const toggleDropdown = (host) => {
  host.showDropdown = !host.showDropdown;
};

const options = [
  { name: 'Bootstrap', value: 'bootstrapBuiltIn' },
  { name: 'Tailwindcss', value: 'tailwindBuiltIn' },
];

const DropdownMenu = {
  tag: 'dropdown-menu',
  selected: property('tailwindBuiltIn'),
  showDropdown: false,
  render: ({ selected, showDropdown }: { selected: string, showDropdown: boolean }) => html`
    <div class="relative">
      <div class="flex w-full justify-center cursor-pointer" onclick="${toggleDropdown}">
          <div class="text-white border-b border-gray-500 pr-10">${options.find(o => o.value === selected).name}</div>
          <div class="border-b border-gray-500" innerHTML="${icons['chevron-down'].toSvg({ class: 'text-blue-500' })}"></div>
      </div>
      <div>${showDropdown && html`<div class="bg-white absolute w-full h-24 rounded top-8 overflow-y-scroll">
          ${options.map((option, i) => html`
              <div 
                class="hover:bg-blue-300 px-2 py-4 ${i === 0 ? 'rounded-t' : ''} ${i === options.length - 1 ? 'rounded-b' : ''}" 
                onclick="${selectionChanged(option.value)}">
                  ${option.name}
              </div>
          `)}
      </div>`}
      }
    </div>
  `.style(cssText),
};

export default DropdownMenu;
