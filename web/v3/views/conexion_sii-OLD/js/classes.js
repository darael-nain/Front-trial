class Card {
  constructor() {
    this.id = '';
    this.hasHeader = true;
    this.headerTitle = '';
    this.title = '';
    this.body1 = '';
    this.href = '';
  }
}

class Table {
  constructor() {
    this.id = '';
    this.headers = [];
    this.bodyRows = [];
  }
}  

class Alert {
  constructor() {
    this.msg = '';
    this.type = 'success';
  }
}  


class Select {
  constructor() {
    this.label_name = '',
    this.id = '',
    this.id0 = '',
    this.options = []
  }
}  


class List {
  constructor() {
    this.bloques = [],
    this.adicional = []
    
  }
}  