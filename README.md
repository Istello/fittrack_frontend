# FitTrack — Frontend Dashboard

A responsive web application for FitTrack that handles user authentication and Body Mass Index (BMI) tracking.

## Features

* **Flexible Authentication**: Log in using either an email address or username.
* **Cookie-Based Sessions**: Relies on secure HTTP cookies (`credentials: "include"`) to handle session state with the backend server.
* **Automatic Refresh Flow**: Silently requests token renewals via `/users/token/refresh` when sessions expire.
* **Interactive Dashboard**: Dynamically renders current BMI results, health risk categories, total records, and entry history.
* **Form Safeguards**: Implements concurrency checks and button disabling to prevent duplicate network requests on double clicks.

## Tech Stack

* **HTML5** & **CSS3** (Custom Properties & Grid layout)
* **Vanilla JavaScript** (ES6 Modules)
* **Fetch API** with credentials inclusion

## Project Structure

```text
frontend/
├── css/
│   ├── style.css          # Core variables & utility classes
│   ├── auth.css           # Styling for login and signup pages
│   └── dashboard.css      # Dashboard-specific layout
├── js/
│   ├── url.js             # Base backend URL exporter
│   ├── login.js           # Authentication handler
│   ├── signup.js          # User registration logic
│   ├── accessExpired.js   # Automated token refresh function
│   └── dashboard.js       # Core dashboard state & history rendering
├── index.html             # Landing page
├── login.html             # Login view
├── signup.html            # Registration view
└── dashboard.html         # User dashboard view
