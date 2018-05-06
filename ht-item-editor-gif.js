"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg";
import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-button/paper-button";

class HTItemEditorGif extends LitElement {
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
            max-height: 300px;
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
          <p>.gif | < 5mb</p>
                <paper-button on-click=${e => {
                  this._chooseImage();
                }}" raised>
                    <iron-icon icon="ht-item-editor-preview-icons:image"></iron-icon>Выбрать Gif</paper-button>
                <input type="file" on-change=${e => {
                  this._inputChanged();
                }} accept="image/gif" hidden>
                <div id="img-container" hidden?=${
                  src === "" ? true : false
                }><img src="${src}"><paper-icon-button raised icon="ht-item-editor-preview-icons:close" onclick=${e => {
      this.reset();
    }}></paper-icon-button></div>
      </div>
`;
  }

  static get is() {
    return "ht-item-editor-gif";
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

  getImageFile() {
    return this.input.files[0];
  }

  setImage(URL) {
    this.src = URL;
  }

  async _changeFileName(file, newFileName) {
    try {
      let fileNameParts = file.name.split(".");
      let fileFormat = fileNameParts[fileNameParts.length - 1];
      let fileName = newFileName + "." + fileFormat;
      let blob = file.slice(0, file.size, file.type);
      let newFile = new File([blob], fileName, { type: file.type });
      return newFile;
    } catch (err) {
      console.log("changeFileName: " + err.message);
    }
  }

  async _updateItemDoc(itemId, gifURL) {
    try {
      await firebase
        .firestore()
        .collection("items")
        .doc(itemId)
        .update({
          gifURL: gifURL
        });
    } catch (err) {
      console.log("changeFileName: " + err.message);
    }
  }

  async _uploadFile(file, folderName) {
    try {
      let fileName = file.name;
      let storageRef = firebase.storage().ref();
      let ref = storageRef.child(`items/${folderName}/${fileName}`);
      let snapshot = await ref.put(file);
      return snapshot.downloadURL;
    } catch (err) {
      console.log("uploadFile: " + err.message);
    }
  }

  async save(itemId) {
    try {
      let file = this.getImageFile();
      if (file === undefined) return;
      file = await this._changeFileName(file, itemId);
      let gifURL = await this._uploadFile(file, itemId);
      await this._updateItemDoc(itemId, gifURL);
    } catch (err) {
      console.log("save: " + err.message);
    }
  }

  reset() {
    this.input.value = "";
    this.src = "";
  }
}

customElements.define(HTItemEditorGif.is, HTItemEditorGif);
