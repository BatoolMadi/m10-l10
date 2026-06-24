# Lab 10 — frontend Dockerfile. Author this file.
#
# TODO: use a multi-stage build to keep the final image small.
# TODO: stage 1 (named `builder`) installs dependencies and builds the
#       Next.js app.
# TODO: stage 2 (named `runner`) copies only the built artifacts and
#       the files needed at runtime from the builder stage.
# TODO: expose the Next.js port and start the production server.
#
# See lab-guide.md "Containerization" section for the constraints the
# autograder will check.

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]