class CreateLikes < ActiveRecord::Migration[6.0]
  def change
    create_table :likes do |t|
      t.integer :user_id
      t.integer :post_id
      t.index ["user_id", "post_id"], name: "index_likes_on_user_id_and_post_id", unique: true

      t.timestamps
    end
  end
end
