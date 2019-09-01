class VisionsController < ApplicationController
  before_action :auth

  def index
    @vision = Vision.new
    @visions = Vision.last(5)

    respond_to do |format|
      format.html
      format.json { render json: @visions }
    end
  end

  def show
    @vision = Vision.includes({vision_tags: :predicted_tag}).find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @vision.to_json(include: {vision_tags: {include: :predicted_tag}}, methods: :image_url) }
    end
  end

  def create
    @vision = Vision.new(vision_params)
    @vision.url = @vision.image_url
    @vision.save
    @vision.generate_tags

    redirect_to @vision, notice: 'Vision was successfully created.'
  end

  private

  def vision_params
    params.require(:vision).permit(:image)
  end

end
