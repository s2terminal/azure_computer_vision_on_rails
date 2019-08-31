import React from 'react';

const copy = (id: string) :void => {
  var elem = document.getElementById(id);
  elem.focus();
  elem.setSelectionRange(0, elem.value.length);
  document.execCommand('copy');
};

type TagProps = {
  id: number;
  vision: Vision;
}
type Vision = {
  image_url: string;
  vision_tags: {
    id: number;
    name: string;
    translated_name: string;
    confidence: number;
  }[];
}

export default (props: TagProps) => {
  const vision = props.vision;
  return (
    <>
      <img alt={vision.image_url} src={vision.image_url} className="vision_image" />
      <label>English Tags</label>
      <div className="input-group">
        <input className="form-control" id='english_tags' value={vision.vision_tags.map((tag) => ( '#'+tag.name.replace(/\s+/g,'') )).join(' ')} />
        <div className="btn btn-primary" onClick={()=>{copy('english_tags')}}>copy</div>
      </div>
      <label>Japanese Tags</label>
      <div className="input-group">
        <input className="form-control" id='japanese_tags' value={vision.vision_tags.map((tag) => ( '#'+tag.translated_name.replace(/\s+/g,'') )).join(' ')} />
        <div className="btn btn-primary" onClick={()=>{copy('japanese_tags')}}>copy</div>
      </div>

      <label>Detail</label>
      <ul>
        {vision.vision_tags.map((tag) => {
          return (<li key={tag.id}>
            { tag.name }
            ({ tag.translated_name })
            { Math.round(tag.confidence * 10000) / 100 }%
          </li>);
        })}
      </ul>
    </>
  )
};
