class VisionController < ApplicationController
  def index
    upload_file = params[:image]
    if upload_file != nil
      # 画像のアップロード
      @vision = Vision.create()
      filedir = "./public/uploads/visions/#{@vision.id}"
      FileUtils.mkdir_p(filedir) unless FileTest.exist?(filedir)
      filepath = "uploads/visions/#{@vision.id}/#{upload_file.original_filename}"
      File.open("./public/#{filepath}", 'wb') do |f|
        f.write(upload_file.read)
      end
      @vision.url = "#{request.url}/#{filepath}"

      # リクエストの生成
      uri = URI('https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze')
      uri.query = URI.encode_www_form({
        'visualFeatures' => 'Tags',
        'language' => 'en'
      })

      http = Net::HTTP::Post.new(uri.request_uri)
      http['Content-Type'] = 'application/json'
      http['Ocp-Apim-Subscription-Key'] = Rails.application.secrets.azure_computer_vision_api_key
      http.body = { url: @vision.url }.to_json
      response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |client|
        client.request(http)
      end

      # レスポンスの加工
      json = JSON.parse(response.body)
      raise json["message"] if response.code != "200"
      json["tags"].each{|tag|
        vision_tag = @vision.vision_tags.build(name: tag["name"], confidence:tag["confidence"])
        vision_tag.save
      }

      @vision.save
      redirect_to :action => "show", :id => @vision.id
    end
  end

  def show
    @vision = Vision.find(params[:id])
  end
end
