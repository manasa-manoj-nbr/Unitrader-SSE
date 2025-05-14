
<h1>Unitrader‑SSE Documentation</h1>

Below is comprehensive documentation for the Unitrader‑SSE repository, a real‑time auction platform built with Next.js and Server‑Sent Events (SSE). This guide covers project overview, prerequisites, setup, architecture, environment configuration (including API keys from a protected PDF), and contributing guidelines.

**1. Project Overview**

Unitrader‑SSE provides:

User authentication and profile management

Listing and auctioning of items within a college community

Real‑time bidding updates powered by SSE

In‑app chat for buyers and sellers to coordinate exchanges

Responsive UI built with Tailwind CSS

This repository contains both the frontend (under src/) and API routes (under src/pages/api/).

**2. Key Technologies**

2.1 Next.js

Next.js is a React framework for building full‑stack web apps with server-side rendering, API routes, and automatic bundling.

2.2 Server‑Sent Events (SSE)

SSE allows servers to push updates to clients over an HTTP connection using the EventSource API, ideal for live auction bids.

2.3 Tailwind CSS

A utility‑first CSS framework that scans your templates for class names to generate a minimal stylesheet.

**3. Prerequisites**

Node.js (v14 or later) and npm

Git (for cloning the repo)

Basic familiarity with React and Next.js

Install vscode extension called as **<u>vscode-pdf</u>** to open the pdf for the api keys.

**4. Installation & Setup**

Clone the repository

git clone https://github.com/pavan082005/Unitrader-SSE.git
cd Unitrader-SSE

Install dependencies

npm install

Dependencies and scripts are defined in package.json.

Configure API Keys

Locate the protected PDF named api_keys.pdf in the root (or docs/) folder and open it.

When prompted, enter the password provided by the Course Representative (CR) to decrypt the file.

Create a new file in the project root named .env.local (or simply .env if you prefer).

Inside .env.local, copy each key from the PDF, preserving the exact variable names. **For example**:

 #Stripe
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXX

  #NextAuth
NEXTAUTH_SECRET=your_nextauth_secret

Ensure .env.local is listed in .gitignore to prevent committing sensitive information.

Run the development server

npm run dev

Starts Next.js at http://localhost:3000.

**5. Project Structure**

![image](https://github.com/user-attachments/assets/93228922-191d-4f83-ad8b-2675d5b46f16)


**6. Screenshots**
  Landing page:
  
  ![image](https://github.com/user-attachments/assets/deea63ad-2817-4e3d-9075-d8d464456236)
  ![image](https://github.com/user-attachments/assets/d776e915-4109-42d6-859a-4bb217914fe4)

  Profile page:
  c![image](https://github.com/user-attachments/assets/6ea0a2e2-7e4d-4a14-a228-255356f8af47)

  Find Products:
  ![image](https://github.com/user-attachments/assets/d3e29b0a-de4e-46ba-a9fd-347ae68d5c4b)

  Sell items:
  ![image](https://github.com/user-attachments/assets/25a034d8-7789-42f4-8fa9-b7946d19d213)

  Item card:
  ![image](https://github.com/user-attachments/assets/26ea937d-2994-4c02-8934-4de480c505a8)

  Payment gateway:
  ![image](https://github.com/user-attachments/assets/caf84371-9564-45a5-bba2-5fec628f0fdb)

  Verify transaction:
  ![image](https://github.com/user-attachments/assets/3bd0174f-c232-4df5-a0d0-51521464f48b)



  
