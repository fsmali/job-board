class UsersController < ApplicationController
  def create
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

  private

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