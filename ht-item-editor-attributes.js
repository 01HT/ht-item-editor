"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "./ht-item-editor-categories-category-item.js";

class HTItemEditorAttributes extends LitElement {
  render() {
    return html`
      <style>
        :host {
            display: block;
            box-sizing:border-box;
            position: relative;
        }

        #container {
          display: flex;
          flex-direction: column;
        }

        #tree {
          margin-left: -32px;
        }
      </style>
        <div id="container">
        <ul id="tree">
        </ul>
        </div>
      `;
  }

  static get is() {
    return "ht-item-editor-attributes";
  }

  static get properties() {
    return {
      categories: Array
    };
  }

  constructor() {
    super();
    this.categories = [];
    this.categoriesElements = [];
    this._getCategories();
    this.addEventListener("category-selected", e => {
      this.categoryChange(e);
    });
  }

  getSelected() {
    let selected = [];
    this.categoriesElements.forEach(elem => {
      if (elem.selected) selected.push(elem.data);
    });
    return selected;
  }

  async categoryChange(e) {
    let selected = e.detail.selected;
    let categoryId = e.detail.data.categoryId;
    if (selected) this.selectCategory(categoryId);
  }

  async selectCategory(categoryId) {
    this.categoriesElements.forEach(elem => {
      let elemCategoryId = elem.data.categoryId;
      let elemParentId = elem.data.parentId;
      if (categoryId === elemCategoryId && elemParentId !== "root") {
        if (elemCategoryId !== "root" && elemParentId !== "") {
          elem.selected = true;
          this.selectCategory(elemParentId);
        }
      }
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
      data.categoryId = doc.id;
      categories.push(data);
    });
    this.categories = categories;
    this.shadowRoot.querySelector("#tree").appendChild(
      this._buildBranch({
        title: "Атрибуты",
        categoryId: "root",
        parentId: "",
        categories: Object.assign([], this.categories)
      })
    );
  }

  _getChildCategories(categoryId, categories) {
    let childCategories = [];
    categories.forEach(category => {
      if (category.parentId === categoryId) childCategories.push(category);
    });
    return childCategories;
  }

  _buildBranch(options) {
    let item = document.createElement(
      "ht-item-editor-categories-category-item"
    );
    item.data = {
      title: options.title,
      categoryId: options.categoryId,
      parentId: options.parentId
    };
    options.categories.forEach(category => {
      if (category.parentId === options.categoryId) {
        item.appendChild(
          this._buildBranch({
            title: category.name,
            categoryId: category.categoryId,
            parentId: category.parentId,
            categories: options.categories
          })
        );
      }
    });
    this.categoriesElements.push(item);
    return item;
  }
}

customElements.define(HTItemEditorAttributes.is, HTItemEditorAttributes);
