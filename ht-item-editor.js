"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-input/paper-input.js";
import "ht-wysiwyg/ht-wysiwyg.js";

class HTItemEditor extends LitElement {
  render(test) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        #container {
          
        }
      </style>
      <div id="container"> 
        <paper-input id="name" label="Название"></paper-input>
        <paper-input id="english" label="Название на английском"></paper-input>
        <section>
          <h3>Описание</h3>
          <ht-wysiwyg id="description"></ht-wysiwyg>
        </section>
      </div>
`;
  }

  static get is() {
    return "ht-item-editor";
  }
}

customElements.define(HTItemEditor.is, HTItemEditor);
