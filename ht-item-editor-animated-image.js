"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-button";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@01ht/ht-storage";
import "@01ht/ht-animated-image";

class HTItemEditorAnimatedImage extends LitElement {
  static styles = [
    window.SharedStyles,
    css`<style>
        paper-dialog {
            width: 95%;
            max-width: 800px;
            margin-left: 0;
            margin-right: 0;
        }

        #actions {
            display:flex;
            flex-wrap:wrap;
        }

        #choose {
            margin-right:8px;
        }

        #close {
          background:none;
          color:var(--accent-color);
        }

        #img-container {
          margin-top: 16px;
          position:relative;
          max-width: 384px;
        }

        .buttons {
          padding:8px 24px 16px 24px;
        }

        [hidden] {
            display: none;
        }
      </style>`
  ];

  render() {
    const { data } = this;
    return html`
      <div id="container"> 
        <p>.webp, .mp4, .gif | 16x9 | Ширина >= 960px | < 10MB</p>
        <div id="actions">
            <paper-button id="choose" @click="${this._showDialog}" raised>
                   Выбрать</paper-button>
            <paper-button id="reset" @click="${
              this.reset
            }" raised ?hidden="${!data.public_id}">
                   Убрать</paper-button>
        </div>
                
          <div id="img-container" ?hidden="${!data.public_id}">
          <ht-animated-image .data="${data}"></ht-animated-image>
                </div>
        <paper-dialog>
            <h2>Выберите файл</h2>
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
    if (
      item.format === "webp" ||
      item.format === "mp4" ||
      (item.format === "gif" &&
        item.width >= 960 &&
        (item.width / item.height).toFixed(2) === "1.78")
    ) {
      this.data = item;
    } else {
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: "Выбранный файл не соотвествует требованиям"
          }
        })
      );
    }
  }

  reset() {
    this.data = {};
  }
}

customElements.define(
  "ht-item-editor-animated-image",
  HTItemEditorAnimatedImage
);
