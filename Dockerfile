
FROM node:16

# TODO - the entrypoint != the WORKDIR currently - working on that
WORKDIR /myapp

# Use google-chrome-stable
# Based on https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN  apt update \
  && apt install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt update \
  && apt upgrade -y \
  && apt install -y \
    google-chrome-stable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# # Chrome dependencies derived from the output of
# #   `ldd ./node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome | grep not`
# RUN apt update \
#   && \
#   apt upgrade -y \
#   && \
#   apt install -y \
#     libnss3 \
#     libnspr4 \
#     libatk1.0-0 \
#     libatk-bridge2.0-0 \
#     libcups2 \
#     libdrm2 \
#     libdbus-1-3 \
#     libxcomposite1 \
#     libxdamage1 \
#     libxfixes3 \
#     libxkbcommon0 \
#     libxrandr2 \
#     libgbm1 \
#     libasound2 \
#     libatspi2.0-0 \
#     # Needed by older Chromium only
#     libx11-xcb1 \
#     libxshmfence1 \
#   && \
#   apt purge --auto-remove -y

RUN mkdir output
ADD package.json app content ./
#`npm ci` with a lockfile is preferable for production, but `npm install` allows fast iteration
#ADD package-lock.json ./
#RUN npm ci
RUN npm install
RUN node node_modules/puppeteer/install.js
# RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium  // only if using puppeteer's Chrome
ENTRYPOINT ["nodejs", "/myapp/app/app.js"]
