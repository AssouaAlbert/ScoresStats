FROM ghcr.io/puppeteer/puppeteer:20.8.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \ PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \ PORT=3000 \
    MONGO_DB='mongodb+srv://assouaalbert:3yro9BmtUfsHCUV6@livescoredaily.sfskfgg.mongodb.net/dailystats?retryWrites=true&w=majority' \
    AUTH_EMAIL=sylvoalberto@gmail.com \
    AUTH_PASS_APP=jktflstcrgopnwpc

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
COPY . .
CMD ["node", "index.js"]