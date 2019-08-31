class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :set_host

  def set_host
    Rails.application.routes.default_url_options[:host] = request.host_with_port
  end

  def auth
    authenticate_or_request_with_http_basic do |user, pass|
      user == Rails.application.secrets.basic_auth_user && pass == Rails.application.secrets.basic_auth_pass
    end
  end

end
