class JobApplication < ApplicationRecord
  belongs_to :user
  belongs_to :job

  validates :message, presence: true
  validates :user_id, uniqueness: { scope: :job_id }
end
