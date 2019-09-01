import React, { useState } from 'react';
import $ from 'jquery';

const MAX_TAGS = 30;
const INTERCEPT = 2.1826742;
const AVERAGE_COEFFICIENT = 1.7384449825127788;

const copy = (id: string) :void => {
  var elem = document.getElementById(id);
  elem.focus();
  elem.setSelectionRange(0, elem.value.length);
  document.execCommand('copy');
};

const per = (rate: number) :number => {
  return rate * 10000 / 100;
}

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
  predicted_tag?: PredictedTag;
}
type PredictedTag = {
  coefficients: number;
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

  const activeTagCount = Object.keys(activeTags).reduce((acc, id) => acc += (activeTags[id] ? 1 : 0), 0);
  const predictedLikeCount = Object.keys(vision.vision_tags).reduce((acc, index) => {
    const visionTag = vision.vision_tags[index];
    if (!activeTags[visionTag.id]) { return acc; }
    if (!visionTag.predicted_tag) { return acc + AVERAGE_COEFFICIENT; }
    return acc += visionTag.predicted_tag.coefficients;
  }, INTERCEPT);

  return (
    <>
      <img alt={vision.image_url} src={vision.image_url} className="vision_image" />
      <p>Tag: {activeTagCount}/{MAX_TAGS}</p>
      <p>予想いいね数: <span style={{fontSize: 'x-large'}}>{ Math.round(predictedLikeCount)}</span></p>
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
                { Math.round(per(tag.confidence)) }%
                ({ tag.predicted_tag ? Math.round(tag.predicted_tag.coefficients) : '?' } likes)
              </label>
            </li>);
        })}
      </ul>
    </>
  )
};
