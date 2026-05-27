# It handles user-related HTTP requests
class UsersController < ApplicationController
  # defines a controller It handles user-related HTTP requests
  def create
    # User is Rails model. Usually connected to users table
    #user_params defines in the private down.
    user = User.new(user_params)

    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def me
  if current_user
    render json: current_user
  else
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
# this method can only be used inside the class
  private
# an internal helper method
  def user_params
    params.require(:user).permit(
  :name,
  :email,
  :phone_number,
  :password,
  :password_confirmation,
  :role
)
  end
end