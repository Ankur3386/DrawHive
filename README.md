# 🐝 DrawHive – Collaborative Drawing Platform

DrawHive is a real-time collaborative drawing and communication platform built with a Turborepo monorepo structure. It brings together multiple backend services and a web frontend to enable seamless, low-latency collaboration.

🔹 Key Features

🎨 Collaborative Whiteboard – Multiple users can draw together on a shared canvas in real-time.

🔌 WebSocket Backend – Powered by ws-backend, enabling live updates with minimal latency.

🌐 HTTP Backend – Handles authentication, user management, and REST APIs.

💻 Next.js Web App – A modern, fast, and responsive frontend built with React & Next.js.

📦 Shared Packages – Common configs (eslint, typescript) and UI components (@repo/ui) managed in a Turborepo for consistency.

⚡ Monorepo Workflow – Efficient builds and caching using Turborepo, with all apps and packages managed under one roof.

🔹 Tech Stack

Frontend: Next.js (with Turbopack), React, TailwindCSS

Backends: Node.js + Express (HTTP + WebSocket servers)

Monorepo Tooling: Turborepo, PNPM

Shared Code: TypeScript configurations, UI components, linting rules

🔹 Vision

DrawHive is designed to be more than just a whiteboard. It’s a collaboration hub where teams, classrooms, and communities can sketch, brainstorm, and communicate visually in real-time.


# Step i have done 
1. Initialized an empty turbor repo
2. Deleted the docs app as 1 frontend needed 
3. Added http-server, ws-server
4. Added package.json in both the places
5. Added tsconfig.json in both the places, and imported it from @repo/typescript-config/base.json
6. Added @repo/typescript-config as a dependency in both ws-server and http-server in package.json
7. added dev,start,build in package.json of  ws-server and http-server
8. update turbo.json for  ws-server and http-server
9. initialize  ws-server and http-server
10. created common packages for zod and written zod 
11. created comman db structure and write schema and generated client and exported client
12. created http routes with controller 
13. created ws room  and save  message in db  