# ⚖️ JusticeFlow: AI-Powered Case Management System  

## Problem Statement  
### WHLG03 – Delays in Justice System  
The judicial system faces **massive case backlogs**, leading to prolonged trials and **delayed justice**. Many cases remain unresolved for years, increasing the burden on courts and causing frustration for citizens.  

🔹 **Challenges:**  
- Overloaded judiciary with **millions of pending cases**.  
- Lack of **efficient case tracking and prioritization**.  
- **Time-consuming** legal research and documentation.  
- **Manual processes** slowing down dispute resolution.  

We aim to build an **AI-powered case management system** to streamline legal research, case tracking, and dispute resolution using **Artificial Intelligence and Automation**.  

## 🏆 Hackathon Details  
🔹 **Team Name:** pehli_baar_aaye_hai  
🔹 **Team Members:**  
1. **Harshil Bohra** (AI/ML Engineer)
2. **Atharva Kuratkar** (Full-Stack Developer)  
3. **Vishal Tamhane** (Backend Developer)  
4. **Sujal Pawar** (Full-Stack Developer) 

🔹 **Hackathon:** WeHack25  
🔹 **Date:** 22nd-23rd March 

## 🛠️ Tech Stack

### Frontend
- **Framework:** React with TypeScript
- **UI Components:** Radix UI, Tailwind CSS
- **State Management:** React Query
- **Routing:** React Router
- **HTTP Client:** Axios
- **Authentication:** JWT

### Backend
- **Framework:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT
- **API Documentation:** Swagger/OpenAPI

### AI/ML Components
- **Natural Language Processing:** OpenAI GPT
- **Document Analysis:** Custom ML Models
- **Case Prediction:** Machine Learning Algorithms

## 🚀 Features

### Core Features
1. **User Authentication & Authorization**
   - Role-based access (Judge, Lawyer, Litigant, Admin)
   - Secure login/registration
   - Profile management

2. **Case Management**
   - Case filing and tracking
   - Document management
   - Case status updates
   - Hearing scheduling

3. **AI-Powered Tools**
   - Legal document analysis
   - Case outcome prediction
   - Similar case recommendations
   - Automated legal research

4. **Communication**
   - In-app messaging
   - Video conferencing for hearings
   - Document sharing
   - Real-time notifications

5. **Analytics & Reporting**
   - Case statistics
   - Performance metrics
   - Custom reports
   - Data visualization

## 🏗️ Project Structure

```
Legal-Ease/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the Frontend directory:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the Backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/legal-ease
   JWT_SECRET=your-super-secret-jwt-key-for-legal-ease
   PORT=5000
   FRONTEND_URL=http://localhost:8081
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔒 Environment Variables

### Frontend
- `VITE_GROQ_API_KEY`: Groq API Key

### Backend
- `MONGODB_URI`: MongoDB Connection String
- `JWT_SECRET`: JWT Secret Key
- `PORT`: Backend Server Port
- `FRONTEND_URL`: Frontend URL

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the backend server. It includes:
- Authentication endpoints
- Case management endpoints
- User management endpoints
- Document management endpoints
- Analytics endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WeHack25 for providing the platform
- Our mentors and judges for their valuable feedback
- All the open-source libraries and tools we used
- Our team members for their dedication and hard work

## 📞 Contact

For any queries or support, please reach out to:
- Email: [wearemarvellians@gmail.com](mailto:wearemarvellians@gmail.com)

---

Made with ❤️ by Team pehli_baar_aaye_hai
