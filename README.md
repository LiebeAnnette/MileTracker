# 🚗 MileTracker

**MileTracker** is a full-stack MERN application that allows users to track trips by logging a start and end location, automatically calculating mileage, showing weather at the destination, and exporting trip history as a PDF report.

Built for the final project in my full-stack bootcamp, this app uses React, Apollo Client, GraphQL, Node.js, Express, and MongoDB with Mongoose. It also includes JWT authentication, secure API key usage, and continuous deployment through Render and GitHub Actions.

---

## 🔧 Technologies Used

- **Frontend:** React, Vite, Apollo Client, TypeScript
- **Backend:** Node.js, Express, GraphQL (Apollo Server), Mongoose
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)
- **APIs:** OpenRouteService (mileage), OpenWeatherMap (weather)
- **CI/CD:** GitHub Actions
- **Deployment:** Render

---

## 🚀 Features

- 🧭 **Add trips** by entering a start and end location
- 📏 **Automatically calculates miles**
- 🌦️ **Displays weather** for the destination
- 🗑 **Delete trips** individually
- 📄 **Download a PDF** report of all logged trips
- 🔐 **User authentication** with JWTs
- 📦 **Protected API keys** in environment variables
- ⚙️ **GitHub Actions** runs type checks on every push

---

## 🔒 Authentication

Register and log in with a username and password. Authenticated users have private trip data and token-secured access to all features.

---

## 🌍 Live Demo

- **Frontend:** [https://miletracker-client.onrender.com](https://miletracker-client.onrender.com)
- **Backend (GraphQL API):** [https://miletracker-wokk.onrender.com/graphql](https://miletracker-wokk.onrender.com/graphql)

---

## 🧪 Local Development

1. Clone the repo
2. Run the backend:

```bash
cd server
npm install
npm run start
```
Run the Front End
```bash
cd client
npm install
npm run dev
```
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
OPENROUTE_API_KEY=your_route_api_key
WEATHER_API_KEY=your_weather_api_key

👏 Credits
Developed by Liebe as the final capstone project for a full-stack JavaScript bootcamp. Built with ❤️, APIs, and very little sleep.

