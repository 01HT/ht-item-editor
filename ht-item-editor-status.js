"use strict";
import { LitElement, html, css } from "lit-element";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTItemEditorStatus extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        #container {
          display: flex;
          flex-wrap: wrap;
          font-size: 14px;
          align-items: center;
        }

        #status {
          font-weight: 500;
          margin-right: 4px;
        }

        #text {
          padding: 2px 6px;
          background: #83b735;
          border-radius: 3px;
          color: #fff;
          font-size: 13px;
        }
      `
    ];
  }

  render() {
    const { statusText } = this;
    return html`
      <div id="container"> 
            <span id="status">Статус:</span> <span id="text">${statusText}</span>
      </div>
`;
  }

  static get properties() {
    return { statusText: String };
  }

  constructor() {
    super();
    this.statusText = "";
  }
}

customElements.define("ht-item-editor-status", HTItemEditorStatus);
