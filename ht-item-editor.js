"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-input/paper-input.js";
import "ht-wysiwyg/ht-wysiwyg.js";
import "ht-item-editor/ht-item-editor-preview.js";
import "ht-item-editor/ht-item-editor-license.js";
import "ht-item-editor/ht-item-editor-categories.js";
import "ht-item-editor/ht-item-editor-attributes.js";
import "ht-item-editor/ht-item-editor-tags.js";
class HTItemEditor extends LitElement {
  render() {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        section {
          margin-top:16px;
        }

        h3 {
          margin-bottom:0;
        }

        #container {
          
        }
      </style>
      <div id="container"> 
        <paper-input id="name" label="Название"></paper-input>
        <paper-input id="name-english" label="Название на английском" placeholder="my-super-item-7" allowed-pattern="^[0-9a-z\-]+$"></paper-input>
        <paper-input label="Ссылка на демо"></paper-input>
        <paper-input id="github" label="Ссылка на репозиторий" placeholder="author/repository">
            <div slot="prefix">https://github.com/</div>
        </paper-input>
        <section>
          <h3>Описание</h3>
          <ht-wysiwyg id="description"></ht-wysiwyg>
        </section>
        <section>
          <h3>Превью</h3>
          <ht-item-editor-preview id="preview"></ht-item-editor-preview>
        </section>
        <section>
          <h3>Лицензии</h3>
          <ht-item-editor-license id="license"></ht-item-editor-license>
        </section>
        <section>
          <h3>Категории</h3>
          <ht-item-editor-categories id="categories"></ht-item-editor-categories>
        </section>
        <section>
          <h3>Атрибуты</h3>
          <ht-item-editor-attributes id="attributes"></ht-item-editor-attributes>
        </section>
        <section>
          <h3>Теги</h3>
          <ht-item-editor-tags id="tags"></ht-item-editor-tags>
        </section>
      </div>
`;
  }

  static get is() {
    return "ht-item-editor";
  }

  static get properties() {
    return {
      licensetypes: Array
    };
  }

  constructor() {
    super();
    this.licensetypes = [];
  }

  ready() {
    super.ready();
  }

  add() {
    let file = this.shadowRoot
      .querySelector("ht-item-editor-preview")
      .getImageFile();
    console.log(file);
  }

  save() {}
}

customElements.define(HTItemEditor.is, HTItemEditor);
