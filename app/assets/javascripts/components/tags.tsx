import React, { useState } from 'react';
import $ from 'jquery';

const MAX_TAGS = 30;

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
  vision_tags: VisionTag[];
}
type VisionTag =  {
  id: number;
  name: string;
  translated_name: string;
  confidence: number;
  active: boolean;
}

type ActiveTags = { [id: number]: boolean; };

const updateVisionTag = async (id: number, active: boolean): Promise<void> => {
  return await $.ajax({
    type: "PATCH",
    url: `/vision_tags/${id}`,
    data: {
      vision_tag: {
        active: active
      },
      authenticity_token: $("#app").data("csrf-token")
    }
  });
}

export default (props: TagProps) => {
  const vision = props.vision;

  const [activeTags, setActiveTags] = useState(() => {
    const defaultActiveTags: ActiveTags = {};
    vision.vision_tags.forEach(tag => {
      defaultActiveTags[tag.id] = tag.active;
    });
    return defaultActiveTags;
  });

  const count = Object.keys(activeTags).reduce((acc, id) => acc += (activeTags[id] ? 1 : 0), 0);

  return (
    <>
      <img alt={vision.image_url} src={vision.image_url} className="vision_image" />
      <p>{count}/{MAX_TAGS} tags</p>
      <label>English Tags</label>
      <div className="input-group">
        <input onChange={()=>{}} className="form-control" id='english_tags' value={vision.vision_tags.filter((tag) => (activeTags[tag.id])).map((tag) => ( '#'+tag.name.replace(/\s+/g,'') )).join(' ')} />
        <div className="btn btn-primary" onClick={()=>{copy('english_tags')}}>copy</div>
      </div>
      <label>Japanese Tags</label>
      <div className="input-group">
        <input onChange={()=>{}} className="form-control" id='japanese_tags' value={vision.vision_tags.filter((tag) => (activeTags[tag.id])).map((tag) => ( '#'+tag.translated_name.replace(/\s+/g,'') )).join(' ')} />
        <div className="btn btn-primary" onClick={()=>{copy('japanese_tags')}}>copy</div>
      </div>

      <label>Detail</label>
      <ul style={{listStyle: "none"}}>
        {vision.vision_tags.map((tag) => {
          return (
            <li key={tag.id}>
              <label>
                <input
                  name={`active-tag-${tag.id}`}
                  type="checkbox"
                  checked={ activeTags[tag.id] }
                  onChange={() => setActiveTags(actives => {
                    Object.keys(actives).forEach(id => {
                      if (id != tag.id.toString()) { return; }
                      actives[tag.id] = !actives[tag.id];
                      updateVisionTag(tag.id, actives[tag.id]);
                    });
                    return Object.assign({}, actives);
                  })}
                />
                { tag.name }
                ({ tag.translated_name })
                { Math.round(tag.confidence * 10000) / 100 }%
              </label>
            </li>);
        })}
      </ul>
    </>
  )
};
