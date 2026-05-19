# This migration creates a new table called "jobs" with the following columns:
# - title: a string that represents the title of the job.
# - description: a text field that provides a detailed description of the job.
# - location: a string that indicates where the job is located.
# - category: a string that categorizes the job (e.g., "Engineering", "
class Job < ApplicationRecord
    belongs_to :user
    
    has_many :job_applications, dependent: :destroy

    validates :title, presence: true
    validates :description, presence: true
    validates :location, presence: true
    validates :category, presence: true
    validates :budget, presence: true
end
