// @ts-ignore
import cssText from 'bundle-text:../../../dist/style.css';
import { html, property } from 'hybrids';
import * as browser from 'webextension-polyfill';

interface IPositionSelector {
  selected: string
}

const selectedClass = 'bg-green-500';
const defaultClass = 'bg-black';

const onSelectorClicked = (clickedId: string) => (host: IPositionSelector) => {
  host.selected = clickedId;
  browser.runtime.sendMessage( { action: 'CHANGE_POSITION', value: clickedId });
};

const PositionSelector =  {
  tag: 'position-selector',
  selected: property('selectTopLeft'),
  render: ({ selected }) => html`
      <div class="bg-black grid grid-cols-2 gap-4">
        <button 
          name="selectPos" 
          id="selectTopLeft" 
          class="${selected === 'selectTopLeft' ? selectedClass : defaultClass} border-t-2 border-l-2 border-blue-500 w-full h-10"
          onclick="${onSelectorClicked('selectTopLeft')}"
        >
        </button>
        <button 
          name="selectPos" 
          id="selectTopRight"
          class="${selected === 'selectTopRight' ? selectedClass : defaultClass} border-t-2 border-r-2 border-blue-500 w-full h-10"
          onclick="${onSelectorClicked('selectTopRight')}"
        >
        </button>
        <button 
          name="selectPos" 
          id="selectBtmLeft"
          class="${selected === 'selectBtmLeft' ? selectedClass : defaultClass} border-b-2 border-l-2 border-blue-500 w-full h-10"
          onclick="${onSelectorClicked('selectBtmLeft')}"
        >
        </button>
        <button 
          name="selectPos" 
          id="selectBtmRight"
          class="${selected === 'selectBtmRight' ? selectedClass : defaultClass} border-b-2 border-r-2 border-blue-500 w-full h-10"
          onclick="${onSelectorClicked('selectBtmRight')}"
        >
        </button>
      </div>
    `.style(cssText),
};

export default PositionSelector;
