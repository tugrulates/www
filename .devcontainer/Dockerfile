ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# Install additional OS dependencies.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends graphicsmagick

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"

# Install zola
RUN wget -q -O - "https://github.com/getzola/zola/releases/download/v0.16.1/zola-v0.16.1-x86_64-unknown-linux-gnu.tar.gz" | tar xzf - -C /usr/local/bin
