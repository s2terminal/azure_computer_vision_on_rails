class VisionTagsController < ApplicationController
  before_action :auth

  def update
    vision_tag = VisionTag.find(params[:id])
    if vision_tag.update(vision_tag_params)
      render json: { status: 'SUCCESS', message: 'updated the vision_tag', data: vision_tag }
    end
  end

  private

  def vision_tag_params
    params.require(:vision_tag).permit(:active)
  end
end
