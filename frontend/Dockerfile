# Use Node 22 to satisfy Vite 7 requirements
FROM node:22-alpine as build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT=80
# Add nginx config for React Router
RUN echo 'server { listen ${PORT}; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]