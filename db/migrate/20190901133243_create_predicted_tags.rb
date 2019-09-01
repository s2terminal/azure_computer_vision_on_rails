class CreatePredictedTags < ActiveRecord::Migration[5.2]
  def change
    create_table :predicted_tags do |t|
      t.string :name
      t.float  :coefficients

      t.timestamps
    end
  end
end
