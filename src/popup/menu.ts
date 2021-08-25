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
          <div class="text-2xl text-white flex gap-4">
            Break Points
            <label
              for="enableToggle" 
              class="flex items-center cursor-pointer"
            >
              <div class="relative">
                <input 
                  id="enableToggle" 
                  type="checkbox" 
                  class="sr-only"
                  onchange="${setPluginToggle}"
                  checked="${enabled ?? false}"
                />
                <div class="w-10 h-5 bg-gray-500 rounded-full shadow-inner"></div>
                <div class="dot absolute w-5 h-5 bg-white rounded-full shadow left-0 top-0 transition"></div>
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
