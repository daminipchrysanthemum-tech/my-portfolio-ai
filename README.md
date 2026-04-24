## 🤖🏆 AI-Powered Achievement Showcase


<img width="884" height="861" alt="AI Portfolio App" src="https://github.com/user-attachments/assets/165c52f3-4ae1-43ce-8212-ed11d25d5837" />


## 📖 Overview

An AI-powered achievement showcase where visitors can ask questions about my background and get real answers pulled from a live database of 252 of my achievements. Ask it about my leadership experience, case competitions, volunteering history, or awards — it knows all of it.

---

## ✨ Features

- Six quick-question chips — Certifications, Competitions, Organizations, Volunteering, Awards, and Full Summary
- Free text input for custom questions
- AI intentionally scoped only to answer questions about my achievements — redirects any off-topic questions
- 252 achievements organized by category in Azure SQL
- Frontend and backend fully deployed on free-tier platforms

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| AI Model | Azure OpenAI GPT-4o-mini |
| Database | Azure SQL |
| Backend | Node.js, Express |
| Backend Hosting | Render |
| Frontend Hosting | Netlify |
| Version Control | GitHub |

---

## 🏗️ Architecture

The frontend is hosted on Netlify and connected to GitHub for automatic deployments — every push updates the site instantly. The backend runs on Render as a Node.js Express server, handling API calls to Azure OpenAI and queries to Azure SQL. The database stores 252 achievements across four columns — ID, category, title, and description — which map directly to the six chips in the interface.

---

## 🧠 Key Technical Decisions

**Choosing Node.js over Python**
Python is my strongest language, but I deliberately chose Node.js for this project. I had learned Java in college and wanted to push myself into something unfamiliar. Learning a new language by building something real is completely different from following a tutorial — three days later, I had working Node.js code.

**Choosing Azure for AI**
My AWS project covered infrastructure. I wanted Azure to show something different — AI and cloud working together. Azure OpenAI made that combination accessible and fit exactly what I was trying to build.

**Building the Database**
Rather than entering 252 achievements manually, I wrote a script to populate the database. Getting the Azure SQL firewall rules configured correctly to allow backend connections took some back-and-forth, but once set up, the queries ran cleanly and fast.

---

## 🚧 The Deployment Problem Nobody Warns You About

My original plan was to deploy the backend to Azure App Service and keep everything on Azure. It failed immediately — I had hit the subscription quota limit on the free plan with no warning.

I tried the railway next. It required a paid plan.

After about an hour of research, I found Render — free tier, straightforward Node.js support, and it worked. I added all 7 environment variables in the Render dashboard, configured CORS to allow my Netlify frontend to connect, and the backend was live.

The final stack ended up split across four platforms instead of one, but it works, it costs nothing, and it taught me something important — always have a deployment backup plan, especially on free-tier accounts.

---

## 📁 Repository Structure

```
ai-achievement-showcase/
├── frontend/
│   └── index.html              # UI with chips, free text input, and response display
├── backend/
│   ├── server.js               # Express server — handles OpenAI and Azure SQL calls
│   ├── db.js                   # Azure SQL connection and query logic
│   ├── openai.js               # Azure OpenAI GPT-4o-mini integration
│   └── .env.example            # Template for the 7 required environment variables
├── scripts/
│   └── populate_db.js          # Script used to bulk-insert 252 achievements into Azure SQL
├── assets/
│   └── preview.png             # App screenshot (the one in your README)
└── README.md

```


