# Lookout Towers

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

Website of community database of **lookout towers**, observatories and other objects designed to discover beautiful views. I created this website to better connect lookout tower lovers, which of course includes me. The goal of this website is to map all lookout towers in the Czech Republic (so far), store current information about them that will be freely available to everyone, and last but not least, allow users to preserve their visits and memories.

The project leverages **Next.js** for server-side rendering and static site generation, **Tailwind CSS** for styling, and follows modern **TypeScript** practices.

## Features

- User authentication using `next-auth v5` (found in `auth.ts`).
- Modular UI components (located in `components/`).
- Tailwind CSS for responsive and modern design.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- Node.js (version 22 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/dowl-air/lookout-towers-v2.git
    cd lookout-towers-v2
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

A brief overview of the main folders and files:

- **`actions/`**: Contains action handlers or utilities.
- **`app/`**: Main application logic, including pages and routes.
- **`auth.ts`**: Authentication-related functionality.
- **`components/`**: Reusable UI components.
- **`public/`**: Public assets like images.
- **`utils/`**: Utility functions for common tasks.
- **`types/`**: TypeScript types and interfaces.

## Scripts

Useful scripts defined in `package.json`:

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm start`: Start the production server.
- `npm run lint`: Run linter to check for code issues.

## Contributors

- [Daniel Patek](https://github.com/dowl-air)
