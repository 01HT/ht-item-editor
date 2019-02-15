"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-tooltip";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@01ht/ht-wysiwyg";
import "@01ht/ht-spinner";
import "./ht-item-editor-status.js";
import "./ht-item-editor-author.js";
import "./ht-item-editor-image.js";
import "./ht-item-editor-image-slider.js";
import "./ht-item-editor-animated-image.js";
import "./ht-item-editor-youtube.js";
import "./ht-item-editor-preview-mode.js";
import "./ht-item-editor-license.js";
import "./ht-item-editor-categories.js";
import "./ht-item-editor-attributes.js";
import "./ht-item-editor-tags.js";
import "./cloudinary-widget.js";

import { styles } from "@01ht/ht-theme/styles";

import {
  // callTestHTTPFunction,
  callFirebaseHTTPFunction
} from "@01ht/ht-client-helper-functions";

class HTItemEditor extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        h4 {
          font-family: Roboto, sans-serif;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-size: 1rem;
          line-height: 1.5rem;
          font-weight: 500;
          letter-spacing: 0.0125em;
          text-decoration: inherit;
          text-transform: inherit;
        }

        section {
          margin-top: 32px;
        }

        ht-item-editor-status,
        paper-toggle-button {
          margin: 16px 0;
        }

        paper-input {
          max-width: 500px;
          width: 100%;
        }

        #metaDescriptionContainer {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 500px;
          width: 100%;
        }

        #meta-description {
          margin-right: 32px;
        }

        #nameInURLContainer {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 500px;
          width: 100%;
        }

        #name-in-url {
          margin-right: 32px;
        }

        .warning {
          color: var(--accent-color);
          position: absolute;
          top: 28px;
          height: 24px;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: flex-end;
        }

        .toggle-container {
          display: flex;
        }

        #actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 32px;
        }

        #container[hidden],
        #status[hidden],
        #published[hidden],
        ht-spinner[hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { itemId, loading, loadingText } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-item-editor">
        <svg>
          <defs>
              <g id="warning"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g>
              <g id="info"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></g>
          </defs>
        </svg>
      </iron-iconset-svg>
      <ht-spinner page .text="${loadingText}" ?hidden="${!loading}"></ht-spinner>
      <div id="container" ?hidden="${loading}">
        <h1 class="mdc-typography--headline5">${
          itemId === "" ? "Добавить элемент" : "Настроки элемента"
        }</h1>
        <ht-item-editor-status id="status" ?hidden="${itemId ===
          ""}"></ht-item-editor-status>
        <div class="toggle-container">
          <paper-toggle-button id="published" ?hidden="${itemId ===
            ""}">Отображать в каталоге</paper-toggle-button>
        </div>
        <paper-input id="name" label="Название" allowed-pattern="^[0-9a-zA-Zа-яА-Я ]" char-counter maxlength="60"></paper-input>
        <div id="metaDescriptionContainer">
          <div class="warning">
              <a href="https://support.google.com/webmasters/answer/35624?hl=ru&visit_id=636849945150474069-113811972&rd=1" target="_blank" rel="noopener">
                <iron-icon icon="ht-item-editor:info"></iron-icon>
              </a>
          </div>
          <paper-input id="meta-description" label="Meta description" placeholder="Текстовый сниппет в поисковой выдаче" auto-validate char-counter maxlength="120"></paper-input>
        </div>
        <div id="nameInURLContainer">
          <div class="warning">
              <iron-icon icon="ht-item-editor:warning"></iron-icon>
              <paper-tooltip>
              Изменение влечет за собой изменение всех ссылок в которых задействован данный параметр. Существующие ссылки в интернете с параметром, станут недоступными и будут выдавать ошибку 404. Поисковым системам потребуется время для повторного индексирования ссылок и размещения информации в поисковой выдаче. Соответственно изменять данный параметр крайне не рекомендуется.
            </paper-tooltip>
          </div>
          <paper-input id="name-in-url" label="Название в URL" placeholder="my-super-element-7" allowed-pattern="^[0-9a-z\-]+$" auto-validate char-counter maxlength="100">
            <div slot="prefix">/item/</div>
            <div slot="suffix"></div>
          </paper-input>
        </div>
        <paper-input id="github" label="Ссылка на репозиторий" placeholder="author/repository">
            <div slot="prefix">https://github.com/</div>
        </paper-input>
        <section>
          <h3 class="mdc-typography--headline6">Автор</h3>
          <ht-item-editor-author id="author"></ht-item-editor-author>
        </section>
        <section>
          <h3 class="mdc-typography--headline6">Описание</h3>
          <ht-wysiwyg id="description"></ht-wysiwyg>
        </section>
        <section>
          <h3 class="mdc-typography--headline6">Превью</h3>
          <paper-input id="demo" label="Demo URL"></paper-input>
        <section>
          <h4>Изображение (обязательно)</h4>
          <ht-item-editor-image id="image"></ht-item-editor-image>
        </section>
        <section>
          <h4>Слайдер изображений</h4>
          <ht-item-editor-image-slider id="slider"></ht-item-editor-image-slider>
        </section>
        <section>
          <h4>Анимированное изображение</h4>
          <ht-item-editor-animated-image id="animated"></ht-item-editor-animated-image>
        </section>
        <section>
          <h4>YouTube видео</h4>
          <ht-item-editor-youtube id="youtube"></ht-item-editor-youtube>
        </section>
        <section>
          <h4>Используемое по умолчанию превью</h4>
          <ht-item-editor-preview-mode id="mode"></ht-item-editor-preview-mode>
        </section>
        <section>
          <h3>Лицензии</h3>
          <ht-item-editor-license id="license"></ht-item-editor-license>
        </section>
        <section>
          <h3>Категория</h3>
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
          <paper-button @click="${e => {
            itemId === "" ? this.add() : this.save();
          }}">${itemId === "" ? "Добавить" : "Сохранить"}</paper-button>
        </section>
      </div>
`;
  }

  static get properties() {
    return {
      itemId: { type: String },
      loading: { type: Boolean },
      loadingText: { type: String }
    };
  }

  constructor() {
    super();
    this.itemId = "";
    this.loading = true;
    this.loadingText = "Загрузка данных";
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

  async _setDefaultData() {
    try {
      this.shadowRoot.querySelector("#status").statusText = "Добавление";
      this.shadowRoot.querySelector("#published").checked = false;
      this.shadowRoot.querySelector("#name").value = "";
      this.shadowRoot.querySelector("#meta-description").value = "";
      this.shadowRoot.querySelector("#name-in-url").value = "";
      this.shadowRoot.querySelector(
        "#name-in-url [slot='suffix']"
      ).innerHTML = ``;
      this.shadowRoot.querySelector("#github").value = "";
      this.shadowRoot.querySelector("#author").reset();
      this.shadowRoot.querySelector("#description").setDefaultData();
      this.shadowRoot.querySelector("#demo").value = "";
      this.shadowRoot.querySelector("#image").reset();
      this.shadowRoot.querySelector("#slider").reset();
      this.shadowRoot.querySelector("#animated").reset();
      this.shadowRoot.querySelector("#youtube").reset();
      this.shadowRoot.querySelector("#mode").reset();
      this.shadowRoot.querySelector("#license").selected = {};
      this.shadowRoot.querySelector("#categories").selected = {};
      this.shadowRoot.querySelector("#attributes").selected = {};
      this.shadowRoot.querySelector("#tags").selected = {};
    } catch (err) {
      console.log("_setDefaultData: " + err.message);
    }
  }

  async _setItemData(itemId) {
    try {
      let itemData = await this._getItemData(itemId);
      this.shadowRoot.querySelector("#status").statusText = itemData.statusText;
      this.shadowRoot.querySelector("#published").checked = itemData.published;
      this.shadowRoot.querySelector("#name").value = itemData.name;
      this.shadowRoot.querySelector("#meta-description").value =
        itemData.metaDescription;
      this.shadowRoot.querySelector("#name-in-url").value = itemData.nameInURL;
      this.shadowRoot.querySelector(
        "#name-in-url [slot='suffix']"
      ).innerHTML = `/${itemData.itemNumber}`;
      this.shadowRoot.querySelector("#github").value = itemData.repositoryURL;
      this.shadowRoot.querySelector("#author").data = itemData.authorData;
      this.shadowRoot
        .querySelector("#description")
        .setData(itemData.description);
      this.shadowRoot.querySelector("#demo").value = itemData.demoURL;
      this.shadowRoot.querySelector("#image").data = itemData.image;
      this.shadowRoot.querySelector("#slider").data = itemData.slider;
      this.shadowRoot.querySelector("#animated").data = itemData.animated;
      this.shadowRoot.querySelector("#youtube").data = itemData.youtube;
      this.shadowRoot.querySelector("#mode").data = itemData.previewMode;
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

  async add() {
    try {
      this.loading = true;
      this.loadingText = "Создание продукта";
      let item = {};
      item.created = firebase.firestore.FieldValue.serverTimestamp();
      item.updated = firebase.firestore.FieldValue.serverTimestamp();
      item.status = "moderation";
      item.statusText = "Рассматривается модератором";
      item.published = false;
      item.ownerId = firebase.auth().currentUser.uid;
      item.name = this.shadowRoot.querySelector("#name").value || "No name";
      item.metaDescription =
        this.shadowRoot.querySelector("#meta-description").value || "";
      item.nameInURL =
        this.shadowRoot.querySelector("#name-in-url").value || "no-name";
      item.repositoryURL = this.shadowRoot.querySelector("#github").value || "";
      item.description = this.shadowRoot
        .querySelector("#description")
        .getData();
      item.demoURL = this.shadowRoot.querySelector("#demo").value || "";
      item.image = this.shadowRoot.querySelector("#image").data || {};
      item.slider = this.shadowRoot.querySelector("#slider").data || {};
      item.animated = this.shadowRoot.querySelector("#animated").data || {};
      item.youtube = this.shadowRoot.querySelector("#youtube").data || "";
      item.previewMode = this.shadowRoot.querySelector("#mode").data;
      item.license = this.shadowRoot.querySelector("#license").selected;
      item.price = this.shadowRoot.querySelector("#license").getPrice();
      item.categories = this.shadowRoot.querySelector("#categories").selected;
      item.attributes = this.shadowRoot.querySelector("#attributes").selected;
      item.tags = this.shadowRoot.querySelector("#tags").selected;
      item.authorData = await this.shadowRoot.querySelector("#author").data;
      item.sales = 0;

      let response = await callFirebaseHTTPFunction({
        name: "httpsItemsCreateItemIndex",
        authorization: true,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            itemData: item
          })
        }
      });
      this.loading = false;
      if (response.created === true) {
        this.dispatchEvent(
          new CustomEvent("on-add", {
            bubbles: true,
            composed: true
          })
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("show-toast", {
            bubbles: true,
            composed: true,
            detail: {
              text: `При создании элемента возникла ошибка: ${response.error}`
            }
          })
        );
      }
    } catch (err) {
      console.log("add: " + err.message);
    }
  }

  async save() {
    try {
      this.loading = true;
      this.loadingText = "Идет сохранение";
      let itemId = this.itemId;
      let updates = {};
      updates.updated = firebase.firestore.FieldValue.serverTimestamp();
      updates.published = this.shadowRoot.querySelector("#published").checked;
      updates.name = this.shadowRoot.querySelector("#name").value || "No name";
      updates.metaDescription =
        this.shadowRoot.querySelector("#meta-description").value || "";
      updates.nameInURL =
        this.shadowRoot.querySelector("#name-in-url").value || "no-name";
      updates.repositoryURL =
        this.shadowRoot.querySelector("#github").value || "";
      updates.description = this.shadowRoot
        .querySelector("#description")
        .getData();
      updates.demoURL = this.shadowRoot.querySelector("#demo").value || "";
      updates.image = this.shadowRoot.querySelector("#image").data || {};
      updates.slider = this.shadowRoot.querySelector("#slider").data || {};
      updates.animated = this.shadowRoot.querySelector("#animated").data || {};
      updates.youtube = this.shadowRoot.querySelector("#youtube").data || "";
      updates.previewMode = this.shadowRoot.querySelector("#mode").data;
      updates.license = this.shadowRoot.querySelector("#license").selected;
      updates.price = this.shadowRoot.querySelector("#license").getPrice();
      updates.categories = this.shadowRoot.querySelector(
        "#categories"
      ).selected;
      updates.attributes = this.shadowRoot.querySelector(
        "#attributes"
      ).selected;
      updates.tags = this.shadowRoot.querySelector("#tags").selected;
      updates.authorData = await this.shadowRoot.querySelector("#author").data;
      await firebase
        .firestore()
        .collection("items")
        .doc(itemId)
        .update(updates);
      this.dispatchEvent(
        new CustomEvent("on-updated", {
          bubbles: true,
          composed: true
        })
      );
      this.loading = false;
    } catch (err) {
      console.log("save: " + err.message);
    }
  }

  async reset() {
    await this._setDefaultData();
    if (this.itemId !== "") await this._setItemData(this.itemId);
    this.loading = false;
  }
}

customElements.define("ht-item-editor", HTItemEditor);
