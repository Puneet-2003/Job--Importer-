# Job Importer - System Architecture

This document outlines the architecture of the **Job Importer** system, which is designed to import, process, and manage job listings from external APIs.

---

## Overview

The Job Importer system consists of two main components:

1. **Frontend (Client)**: A Next.js application that provides a user interface for managing job imports, viewing logs, and browsing job listings.
2. **Backend (Server)**: An Express.js application that handles API requests, job processing, and database interactions.

The system is designed to be scalable, reliable, and maintainable, leveraging modern technologies like MongoDB, Redis, and BullMQ.

---

## Architecture Diagram

```plaintext
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|   External APIs   +<----->+      Server       +<----->+     Database      |
|                   |       |                   |       |   (MongoDB)      |
+-------------------+       +-------------------+       +-------------------+
                                 ^
                                 |
                                 v
                         +-------------------+
                         |                   |
                         |      Queue        |
                         |     (Redis)       |
                         +-------------------+
                                 ^
                                 |
                                 v
                         +-------------------+
                         |                   |
                         |      Worker       |
                         |   (BullMQ Jobs)   |
                         +-------------------+
                                 ^
                                 |
                                 v
                         +-------------------+
                         |                   |
                         |      Client       |
                         |    (Next.js)      |
                         +-------------------+