# 🌿 GreenMind — GenAI Green Campus Platform

> **AI-Powered Environmental Issue Detection, Responsible Sustainability Analytics, and Eco-Bounty Rewards for Smart Campuses.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini_1.5_Flash-Vision_&_Pro-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🚀 Instant 1-Click Cloud Deployment (Vercel)

Next.js is a full-stack framework with serverless API routes, cookie-based session authentication, and Gemini AI vision integration. The easiest and fastest way to deploy GreenMind live with **100% features and zero configuration** is with **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Felakkiyan06-ux%2FGreen-Minds)

### Step-by-Step Deployment:
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Under **Import Git Repository**, select **`elakkiyan06-ux/Green-Minds`**.
3. *(Optional)* Add your Gemini AI API key under **Environment Variables**:
   - `GEMINI_API_KEY`: `your_gemini_api_key_here`
4. Click **Deploy**. Your site will be live within 60 seconds at `https://green-minds.vercel.app`!

---

## 👥 Separated Roles & Demo Accounts

GreenMind features strictly separated authentication and dashboards for students/users and campus administration:

| Portal | Route | Demo Email | Demo Password | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Student / User Portal** | `/login` | `student@greenmind.demo` | `student123` | Report campus issues, Gemini Vision audit, Eco-Bounty rewards & Green Assistant |
| **Admin Operations** | `/admin/login` | `admin@greenmind.demo` | `admin123` | Department dispatch, status triage, recurring issue predictions, resource impact metrics |

---

## ✨ Key Features

### 1. 🎓 Student & Community Experience (`/user/*`)
- **Multimodal Issue Reporting (`/user/report`)**: Upload photos or describe issues using voice-to-text. Gemini Vision automatically verifies the issue, assigns a severity category, and calculates auditor reward points.
- **Eco-Bounty Gamification (`/user/eco-bounty`)**: Earn points for verified reports, climb the campus leaderboard, and redeem sustainability badges.
- **My Reports Tracking (`/user/issues`)**: Track real-time repair progress, maintenance department dispatch, and resolution notes from technicians.
- **AI Green Assistant (`/user/assistant`)**: Context-aware conversational assistant trained on campus sustainability guidelines and waste segregation policies.

### 2. 🏛️ Admin Management Portal (`/admin/*`)
- **Campus Command Dashboard (`/admin/dashboard`)**: 8 high-level KPI cards, issue category distributions, severity breakdown, and maintenance department queues.
- **Predictive Recurring Problems (`/admin/recurring-problems`)**: Pattern detection algorithms analyzing historical incidents to identify repeated water leaks, chronic energy waste, and recurring overflows before they cause damage.
- **Resource Impact & Cost Estimator (`/admin/resource-impact`)**: Quantified campus metrics including wasted liters of water, lost kilowatt-hours, carbon emissions ($CO_2e$), and direct financial savings from preventive repairs.
- **Maintenance Dispatch & Ticket Resolution (`/admin/issues/[id]`)**: Assign work orders directly to Electrical, Plumbing, Housekeeping, Waste Management, or Security with resolution logs.
- **User Directory (`/admin/users`)**: Role-based access control management.

---

## 💻 Local Development Setup

To run GreenMind locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/elakkiyan06-ux/Green-Minds.git
cd Green-Minds

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3030](http://localhost:3030)) in your browser.

---

## 🛡️ Responsible AI Disclosure

GreenMind adheres to transparent, responsible AI principles:
- **Vision Uncertainty Acknowledgement**: When analyzing vacant classrooms or plumbing fixtures, the AI explicitly states observations (e.g. *"No people are clearly visible in the provided camera frame"*) rather than assuming schedule occupancy.
- **AI Predictions vs. Guarantees**: Predictive recurring problem alerts are clearly flagged as heuristic pattern forecasts to aid human facilities managers, not infallible forecasts.
- **Human-in-the-Loop**: All final status closures and maintenance work orders require administrative sign-off.

---

## 📄 License
This project is open-source and built for the Green Campus Initiative.
