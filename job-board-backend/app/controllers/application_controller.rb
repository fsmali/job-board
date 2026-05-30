# Every controller in your app usually inherits from ApplicationController.
class ApplicationController < ActionController::API
    private

    def current_user
        # Reads request header. Authorization: Bearer abc123token
        auth_header = request.headers["Authorization"]

        if auth_header
            # This removes "Bearer" part. ["Bearer", "abc123"] token = "abc123"
            token = auth_header.split(" ").last
            # This verifies and decodes JWT. JWT is encrypted/signed using secret key. The backend uses same secret key to verify token is real.
          decoded_token = JWT.decode(
  token,
  Rails.application.secret_key_base,
  true,
  { algorithm: "HS256" }
)
            # Gets first element
            user_id = decoded_token[0]["user_id"]
            # Queries database 
            User.find_by(id: user_id)
        end
        #  If token is invalid expired, fake, corrupted then throws error. Without rescue throws error. With rescue return nil safely.
    rescue JWT::DecodedError
        nil
    end
    # helper method protect routes
    def authenticate_user!
         unless current_user
         render json: { error: "Unauthorized" }, status: :unauthorized
         end
    end
end
