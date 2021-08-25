import { debounce } from 'ts-debounce';
import { saveHostValues } from './BrowserStorage';

const draggable = (element) => {
  const storeCurrentPosition = debounce((top, left) => {
    const hostname = window.location.hostname;
    saveHostValues(hostname, { position: { top, left } });
  }, 500);

  let top;
  let left;

  const elementDrag = (e) => {
    e.preventDefault();
    // calculate the new cursor position:
    top = e.clientY - (element.offsetHeight / 2);
    left = e.clientX - (element.offsetWidth / 2);
    // set the element's new position:
    if (top < 0 ) {
      top = '0px';
    }
    if (top + element.offsetHeight + 15 > window.innerHeight) {
      top = `${window.innerHeight - element.offsetHeight - 15}px`;
    }
    if (left < 0){
      left = '0px';
    }
    if (left + element.offsetWidth + 15 > window.innerWidth) {
      left = `${window.innerWidth - element.offsetWidth - 15}px`;
    }

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  };

  const closeDragElement = () => {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    storeCurrentPosition(top, left);
  };

  element.onmousedown = (e) => {
    e.preventDefault();
    // get the mouse cursor position at startup:
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  };
};

export default draggable;
