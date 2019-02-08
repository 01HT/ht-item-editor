"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";

class HTItemEditorAuthor extends LitElement {
  static styles = css`<style>
    :host {
        display: block;
        box-sizing:border-box;
        position: relative;
    }

    select {
        margin: 16px 0;
    }

    select, option{
        padding: 8px;
        max-width: 300px;
        font-size: 16px;
    }
    
    #container {
        margin-top:-16px;
        display:flex;
        flex-direction: column;
    }
  </style>`;

  render() {
    const { items } = this;
    return html`
        <div id="container">
            <select @change="${_ => {
              this._onSelect();
            }}">
                ${repeat(
                  items,
                  item => html`
                    <option .value="${item.uid}" .data="${item}">${
                    item.displayName
                  }</option>
            `
                )}
            </select>
        </div>
      `;
  }

  static get properties() {
    return {
      items: { type: Array },
      data: { type: Object }
    };
  }

  constructor() {
    super();
    this.items = [];
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  get data() {
    //console.log(this.select.options[this.select.selectedIndex].data);
    return this.select.options[this.select.selectedIndex].data;
  }

  set data(data) {
    this._setData(data);
  }

  _onSelect() {
    let select = this.select;
    this.value = select.options[select.selectedIndex].data.uid;
  }

  async _setData(data) {
    this.select.value = data.uid;
  }

  async reset() {
    if (window.firebase.auth().currentUser === null) return;
    let promises = await Promise.all([
      this._getUsersData(),
      this._getOrganizations()
    ]);
    this.items = [promises[0]].concat(promises[1]);
    this.select.selectedIndex = 0;
  }

  async _getUsersData() {
    try {
      let userId = window.firebase.auth().currentUser.uid;
      let snapshot = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      let data = snapshot.data();
      let usersData = {
        uid: userId,
        displayName: data.displayName,
        verified: data.verified,
        avatar: data.avatar,
        isOrg: false,
        userNumber: data.userNumber,
        nameInURL: data.nameInURL
      };
      return usersData;
    } catch (err) {
      console.log("_getUsersData: " + err.message);
    }
  }

  async _getOrganizations() {
    try {
      let userId = window.firebase.auth().currentUser.uid;
      let querySnapshot = await window.firebase
        .firestore()
        .collection("organizations")
        .where(`ownerId`, "==", userId)
        .get();
      let items = [];
      querySnapshot.forEach(doc => {
        let data = doc.data();
        let item = {
          uid: doc.id,
          displayName: data.displayName,
          verified: data.verified,
          avatar: data.avatar,
          isOrg: true,
          organizationNumber: data.organizationNumber,
          nameInURL: data.nameInURL
        };
        items.push(item);
      });
      return items;
    } catch (err) {
      console.log("_getOrganizations: " + err.message);
    }
  }
}

customElements.define("ht-item-editor-author", HTItemEditorAuthor);
