# GoalVision AI backend — full image with Node.js + Python so the IBM Docling
# document-intelligence endpoints (/api/docling/*) work in production.
#
# The default Render `node` runtime has no Python, so Docling degrades to a
# JSON error there. Deploy with this Dockerfile (render.yaml: runtime: docker)
# to enable real Docling extraction.
FROM node:20-bookworm-slim

# Python 3 + pip for the Docling extraction script.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (cached layer). Docling pulls heavy ML models;
# allow a generous build. Use a venv so `python3` resolves the packages.
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Node deps.
COPY package.json package-lock.json ./
RUN npm install

# App source.
COPY . .

ENV PORT=4000
EXPOSE 4000
CMD ["npm", "start"]
