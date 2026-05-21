class JobsController < ApplicationController
    # Only logged-in users can create, update, or destroy.
    before_action :authenticate_user!, only: [:create, :update, :destroy, :my_jobs]
      before_action :authorize_owner!, only: [:update, :destroy]
      before_action :authorize_employer!, only: [:create]
    # handles the case where a job is not found in the database and returns a JSON response with an error message and a status of not found (404).
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
 # jobs controller with an index action that retrieves all jobs from the database and returns them as JSON.
def index
  jobs = Job.all

  if params[:category].present?
    jobs = jobs.where(
      "LOWER(category) LIKE ?",
      "%#{params[:category].downcase}%"
    )
  end

  if params[:location].present?
    jobs = jobs.where(
      "LOWER(location) LIKE ?",
      "%#{params[:location].downcase}%"
    )
  end

  render json: jobs
end
  # creates action for one job
 def show
    # gets the job id from url
    job = Job.find(params[:id])
     # returns those jobs as JSON.
    render json: job
 end
 def create
    # creates a new job with the parameters from the request body.
   job = current_user.jobs.new(job_params)
    # if the job is saved successfully, return the job as JSON with a status of created (201).
    if job.save
        render json: job, status: :created
    else
        # if the job is not saved successfully, return the errors as JSON with a status of unprocessable entity (422).
        render json: job.errors, status: :unprocessable_entity
    end
 end
 # updates an existing job with the parameters from the request body.
 def update 
    job = Job.find(params[:id])
    if job.update(job_params)
        render json: job
    else
        render json: job.errors, status: :unprocessable_entity
    end
 end
 # deletes a job from the database.
 def destroy
    job = Job.find(params[:id])
    job.destroy
    head :no_content
 end
def my_jobs
  render json: current_user.jobs
end

    private
    # strong parameters to allow only the specified parameters to be used for creating a job.
    def job_params
        params.require(:job).permit(:title, :description, :location, :category, :budget)
    end
    def record_not_found
        render json: { error: "Job not found" }, status: :not_found
    end 
    def authorize_owner!
  job = Job.find(params[:id])

  unless job.user_id == current_user.id
    render json: { error: "Forbidden" }, status: :forbidden
  end
end
def authorize_employer!
  unless current_user.role == "employer"
    render json: { error: "Only employers can create jobs" }, status: :forbidden
  end
end
end
