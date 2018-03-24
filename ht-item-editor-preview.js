"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg";
import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-button/paper-button";
import "ht-wysiwyg/ht-wysiwyg.js";

class HTItemEditorPreview extends LitElement {
  render({ src }) {
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
        }

        iron-icon {
            margin-right: 4px;
        }

        img {
            width: 100%;
            height: 100%;
            margin-top: 16px;
            max-width: 400px;
            max-height: 300px;
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
                </defs>
            </svg>
        </iron-iconset-svg>
      <div id="container"> 
          <p>Необходимо изображение: 800x600 | .svg .png .jpeg</p>
                <paper-button on-click=${e => {
                  this._chooseImage();
                }}" raised>
                    <iron-icon icon="ht-item-editor-preview-icons:image"></iron-icon>Выбрать изображение</paper-button>
                <input type="file" on-change=${e => {
                  this._inputChanged();
                }} accept="image/svg+xml,image/png,image/jpeg" hidden>
                <div id="img-container" hidden?=${
                  src === "" ? true : false
                }><img src="${src}"></div>
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
    this.img.removeAttribute("hidden");
    if (this.input.files[0] === undefined) return;
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
}

customElements.define(HTItemEditorPreview.is, HTItemEditorPreview);
