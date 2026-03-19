# Sale Inventory Management System

A full-stack web application built to manage products, sales, invoices, and inventory in a simple and organized way.

This project is being developed as part of my full-stack web development learning journey and practical portfolio building.

## Features

- User authentication (Register/Login)
- Protected routes
- Product management
- Sales entry system
- Invoice generation
- Sales history
- Inventory tracking
- Responsive frontend UI
- JWT-based authentication
- REST API integration
- Separate user-based data handling (in progress)

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

## Project Structure

```bash
Current Modules
Authentication
Users can register and log in securely. JWT token is generated after login and used for protected API access.

Products
Users can add and manage products with details like product name, price, stock, and HSN code.

Sales
Users can create a sale by selecting products, adding quantity, and generating total amount.

Invoice
After completing a sale, invoice data is shown with product details, quantity, price, and total amount. Invoice can also be printed.

Sales History
Sales records can be viewed for tracking previous transactions.

Work in Progress
This project is still under development. Some features are completed, and some are currently being improved.

In Progress
Currently working on user-specific data isolation so that each logged-in user can access and manage only their own data
Better dashboard insights
Improved validations and error handling
UI/UX improvements
Better invoice with proper details

Future Improvements
Role-based access control
Separate user-specific products, customers, sales, and invoices
Export invoice as PDF
Analytics dashboard
Search, filter, and pagination
Better mobile responsiveness


To run backend 
npx nodemon server.js (run in terminal)

for forntend
npm run dev (run in terminal)

