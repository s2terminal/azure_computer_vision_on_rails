class CreateVisionTags < ActiveRecord::Migration[5.0]
  def change
    create_table :vision_tags do |t|
      t.integer :vision_id
      t.string :name
      t.float :confidence

      t.timestamps
    end
    add_index :vision_tags, [:vision_id]
    add_index :vision_tags, [:name, :confidence]
  end
end
