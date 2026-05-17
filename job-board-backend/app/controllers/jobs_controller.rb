class JobsController < ApplicationController
    # handles the case where a job is not found in the database and returns a JSON response with an error message and a status of not found (404).
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
 # jobs controller with an index action that retrieves all jobs from the database and returns them as JSON.
 def index
    # gets all jobs from the database.
    jobs = Job.all
    # returns those jobs as JSON.
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
    job = Job.new(job_params)
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
    private
    # strong parameters to allow only the specified parameters to be used for creating a job.
    def job_params
        params.require(:job).permit(:title, :description, :location, :category, :budget)
    end
    def record_not_found
        render json: { error: "Job not found" }, status: :not_found
    end 
end
