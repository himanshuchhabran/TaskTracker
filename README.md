Task Tracker Application

A full-stack task management application that allows users to sign up, log in, and manage their daily tasks with status tracking and filtering capabilities.

Tech Stack & Rational

Frontend: React with Tailwind CSS
Why: I chose React because its component-based architecture allows for a modular and maintainable codebase. It also enables instant UI updates (virtual DOM) which is crucial for a responsive task manager.

Backend: Node.js with Express
Why: Javascript on both ends allowed for a consistent development workflow. Express provides a lightweight and flexible routing framework that is easy to scale for this scope.

Database: MongoDB
Why: MongoDB was chosen for its schema flexibility, allowing for rapid iteration of data models during the initial development phase.


Setup Instructions

Follow these steps to get the application running locally.

1.Clone the Repository

2.cd server 
npm install
Change .env.example file with .env and enter your credentials.
npm run dev

3.cd client 
npm install
npm run dev
