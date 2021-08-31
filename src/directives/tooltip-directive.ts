import { DirectiveBinding } from 'vue/types/options';

export default (el: HTMLElement, binding: DirectiveBinding) => {
  /* eslint-disable no-param-reassign */
  const tooltipText = binding.expression;
  if (tooltipText) {
    const scopedId = Math.random().toString(16).substr(2, 14);
    const tooltip = el.ownerDocument.createElement('span');
    el.innerHTML += `<style>
        .tooltip-${scopedId} {
            position: absolute;
            z-index: 10;
            right: -23px;
            top: 25px;
            width: 70px;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
        }
        @media (prefers-color-scheme: light) {
            .tooltip-${scopedId}:after {
              content: " ";
              position: absolute;
              bottom: 100%;  /* At the top of the tooltip */
              left: 50%;
              margin-left: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: transparent transparent black transparent;
            }
        }

        @media (prefers-color-scheme: dark) {
            .tooltip-${scopedId}:after {
              content: " ";
              position: absolute;
              bottom: 100%;  /* At the top of the tooltip */
              left: 50%;
              margin-left: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: transparent transparent white transparent;
            }
        }

    </style>`;
    tooltip.classList.add(
      `tooltip-${scopedId}`,
      'absolute',
      'bg-black',
      'text-white',
      'dark:text-black',
      'dark:bg-white',
    );
    tooltip.innerText = tooltipText;
    tooltip.style.display = 'none';
    el.onmouseover = () => {
      console.log('mouseOver');
      tooltip.style.display = 'inline-block';
      el.onmouseout = () => {
        tooltip.style.display = 'none';
        el.onmouseout = null;
      };
    };
    el.style.position = 'relative';
    el.appendChild(tooltip);
  }
  /* eslint-enable no-param-reassign */
};
