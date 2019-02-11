"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-button";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@01ht/ht-storage";

import { styles } from "@01ht/ht-theme/styles";

class HTItemEditorImage extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        paper-dialog {
          width: 95%;
          max-width: 800px;
          margin-left: 0;
          margin-right: 0;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 384px;
        }

        #actions {
          display: flex;
          flex-wrap: wrap;
        }

        #choose {
          margin-right: 8px;
        }

        #img-container {
          margin-top: 16px;
          position: relative;
        }

        #close {
          background: none;
          color: var(--accent-color);
        }

        .buttons {
          padding: 16px 24px 16px 24px;
        }

        [hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { data } = this;
    return html`
      <div id="container"> 
        <p>1920x1080 | .jpg</p>
        <div id="actions">
            <paper-button id="choose" @click="${this._showDialog}" raised>
                Выбрать</paper-button>
        </div>
        ${
          data.public_id
            ? html`<div id="img-container"><img src="${
                window.cloudinaryURL
              }/image/upload/c_scale,f_auto,w_512/v${data.version}/${
                data.public_id
              }.jpg">
                </div>`
            : ""
        }
        <paper-dialog>
            <h2>Выберите изображение</h2>
            <paper-dialog-scrollable>
                <ht-storage></ht-storage>
            </paper-dialog-scrollable>
            <div class="buttons">
            <paper-button id="close" dialog-dismiss>Закрыть</paper-button>
            <paper-button id="select" dialog-confirm @click="${
              this._insertImage
            }">Выбрать</paper-button>
            </div>
        </paper-dialog>

      </div>
`;
  }

  static get properties() {
    return { data: { type: Object } };
  }

  constructor() {
    super();
    this.data = {};
  }

  get dialog() {
    return this.shadowRoot.querySelector("paper-dialog");
  }

  get storage() {
    return this.shadowRoot.querySelector("ht-storage");
  }

  _showDialog() {
    this.dialog.open();
    this.storage.updateList();
  }

  _insertImage() {
    let items = this.storage.getSelectedItems();
    if (items.length === 0) return;
    let item = items[0];
    if (item.format === "jpg" && item.width === 1920 && item.height === 1080) {
      this.data = item;
    } else {
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: "Изображение не соотвествует требованиям"
          }
        })
      );
    }
  }

  reset() {
    this.data = {};
  }
}

customElements.define("ht-item-editor-image", HTItemEditorImage);
