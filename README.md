# **Ride Service Backend**

The **Ride Service Backend** is a **monolithic backend system** designed to facilitate smooth interaction between passengers and drivers in a ride-sharing environment. It supports features like **ride booking**, **location-based driver search**, and **real-time notifications**, ensuring an efficient and responsive user experience.

---

## 🔧 **Key Features**

### 👤 Passenger Module
- Search and view **nearby available drivers** using Redis GEO queries.
- Book rides through a simple and responsive API endpoint.
- Receive **real-time updates** for ride status changes (confirmed, cancelled, completed).

### 🚗 Driver Module
- Secure login and session management using **JWT** and **bcrypt**.
- Accept or reject **incoming ride requests** dynamically.
- Get **instant notifications** for new bookings and ride status via **WebSockets**.

---

## ⚙️ **Tech Stack**

| Category                | Technology                    |
|------------------------|-------------------------------|
| **Backend Framework**  | Express.js                    |
| **Database**           | MongoDB                       |
| **Authentication**     | JWT & bcrypt                  |
| **Real-Time Updates**  | WebSocket                     |
| **Location Matching**  | Redis (with GEO commands)     |
| **Caching/Queue Ready**| Redis                         |

---

## 🧠 **System Architecture Overview**

The application is organized as a **monolithic architecture** with modular components such as controllers, services, and routes.  
It leverages **WebSocket** for real-time communication and **Redis GEO** commands for location-based driver matching.

![Ride Service Architecture](https://github.com/abhijeetGupta7/RIDE_SERVICE_BACKEND/blob/master/Ride_Service_Architecture.png)

---

## 🔁 **Workflow Example: Ride Booking**

1. A **passenger sends a ride request**, including pickup location coordinates.
2. The system searches for **available drivers nearby** using **Redis GEO**.
3. Once a driver is found, the backend sends a **WebSocket notification** to the driver.
4. The **driver accepts** the ride, and both users receive real-time status updates.
5. The **ride information** is stored and tracked in **MongoDB**.

---

## 🔒 **Security & Authentication**

- **JWT** is used for stateless user authentication and route protection.
- **Bcrypt** is used for secure password hashing and storage.
- Auth middleware ensures route access control between **passengers** and **drivers**.

--- 


#  API Documentation

**Base URL:**  
`http://localhost:8002/api/v1`

---

## Authentication

### Sign Up

- **Endpoint:** `POST /auth/signup`
- **Description:** Register a new user (passenger or driver).
- **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "passenger", // or "driver"
      "password": "yourpassword",
      "location": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      }
    }
    ```
- **Response:**
    - `201 Created`
    ```json
    {
      "success": true,
      "data": {
        "userData": { ...user fields... },
        "token": "JWT_TOKEN"
      },
      "message": "Successfully Created the User"
    }
    ```

---

### Sign In

- **Endpoint:** `POST /auth/signin`
- **Description:** Log in as an existing user.
- **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "yourpassword"
    }
    ```
- **Response:**
    - `201 Created`
    ```json
    {
      "success": true,
      "data": {
        "userData": { ...user fields... },
        "token": "JWT_TOKEN"
      },
      "message": "Successfully Signed In"
    }
    ```

---

## Passenger APIs

> **All endpoints require `Authorization: Bearer <token>` header.**

### Get All Bookings

- **Endpoint:** `GET /passenger/bookings`
- **Description:** Get all bookings for the authenticated passenger.
- **Response:**
    - `200 OK`
    ```json
    {
      "success": true,
      "data": [ ...booking objects... ],
      "message": "Successfully fetched all the bookings"
    }
    ```

---

### Provide Feedback

- **Endpoint:** `PATCH /passenger/feedback`
- **Description:** Provide feedback and rating for a completed booking.
- **Request Body:**
    ```json
    {
      "bookingId": "<booking_id>",
      "feedback": "Great ride!",
      "rating": 5
    }
    ```
- **Response:**
    - `200 OK`
    ```json
    {
      "success": true,
      "data": { ...updated booking... },
      "message": "Successfully provided the feedback"
    }
    ```

---

## Driver APIs

> **All endpoints require `Authorization: Bearer <token>` header.**

### Get All Bookings

- **Endpoint:** `GET /driver/bookings`
- **Description:** Get all bookings for the authenticated driver.
- **Response:**
    - `200 OK`
    ```json
    {
      "success": true,
      "data": [ ...booking objects... ],
      "message": "Successfully fetched all the bookings"
    }
    ```

---

### Update Driver Location

- **Endpoint:** `PATCH /driver/location`
- **Description:** Update the driver's current location.
- **Request Body:**
    ```json
    {
      "latitude": 28.7041,
      "longitude": 77.1025
    }
    ```
- **Response:**
    - `200 OK`
    ```json
    {
      "success": true,
      "data": { ...updated driver... },
      "message": "Successfully Updated the Driver Location"
    }
    ```

---

## Booking APIs

> **All endpoints require `Authorization: Bearer <token>` header.**

### Create Booking

- **Endpoint:** `POST /booking/`
- **Description:** Create a new booking as a passenger.
- **Request Body:**
    ```json
    {
      "source": { "latitude": "28.7041", "longitude": "77.1025" },
      "destination": { "latitude": "28.5355", "longitude": "77.3910" }
    }
    ```
- **Response:**
    - `201 Created`
    ```json
    {
      "success": true,
      "data": { ...booking object... },
      "message": "Successfully Initiated the booking"
    }
    ```

---

### Confirm Booking (Driver)

- **Endpoint:** `PUT /booking/:bookingId/confirm`
- **Description:** Confirm a booking as a driver (only if notified).
- **Response:**
    - `200 OK`
    ```json
    {
      "success": true,
      "data": { ...booking object... },
      "message": "Booking Successfully Confirmed"
    }
    ```

---

## WebSocket Events

- **Socket URL:** `ws://localhost:8002`
- **Events:**
    - `setUserSocketId` — Set userId and role for socket.
    - `new-bookingNotification` — Sent to drivers when a new booking is available nearby.
    - `confirmBookingDriver` — Sent to driver when booking is confirmed.
    - `confirmBookingPassenger` — Sent to passenger when booking is confirmed.
    - `bookingTaken` — Sent to other drivers when booking is taken.

---

## Models

### User

- `_id`
- `name`
- `email`
- `password`
- `role` ("passenger" or "driver")
- `location` (GeoJSON Point)

### Booking

- `_id`
- `passengerId`
- `driverId`
- `source` (`latitude`, `longitude`)
- `destination` (`latitude`, `longitude`)
- `fare`
- `status` (`pending`, `cancelled`, `confirmed`, `completed`)
- `rating`
- `feedback`

---

## Error Response

```json
{
  "success": false,
  "error": { "message": "Error details" },
  "data": {},
  "message": "Something went wrong"
}
```

---

## Notes

- All endpoints (except `/auth/signup` and `/auth/signin`) require JWT authentication.
- Use the returned JWT token in the `Authorization` header for protected routes.
- Real-time notifications are handled via Socket.IO.

---

