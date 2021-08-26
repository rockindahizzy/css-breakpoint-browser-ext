// @ts-ignore
import cssText from 'bundle-text:../../../dist/style.css';
import { html } from 'hybrids';

const CreateBreakpointForm = {
  tag: 'create-breakpoint-form',
  render: (host) => html`
    <div class="text-white">This is a new component</div>
  `.style(cssText),
};

export default CreateBreakpointForm;
