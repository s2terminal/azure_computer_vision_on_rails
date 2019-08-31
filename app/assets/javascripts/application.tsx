import React from 'react';
import ReactDOM from 'react-dom';
import Tags from './components/tags';
import $ from 'jquery';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

if (document.getElementById('react')) {
  const id = $("#app").data("image-id");
  $.ajax({
    url: "/visions/"+id+".json"
  }).done(function(vision) {
    ReactDOM.render(<Tags id={id} vision={vision} />, document.getElementById('react'));
  });
}
