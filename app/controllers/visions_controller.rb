class VisionsController < ApplicationController
  before_action :basic

  def index
    @vision = Vision.new
    @visions = Vision.last(5)

    respond_to do |format|
      format.html
      format.json { render json: @visions }
    end
  end

  def show
    @vision = Vision.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @vision.to_json(include: :vision_tags, methods: :image_url) }
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
  def basic
    authenticate_or_request_with_http_basic do |user, pass|
      user == Rails.application.secrets.basic_auth_user && pass == Rails.application.secrets.basic_auth_pass
    end
  end

  def vision_params
    params.require(:vision).permit(:image)
  end

end
