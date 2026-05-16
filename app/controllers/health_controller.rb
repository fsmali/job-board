class HealthController < ApplicationController
    def index
        render json:{ message:"API is healthy working fine"}
    end
end
done
