# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).


#creates a new job record in the database.The ! means: raise/show an error if validation fails.  Good for development/testing.
# rails db:seed  This inserts the sample jobs into SQLite.
Job.create!(
  title: "Frontend Developer",
  description: "Build React UI components",
  location: "London",
  category: "Development",
  budget: 500
)

Job.create!(
  title: "UI Designer",
  description: "Design mobile app screens",
  location: "Remote",
  category: "Design",
  budget: 300
)