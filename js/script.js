// add
function addCard(list) {
  return function () {
    var titleTextarea =
      list.titleFormNode.getElementsByClassName("new-card-input")[0];
    list.titleFormNode.getElementsByClassName("new-card-title")[0].onclick =
      titleSubmit;
    list.titleFormNode.style.display = "block";
    titleTextarea.focus();

    function titleSubmit(evt) {
      evt.preventDefault();
      var title = titleTextarea.value.trim(),
        card;

      list.titleFormNode.style.display = "none";
      titleTextarea.value = "";
      if (!title) {
        return;
      }

      card = new Card(list, title);
      list.board.registerCard(card, list.cards.length);
      list.cardsNode.insertBefore(
        card.node,
        list.cards[list.cards.length - 1].node
      );
      list.cards.push(card);
    }
  };
}

// list
function addListtodo(board) {
  return function () {
    var titleInput = document.getElementById("todo-list-title-input");

    document.getElementById("todo-list-title-submit").onclick =
      titleButtonClick;
    board.titleFormNode.style.display = "block";
    titleInput.focus();

    function titleButtonClick(evt) {
      evt.preventDefault();
      var title = titleInput.value.trim(),
        index = board.lists.length - 1,
        list;

      board.titleFormNode.style.display = "none";
      titleInput.value = "";
      if (!title) {
        return;
      }

      list = new List(board, title, index);
      board.lists.splice(index, 0, list);
      board.listsNode.insertBefore(list.node, board.lists[index + 1].node);
      board.lists[index + 1].titleNode.setAttribute("list-index", index + 1);
    }
  };
}

function buildCardTitleForm() {
  var node = document.createElement("form");
  node.innerHTML =
    '<div class="newitem-title-wrapper">' +
    '<textarea class="new-card-input" type="text"></textarea>' +
    '<input class="new-card-title" type="submit" value="Add">' +
    "</div>";
  node.style.display = "none";
  return node;
}

function buildListTitleForm() {
  var node = document.createElement("form");
  node.innerHTML =
    '<div class="newitem-title-wrapper">' +
    '<input id="todo-list-title-input" type="text">' +
    '<input id="todo-list-title-submit" type="submit" value="Save">' +
    "</div>";
  node.style.display = "none";
  return node;
}

(function () {
  "use strict";

  function Board(title) {
    var nextId = 0;

    this.title = title;
    this.lists = [];
    this.cards = {};

    this.node = document.createElement("div");
    this.titleNode = document.createElement("div");
    this.listsNode = document.createElement("div");

    this.node.id = "board";
    this.titleNode.id = "todo-title-board";
    this.listsNode.id = "todo-canvas-board";

    this.titleFormNode = buildListTitleForm();
    this.titleNode.appendChild(document.createTextNode(this.title));

    this.getNextId = function () {
      return "_" + (nextId++).toString();
    };
  }

  Board.prototype.render = function () {
    this.lists.push(new List(this, "List Name", 0, true));
    for (var i = 0; i < this.lists.length; ++i) {
      this.listsNode.appendChild(this.lists[i].node);
    }
    this.lists[this.lists.length - 1].node.appendChild(this.titleFormNode);
    this.lists[this.lists.length - 1].titleNode.onclick = addListtodo(this);
    this.node.appendChild(this.titleNode);
    this.node.appendChild(this.listsNode);
  };

  Board.prototype.registerCard = function (card, index) {
    this.cards[card.id] = {
      card: card,
      list: card.list,
      index: index,
    };
  };

  Board.prototype.reregisterSubsequent = function (list, index, shift) {
    for (var i = index; i < list.cards.length; ++i) {
      this.registerCard(list.cards[i], i + shift);
    }
  };

  Board.prototype.unregisterCard = function (card) {
    delete this.cards[card.id];
  };

  document.body.onload = function () {
    var title = "Add List",
      board = new Board(title);

    board.render();
    document.getElementById("container").appendChild(board.node);
  };
})();
