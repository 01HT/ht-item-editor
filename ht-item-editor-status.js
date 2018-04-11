"use strict";
import { LitElement, html } from "@polymer/lit-element";

class HTItemEditorStatus extends LitElement {
  render({ statusText }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        #container {
            display: flex;
            flex-wrap: wrap;
            font-size: 14px;
            align-items:center;
        }

        #status {
            font-weight: 500;
            margin-right: 4px;
        }

        #text {
            padding: 2px 6px;
            background: #afd683;
            border-radius: 3px;
            color:#fff;
            font-size: 13px;
        }
      </style>
      <div id="container"> 
            <span id="status">Статус:</span> <span id="text">${statusText}</span>
      </div>
`;
  }

  static get is() {
    return "ht-item-editor-status";
  }

  static get properties() {
    return { statusText: String };
  }

  constructor() {
    super();
    this.statusText = "";
  }
}

customElements.define(HTItemEditorStatus.is, HTItemEditorStatus);
