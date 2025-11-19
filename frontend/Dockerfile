# Stage 1: Build the React App
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build 

FROM nginx:alpine
# Copy the build output to Nginx's html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config 
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]