export const history = {	
    _stack: {
      back: [],
      forward: []
    },
    _last: {},
    save: function(url, type, skip_history) {
      if (typeof skip_history == "undefined") {
        unaBase.history._stack.back.push({
          url: url,
          standalone: type
        });
      }
      unaBase.history._last = {
        url: url,
        standalone: type
      };
    },
    back: function(cb) {
      unaBase.history._stack.forward.push(unaBase.history._stack.back.pop());
      var record =
        unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
      unaBase.history._last = record;
      unaBase.loadInto.viewport(record.url, undefined, record.standalone, true);
      if (typeof cb !== "undefined") {
        cb();
      }
    },
    forward: function() {
      var record = unaBase.history._stack.forward.pop();
      unaBase.history._stack.back.push(record);
      unaBase.history._last = record;
      unaBase.loadInto.viewport(record.url, undefined, record.standalone, true);
    },
    current: function() {
      //return unaBase.history._stack.back[unaBase.history._stack.back.length - 1];
      return unaBase.history._last;
    }
}