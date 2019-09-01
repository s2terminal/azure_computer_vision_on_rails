class VisionTag < ApplicationRecord
  belongs_to :vision
  has_one :predicted_tag, foreign_key: :name, primary_key: :name
end
