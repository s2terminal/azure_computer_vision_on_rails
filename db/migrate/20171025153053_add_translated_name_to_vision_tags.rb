class AddTranslatedNameToVisionTags < ActiveRecord::Migration[5.0]
  def change
    add_column :vision_tags, :translated_name, :string
  end
end
