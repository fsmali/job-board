class User < ApplicationRecord
    # password hashing, password confirmation support, password authentication.
  has_secure_password

    # One user can have many jobs
  has_many :jobs
  
    # One user can have many applications
  has_many :job_applications

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, length:{minimum:8},  format: {
              with: /\A(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])/,
              message: 'must contain uppercase, number and special character'
            }, presence: true
  validates :role, presence: true
end
