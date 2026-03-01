Parking Lot Management System


📌 Project Overview

The Parking Lot Management System is a full-stack web application that automates vehicle parking operations.
This system allows users to:
Park vehicles based on availability
Automatically allocate suitable parking spots
Generate parking tickets with entry time
Unpark vehicles using ticket ID
Automatically calculate parking fees based on duration
View real-time parking status
The goal of this project was to build a clean backend system using ASP.NET Core and integrate it with a responsive React frontend.

🎯 Problem Statement
In many small parking areas, vehicle entry and exit are managed manually. This leads to:
Incorrect spot allocation
Manual billing errors
No real-time tracking
Difficulty in monitoring occupancy
This project solves these problems by automating:
Spot assignment
Ticket generation
Time tracking
Fee calculation
Real-time parking status

🛠 Tech Stack Used

Backend
ASP.NET Core Web API
C#
REST APIs
In-Memory Data Storage
Swagger (API Testing)

Frontend
React (Vite)
JavaScript
Fetch API
Responsive UI Design

🏗 System Architecture

The backend follows a clean layered structure:
Controllers → Handle HTTP requests
Services → Business logic (spot allocation, pricing)
Repository → Manage parking data in memory
Dependency Injection is used to manage services.
Frontend communicates with backend using REST APIs.

🔄 How It Works (Workflow)

1️⃣ Parking a Vehicle
User enters vehicle number plate
Selects vehicle type (Bike / Car / Truck)
Frontend sends POST request to backend
Backend:
Checks for available spot
Allocates appropriate spot
Generates unique ticket ID
Stores entry time
Frontend updates real-time status

2️⃣ Unparking a Vehicle
User enters Ticket ID
Frontend sends POST request
Backend:
Calculates parking duration
Computes fee
Frees parking spot
Updated status is shown in dashboard

🌐 APIs Implemented
Method	Endpoint	Description
POST	/api/Parking/park	Allocate parking spot
POST	/api/Parking/unpark/{ticketId}	Free spot & calculate fee
GET	/api/Parking/status	Get real-time parking status

All APIs are tested using Swagger.

📊 Key Features
Real-time parking status dashboard
Automatic parking spot allocation
Ticket generation system
Duration-based fee calculation
Clean backend architecture
Full frontend-backend integration
CORS handled properly
Responsive UI

⚙️ How To Run This Project
1️⃣ Run Backend
cd ParkingLot.Api
dotnet run
Backend runs on:
http://localhost:5056
Swagger:
http://localhost:5056/swagger

2️⃣ Run Frontend
cd parkinglot-frontend
npm install
npm run dev
Frontend runs on:
http://localhost:5173
(or 5174 depending on system)

🧪 Testing the System
Open frontend
Enter vehicle number (e.g., KA01AB1234)
Select vehicle type
Click Park
Copy ticket ID
Use ticket ID to Unpark
Observe real-time update in parking status.

🚀 Challenges Faced
1️⃣ CORS Issue
Initially frontend could not communicate with backend due to CORS restrictions.
Solved by configuring CORS policy and using Vite proxy.

2️⃣ Spot Allocation Logic
Ensured vehicle type matches appropriate parking spot type.

3️⃣ Real-Time UI Update
Handled state refresh after every parking/unparking operation.

📈 Future Improvements
Replace in-memory storage with SQL database
Add authentication system
Add admin dashboard
Deploy to cloud
Add payment gateway integration

📸 Demo

📽 Short demo video: 
https://www.loom.com/share/cfda70be1b9f45b2923bdf12b01acc6c

📷 Screenshots: 
<img width="1920" height="970" alt="Screenshot (480)" src="https://github.com/user-attachments/assets/aab37c51-1498-4776-b1b5-b2525e2efe2e" />
<img width="1920" height="960" alt="Screenshot (481)" src="https://github.com/user-attachments/assets/fee394da-e98a-4bef-8145-f0e4b29d73ec" />

👩‍💻 Author
Laxmi

⭐ What This Project Demonstrates
Backend API development
Business logic implementation
Full-stack integration

Clean code structure

Real-world problem solving
