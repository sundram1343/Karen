# karen

## 📑 Table of Contents

- [Description](#description)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributors](#contributors)
- [Contributing](#contributing)

## 📝 Description

karen — a mobile app built with Android (Native), Express.js, Java (Gradle), JavaScript, Kotlin, MongoDB, Ruby, iOS (Native).

## 📸 Screenshots

![LoginScreen](Frontend/Karen/src/assets/LoginScreen.png)

## 🛠️ Tech Stack

![Android (Native)](https://img.shields.io/badge/Android%20(Native)-3DDC84?style=for-the-badge&logo=android&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![Java (Gradle)](https://img.shields.io/badge/Java%20(Gradle)-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Ruby](https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white) ![iOS (Native)](https://img.shields.io/badge/iOS%20(Native)-000000?style=for-the-badge&logo=apple&logoColor=white)

**Notable libraries:** Mongoose, Multer

## 🏗️ Architecture

A high-level view of how the main pieces fit together:

```mermaid
flowchart TD
    User["📱 Mobile App"]
    API["⚙️ Express API"]
    User --> API
    DB[("🗄️ MongoDB")]
    API --> DB
```

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https:\\github.com\sundram1343\karen.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 📦 Key Dependencies

```
bcrypt: ^6.0.0
cors: ^2.8.6
dotenv: ^17.4.2
express: ^5.2.1
groq-sdk: ^1.5.0
jsonwebtoken: ^9.0.3
mongoose: ^9.9.0
multer: ^2.2.0
nodemon: ^3.1.14
open: ^11.0.1
pdf-parse: ^2.4.5
```

## 🌐 API Endpoints

Detected endpoints (best-effort scan):

```
POST /register
POST /login
POST /send
GET /chats
GET /chat/:chatid
```

## 📁 Project Structure

```
.
├── Backend
│   ├── app.js
│   ├── config
│   │   ├── DB.js
│   │   └── groq-config.js
│   ├── controllers
│   │   ├── auth-controller.js
│   │   └── message-controller.js
│   ├── middleware
│   │   ├── authmiddleware.js
│   │   └── uploadmiddleware.js
│   ├── models
│   │   ├── chat-model.js
│   │   ├── message-model.js
│   │   └── user-model.js
│   ├── package.json
│   └── routes
│       ├── auth-router.js
│       └── message-router.js
└── Frontend
    └── Karen
        ├── .bundle
        │   └── config
        ├── Gemfile
        ├── __tests__
        │   └── App.test.tsx
        ├── app.json
        ├── babel.config.js
        ├── env.d.ts
        ├── index.js
        ├── jest.config.js
        ├── metro.config.js
        ├── package.json
        ├── src
        │   ├── App.jsx
        │   ├── AuthScreens
        │   │   ├── Login.jsx
        │   │   └── SignUp.jsx
        │   ├── Components
        │   │   ├── ChatHeader.jsx
        │   │   ├── ChatInput.jsx
        │   │   ├── MessageBubble.jsx
        │   │   ├── NavDrawer.jsx
        │   │   └── TypingIndicator.jsx
        │   ├── Home
        │   │   └── Home.jsx
        │   ├── assets
        │   │   └── LoginScreen.png
        │   └── services
        │       └── actions.jsx
        └── tsconfig.json
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

## 👥 Contributors

Thanks to everyone who has contributed to this project:

<p align="left">
<a href="https://github.com/sundram1343" title="sundram1343"><img src="https://avatars.githubusercontent.com/u/215622160?v=4&s=64" width="64" height="64" alt="sundram1343" style="border-radius:50%" /></a>
</p>

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https:\\github.com\sundram1343\karen.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

---

<div align="center">

[![Made with ReadmeBuddy](https://img.shields.io/badge/Made%20with-ReadmeBuddy-8B5CFF?style=for-the-badge&logo=markdown&logoColor=white)](https://readmebuddy.com)

<sub>Generate beautiful READMEs in seconds → <a href="https://readmebuddy.com">readmebuddy.com</a></sub>

</div>
