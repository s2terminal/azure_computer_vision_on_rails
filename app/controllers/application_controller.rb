class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :set_host

  def set_host
    Rails.application.routes.default_url_options[:host] = request.host_with_port
  end
end
