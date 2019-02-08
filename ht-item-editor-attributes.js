"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "./ht-item-editor-attributes-attribute-item.js";

class HTItemEditorAttributes extends LitElement {
  static styles = css`<style>
    :host {
        display: block;
        box-sizing:border-box;
        position: relative;
    }

    #container {
      margin-top: -16px;
      display: flex;
      flex-direction: column;
    }

    #tree {
      margin-left: -32px;
    }
  </style>`;

  render() {
    return html`
        <div id="container">
        <ul id="tree">
        </ul>
        </div>
      `;
  }

  static get properties() {
    return {
      selected: { type: Object }
    };
  }

  constructor() {
    super();
    this.selected = {};
    this.categoriesElements = [];
    this._getCategories();
    this.addEventListener("category-selected", e => {
      this.categoryChange(e);
    });
  }

  get selected() {
    let selected = {};
    this.categoriesElements.forEach(elem => {
      if (elem.selected) selected[elem.data.attributeId] = elem.data;
    });
    return selected;
  }

  set selected(attributes) {
    (async () => {
      if (
        this.categoriesElements === undefined ||
        this.categoriesElements.length === 0
      )
        return;
      this.unselectCategory();
      for (let attributeId in attributes) {
        await this.selectCategory(attributeId);
      }
    })();
  }

  async categoryChange(e) {
    let selected = e.detail.selected;
    let attributeId = e.detail.data.attributeId;
    if (selected) this.selectCategory(attributeId);
  }

  async selectCategory(attributeId) {
    for (let elem of this.categoriesElements) {
      let elemAttributeId = elem.data.attributeId;
      let elemParentId = elem.data.parentId;
      if (attributeId === elemAttributeId && elemParentId !== "root") {
        if (elemAttributeId !== "root" && elemParentId !== "") {
          elem.selected = true;
          await this.selectCategory(elemParentId);
        }
      }
    }
  }

  async unselectCategory() {
    this.categoriesElements.forEach(elem => {
      elem.selected = false;
    });
  }

  async _getCategories() {
    let categories = [];
    let snapshot = await window.firebase
      .firestore()
      .collection("attributes")
      .get();
    snapshot.forEach(doc => {
      let data = doc.data();
      data.attributeId = doc.id;
      categories.push(data);
    });
    this.shadowRoot.querySelector("#tree").appendChild(
      await this._buildBranch({
        name: "Атрибуты",
        attributeId: "root",
        parentId: "",
        imageURL: null,
        categories: Object.assign([], categories)
      })
    );
    this.selected = Object.assign({}, this.selected);
  }

  _getChildCategories(attributeId, categories) {
    let childCategories = [];
    categories.forEach(category => {
      if (category.parentId === attributeId) childCategories.push(category);
    });
    return childCategories;
  }

  async _buildBranch(options) {
    let item = document.createElement(
      "ht-item-editor-attributes-attribute-item"
    );
    this.categoriesElements.push(item);
    item.data = {
      name: options.name,
      attributeId: options.attributeId,
      parentId: options.parentId,
      imageURL: options.imageURL || null
    };
    for (let category of options.categories) {
      if (category.parentId === options.attributeId) {
        let branch = await this._buildBranch({
          name: category.name,
          attributeId: category.attributeId,
          parentId: category.parentId,
          categories: options.categories,
          imageURL: category.imageURL || null
        });
        item.appendChild(branch);
      }
    }
    return item;
  }
}

customElements.define("ht-item-editor-attributes", HTItemEditorAttributes);
