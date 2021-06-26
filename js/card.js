var dragTracker = {
  id: undefined,
  list: undefined,
};

function buildCardNode() {
  var node = document.createElement("div");
  node.draggable = true;
  node.innerHTML = '<div class="card-title"></div>';
  return node;
}

function Card(list, title) {
  this.id = list.board.getNextId();
  this.list = list;
  this.title = title;
  this.node = buildCardNode();
  this.titleNode = this.node.getElementsByClassName("card-title")[0];

  this.node.classList.add("card");
  this.node.setAttribute("card-id", this.id);
  this.titleNode.appendChild(document.createTextNode(this.title));

  this.node.ondragstart = (function (id) {
    return function (evt) {
      dragTracker.id = id;
      evt.dataTransfer.effectAllowed = "move";
    };
  })(this.id);

  this.node.ondragover = function (evt) {
    if (dragTracker.id) {
      evt.preventDefault();
    }
  };

  this.node.ondrop = (function (board) {
    return function (evt) {
      var id = dragTracker.id,
        targetId = this.getAttribute("card-id"),
        source = board.cards[id],
        target = board.cards[targetId];

      if (id === targetId) {
        return;
      }

      source.list.cardsNode.removeChild(source.card.node);
      target.list.cardsNode.insertBefore(source.card.node, target.card.node);

      board.reregisterSubsequent(source.list, source.index + 1, -1);
      source.list.cards.splice(source.index, 1);

      board.reregisterSubsequent(source.list, source.index + 1, 1);
      source.list.cards.splice(source.index + 1, 0, source.card);

      source.card.list = source.list;
      board.registerCard(source.card, source.index + 1);
      evt.preventDefault();
    };
  })(list.board);

  this.node.ondragend = function () {
    dragTracker.id = undefined;
  };

  this.node.onclick = (function (card) {
    return function () {
      cardEdit.card = card;
      cardEdit.titleNode.value = card.title;
      cardEdit.show();
    };
  })(this);
}
