class JobApplicationsController < ApplicationController

  # only logged user can apply job
  before_action :authenticate_user!
  # only freelancer can apply the  job
  before_action :authorize_freelancer!, only: [:create]

  def create
    # Finds the job the freelancer is applying to.
    job = Job.find(params[:job_id])

    job_application = job.job_applications.new(
      job_application_params
    )

    job_application.user = current_user
    job_application.status = "pending"

    if job_application.save
      render json: job_application, status: :created
    else
      render json: {
        errors: job_application.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  # find the job, check ownership, return application only to owner
    def index
        job = Job.find(params[:job_id])

        if job.user_id != current_user.id
            return render json: {
            error: "Forbidden"
            }, status: :forbidden
  end

render json: job.job_applications.as_json(
  include: {
    user: {
      only: [:id, :name, :email, :phone_number]
    }
  }
)
end

def my_applications
  render json: current_user.job_applications, include: :job
end
    def update
  job_application = JobApplication.find(params[:id])

  if job_application.job.user_id != current_user.id
    return render json: {
      error: "Forbidden"
    }, status: :forbidden
  end

  if job_application.update(status_params)
    render json: job_application
  else
    render json: {
      errors: job_application.errors.full_messages
    }, status: :unprocessable_entity
  end
end

  private

  def job_application_params
    params.require(:job_application).permit(:message)
  end

  def authorize_freelancer!
  unless current_user.role == "freelancer"
    render json: { error: "Only freelancers can apply to jobs" }, status: :forbidden
  end
end

def status_params
  params.require(:job_application).permit(:status)
end



end
