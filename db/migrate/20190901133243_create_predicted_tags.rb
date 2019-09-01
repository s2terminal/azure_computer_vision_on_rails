class CreatePredictedTags < ActiveRecord::Migration[5.2]
  def change
    create_table :predicted_tags do |t|
      t.string :name
      t.coefficients :name

      t.timestamps
    end
  end
end
