"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg";

class HTItemEditorTags extends LitElement {
  render() {
    const { tags, selectedTags } = this;
    return html`
      <style>
        :host {
            display: block;
            box-sizing:border-box;
            position: relative;
        }

        select, option{
          padding: 8px;
          max-width: 300px;
          font-size: 16px;
        }

        paper-icon-button {
            min-width: 40px;
            min-height: 40px;
        }

        select {
            margin-top: 16px;
        }

        #container {
          margin-top:-16px;
          display:flex;
          flex-direction: column;
        }

        #selected {
          display: flex;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .selected {
            max-width: 240px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            margin: 4px 8px 4px 0;
            padding: 2px 2px 2px 16px;
            align-items: center;
            border-radius: 2px;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .name {
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-item-editor-tags-icons">
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
            <option value="">Выберите тег</option>
            ${repeat(
              tags,
              tag => html`
                <option .data=${tag}>${tag.name}</option>
          `
            )}
        </select>
        <div id="selected">
            ${repeat(
              selectedTags,
              item =>
                html`<div class="selected"><div class="name">${
                  item.name
                }</div><paper-icon-button icon="ht-item-editor-tags-icons:close" .tagId=${
                  item.tagId
                } @click=${e => {
                  this._removeItem(e);
                }}></paper-icon-button></div>`
            )}
        </div>
        </div>
      `;
  }

  static get is() {
    return "ht-item-editor-tags";
  }

  static get properties() {
    return {
      tags: { type: Array },
      selectedTags: { type: Array },
      selected: { type: Object }
    };
  }

  constructor() {
    super();
    this.tags = [];
    this.selectedTags = [];
    this.selected = {};
    this._getTags();
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  firstUpdated() {
    this.select.addEventListener("change", _ => {
      this._onSelect();
    });
  }

  get selected() {
    let selected = {};
    this.selectedTags.forEach(tag => {
      selected[tag.tagId] = tag;
    });
    return selected;
  }

  set selected(tags) {
    let selectedTags = [];
    for (let tagId in tags) {
      selectedTags.push(tags[tagId]);
    }
    this.selectedTags = selectedTags;
  }

  async _getTags() {
    let tags = [];
    let snapshot = await window.firebase
      .firestore()
      .collection("tags")
      .get();
    snapshot.forEach(doc => {
      let data = doc.data();
      data.tagId = doc.id;
      tags.push(data);
    });
    this.tags = tags;
  }

  _onSelect() {
    let selectedTags = Object.assign([], this.selectedTags);
    let selectedIndex = this.select.options.selectedIndex;
    let selectedItem = this.select.options[selectedIndex];
    let tagId = selectedItem.data.tagId;
    let isExist = false;
    selectedTags.forEach(tag => {
      console.log(tag);
      if (tag.tagId === tagId) isExist = true;
    });
    if (!isExist) selectedTags.push(selectedItem.data);
    this.selectedTags = selectedTags;
    this.select.options.selectedIndex = 0;
  }

  _removeItem(e) {
    let selectedTags = [];
    let tagId = e.target.tagId;
    this.selectedTags.forEach(item => {
      if (item.tagId !== tagId) selectedTags.push(item);
    });
    this.selectedTags = selectedTags;
  }
}

customElements.define(HTItemEditorTags.is, HTItemEditorTags);
