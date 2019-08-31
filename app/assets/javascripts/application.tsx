console.log("hello, ts");

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const Hello = props => (
  <div>Hello {props.name}!</div>
);

const id = $("#app").data("image-id");


const copy = (id: string) :void => {
  var elem = document.getElementById(id);
  elem.focus();
  elem.setSelectionRange(0, elem.value.length);
  document.execCommand('copy');
};

$.ajax({
  url: "/visions/"+id+".json"
}).done(function(vision) {
  console.log(vision);
  const element = (
    <>
      <img alt={vision.image_url} src={vision.image_url} class="vision_image" />
      <label>English Tags</label>
      <div class="input-group">
        <input class="form-control" id='english_tags' value={vision.vision_tags.map(function(tag){ return '#'+tag.name.replace(/\s+/g,''); }).join(' ')} />
        <div class="btn btn-primary" onClick={()=>{copy('english_tags')}}>copy</div>
      </div>
      <label>Japanese Tags</label>
      <div class="input-group">
        <input class="form-control" id='japanese_tags' value={vision.vision_tags.map(function(tag){ return '#'+tag.translated_name.replace(/\s+/g,''); }).join(' ')} />
        <div class="btn btn-primary" onClick={()=>{copy('japanese_tags')}}>copy</div>
      </div>

      <label>Detail</label>
      <ul>
        {vision.vision_tags.map((tag) => {
         return (<li>
            { tag.name }
            ({ tag.translated_name })
            { Math.round(tag.confidence * 10000) / 100 }%
          </li>);
        }}
      </ul>
    </>
  );
  ReactDOM.render(element,document.getElementById('react'));
});


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Hello name="React" />,
    document.body.appendChild(document.createElement('div')),
  );
});
