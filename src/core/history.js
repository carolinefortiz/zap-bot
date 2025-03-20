class History {
  #lastUserId = null;

  get lastUserId() {
    return this.#lastUserId;
  }

  set lastUserId(userId) {
    this.#lastUserId = userId;
  }
}

module.exports = new History();
