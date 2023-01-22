# A Headless Vending Machine API Implementation

This repository contains all the code related to the headless vending machine API project

### Development Environment Setup


### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- `Shell Script Environment`

### Installation & Setup

##### Dev Environment

1. Copy the `.envtemplate` to `.env`and fill out all the environment variables
2. Start Docker Containers from the root of the project `sh config/dev/scripts/start.sh`


### Usage

TODO


### Architecture

TODO

### Documentation

- Postman Collection in `/docs` dir


## Branching Strategy

TODO

## File Structure

- `/config`: Terraform IaC code and configuration scripts
- `/docker`: Docker Image Configurations & Composition
- `/prisma`: Prisma Database Schemas + Migrations & other utilities
- `/lambdaBuilds`: Bundled Lambda Services
- `/src`: API code Folder
- `/docs`: Service Documentation + OpenAPI Spec

## Testing

### Unit Testing

1. `pnpm run install`
2. `pnpm run test`

### E2E 

TODO

## Code Quality

TODO

## Versioning

TODO


## TODO

- Map Specific Error Codes;
- Redis Encryption - Transit & Rest;
- E2E + integration testing;
- Load testing;
- Admin User Implementation.
- Transaction Ledger