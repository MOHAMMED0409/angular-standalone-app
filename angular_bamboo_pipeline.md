
## Angular Deployment Pipeline – Bamboo CI/CD Documentation

### Project Overview
This document outlines the setup and execution of a CI/CD pipeline using **Atlassian Bamboo** to build and deploy an Angular application to a **local Apache web server** hosted at `127.0.0.1`.

---

### Project Structure
- **Source Code**: Angular App
- **CI Tool**: Bamboo
- **Web Server**: Apache (local)
- **Deployment Target**: `/var/www/html`
- **User**: `your_username`
- **Build Output**: `dist/angular-standalone-app/`

---

### Pipeline Configuration

#### Plan Name:
`Angular CI/CD`

#### Stages & Jobs:
```
Install  →  Build  →  Test  →  Deploy
```

---

### Step-by-Step Setup

#### 1. Source Repository
- Connect Bamboo to the Git repository containing the Angular app.

#### 2. Create Build Plan
- Create a new plan in Bamboo.
- Define one stage per task (Install, Build, Test, Deploy).

---

### 3. Install Job
**Script Task – Install Node Modules**
```bash
#!/bin/bash
cd angular-standalone-app
npm ci || npm install
```

---

### 4. Build Job
**Script Task – Angular Build**
```bash
#!/bin/bash
cd angular-standalone-app
npm run build
```

---

### 5. Test Job (Optional)
```bash
#!/bin/bash
cd angular-standalone-app
npm run test -- --watch=false
```

---

### 6. Artifact Setup
Under **Artifacts**, define:

- **Name**: `Deploy`
- **Location**: `angular-standalone-app/dist/angular-standalone-app`
- **Copy Pattern**: `**/*`
- **Shared**: Yes
- **Required**: Yes

---

### 7. Deploy Job

#### Deploy Script (SCP and SSH)
```bash
#!/bin/bash
set -e

echo "===== Deploy Script Started ====="
BUILD_DIR="/home/your_username/bamboo-agent-home/xml-data/build-dir/PROJECTKEY-JOBKEY/dist/angular-standalone-app"

# Validate build dir
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory not found"
  exit 1
fi

echo "Copying files..."
scp -r "$BUILD_DIR"/* your_username@127.0.0.1:/var/www/html

echo "Files copied. Verifying..."
ssh your_username@127.0.0.1 "ls -l /var/www/html"

echo "===== Deploy Script Finished ====="
```
> Replace `PROJECTKEY-JOBKEY` with your Bamboo plan & job key.

---

### SSH Setup – Passwordless Access
On **Bamboo Agent**:
```bash
ssh-keygen -t rsa -b 2048 -N "" -f ~/.ssh/id_rsa
ssh-copy-id your_username@127.0.0.1
```

---

### Common Errors & Fixes

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `Node packages may not be installed` | `node_modules/` missing | Add `npm install` task |
| `Could not find '@angular-devkit'` | Missing build packages | Ensure `@angular-devkit/build-angular` is installed |
| `Failing as no matching files found` | Artifact path wrong | Double-check `dist/` path in Artifact settings |
| `scp: Permission denied` | No write access to `/var/www/html` | Run: `sudo chown -R your_username:your_username /var/www/html` on the server |
| `ssh: Permission denied (publickey)` | SSH key not copied | Run `ssh-copy-id your_username@127.0.0.1` |

---

### Accessing the App
If the Angular app was deployed to `/var/www/html`, access it via:
```url
http://127.0.0.1/
```

If deployed under a subfolder (like `browser/`):
```url
http://127.0.0.1/browser/
```

---

### Final Checklist
- [x] Bamboo plan has all 4 stages
- [x] SSH keys copied to the server
- [x] Apache or Nginx installed and running
- [x] Angular build generates output in `dist/`
- [x] Deploy stage pushes files successfully
