class Vision < ApplicationRecord
  has_many :vision_tags, dependent: :destroy
  has_one_attached :image

  def image_url
    self.image.attached? ? Rails.application.routes.url_helpers.url_for(self.image) : self.url
  end

  def generate_tags
    return if self.vision_tags.present?
    generate_english_tags_from_azure_cognitive
    generate_translated_tags_from_azure_cognitive
  end

  private

  def generate_english_tags_from_azure_cognitive
    # リクエストの生成
    uri = URI('https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze')
    uri.query = URI.encode_www_form({
      'visualFeatures' => 'Tags',
      'language' => 'en'
    })

    http = Net::HTTP::Post.new(uri.request_uri)
    http['Content-Type'] = 'application/json'
    http['Ocp-Apim-Subscription-Key'] = Rails.application.secrets.azure_computer_vision_api_key
    http.body = { url: self.url }.to_json
    response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |client|
      client.request(http)
    end

    # レスポンスの加工
    json = JSON.parse(response.body)
    raise json["message"] if response.code != "200"
    json["tags"].each{|tag|
      vision_tag = self.vision_tags.build(name: tag["name"], confidence:tag["confidence"])
      vision_tag.save
    }
  end

  def generate_translated_tags_from_azure_cognitive
    # 翻訳のアクセストークン取得
    uri = URI('https://api.cognitive.microsoft.com/sts/v1.0/issueToken')
    http = Net::HTTP::Post.new(uri.request_uri)
    http['Content-Type'] = 'application/json'
    http['Accept'] = 'application/jwt'
    http['Ocp-Apim-Subscription-Key'] = Rails.application.secrets.azure_translator_text_api_key
    response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |client|
      client.request(http)
    end
    token = response.body

    # 翻訳
    require 'rexml/document'
    uri = URI('https://api.microsofttranslator.com/V2/Http.svc/Translate')
    self.vision_tags.each{|tag|
      uri.query = URI.encode_www_form({
        'appid' => 'Bearer ' + token,
        'text' => tag.name,
        'to' => 'ja'
      })
      http = Net::HTTP::Get.new(uri.request_uri)
      http['Accept'] = 'application/xml'
      response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |client|
        client.request(http)
      end
      raise response.body if response.code != "200"
      doc = REXML::Document.new(response.body)
      tag.translated_name = doc.elements.first.text
      tag.save
    }
  end

end
