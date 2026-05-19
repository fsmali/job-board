class SessionsController < ApplicationController
    def create 
        # finds the user.
        user = User.find_by(email: params[:email])

        # checks the password using bcrypt.
        if user && user.authenticate(params[:password])
            # This creates a signed token containing the user’s ID.
            token = JWT.encode({ user_id: user.id }, Rails.application.credentials.secret_key_base)
               render json: {
        user: user,
        token: token
      }
        else 
            render json: { error: "Invalid email or password" }, status: :unauthorized
        end
    end
end

