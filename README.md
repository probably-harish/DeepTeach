# DeepTeach

DeepTeach is an online examination portal designed for students and teachers. This README file will guide you through the steps necessary to set up and run the project.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Getting Started

Follow these steps to get the project up and running:

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone <https://github.com/probably-harish/DeepTeach.git>
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd DeepTeach
npm install
```

### 3. Install shadcn/ui Components

Initialize the shadcn/ui components and add the required components:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add alert button card dialog input label pagination process scroll-area progress select slider tabs textarea
```

After adding the components, run:

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory of the project and add the following environment variables:

```bash
MONGODB_URI=mongodb://localhost:27017/DeepTeach or something like that
JWT_SECRET=
```

- `MONGODB_URI`: This is the connection string for your MongoDB instance. Make sure MongoDB is running locally or adjust the connection string as needed for your setup.
- `JWT_SECRET`: This is the secret key used for signing JSON Web Tokens (JWT). Replace the example secret with your own secure secret key.

## Running the Project

After completing the setup, start the development server using the following command:

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run dev
```
check out `http://localhost:3000`.

