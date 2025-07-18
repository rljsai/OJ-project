FROM node:20

RUN apt-get update && \
    apt-get install -y g++ gcc python3 python3-pip openjdk-17-jdk golang && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 7000
CMD ["npm", "start"]