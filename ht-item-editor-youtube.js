"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-elements-item-youtube-preview";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTItemEditorYoutube extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        ht-elements-item-youtube-preview {
          width: 100%;
          max-width: 384px;
          margin-top: 16px;
        }

        #container {
          display: flex;
          flex-direction: column;
        }

        paper-input {
          max-width: 500px;
        }
      `
    ];
  }

  render() {
    const { data } = this;
    return html`
      <div id="container"> 
        <paper-input id="youtube" label="YouTube videoID" value="${data}" always-float-label placeholder="videoID" @keyup="${e => {
      this._onInputKeyUp(e);
    }}">
            <div slot="prefix">https://www.youtube.com/watch?v=</div>
        </paper-input>
        ${
          data && data !== ""
            ? html`<ht-elements-item-youtube-preview .data="${data}"></ht-elements-item-youtube-preview>`
            : ""
        }
        
      </div>
    `;
  }

  static get properties() {
    return { data: { type: String } };
  }

  _onInputKeyUp(e) {
    this.data = this.shadowRoot.querySelector("paper-input").value;
  }

  reset() {
    this.data = "";
  }
}

customElements.define("ht-item-editor-youtube", HTItemEditorYoutube);
