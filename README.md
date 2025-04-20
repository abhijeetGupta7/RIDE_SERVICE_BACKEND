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
