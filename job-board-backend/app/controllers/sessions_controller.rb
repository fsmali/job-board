class SessionsController < ApplicationController
    def create 
        # finds the user.
        user = User.find_by(email: params[:email])

        # check the user exist and user password correct.
        # the server gives the frontend a token.
        # Frontend sends that token later to prove identity.
        if user && user.authenticate(params[:password])
            # JSON Web Token is a secure token format used for authentication.
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

