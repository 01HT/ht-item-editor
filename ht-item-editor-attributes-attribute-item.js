"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";

class HTItemEditorAttributesAttributeItem extends LitElement {
  render({ data, opened, selected }) {
    return html`
      <style>
        :host {
            display: flex;
            box-sizing:border-box;
            position:relative;
        }

        #container {
            display:flex;
            flex-direction: column;
            margin-left:16px;
        }

        #actions {
            display: flex;
            align-items: center;
            height:42px;
        }

        #title {
            max-width: 160px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        #title {
            display:flex;
            align-items:center;
            box-sizing:border-box;
            border: 1px solid #fff;
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
        }

        #title:hover {
            border: 1px solid #ddd;
        }

        #add-container {
            margin-bottom:8px;
        }

        paper-icon-button {
            color: var(--accent-color);
        }

        iron-icon {
            display: none;
            margin-left:4px;
            color: #ddd;
            min-width: 24px;
            min-height: 24px;
        }

        #title:hover iron-icon {
            display: block;
        }

        #title[selected] {
            display: flex;
            background: rgba(139, 195, 74, 0.19);
        }

        [selected] iron-icon {
            display: block;
            color: var(--accent-color);
        }

        #title.root {
            cursor: default;
        }

        #title.root:hover {
            border:1px solid #fff;
        }

        #title.root:hover iron-icon {
            display:none;
        }

        [hidden] {
            display:none;
        }

        [hide] {
            visibility: hidden;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-item-editor-categories-item">
          <svg>
              <defs>
                <g id="check-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></g>
                <g id="add-box"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g>
                <g id="indeterminate-check-box"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
          <div id="actions">
              <paper-icon-button icon="ht-item-editor-categories-item:add-box" on-click=${e => {
                this.open();
              }} hidden?=${opened} hide?=${this.showBlockHidden()}></paper-icon-button>
              <paper-icon-button icon="ht-item-editor-categories-item:indeterminate-check-box" on-click=${e => {
                this.close();
              }} hidden?=${!opened} hide?=${this.showBlockHidden()}></paper-icon-button>
          <div id="title" class$="${
            this.isRoot() ? "root" : ""
          }" selected?=${selected} on-click=${e => {
      this.toggle(e);
    }}>${
      data.title
    } <iron-icon icon="ht-item-editor-categories-item:check-circle"></iron-icon></div>
        </div>
          <div hidden?=${!opened}>
              <slot></slot>
          </div>
      </div>
      `;
  }

  static get is() {
    return "ht-item-editor-attributes-attribute-item";
  }

  static get properties() {
    return { data: Object, opened: Boolean, selected: Boolean };
  }

  constructor() {
    super();
    this.data = {};
    this.opened = false;
    this.selected = false;
  }

  isRoot() {
    if (this.data.parentId === "" || this.data.parentId === "root") return true;
    return false;
  }

  showBlockHidden() {
    if (this.innerHTML === "") return true;
    return false;
  }

  get input() {
    return this.shadowRoot.querySelector("paper-input");
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  toggle(e) {
    if (e.target.classList.contains("root") !== true) {
      this.selected = !this.selected;
      this.dispatchEvent(
        new CustomEvent("category-selected", {
          bubbles: true,
          composed: true,
          detail: this
        })
      );
    }
  }
}

customElements.define(
  HTItemEditorAttributesAttributeItem.is,
  HTItemEditorAttributesAttributeItem
);
