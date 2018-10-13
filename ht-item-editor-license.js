"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg";
import "@polymer/paper-icon-button/paper-icon-button.js";

class HTItemEditorLicense extends LitElement {
  render() {
    const { licensetypes, selectedLicensetypes } = this;
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
            max-width: 360px;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            margin: 8px 0;
            padding: 8px 8px 8px 16px;
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
            font-weight: 400;
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
              licensetypes,
              item => html`
                <option .data=${item}>${item.name}</option>
          `
            )}
           
          </select>
          <div id="selected">
            ${repeat(
              selectedLicensetypes,
              licensetype => html`
                <div class="license-container" .licensetypeId=${
                  licensetype.licensetypeId
                }>
                  <div class="name">${licensetype.name}</div>
                  <div class="right">
                      <div class="price" ?hidden=${licensetype.free}>
                          <span>$ </span>
                          <input placeholder="Цена" .id="id${
                            licensetype.licensetypeId
                          }" .value=${licensetype.price || 0}>
                      </div>
                      <paper-icon-button icon="ht-item-editor-license-icons:close" .openSource=${
                        licensetype.openSource
                      } .licensetypeId=${
                licensetype.licensetypeId
              } @click=${e => {
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
      selectedLicensetypes: { type: Array },
      licensetypes: { type: Array }
    };
  }

  constructor() {
    super();
    this.personalLicenseId = "q23WR8PbikFUBSVWh0fL";
    this.licensetypes = [];
    this.selectedLicensetypes = [];
  }

  firstUpdated() {
    this.setLicensetypes();
    this.select.addEventListener("change", e => {
      this.changed();
    });
  }

  get selected() {
    let selected = {};
    this.selectedLicensetypes.forEach(item => {
      if (!item.free) {
        item.price = this.shadowRoot.querySelector(
          `#id${item.licensetypeId}`
        ).value;
        item.price = +item.price;
        if (item.price === undefined || item.price === "") item.price = 0;
      }
      selected[item.licensetypeId] = item;
    });
    return selected;
  }

  set selected(selected) {
    let license = [];
    for (let licensetypeId in selected) {
      license.push(selected[licensetypeId]);
    }
    this.selectedLicensetypes = license;
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  async setLicensetypes() {
    let licensetypes = [];
    let snapshot = await firebase
      .firestore()
      .collection("licensetypes")
      .get();
    snapshot.forEach(function(doc) {
      let data = doc.data();
      data.licensetypeId = doc.id;
      // All except extended license
      if (data.licensetypeId !== "9dqs4FFuHxUFVoRHEKBI")
        licensetypes.push(data);
    });
    licensetypes.sort((a, b) => {
      return a.index > b.index;
    });
    this.licensetypes = licensetypes;
    let selected = Object.assign([], this.selectedLicensetypes);
    this.selectedLicensetypes = selected;
  }

  changed() {
    let selectedIndex = this.select.options.selectedIndex;
    let selectedItem = this.select.options[selectedIndex].data;
    if (selectedItem === undefined) return;
    let selected = Object.assign([], this.selectedLicensetypes);
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
      if (
        !personalLicenseExist &&
        selectedItem.licensetypeId !== this.personalLicenseId
      ) {
        this.licensetypes.forEach(item => {
          if (item.licensetypeId === this.personalLicenseId) temp.push(item);
        });
      }
      selected = temp;
    }
    selected.sort((a, b) => {
      return a.index > b.index;
    });
    this.select.options.selectedIndex = 0;
    this.selectedLicensetypes = selected;
  }

  _removeItem(e) {
    let selected = [];
    this.selectedLicensetypes.forEach(item => {
      if (
        item.licensetypeId !== e.target.licensetypeId &&
        item.licensetypeId !== this.personalLicenseId
      )
        selected.push(item);
      if (
        this.selectedLicensetypes.length > 1 &&
        item.licensetypeId === this.personalLicenseId
      )
        selected.push(item);
    });
    this.selectedLicensetypes = selected;
  }

  getPrice() {
    let price = 0;
    this.selectedLicensetypes.forEach(item => {
      if (item.name === "Yunato Single") price = +item.price;
      if (item.name === "Yunato Extended" && price === 0) price = +item.price;
    });
    return price;
  }
}

customElements.define(HTItemEditorLicense.is, HTItemEditorLicense);
