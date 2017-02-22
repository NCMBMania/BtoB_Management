$(function() {
  var app = new Vue({
    el: '#app',
    data: {
      items: []
    },
    created: function() {
      var me = this;
      $.ajax({
        url: '/masters/items'
      })
      .then(function(master) {
        me.items = master.items;
      })
    },
    methods: {
      add_item: function() {
        this.items.push("");
      },
      delete_item: function(index) {
        this.items.splice(index, 1);
      },
      save: function() {
        var me = this;
        $.ajax({
          url: '/masters/items',
          type: 'POST',
          data: {
            items: me.items
          }
        })
        .then(function(items) {
          console.log(items);
        })
      }
    }
  })
})
