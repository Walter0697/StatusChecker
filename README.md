# Status Checker

Using Nuxt3 to develop a simple status checker web app

- the framework is still in development and I believe this is not a best practice to use it. If there are anything changed, I will modify this web app to make it better
- normally backend should be separated from the frontend project, but this project is just an experimental and practice project, so I combine it together.
## Setup

- to build the image at Apple Chip, use the command `docker buildx build --platform linux/amd64 -t <imagename>:<tagname> .`
- to apply the migration, enter the docker container, and `npx prisma migrate deploy`
- to create a new user, enter the docker container, and `node inituser.ts <username> <password>`