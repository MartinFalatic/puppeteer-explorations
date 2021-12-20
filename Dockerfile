
FROM node:16

# TODO - the entrypoint != the WORKDIR currently - working on that
WORKDIR /myapp

RUN apt update \
  && \
  apt-get upgrade -y \
  && \
  apt install -y \
    # Chrome dependencies derived from the output of
    #   `ldd ./node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome | grep not`
    # A different trick is to install `deb http://dl.google.com/linux/chrome/deb/ stable main` and
    # let that install its dependencies
    #   (thread at https://community.linuxmint.com/tutorial/view/1774 et al.)
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatspi2.0-0 \
  && \
  apt purge --auto-remove -y

    COPY package.json .
    COPY package-lock.json .
    RUN npm ci
    RUN node node_modules/puppeteer/install.js
    RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium
    #COPY app.js .
    ENTRYPOINT ["nodejs", "/opt/app/app.js"]
