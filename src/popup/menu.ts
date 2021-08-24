// @ts-ignore
import cssText from 'bundle-text:../../dist/style.css';
import { html, define } from 'hybrids';
import * as browser from 'webextension-polyfill';
import { getValues } from '../BrowserStorage';
import { getHostFromTabUrl } from '../utils';
import DropdownMenu from './components/DropdownMenu';
import PositionSelector from './components/PositionSelector';

const getStorageValues = async (host) => {
  const [{ url }] = await browser.tabs.query({ active: true, currentWindow: true });
  const hostname = getHostFromTabUrl(url);
  const values = await getValues(hostname);
  const hostValues = values[hostname];
  host.enabled = hostValues?.isEnabled ?? false;
  host.selectedRule = hostValues?.selectedRule ?? 'bootstrapBuiltIn';
  host.displayPosition = hostValues?.displayPosition ?? 'selectTopLeft';
  return host;
};

const setPluginToggle = async (host, e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  host.enabled = checked;
  await browser.runtime.sendMessage({ action: 'ENABLE_DISPLAY', value: checked });
};

export default define({
  tag: 'menu-popup',
  enabled: false,
  selectedRule: 'bootstrapBuiltIn',
  displayPosition: 'selectTopLeft',
  render: (host) => html`
      <div>
        ${html.resolve( getStorageValues(host).then(({ enabled, selectedRule, displayPosition }) => html`
          <div class="text-blue-500 flex gap-4">
            Break Points
            <label
              for="toogleA" 
              class="flex items-center cursor-pointer"
            >
              <div class="relative">
                <input 
                  id="toogleA" 
                  type="checkbox" 
                  class="sr-only"
                  onchange="${setPluginToggle}"
                  checked="${enabled ?? false}"
                />
                <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
            </div>
          </label>
          </div>
          <div class="h-4"></div>
          <dropdown-menu selected="${selectedRule}"></dropdown-menu>
          <div class="h-4"></div>
          <position-selector selected="${displayPosition}"></position-selector>
        `))}
      </div>
    `.style(cssText),
}, DropdownMenu, PositionSelector);
