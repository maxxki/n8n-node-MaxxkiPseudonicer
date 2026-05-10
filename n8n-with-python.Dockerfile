FROM n8nio/n8n:latest

USER root
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Ensure python3 is globally accessible via 'python3' command
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1

USER node
