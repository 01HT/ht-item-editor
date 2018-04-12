"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-spinner/paper-spinner.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "ht-wysiwyg/ht-wysiwyg.js";
import "ht-item-editor/ht-item-editor-status.js";
import "ht-item-editor/ht-item-editor-preview.js";
import "ht-item-editor/ht-item-editor-gif.js";
import "ht-item-editor/ht-item-editor-license.js";
import "ht-item-editor/ht-item-editor-categories.js";
import "ht-item-editor/ht-item-editor-attributes.js";
import "ht-item-editor/ht-item-editor-tags.js";
class HTItemEditor extends LitElement {
  render({ itemId, loading, loadingText }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        paper-button {
          background: var(--accent-color);
          margin:0;
          color: #fff;
          padding: 8px 16px;
        }

        section {
          margin-top:16px;
        }
        
        paper-toggle-button {
          margin-top:32px;
          margin-bottom:8px;
        }

        paper-input {
          max-width: 500px;
        }

        #loading-container {
          position: absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          display:flex;
          justify-content: center;
          align-items:center;
        }

        #loading {
          display:flex;
          background: rgba(0, 0, 0, 0.5);
          z-index:1;
          background: #fff;
          padding:16px;
          border-radius:3px;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        #loading-text {
          font-size: 14px;
          margin-left: 8px;
          line-height: 24px;
          font-weight: 400;
          color:var(--secondary-text-color);
        }

        paper-spinner {
          width: 24px;
          height: 24px;
        }

        #actions {
          display: flex;
          justify-content: flex-end;
          margin-top:32px;
        }

        [hidden] {
          display:none !important;
        }
      </style>
      <div id="loading-container" hidden?=${!loading}>
        <div id="loading">
          <paper-spinner active></paper-spinner>
          <div id="loading-text">${loadingText}</div>
        </div>
      </div>
      <div id="container" hidden?=${loading}>
        <h1>${itemId === "" ? "Добавить продукт" : "Настроки продукта"}</h1>
        <ht-item-editor-status id="status" hidden?=${
          itemId === "" ? true : false
        }></ht-item-editor-status>
        <paper-toggle-button id="published">Отображать в каталоге</paper-toggle-button>
        <paper-input id="name" label="Название" allowed-pattern="^[0-9a-zA-Zа-яА-Я ]" char-counter maxlength="50"></paper-input>
        <paper-input id="name-in-url" label="Название в URL" placeholder="my-super-item-7" allowed-pattern="^[0-9a-z\-]+$" char-counter maxlength="100"></paper-input>
        <paper-input id="github" label="Ссылка на репозиторий" placeholder="author/repository">
            <div slot="prefix">https://github.com/</div>
        </paper-input>
        <section>
          <h3>Описание</h3>
          <ht-wysiwyg id="description"></ht-wysiwyg>
        </section>
        <section>
          <h3>Превью</h3>
            <paper-input id="demo" label="Demo URL"></paper-input>
            <paper-input id="youtube" label="YouTube URL"></paper-input>
          <section>
            <h4>Изображение</h4>
            <ht-item-editor-preview id="preview"></ht-item-editor-preview>
          </section>
          <section>
            <h3>Gif</h3>
            <ht-item-editor-gif id="gif"></ht-item-editor-gif>
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
        <section id="actions">
          <paper-button on-click=${e => {
            itemId === "" ? this.add() : this.save();
          }}>${itemId === "" ? "Добавить" : "Сохранить"}</paper-button>
        </section>
      </div>
`;
  }

  static get is() {
    return "ht-item-editor";
  }

  static get properties() {
    return {
      itemId: String,
      loading: Boolean,
      loadingText: String
    };
  }

  constructor() {
    super();
    this.itemId = "";
    this.loading = true;
    this.loadingText = "Загрузка данных";
  }

  async _setDefaultData() {
    try {
      this.shadowRoot.querySelector("#status").statusText =
        "Добавление продукта";
      this.shadowRoot.querySelector("#published").checked = true;
      this.shadowRoot.querySelector("#name").value = "";
      this.shadowRoot.querySelector("#name-in-url").value = "";
      this.shadowRoot.querySelector("#github").value = "";
      await this.shadowRoot.querySelector("#description").setDefaultData();
      this.shadowRoot.querySelector("#demo").value = "";
      this.shadowRoot.querySelector("#youtube").value = "";
      this.shadowRoot.querySelector("#preview").reset();
      this.shadowRoot.querySelector("#gif").reset();
      this.shadowRoot.querySelector("#license").selected = [];
      this.shadowRoot.querySelector("#categories").selected = [];
      this.shadowRoot.querySelector("#attributes").selected = [];
      this.shadowRoot.querySelector("#tags").selected = [];
    } catch (err) {
      console.log("_setDefaultData: " + err.message);
    }
  }

  async _getItemData(itemId) {
    try {
      let snapshot = await firebase
        .firestore()
        .collection("items")
        .doc(itemId)
        .get();
      let itemData = snapshot.data();
      return itemData;
    } catch (err) {
      console.log("_setItemData: " + err.message);
    }
  }

  async _setItemData(itemId) {
    try {
      let itemData = await this._getItemData(itemId);
      this.shadowRoot.querySelector("#status").statusText = itemData.statusText;
      this.shadowRoot.querySelector("#published").checked = itemData.published;
      this.shadowRoot.querySelector("#name").value = itemData.name;
      this.shadowRoot.querySelector("#name-in-url").value = itemData.nameInURL;
      this.shadowRoot.querySelector("#github").value = itemData.repositoryURL;
      this.shadowRoot
        .querySelector("#description")
        .setData(itemData.description);
      this.shadowRoot.querySelector("#demo").value = itemData.demoURL;
      this.shadowRoot.querySelector("#youtube").value = itemData.youtubeURL;
      this.shadowRoot.querySelector("#preview").reset();
      this.shadowRoot.querySelector("#preview").src = itemData.thumb_w960;
      this.shadowRoot.querySelector("#gif").reset();
      this.shadowRoot.querySelector("#gif").src = itemData.gifURL;
      this.shadowRoot.querySelector("#license").selected = itemData.license;
      this.shadowRoot.querySelector("#categories").selected =
        itemData.categories;
      this.shadowRoot.querySelector("#attributes").selected =
        itemData.attributes;
      this.shadowRoot.querySelector("#tags").selected = itemData.tags;
    } catch (err) {
      console.log("_setItemData: " + err.message);
    }
  }

  _updatedData() {
    try {
      let item = {};
      item.updated = firebase.firestore.FieldValue.serverTimestamp();
      item.name = this.shadowRoot.querySelector("#name").value || "";
      item.published = this.shadowRoot.querySelector("#published").checked;
      item.repositoryURL = this.shadowRoot.querySelector("#github").value || "";
      item.demoURL = this.shadowRoot.querySelector("#demo").value || "";
      item.youtubeURL = this.shadowRoot.querySelector("#youtube").value || "";
      item.description = this.shadowRoot
        .querySelector("#description")
        .getData();
      item.license = this.shadowRoot.querySelector("#license").selected;
      item.categories = this.shadowRoot.querySelector("#categories").selected;
      item.attributes = this.shadowRoot.querySelector("#attributes").selected;
      item.tags = this.shadowRoot.querySelector("#tags").selected;
      return item;
    } catch (err) {
      console.log("_updatedData: " + err.message);
    }
  }

  async _addDoc() {
    try {
      // Data that use only when create doc
      let item = {};
      item.status = "moderation";
      item.statusText = "Рассматривается модератором";
      item.published = false;
      item.created = firebase.firestore.FieldValue.serverTimestamp();
      item.nameInURL =
        this.shadowRoot.querySelector("#name-in-url").value || "";
      item.authorId = firebase.auth().currentUser.uid;
      item.sales = 0;
      item.imageURL =
        "https://firebasestorage.googleapis.com/v0/b/api-01-ht.appspot.com/o/default%2Fitem%2Fitem-default-image.png?alt=media&token=00dd251b-7bcb-4bd2-9c19-a43e4f478f49";
      item.thumb_w960 =
        "https://firebasestorage.googleapis.com/v0/b/api-01-ht.appspot.com/o/default%2Fitem%2Fitem-default-image-thumb-960x540.png?alt=media&token=09196d16-235d-49ea-bf58-f9cdfefb1efc";
      item.thumb_w480 =
        "https://firebasestorage.googleapis.com/v0/b/api-01-ht.appspot.com/o/default%2Fitem%2Fitem-default-image-thumb-480x270.png?alt=media&token=7120d3cf-b8cf-453e-ac59-f9d7b54cbe70";
      item.thumb_w240 =
        "https://firebasestorage.googleapis.com/v0/b/api-01-ht.appspot.com/o/default%2Fitem%2Fitem-default-image-thumb-480x270.png?alt=media&token=7120d3cf-b8cf-453e-ac59-f9d7b54cbe70";
      item.thumb_w60 =
        "https://firebasestorage.googleapis.com/v0/b/api-01-ht.appspot.com/o/default%2Fitem%2Fitem-default-image-placeholder.png?alt=media&token=224871de-cb60-4367-95b4-c05f237b97cc";
      item.gifURL = "";
      // Merge with always updated data
      item = Object.assign(this._updatedData(), item);
      let snapshot = await firebase
        .firestore()
        .collection("items")
        .add(item);
      return snapshot.id;
    } catch (err) {
      console.log("_addDoc: " + err.message);
    }
  }

  async _updateDoc(itemId, updates) {
    try {
      await firebase
        .firestore()
        .collection("items")
        .doc(itemId)
        .update(updates);
    } catch (err) {
      console.log("_updateDoc: " + err.message);
    }
  }

  async add() {
    try {
      this.loading = true;
      this.loadingText = "Создание продукта";
      let itemId = await this._addDoc();
      await this.shadowRoot.querySelector("#preview").save(itemId);
      await this.shadowRoot.querySelector("#gif").save(itemId);
      this.dispatchEvent(
        new CustomEvent("on-add", {
          bubbles: true,
          composed: true
        })
      );
      this.loading = false;
    } catch (err) {
      console.log("add: " + err.message);
    }
  }

  async save() {
    try {
      this.loading = true;
      this.loadingText = "Идет сохранение";
      let itemId = this.itemId;
      let updates = await this._updatedData();
      await this._updateDoc(itemId, updates);
      this.loadingText = "";
      await this.shadowRoot.querySelector("#preview").save(itemId);
      await this.shadowRoot.querySelector("#gif").save(itemId);
      this.dispatchEvent(
        new CustomEvent("on-saved", {
          bubbles: true,
          composed: true
        })
      );
      this.loading = false;
    } catch (err) {
      console.log("add: " + err.message);
    }
  }

  async reset() {
    await this._setDefaultData();
    if (this.itemId !== "") await this._setItemData(this.itemId);
    this.loading = false;
  }
}

customElements.define(HTItemEditor.is, HTItemEditor);
