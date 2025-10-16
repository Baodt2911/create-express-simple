# Create Express Template CLI

A CLI tool to quickly generate Express.js project templates with a clean structure, supporting both JavaScript and TypeScript. Choose between minimal, RESTful API, or realtime (Socket.io) templates.

## Features

- Generate Express.js project templates in JavaScript or TypeScript
- Select template type: minimal, RESTful API, or realtime (Socket.io)
- Predefined folder structure: configs, controllers, events, middlewares, models, routes, services, utils, views
- Ready-to-use starter code

## Usage

You can use this CLI directly with npx (no global installation required).

Below are two ways to run the command:

- Without options (defaults):

```bash
npx create-express-simple <project-name>
```

Example:

```bash
npx create-express-simple my-app
```

- With options (specify type and template):

```bash
# General syntax
npx create-express-simple <project-name> --type <js|ts> --template <minimal|rest|realtime>
```

Example:

```bash
# Create a RESTful API project with TypeScript
npx create-express-simple my-app --type ts --template rest
```

After generation, change into the project directory and install dependencies:

```bash
cd my-app
npm install
```

## Template Types

- **minimal**: Basic Express server setup
- **rest**: RESTful API structure with controllers, models, routes
- **realtime**: Socket.io integration for realtime features

## Example Folder Structure

```
configs/
controllers/
events/
middlewares/
models/
routes/
services/
utils/
views/
```

## License

MIT
