
1. Clone the repository:

   ```bash
   git clone https://github.com/2noScript/n8n-nodes-video-mzz
   cd n8n-nodes-video-mzz
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build the node (if applicable):

   ```bash
   bun run build
   ```

4. (Optional) Start in development mode:

   ```bash
   bun run dev
   ```

5. n8n Docker-compose

   ```
   version: "3.9"

   services:
   n8n:
       image: n8nio/n8n:latest
       container_name: n8n
       ports:
       - "5678:5678"
       environment:
       - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
       - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
       - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
       volumes:
       - ./n8n_data:/home/node/.n8n
       - {local_path}/n8n-nodes-video-mzz:/home/node/.n8n/custom/n8n-nodes-video-mzz

   ```

6. Start n8n
   ```bash
   docker compose up -d
   ```
7. Debug custom node
   ```bash
    docker restart n8n
   ```