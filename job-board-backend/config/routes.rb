Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
# Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

# creates a GET endpoint will trigger the controller..
get "/health", to: "health#index"


    # Route for user registration.
    # Sends POST /signup requests
    # to create action inside UsersController.
post "/signup", to: "users#create"
post "/login", to: "sessions#create"
get "/my-applications", to: "job_applications#my_applications"
get "/me", to: "users#me"
get "/my-jobs", to: "jobs#my_jobs"

 resources :job_applications, only: [:update]
  # creates REST routes for jobs.
  resources :jobs, only: [:index, :show, :create, :update, :destroy] do
    resources :job_applications, only: [:index, :create]
 

end


  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")s
  # root "posts#index"
end
