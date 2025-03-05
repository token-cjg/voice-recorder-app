/* eslint-disable */

import '@testing-library/jest-dom';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

// Polyfill createRoot if necessary.
if (!ReactDOMClient.createRoot) {
  ReactDOMClient.createRoot = function (container) {
    return {
      render(element) {
        ReactDOM.render(element, container);
      },
    };
  };
}

// Polyfill ReactDOM.render if it doesn't exist.
if (typeof ReactDOM.render !== 'function') {
  ReactDOM.render = function (element, container) {
    return ReactDOMClient.createRoot(container).render(element);
  };
}

// Polyfill unmountComponentAtNode if it's not defined.
if (typeof ReactDOM.unmountComponentAtNode !== 'function') {
  ReactDOM.unmountComponentAtNode = function (container) {
    // Clear the container's content.
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    return true;
  };
}
