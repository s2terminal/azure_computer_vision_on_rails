class Vision < ApplicationRecord
  has_many :vision_tags, dependent: :destroy
end
