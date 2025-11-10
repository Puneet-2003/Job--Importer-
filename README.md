# Job Importer

Job Importer is a scalable system for importing, processing, and managing job listings from various APIs. It consists of a **client** built with Next.js and a **server** built with Express.js, MongoDB, and BullMQ for queue-based job processing.

---

## Features

### Client
- **Dashboard**: View system status and perform quick actions.
- **Import History**: Track all job import operations with detailed logs.
- **Job Listings**: Browse and manage imported job listings.
- **Responsive Design**: Optimized for desktop and mobile devices.

### Server
- **Job Import**: Fetch and process job listings from external APIs.
- **Queue System**: Use BullMQ for scalable and reliable job processing.
- **Database**: Store job listings and import logs in MongoDB.
- **Health Check**: Monitor server and queue system status.

---

## Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Running instance for database storage
- **Redis**: Running instance for queue management
- **Environment Variables**: Create `.env` files in both `client` and `server` directories.

### Example `.env` for Server
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-importer
REDIS_URL=redis://localhost:6379
```

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/job-importer.git
cd job-importer
```

### 2. Install Dependencies
#### Client
```bash
cd client
npm install
```

#### Server
```bash
cd server
npm install
```

### 3. Run the Development Servers
#### Client
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Server
```bash
npm run dev
```
The server will run at [http://localhost:5000](http://localhost:5000).

---

## Scripts

### Client
- `npm run dev`: Start the development server.
- `npm run build`: Build the production version.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint for code quality checks.

### Server
- `npm run dev`: Start the server in development mode with `nodemon`.
- `npm run start`: Start the server in production mode.
- `npm run worker`: Start the queue worker for processing jobs.

---

## API Endpoints

### Health Check
- **GET** `/api/health`: Check server status.

### Job Import
- **POST** `/api/import/start`: Start a job import from a specific API.
- **POST** `/api/import/trigger-all`: Trigger imports from all predefined APIs.
- **GET** `/api/import/history`: Get import history with pagination.
- **GET** `/api/import/:id`: Get details of a specific import.

### Jobs
- **GET** `/api/jobs`: Fetch all jobs with pagination.

---

## Folder Structure

```
job-importer/
├── client/          # Frontend (Next.js)
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   ├── types/       # TypeScript types
│   └── ...          # Other configuration files
├── server/          # Backend (Express.js)
│   ├── src/         # Source code
│   │   ├── models/  # MongoDB models
│   │   ├── workers/ # Queue workers
│   │   ├── services/# Utility services
│   │   └── ...      # Controllers and routes
│   └── ...          # Other configuration files
└── README.md        # Project documentation
```

---

## Deployment

### Client
1. Build the client:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

### Server
1. Start the server:
   ```bash
   npm run start
   ```
2. Start the worker:
   ```bash
   npm run worker
   ```

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [BullMQ](https://docs.bullmq.io)
- [Redis](https://redis.io)