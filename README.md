Of course, here is a corrected and refined version of your project description.

# Smart Hospital Monitoring and Management System (SHMMS)

An intelligent, full-stack web platform for modern healthcare environments. SHMMS provides role-based dashboards for patients, doctors, and hospital management, enabling personalized care monitoring, streamlined communication, and data-driven operational analytics.

-----

## ✨ Key Features

  - **Role-Based Access Control**: Secure, distinct dashboards for patients, doctors, and management, each tailored with specific functionalities.
  - **Real-Time Vitals Monitoring**: Doctors can monitor patient vitals (Heart Rate, SpO₂, Temperature) in real-time through dynamic, auto-updating charts.
  - **Critical Alert System**: An automated system that triggers alerts when a patient's vitals breach safe thresholds, ensuring immediate attention.
  - **Secure Doctor-Patient Messaging**: A built-in chat system for secure, real-time communication between patients and their assigned doctors.
  - **AI-Powered Patient Assistant**: A helpful chatbot, powered by the Google Gemini API, that assists patients with general inquiries about hospital services.
  - **Intuitive Appointment Scheduling**: Patients can easily view available slots and book appointments. Doctors get a consolidated view of their upcoming schedules.
  - **Comprehensive Analytics Dashboard**: A dedicated view for hospital management to visualize key operational metrics, including patient census trends, demographic distributions, and alert statistics.
  - **Responsive & Modern UI**: A clean, intuitive, and fully responsive user interface built with Tailwind CSS for a seamless experience on desktop and mobile devices.
  - **Light & Dark Mode**: A theme toggle allows users to switch between light and dark modes for their comfort.

-----

## 🚀 Technology Stack

  - **Frontend**: React, TypeScript
  - **Styling**: Tailwind CSS
  - **AI Integration**: Google Gemini API (`@google/genai`)
  - **State Management**: React Context API
  - **Charting**: Recharts
  - **Backend Simulation**: A robust mock API built with TypeScript simulates all backend functionalities, including user authentication, data fetching, and real-time updates.

-----

## 📂 Project Structure

The project is organized into a modular structure to promote scalability and maintainability.

```
/
├── public/
├── src/
│   ├── components/     # Reusable UI components (Layout, Charts, etc.)
│   ├── context/        # React Context for global state (Auth, Notifications)
│   ├── hooks/          # Custom hooks (e.g., useVitals for simulation)
│   ├── pages/          # Top-level page components for each dashboard
│   ├── services/       # API layers (mockApi, geminiService)
│   ├── types.ts        # TypeScript type definitions
│   ├── App.tsx         # Main application component with routing
│   └── index.tsx       # Application entry point
├── index.html
└── package.json
```

-----

## ⚙️ Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

  - Node.js (v16 or later)
  - npm or yarn

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/shmms.git
    cd shmms
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the project's root directory and add your Google Gemini API key. This is required for the patient chatbot.

    **Note**: Since this is a Vite project, environment variables must be prefixed with `VITE_`.

    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

-----

## 🖥️ Usage

You can log in with the following mock credentials to explore the different user roles.

**Password for all users:** `password123`

| Role        | Username  | Description                                                                 |
| :---------- | :-------- | :-------------------------------------------------------------------------- |
| **Patient** | `jdoe`    | View vitals, schedule appointments, chat with AI, and message their doctor. |
| **Doctor** | `ereed`   | Monitor assigned patients, view alerts, and message patients.               |
| **Management**| `swilson` | Access the hospital-wide analytics dashboard.                               |

-----

## 🤝 Contributing

Contributions are welcome\! If you have suggestions for improving the application, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

## 📄 License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.