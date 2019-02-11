"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTItemEditorPreviewMode extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        select {
          margin: 16px 0;
        }

        select,
        option {
          padding: 8px;
          max-width: 300px;
          font-size: 16px;
        }

        #container {
          margin-top: -16px;
          display: flex;
          flex-direction: column;
        }
      `
    ];
  }

  render() {
    const { items, value } = this;
    return html`
        <div id="container">
            <select .value="${value}" @change="${_ => {
      this._onSelect();
    }}">
                ${repeat(
                  items,
                  item => html`
                    <option value="${item.value}">${item.text}</option>
            `
                )}
            </select>
        </div>
      `;
  }

  static get properties() {
    return {
      items: { type: Array },
      data: { type: String },
      value: { type: String }
    };
  }

  constructor() {
    super();
    this.value = "image";
    this.items = [
      { text: "Изображение", value: "image" },
      { text: "Слайдер с изображениями", value: "slider" },
      { text: "Анимированное изображение", value: "animated" },
      { text: "YouTube видео", value: "youtube" }
    ];
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  get data() {
    return this.value;
  }

  set data(data) {
    this.value = data;
  }

  _onSelect() {
    let select = this.select;
    this.value = select.options[select.selectedIndex].value;
  }

  reset() {
    this.value = "image";
  }
}

customElements.define("ht-item-editor-preview-mode", HTItemEditorPreviewMode);
