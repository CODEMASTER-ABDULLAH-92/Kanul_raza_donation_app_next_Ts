# Kanul Riza Donation App

A modern, scalable donation management platform built using **Next.js**, **Tailwind CSS**, and **React Icons**, designed for the Kanul Riza Islamic Institute. This application allows authorized staff members to collect donations from the public and enables administrators to manage, track, and monitor all donation activities through an Admin Dashboard.

---

## 🚀 Features

### **👤 Staff Features**

* Access through **Staff Login** only
* Submit donation details from field stalls
* Collect donor information:

  * Full Name
  * Email
  * Phone Number
  * Donation Amount
  * Type of Charity (Sadaqah, Zakat, Nafl, etc.)
  * Donation Category (Masjid, Madrasa, Books, Ration, etc.)
* Data automatically stored in MongoDB (future integration)

---

### **🛠️ Admin Features**

* Access through **Admin Login**
* Full Admin Dashboard with sidebar navigation
* View total donations, staff count, and pending requests
* **Charities Management** (CRUD – coming soon)
* **Staff Management** (Admin can create login credentials for staff)
* View complete donation records submitted by staff
* Manage staff emails/passwords

---

## 🎨 UI / Frontend Stack

* **Next.js 14 (App Router)**
* **Tailwind CSS** (Green + White gradient theme)
* **React Icons** for clean, aesthetic icons
* Fully **responsive across all devices**

---

## 📁 Project Structure

```
/project
 ├── app
 │   ├── page.jsx (Homepage)
 │   ├── staff-login/page.jsx
 │   ├── admin-login/page.jsx
 │   ├── donation-form/page.jsx
 │   ├── admin-dashboard/page.jsx
 │   └── globals.css
 ├── components
 ├── public
 └── README.md
```

---

## 📦 Installation

Install dependencies:

```
npm install
```

Install required libraries:

```
npm i react-icons
npm i mongoose
```

Run development server:

```
npm run dev
```

---

## 🗄️ Database (Upcoming Integration)

The app will be connected to **MongoDB** using **Mongoose** with:

* `donations` collection
* `staff` collection
* `admin` collection

---

## 🧪 Dummy Data

The Admin Dashboard currently uses dummy arrays for:

* Charities
* Staff Members
  These will be replaced with MongoDB API routes soon.

---

## 📱 Responsive Design

The entire application is fully responsive:

* Mobile View ✔
* Tablet View ✔
* Laptop/Desktop View ✔
* Sidebars collapse on smaller screens ✔

---

## ✨ Upcoming Features

* Full CRUD for Charities & Staff
* Staff Activity Logs
* Admin Role Management
* Email Notifications (Staff → Admin → Donor)
* PDF Donation Receipts
* Dashboard Analytics with Charts
* Secure Authentication (JWT / NextAuth)

---

## 🤝 Contribution

Want to contribute or extend the features? Create a pull request or message the project owner.

---

## 📞 Contact & Support

For queries, reach out via email or institution contact.

**Kanul Riza Institute** – Serving Islam through education, charity, and community support.

---

## ⭐ Rate This Project

If you like this project, please star the repository to support continued development!
