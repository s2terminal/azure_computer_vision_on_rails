class AddColumnToVisionTag < ActiveRecord::Migration[5.2]
  def change
    add_column :vision_tags, :active, :boolean
  end
end
