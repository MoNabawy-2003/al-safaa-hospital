# Smart Hospital Monitoring and Management System (SHMMS)

An intelligent, full-stack web platform designed for modern healthcare environments. SHMMS provides role-based dashboards for Patients, Doctors, and Hospital Management, enabling personalized care monitoring, streamlined communication, and data-driven operational analytics.

## ✨ Key Features

-   *Role-Based Access Control*: Secure, distinct dashboards for Patients, Doctors, and Management, each tailored with specific functionalities.
-   *Real-Time Patient Vitals Monitoring*: Doctors can monitor patient vitals (Heart Rate, SpO2, Temperature) in real-time through dynamic, auto-updating charts and cards.
-   *Critical Alert System*: An automated system that triggers and displays critical alerts when a patient's vitals breach safe thresholds, ensuring immediate attention.
-   *Secure Doctor-Patient Messaging*: A built-in, real-time chat system allowing patients to communicate securely with their assigned doctors.
-   *AI-Powered Patient Assistant*: A helpful chatbot, powered by the Google Gemini API, assists patients with general, non-medical inquiries about hospital services.
-   *Intuitive Appointment Scheduling*: Patients can easily view available slots and book appointments with their doctor. Doctors get a consolidated view of their upcoming schedule.
-   *Comprehensive Analytics Dashboard*: A dedicated view for hospital management to visualize key operational metrics, including patient census trends, demographic distributions, and alert statistics.
-   *Responsive & Modern UI*: A clean, intuitive, and fully responsive user interface built with Tailwind CSS, ensuring a seamless experience on both desktop and mobile devices.
-   *Light & Dark Mode*: A theme toggle allows users to switch between light and dark modes for their comfort.

## 🚀 Technology Stack

-   *Frontend*: React, TypeScript
-   *Styling*: Tailwind CSS
-   *AI Integration*: Google Gemini API (@google/genai)
-   *State Management*: React Context API
-   *Charting*: Recharts
-   *Backend Simulation*: A robust Mock API built with TypeScript to simulate all backend functionalities, including user authentication, data fetching, and real-time updates.

## 📂 Project Structure

The project is organized into a modular structure to promote scalability and maintainability.


/
├── public/
├── src/
│   ├── components/      # Reusable UI components (Layout, Charts, etc.)
│   ├── context/         # React Context for global state (Auth, Notifications)
│   ├── hooks/           # Custom hooks (e.g., useVitals for vitals simulation)
│   ├── pages/           # Top-level page components for each dashboard/view
│   ├── services/        # API layers (mockApi, geminiService, appointmentService)
│   ├── types.ts         # TypeScript type definitions
│   ├── App.tsx          # Main application component with routing
│   └── index.tsx        # Application entry point
├── index.html
└── package.json


## ⚙ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v16 or later)
-   npm or yarn

### Installation & Setup

1.  *Clone the repository:*
    bash
    git clone https://github.com/your-username/shmms.git
    cd shmms
    

2.  *Install dependencies:*
    bash
    npm install
    

3.  *Set up environment variables:*

    Create a .env file in the root of the project and add your Google Gemini API key. This is required for the patient chatbot functionality.

    
    API_KEY=YOUR_GEMINI_API_KEY
    

4.  *Run the development server:*
    bash
    npm run dev
    
    The application will be available at http://localhost:5173.

## 🖥 Usage

You can log in with the following mock credentials to explore the different user roles.

*Password for all users:* password123

| Role       | Username  | Description                                                                 |
| :--------- | :-------- | :-------------------------------------------------------------------------- |
| *Patient*  | jdoe    | View vitals, schedule appointments, chat with AI, and message their doctor. |
| *Doctor*   | ereed   | Monitor assigned patients, view alerts, and message patients.               |
| *Management* | swilson | Access the hospital-wide analytics dashboard.                             |

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the application, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (git checkout -b feature/AmazingFeature)
3.  Commit your Changes (git commit -m 'Add some AmazingFeature')
4.  Push to the Branch (git push origin feature/AmazingFeature)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details.