"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-button";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@01ht/ht-storage";
import "@01ht/ht-image";
import "@01ht/ht-image-slider";

class HTItemEditorImageSlider extends LitElement {
  render() {
    const { data } = this;
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        paper-button {
            margin:8px 0 0 0;
            color:var(--secondary-text-color);
            font-weight:500;
            padding: 8px 16px;
        }

        #select {
          color:var(--accent-color);
        }
        
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
            color: #fff;
            background: var(--accent-color);
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
      </style>
     
      <div id="container"> 
        <p>1920x1080 | .jpg | от 2-5 изображений</p>
        <div id="actions">
            <paper-button id="choose" @click=${e => {
              this._showDialog();
            }}" raised>
                   Выбрать</paper-button>
            <paper-button id="reset" @click=${e => {
              this.reset();
            }}" raised ?hidden=${Object.keys(data).length === 0}>
                   Убрать</paper-button>
        </div>
        
          <div id="img-container" >
          <ht-image-slider .data=${data}></ht-image-slider>
                </div>
        <paper-dialog>
            <h2>Выберите файл</h2>
            <paper-dialog-scrollable>
                <ht-storage></ht-storage>
            </paper-dialog-scrollable>
            <div class="buttons">
            <paper-button id="close" dialog-dismiss>Закрыть</paper-button>
            <paper-button id="select" dialog-confirm @click="${e => {
              this._insertImage();
            }}">Выбрать</paper-button>
            </div>
        </paper-dialog>

      </div>
`;
  }

  static get is() {
    return "ht-item-editor-image-slider";
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
    if (items.length <= 1 || items.length > 5) {
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: "Количество не соответствует требованиям"
          }
        })
      );
      return;
    }
    let data = {};
    for (let index in items) {
      let item = items[index];
      if (
        item.format !== "jpg" ||
        item.width !== 1920 ||
        item.height !== 1080
      ) {
        this.dispatchEvent(
          new CustomEvent("show-toast", {
            bubbles: true,
            composed: true,
            detail: {
              text: `Файл ${item.public_id}.${
                item.format
              } не соответствует требованиям`
            }
          })
        );
      }
      data[item.public_id] = item;
    }
    this.data = data;
  }

  reset() {
    this.data = {};
  }
}

customElements.define(HTItemEditorImageSlider.is, HTItemEditorImageSlider);
