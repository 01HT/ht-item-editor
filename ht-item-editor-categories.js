"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "./ht-item-editor-categories-category-item.js";

class HTItemEditorCategories extends LitElement {
  render() {
    return html`
      <style>
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
      </style>
        <div id="container">
        <ul id="tree">
        </ul>
        </div>
      `;
  }

  static get is() {
    return "ht-item-editor-categories";
  }

  static get properties() {
    return {
      selected: Array
    };
  }

  constructor() {
    super();
    this.selected = [];
    this.categoriesElements = [];
    this._getCategories();
    this.addEventListener("category-selected", e => {
      this.categoryChange(e);
    });
  }

  get selected() {
    let selected = [];
    this.categoriesElements.forEach(elem => {
      if (elem.selected) selected.push(elem.data);
    });
    return selected;
  }

  set selected(categories) {
    (async () => {
      if (
        this.categoriesElements === undefined ||
        this.categoriesElements.length === 0
      )
        return;
      this.unselectCategory();
      for (let category of categories) {
        await this.selectCategory(category.categoryId);
      }
    })();
  }

  async categoryChange(e) {
    let selected = e.detail.selected;
    let categoryId = e.detail.data.categoryId;
    if (!selected) this.unselectCategory();
    if (selected) {
      await this.unselectCategory();
      await this.selectCategory(categoryId);
    }
  }

  async selectCategory(categoryId) {
    for (let elem of this.categoriesElements) {
      let elemCategoryId = elem.data.categoryId;
      let elemParentId = elem.data.parentId;
      if (categoryId === elemCategoryId && elemParentId !== "") {
        elem.selected = true;
        if (elemCategoryId !== "root") await this.selectCategory(elemParentId);
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
      .collection("categories")
      .get();
    snapshot.forEach(doc => {
      let data = doc.data();
      data.categoryId = doc.id;
      categories.push(data);
    });
    this.shadowRoot.querySelector("#tree").appendChild(
      await this._buildBranch({
        title: "Категории",
        categoryId: "root",
        parentId: "",
        categories: Object.assign([], categories)
      })
    );
    this.selected = Object.assign([], this.selected);
  }

  _getChildCategories(categoryId, categories) {
    let childCategories = [];
    categories.forEach(category => {
      if (category.parentId === categoryId) childCategories.push(category);
    });
    return childCategories;
  }

  async _buildBranch(options) {
    let item = document.createElement(
      "ht-item-editor-categories-category-item"
    );
    this.categoriesElements.push(item);
    item.data = {
      title: options.title,
      categoryId: options.categoryId,
      parentId: options.parentId
    };
    for (let category of options.categories) {
      if (category.parentId === options.categoryId) {
        let branch = await this._buildBranch({
          title: category.name,
          categoryId: category.categoryId,
          parentId: category.parentId,
          categories: options.categories
        });
        item.appendChild(branch);
      }
    }
    return item;
  }
}

customElements.define(HTItemEditorCategories.is, HTItemEditorCategories);
