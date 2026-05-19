class User < ApplicationRecord
    # password hashing, password confirmation support, password authentication.
  has_secure_password

  has_many :jobs
  has_many :job_applications

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
  validates :role, presence: true
end