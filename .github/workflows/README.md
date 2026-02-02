# GitHub Actions Deployment to Azure App Service

This workflow deploys your static HTML/JS website to Azure App Service.

## Setup Instructions:

1. **Create an Azure App Service** in the Azure Portal:
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "App Service" (Web App)
   - Runtime stack: Choose any (e.g., Node.js, Python, or .NET)
   - For static sites, the runtime doesn't matter much
   
2. **Download the publish profile:**
   - Go to your App Service in Azure Portal
   - Click "Download publish profile"
   - Save the XML content

3. **Add GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `AZURE_WEBAPP_NAME`: Your Azure App Service name
     - `AZURE_WEBAPP_PUBLISH_PROFILE`: Paste the publish profile XML content

4. **Deploy:**
   - Push to main branch to trigger automatic deployment
   - Or manually trigger from Actions tab → "Deploy to Azure App Service" → Run workflow

## How it works:
- Creates a ZIP package of your site (excluding .git, .github, and .md files)
- Deploys to Azure App Service using the publish profile
- Runs on every push to main branch or manual trigger
