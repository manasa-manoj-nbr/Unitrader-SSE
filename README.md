# Unitrader-SSE(Secure Sale Environment)

Unitrader-SSE is a real-time auction platform built using **Next.js** and **Server-Sent Events (SSE)**, designed specifically for a college community. This document serves as a comprehensive guide to the repository's features, setup, and development.

---

## 🚀 Project Overview

Unitrader-SSE provides:

* 🔐 User authentication and profile management
* 📦 Listing and auctioning of items
* 🔄 Real-time bidding updates via Server-Sent Events
* 💬 In-app chat between buyers and sellers
* 📱 Responsive UI using Tailwind CSS

The repository includes:

* **Frontend**: Located in `src/`
* **API routes**: Located in `src/pages/api/`

---

## 🛠️ Key Technologies

### 1. Next.js

* React framework for building full-stack apps
* Supports SSR, file-based routing, and API endpoints

### 2. Server-Sent Events (SSE)

* Real-time communication using HTTP
* Efficient for pushing live auction bids to clients

### 3. Tailwind CSS

* Utility-first CSS framework
* Generates minimal CSS based on your markup

---

## 📋 Prerequisites

Before you begin, ensure you have:

* [Node.js](https://nodejs.org/) (v14 or later)
* [Git](https://git-scm.com/)
* A code editor like [VS Code](https://code.visualstudio.com/)
* Installed **vscode-pdf** extension (to open protected PDF)

---

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/pavan082005/Unitrader-SSE.git
cd Unitrader-SSE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API Keys

* Locate the file `api_keys.pdf` in the root directory
* Use the password provided by the Course Representative (CR) to open it
* Create a `.env.local` file in the root and paste your keys

**Example:**

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXX

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
```

> ⚠️ Make sure `.env.local` is listed in your `.gitignore`.

### 4. Start development server

```bash
npm run dev
```

Access the app at: [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
Unitrader-SSE/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── pages/api/
│   ├── styles/
├── .env.local
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 📸 Screenshots

### Landing Page

![Landing Page](https://github.com/user-attachments/assets/deea63ad-2817-4e3d-9075-d8d464456236)

### Profile Page

![Profile](https://github.com/user-attachments/assets/6ea0a2e2-7e4d-4a14-a228-255356f8af47)

### Find Products

![Find Products](https://github.com/user-attachments/assets/d3e29b0a-de4e-46ba-a9fd-347ae68d5c4b)

### Sell Items

![Sell](https://github.com/user-attachments/assets/25a034d8-7789-42f4-8fa9-b7946d19d213)

### Item Card

![Item Card](https://github.com/user-attachments/assets/26ea937d-2994-4c02-8934-4de480c505a8)

### Payment Gateway

![Payment](https://github.com/user-attachments/assets/caf84371-9564-45a5-bba2-5fec628f0fdb)

### Transaction Verification

![Verify](https://github.com/user-attachments/assets/3bd0174f-c232-4df5-a0d0-51521464f48b)

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

---

## 📄 License

This project is for educational purposes only and may be modified for academic use.

---

Feel free to raise issues or contact the maintainer for questions or suggestions.
