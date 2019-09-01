class AddIndexToPredictedTag < ActiveRecord::Migration[5.2]
  def change
    add_index :predicted_tags, :name, :unique => true
  end
end
