# FitTrack — Frontend Dashboard

A responsive web interface for the FitTrack platform, allowing users to calculate their Body Mass Index (BMI), track historical measurements, and manage their health metrics over time.

## Features

* **Flexible Authentication**: Sign up and log in using either a username or email address.
* **JWT Access & Refresh Strategy**: Automatically stores session tokens in `localStorage` and silently refreshes expired access tokens without interrupting user workflow.
* **Interactive Dashboard**: Calculate real-time BMI metrics, assign status categories (Underweight, Normal, Overweight, Obese), and display summary statistics.
* **History Tracking**: Dynamic rendering of past user entries.
* **Concurrent Form Lock**: Built-in safeguards on authentication and calculation forms to prevent duplicate requests on accidental double-clicks.

## Tech Stack

* **HTML5** & **CSS3** (Custom properties & CSS grid layout)
* **Vanilla JavaScript** (ES6+ Native Modules)
* **Fetch API** for HTTP communications

## Project Structure

```text
frontend/
├── css/
│   ├── style.css          # Global styling & layout resets
│   ├── auth.css           # Login & Signup screen styles
│   └── dashboard.css      # Dashboard-specific layout & cards
├── js/
│   ├── url.js             # Centralized backend URL configuration
│   ├── login.js           # Authentication handler for sign-in
│   ├── signup.js          # Registration form validator & submit handler
│   ├── accessExpired.js   # Automated token refresh utility
│   └── dashboard.js       # Core dashboard, user profile, & BMI logic
├── index.html             # FitTrack landing page
├── login.html             # User login page
├── signup.html            # User account creation page
└── dashboard.html         # Main user dashboard
