# TaskNest: Micro-Task & Earning Platform

TaskNest is a **full-stack MERN-based platform** designed for micro-tasking and earning. It allows users to complete small tasks, earn coins, and manage tasks efficiently. The platform supports three distinct roles with tailored dashboards: **Worker**, **Buyer**, and **Admin**.

---

## Live Demo

* **Front-end Live Site:** [https://tasknest-8cfc3.web.app/]
* **Client GitHub Repository:** [https://github.com/hossain-shifat/TaskNest]
* **Server GitHub Repository:** [https://github.com/hossain-shifat/TaskNest-Server]

---

## Admin Credentials

* **Email:** [demo@admin.com]
* **Password:** [Admin1234]

---

## Project Overview

TaskNest is designed to facilitate a seamless micro-tasking ecosystem where:

* **Workers** can find and complete tasks, track earnings, and request withdrawals.
* **Buyers** can create tasks, manage submissions, and purchase coins for task payments.
* **Admins** oversee the platform, manage users, approve withdrawals, and maintain system integrity.

The platform includes an intuitive UI with a responsive design for mobile, tablet, and desktop, dynamic dashboards, notifications, and secure authentication.

---

## Features

### Worker Features

1. View available tasks and task details.
2. Submit completed tasks with proof or screenshots.
3. Track total submissions, pending submissions, and total earnings.
4. Withdraw coins when minimum balance is reached.
5. Receive notifications for task approvals or rejections.

### Buyer Features

1. Create new tasks with detailed instructions and image uploads.
2. Review submitted work and approve or reject submissions.
3. Track total tasks, pending tasks, and total payments.
4. Purchase coins through Stripe or dummy payment system.
5. Access payment history.

### Admin Features

1. Manage users (update roles, delete accounts).
2. Manage all tasks (delete tasks as needed).
3. Approve withdrawal requests.
4. Monitor total platform coins, payments, and user statistics.

### Common Features

1. Role-based authentication (email/password and Google Sign-In).
2. Coin management system integrated into task workflow.
3. Notification system for task approvals, rejections, and withdrawals.
4. Image uploading using imgBB for tasks and profiles.
5. Pagination support on submission pages.
6. Optional advanced features: automated email notifications, search/filter tasks, and reporting invalid submissions.

---

## Tech Stack

**Frontend:**

* React 19
* React Router 7
* React Query
* TailwindCSS + DaisyUI
* GSAP & Motion for animations
* Recharts for dashboard charts
* SweetAlert2 & Toastify for notifications
* Firebase for authentication

**Backend:**

* Node.js & Express.js
* MongoDB for database
* JWT & Firebase Admin SDK for secure authorization

**Dev Tools:**

* Vite
* ESLint (with React Hooks plugin)

---

## Installation

1. **Clone the repository**

```bash
git clone [client repo URL]
git clone [server repo URL]
```

2. **Install dependencies**

```bash
cd client
npm install

cd server
npm install
```

3. **Setup Environment Variables**

Create a `.env` file for Firebase credentials, MongoDB URI, and Stripe API key.

Example:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

4. **Run the project**

```bash
# Client
npm run dev

# Server
npm start
```

Open `http://localhost:5173` for the frontend and ensure the backend server is running on the configured port.

---

## Scripts

* `npm run dev` – Start the development server (Vite)
* `npm run build` – Build the frontend for production
* `npm run preview` – Preview the production build
* `npm run lint` – Run ESLint checks

---

## Contribution

TaskNest is an assessment and portfolio project for MERN Stack developers. Contributions are welcome to extend features, improve UI/UX, or optimize backend performance.

---

## References

* [Picoworkers](https://picoworkers.net)
* [Clickworker](https://www.clickworker.com/clickworker/)
* [SEOClerks](https://www.seoclerk.com/)

---

## License

This project is created for educational, portfolio, and assessment purposes.
