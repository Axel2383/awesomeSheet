var sheet = (function() {

  var allCharacters = blank.data;

  var currentCharacterIndex = 0;

  var saveHardCodedCharacters = (function() {
    if (read("allCharacters")) {
      allCharacters = JSON.parse(read("allCharacters"));
    } else if (typeof hardCodedCharacters !== "undefined") {
      allCharacters = hardCodedCharacters.load;
    };
    storeCharacters();
  })();

  var setCurrentCharacterIndex = (function() {
    if (read("charactersIndex")) {
      currentCharacterIndex = read("charactersIndex");
    };
  })();

  function storeCharacters() {
    store("allCharacters", JSON.stringify(allCharacters));
  };

  function getAllCharacters() {
    return allCharacters;
  };

  function getCharacter() {
    return allCharacters[currentCharacterIndex];
  };

  function getIndex() {
    return currentCharacterIndex;
  };

  function setIndex(index) {
    currentCharacterIndex = index;
    store("charactersIndex", currentCharacterIndex);
  };

  function addCharacter(newCharacter) {
    var dataToAdd = newCharacter || JSON.parse(JSON.stringify(blank.data));
    allCharacters.push(dataToAdd);
    var newIndex = getAllCharacters().length - 1;
    setIndex(newIndex);
    storeCharacters();
    clear();
    render();
    nav.clear();
    nav.render();
    smoothScroll.animateScroll(null, "#body");
  };

  function removeCharacter() {
    var name = allCharacters[getIndex()].basics.name || "New character";
    allCharacters.splice(getIndex(), 1);
    var lastCharacterRemoved = false;
    if (allCharacters.length == 0) {
      addCharacter();
      lastCharacterRemoved = true;
    };
    setIndex(0);
    clear();
    render();
    storeCharacters();
    nav.clear();
    nav.render();
    if (lastCharacterRemoved) {
      snack.render(helper.truncate(name, 40, true) + " removed. New character added.", false, false);
    } else {
      snack.render(helper.truncate(name, 50, true) + " removed.", false, false);
    };
  };

  function store(key, data) {
    if (localStorage.getItem) {
      localStorage.setItem(key, data);
    };
  };

  function remove(key) {
    if (localStorage.getItem) {
      localStorage.removeItem(key);
    };
  };

  function read(key) {
    if (localStorage.getItem(key) == "") {
      localStorage.removeItem(key);
    } else if (localStorage.getItem(key)) {
      return localStorage.getItem(key);
    };
  };

  function destroy() {
    localStorage.clear();
    prompt.destroy();
    snack.destroy();
    helper.delayFunction(function() {
      document.location.reload(true);
    }, 200);
  };

  function importJson() {
    _render_import();
  };

  function _render_import() {
    var container = document.createElement("div");
    container.setAttribute("class", "container");
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    var col = document.createElement("div");
    col.setAttribute("class", "col-xs-12");
    var importSelect = document.createElement("div");
    importSelect.setAttribute("class", "m-import-select");
    var input = document.createElement("input");
    input.setAttribute("id", "import-select");
    input.setAttribute("type", "file");
    input.setAttribute("class", "m-import-select-input js-import-select-input");
    var label = document.createElement("label");
    label.setAttribute("tabindex", "3");
    label.setAttribute("for", "import-select");
    label.setAttribute("class", "m-import-select-label button button-large button-block js-import-select-label");
    label.textContent = "Choose a file";
    var message = document.createElement("p");
    message.setAttribute("class", "m-import-select-message");
    message.textContent = "Import a previously exported character JSON file from another device.";
    importSelect.appendChild(input);
    importSelect.appendChild(label);
    col.appendChild(message);
    col.appendChild(importSelect);
    row.appendChild(col);
    container.appendChild(row);
    input.addEventListener("change", _handleFiles, false);
    modal.render("Import character JSON", container, "Import", _readJsonFile);
  };

  function _handleFiles() {
    var importSelectLabel = helper.e(".js-import-select-label");
    var fileList = this.files;
    importSelectLabel.textContent = fileList[0].name;
  };

  var _readJsonFile = function() {
    var files = helper.e(".js-import-select-input").files;
    if (files.length <= 0) {
      return false;
    };
    if (files.item(0).type == "application/json") {
      var readFile = new FileReader();
      readFile.onload = function(event) {
        var data = JSON.parse(event.target.result);
        addCharacter(data);
        var name = allCharacters[getIndex()].basics.name || "New character";
        snack.render(helper.truncate(name, 40, true) + " imported and now in the game.", false, false);
      };
      readFile.readAsText(files.item(0));
    } else {
      snack.render("Not a valid JSON file.", false, false);
    };
  };

  function exportJson() {
    var name = getCharacter().basics.name || "New character";
    var exportData = JSON.stringify(getCharacter(), null, " ");
    prompt.render("Download " + name, "Save this character as a JSON file.", "Download", "download");
  };

  function bind() {
    prompt.bind();
    modal.bind();
    snack.bind();
    inputBlock.bind();
    textareaBlock.bind();
    stats.bind();
    clone.bind();
    totalBlock.bind();
    spells.bind();
    display.bind();
  };

  function render() {
    inputBlock.render();
    textareaBlock.render();
    stats.render();
    clone.render();
    totalBlock.render();
    totalBlock.update();
    spells.render();
    display.render();
  };

  function clear() {
    inputBlock.clear();
    textareaBlock.clear();
    stats.render();
    clone.clear();
    totalBlock.clear();
    totalBlock.update();
    spells.clear();
    display.clear();
  };

  // exposed methods
  return {
    getAllCharacters: getAllCharacters,
    getCharacter: getCharacter,
    addCharacter: addCharacter,
    removeCharacter: removeCharacter,
    getIndex: getIndex,
    setIndex: setIndex,
    storeCharacters: storeCharacters,
    destroy: destroy,
    store: store,
    remove: remove,
    read: read,
    clear: clear,
    import: importJson,
    export: exportJson,
    render: render,
    bind: bind
  };

})();
