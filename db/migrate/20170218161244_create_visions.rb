class CreateVisions < ActiveRecord::Migration[5.0]
  def change
    create_table :visions do |t|
      t.string :url

      t.timestamps
    end
  end
end
