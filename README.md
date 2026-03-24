<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ee61cb41-dda1-441f-8025-9ed936ef82f6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Optional Google SSO setup in [.env.local](.env.local):
   - `VITE_ENABLE_GOOGLE_AUTH=true`
   - `VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>`
   - If not set, the app uses local mock login in development.
4. Run the app:
   `npm run dev`
