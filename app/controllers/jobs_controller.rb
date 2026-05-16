class JobsController < ApplicationController
# jobs controller with an index action that retrieves all jobs from the database and returns them as JSON.
 def index
    # gets all jobs from the database.
    jobs = Job.all
    #returns those jobs as JSON.
    render json: jobs
 end
end
