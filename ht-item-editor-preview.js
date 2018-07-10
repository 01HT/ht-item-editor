"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg";
import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-icon-button/paper-icon-button.js";
import { callFirebaseHTTPFunction } from "@01ht/ht-client-helper-functions";

class HTItemEditorPreview extends LitElement {
  _render({ src }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        paper-button {
            margin:0;
            color: #fff;
            background: var(--accent-color);
            padding: 8px 16px;
        }

        paper-icon-button {
          position: absolute;
          background: var(--accent-color);
          color: #fff;
          border-radius: 50%;
          right: 8px;
          top: 8px;
        }

        iron-icon {
            margin-right: 4px;
        }

        img {
            width: 100%;
            height: 100%;
            max-width: 400px;
        }

        #img-container {
          margin-top: 16px;
          position:relative;
          max-width: 400px;
        }

        [hidden] {
            display: none !important;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-item-editor-preview-icons">
        <svg>
            <defs>
                <g id="image">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
                </g>
                  <g id="close">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </g>
            </defs>
        </svg>
      </iron-iconset-svg>
      <div id="container"> 
          <p>1920x1080 | .jpeg | < 1Mb</p>
                <paper-button on-click=${e => {
                  this._chooseImage();
                }}" raised>
                    <iron-icon icon="ht-item-editor-preview-icons:image"></iron-icon>Выбрать изображение</paper-button>
                <input type="file" accept="image/jpeg" on-change=${e => {
                  this._inputChanged();
                }} accept="image/jpeg" hidden>
                <div id="img-container" hidden?=${
                  src === "" ? true : false
                }><img src="${src}">
                <paper-icon-button raised icon="ht-item-editor-preview-icons:close" onclick=${e => {
                  this.reset();
                }}></paper-icon-button>
                </div>
      </div>
`;
  }

  static get is() {
    return "ht-item-editor-preview";
  }

  static get properties() {
    return { src: String };
  }

  constructor() {
    super();
    this.src = "";
  }

  get input() {
    return this.shadowRoot.querySelector("input");
  }

  get img() {
    return this.shadowRoot.querySelector("img");
  }

  _chooseImage() {
    this.input.click();
  }

  _inputChanged() {
    if (this.input.files[0] === undefined) {
      this.reset();
      return;
    }
    this.img.removeAttribute("hidden");
    let file = this.input.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      this.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  _getImageFile() {
    return this.input.files[0];
  }

  setImage(URL) {
    this.src = URL;
  }

  async _uploadImage(file, itemId) {
    try {
      let formData = new FormData();
      formData.append("itemId", itemId);
      formData.append("myfile", file);
      let functionOptions = {
        name: "httpsItemsAddImage",
        options: { method: "POST", body: formData },
        authorization: true
      };
      await callFirebaseHTTPFunction(functionOptions);
    } catch (err) {
      console.log("uploadFile: " + err.message);
    }
  }

  async _setDefaultImage(itemId) {
    try {
      const updates = {
        imageURL:
          "https://storage.googleapis.com/api-01-ht.appspot.com/default/item/item-default-image.jpg",
        thumb_w960:
          "https://storage.googleapis.com/api-01-ht.appspot.com/default/item/item-default-image-960w.jpg",
        thumb_w480:
          "https://storage.googleapis.com/api-01-ht.appspot.com/default/item/item-default-image-480w.jpg",
        thumb_w240:
          "https://storage.googleapis.com/api-01-ht.appspot.com/default/item/item-default-image-240w.jpg",
        thumb_w60:
          "https://storage.googleapis.com/api-01-ht.appspot.com/default/item/item-default-image-60w.jpg"
      };
      await firebase
        .firestore()
        .collection("items")
        .doc(itemId)
        .update(updates);
    } catch (err) {
      console.log("_setDefaultImage: " + err.message);
    }
  }

  async save(itemId) {
    try {
      let file = this._getImageFile();
      if (file === undefined && this.src === "") {
        await this._setDefaultImage(itemId);
        return;
      }
      await this._uploadImage(file, itemId);
    } catch (error) {
      console.log("save: " + error.message);
    }
  }

  reset() {
    this.input.value = "";
    this.src = "";
  }
}

customElements.define(HTItemEditorPreview.is, HTItemEditorPreview);
