# Vaccine Slot Reservation System

## Overview

A full-stack vaccine slot reservation system with admin and user interfaces, concurrency-safe booking logic, booking expiry, 3D frontend animations, and complete deployment to Vercel (frontend) + Render (backend).

## Features

*   **Admin Interface:**
    *   Create and manage clinics.
    *   Create and manage time slots for each clinic.
    *   View all bookings.
*   **User Interface:**
    *   View a list of all clinics.
    *   View available time slots for each clinic.
    *   Book a time slot with a PENDING status.
    *   Confirm a booking within 2 minutes.
*   **Concurrency-Safe Booking:** The system can handle multiple users trying to book the same slot at the same time without overbooking.
*   **Booking Expiry:** Bookings that are not confirmed within 2 minutes are automatically expired and the seats are returned to the slot.
*   **3D Animations:** The frontend includes a rotating 3D vaccine vial in the header and a confetti animation on successful booking confirmation.

## Tech Stack

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite
    *   React Router
    *   React Three Fiber (for 3D animations)
    *   Drei (helpers for React Three Fiber)
    *   Axios (for API requests)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   better-sqlite3 (for the database)
    *   node-cron (for the booking expiry worker)
*   **Database:**
    *   SQLite

## Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Start the backend server:**
    ```bash
    cd ../backend
    npm run dev
    ```
    The backend will be running at `http://localhost:3001`.

5.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

## API Documentation

### Admin API

*   `POST /api/admin/clinics`: Create a new clinic.
    *   **Body:** `{ "name": "string", "location": "string", "description": "string" }`
*   `POST /api/admin/clinics/:clinicId/slots`: Create a new time slot for a clinic.
    *   **Body:** `{ "start_time": "datetime", "duration_minutes": "integer", "capacity": "integer" }`
*   `GET /api/admin/bookings`: Get a list of all bookings.

### User API

*   `GET /api/clinics`: Get a list of all clinics.
*   `GET /api/clinics/:clinicId/slots`: Get a list of all time slots for a specific clinic.
*   `GET /api/slots/:slotId`: Get the details of a specific time slot.
*   `POST /api/slots/:slotId/book`: Create a new booking for a time slot.
    *   **Body:** `{ "name": "string", "phone": "string", "seats_reserved": "integer" }`
*   `GET /api/bookings/:bookingId`: Get the status of a booking.
*   `POST /api/bookings/:bookingId/confirm`: Confirm a booking.
*   `POST /api/bookings/:bookingId/cancel`: Cancel a booking.

## Concurrency Explanation

The system uses a combination of database transactions and a retry mechanism to handle concurrent booking requests.

*   **Database Transactions:** When a user requests a booking, the system starts a database transaction. This ensures that all the steps involved in creating a booking (checking for available seats, creating the booking record, and updating the number of available seats) are performed as a single atomic unit. If any of the steps fail, the entire transaction is rolled back, preventing any inconsistent data.
*   **Retry Mechanism:** If two users try to book the same slot at the same time, one of the transactions might fail with a `SQLITE_BUSY` error. The system is configured to automatically retry the transaction up to 3 times with a random delay between each attempt. This significantly increases the chances of the transaction succeeding without any user intervention.

## Booking Expiry Explanation

To prevent users from holding a slot indefinitely without confirming their booking, the system includes a booking expiry mechanism.

*   **Pending Status:** When a user requests a booking, it is created with a `PENDING` status.
*   **Expiry Worker:** A background worker runs every 30 seconds and checks for any bookings that have been in the `PENDING` status for more than 2 minutes.
*   **Failed Status:** If a booking is found to be expired, its status is changed to `FAILED`, and the reserved seats are returned to the time slot, making them available for other users.

## Deployment Links

*   **Frontend (Vercel):** [To be added]
*   **Backend (Render):** [To be added]

## Screenshots

[To be added]

## GIF Walkthrough

[To be added]
