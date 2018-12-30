
import $ from 'jquery';
import Vue from 'vue';
var id = $("#app").data("image-id");

// initialize
var app = new Vue({
  el: '#app',
  data: {vision: { id:id, image_url:"", vision_tags:[] }},
  methods: {
    copy: function (id) {
      var elem = document.getElementById(id);
      elem.focus();
      elem.setSelectionRange(0, elem.value.length);
      document.execCommand('copy');
    }
  }
});

$.ajax({
  url: "/visions/"+id+".json"
}).done(function(res) {
  app.vision = res;
});

// styles
require('../stylesheets/application.scss');
