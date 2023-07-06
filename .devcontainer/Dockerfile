ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# Install additional OS dependencies.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends chromium graphicsmagick


# Install global node modules
RUN su node -c "npm install -g netlify-cli@12.0 onchange"

# Install zola
RUN export ZOLA=`case $(arch) in \
        aarch64) echo "https://github.com/tugrulates/zola-aarch64-linux/releases/download/v0.17.2/zola-aarch64-linux.tar.gz" ;; \
        *) echo "https://github.com/getzola/zola/releases/download/v0.17.2/zola-v0.17.2-x86_64-unknown-linux-gnu.tar.gz" ;; esac` && \
    wget -q -O - "${ZOLA}" | tar xzf - -C /usr/local/bin && \
    zola --version
