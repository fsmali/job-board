# This migration creates a new table called "jobs" with the following columns:
# - title: a string that represents the title of the job.
# - description: a text field that provides a detailed description of the job.
# - location: a string that indicates where the job is located.
# - category: a string that categorizes the job (e.g., "Engineering", "
class CreateJobs < ActiveRecord::Migration[8.1]
  def change
    create_table :jobs do |t|
      t.string :title
      t.text :description
      t.string :location
      t.string :category
      t.integer :budget

      t.timestamps
    end
  end
end
