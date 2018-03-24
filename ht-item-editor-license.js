"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/lib/repeat.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg";
import "@polymer/paper-icon-button/paper-icon-button.js";
// import "@polymer/paper-listbox";
// import "@polymer/paper-dropdown-menu";

class HTItemEditorLicense extends LitElement {
  render({ items, selected }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        select, option{
          padding: 8px;
          max-width: 300px;
          font-size: 16px;
        }
        
        #container {
          display:flex;
          flex-direction: column;
        }

        .license-container {
            width: 100%;
            max-width: 280px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            margin: 8px 0;
            padding: 4px 4px 4px 16px;
            align-items: center;
            border-radius: 2px;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        
        .right {
            display: flex;
            align-items: center;
        }
        
        .price {
            display: flex;
            align-items: center;
            margin: 0 8px;
        }
        
        span {
            font-size: 14px;
            margin-right: 4px;
        }
        
        input {
            width: 70px;
            padding: 4px;
            font-size: 14px;
        }
        
        .name {
            font-weight: 500;
        }

        #selected {
          margin-top:16px;
        }

        [hidden] {
            display: none;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-item-editor-license-icons">
            <svg>
                <defs>
                    <g id="close">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </g>
                </defs>
            </svg>
        </iron-iconset-svg>
  
        <div id="container">
          <select>
            <option value="">Выберите лицензию</option>
            ${repeat(
              items,
              item => html`
                <option data=${item}>${item.name}</option>
          `
            )}
          </select>
          <div id="selected">
            ${repeat(
              selected,
              item => html`
                <div class="license-container" licensetypeId=${
                  item.licensetypeId
                }>
                  <div class="name">${item.name}</div>
                  <div class="right">
                      <div class="price" hidden?=${item.free}>
                          <span>$ </span>
                          <input placeholder="Цена" id="${
                            item.licensetypeId
                          }" value$=${item.price}/>
                      </div>
                      <paper-icon-button icon="ht-item-editor-license-icons:close" openSource=${
                        item.openSource
                      } licensetypeId=${item.licensetypeId} on-click=${e => {
                this._removeItem(e);
              }}></paper-icon-button>
                  </div>
                </div>
          `
            )}
              
          </div>

        </div>
`;
  }

  static get is() {
    return "ht-item-editor-license";
  }

  static get properties() {
    return {
      items: Array,
      selected: Array
    };
  }

  constructor() {
    super();
    this.personalLicenseId = "q23WR8PbikFUBSVWh0fL";
    this.items = [];
    this.selected = [];
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  ready() {
    super.ready();
    this.select.addEventListener("change", e => {
      this.changed();
    });
  }

  changed() {
    let selectedIndex = this.select.options.selectedIndex;
    let selectedItem = this.select.options[selectedIndex].data;
    if (selectedItem === undefined) return;
    let selected = Object.assign([], this.selected);
    if (selectedItem.openSource) {
      selected = [selectedItem];
    }
    if (!selectedItem.openSource) {
      let temp = [selectedItem];
      let personalLicenseExist = false;
      selected.forEach(item => {
        if (item.licensetypeId === selectedItem.licensetypeId) return;
        if (item.licensetypeId === this.personalLicenseId)
          personalLicenseExist = true;
        if (!item.openSource) temp.push(item);
      });
      if (!personalLicenseExist) {
        this.items.forEach(item => {
          console.log(item);
          if (item.licensetypeId === this.personalLicenseId) temp.push(item);
        });
      }
      selected = temp;
    }
    selected.sort((a, b) => {
      return a.index > b.index;
    });
    this.select.options.selectedIndex = 0;
    this.selected = selected;
  }

  getSelected() {
    let selected = [];
    this.selected.forEach(item => {
      if (!item.free) {
        item.price = this.shadowRoot.querySelector(
          `#${item.licensetypeId}`
        ).value;
        if (item.price === undefined || item.price === "") item.price = 1;
      }
      selected.push(item);
    });
    console.log(selected);
    return selected;
  }

  _removeItem(e) {
    let selected = [];
    this.selected.forEach(item => {
      if (item.licensetypeId !== e.target.licensetypeId) selected.push(item);
    });
    this.selected = selected;
  }
}

customElements.define(HTItemEditorLicense.is, HTItemEditorLicense);
