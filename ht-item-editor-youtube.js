"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-elements-item-youtube-preview";

class HTItemEditorYoutube extends LitElement {
  render() {
    const { data } = this;
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        ht-elements-item-youtube-preview {
            width:100%;
            max-width:384px;
            margin-top:16px;
        }

        #container {
            display:flex;
            flex-direction:column;
        }

        paper-input {
          max-width: 500px;
        }
      </style>
      <div id="container"> 
        <paper-input id="youtube" label="YouTube videoID" value=${data} always-float-label placeholder="videoID" @keyup=${e => {
      this._onInputKeyUp(e);
    }}>
            <div slot="prefix">https://www.youtube.com/watch?v=</div>
        </paper-input>
        ${
          data && data !== ""
            ? html`<ht-elements-item-youtube-preview .data=${data}></ht-elements-item-youtube-preview>`
            : ""
        }
        
      </div>
    `;
  }

  static get is() {
    return "ht-item-editor-youtube";
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

customElements.define(HTItemEditorYoutube.is, HTItemEditorYoutube);
