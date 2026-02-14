# Phase 0 - Development Environment Setup

## Overview
Phase 0 focused on preparing the Parrot OS development environment with all necessary tools for Azure cloud development, including Azure CLI, Node.js, Git, and text editors.

---

## Objectives

- [x] Install Azure CLI for cloud resource management
- [x] Install Node.js and npm for JavaScript development
- [x] Configure Git for version control
- [x] Set up text editors (nano/vim)
- [x] Verify internet connectivity and system requirements

---

## System Information

**Operating System:** Parrot OS Linux (MATE Desktop)  
**Username:** saisugeet  
**Project Directory:** ~/Desktop/Azure-Community-Risk-Intelligence  
**Starting Point:** Fresh system with minimal tools installed

---

## Tools Installed

### 1. Azure CLI
**Purpose:** Manage Azure resources from command line  
**Installation Method:** Microsoft official script  
**Command:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**Verification:**
```bash
az --version
# Output: azure-cli 2.x.x
```

**Why Needed:**
- Create Azure resources programmatically
- Deploy infrastructure as code
- Automate cloud operations
- Access Azure services without GUI

---

### 2. Node.js and npm
**Purpose:** JavaScript runtime for development tools  
**Installation Method:** System package manager  
**Command:**
```bash
sudo apt update
sudo apt install nodejs npm -y
```

**Verification:**
```bash
node --version  # v14.x or higher
npm --version   # 6.x or higher
```

**Why Needed:**
- Static Web Apps CLI requires Node.js
- Package management for frontend tools
- JavaScript build tools and dependencies

---

### 3. Git
**Purpose:** Version control system  
**Installation:** Usually pre-installed on Parrot OS  
**Configuration:**
```bash
git config --global user.name "Sai Sugeet"
git config --global user.email "saisugeet2004@gmail.com"
```

**Verification:**
```bash
git --version
git config --list
```

**Why Needed:**
- Track project changes over time
- Collaborate and version documentation
- Required for GitHub integration
- Best practice for all software projects

---

### 4. Text Editors
**Installed:** nano (primary), vim (backup)  
**Status:** Pre-installed on Parrot OS

**Basic nano Usage:**
```bash
nano filename.txt
# Ctrl+O = Save
# Ctrl+X = Exit
# Ctrl+K = Cut line
# Ctrl+U = Paste
```

---

## Environment Verification Checklist

Before starting Phase 1, verified:

- [x] Internet connectivity working
- [x] Azure CLI installed and functional
- [x] Node.js and npm available
- [x] Git configured with user details
- [x] Terminal access working
- [x] Sufficient disk space (~10 GB free)
- [x] Text editor functional

---

## Azure Account Setup

**Account Type:** Personal Microsoft Account  
**Subscription:** Azure Free Tier / Pay-as-you-go  
**Region Preference:** East Asia (closest to India)

**Portal Access:** https://portal.azure.com  
**Subscription ID:** fdc6d48e-5fc6-4415-9cdb-85ac0e40fedb

**Free Tier Benefits:**
- 12 months free services
- $200 credit (first 30 days)
- Always-free services (Functions, Storage, Database)

---

## Directory Structure Preparation

**Created Project Root:**
```bash
mkdir -p ~/Desktop/Azure-Community-Risk-Intelligence
cd ~/Desktop/Azure-Community-Risk-Intelligence
```

**Why Desktop Location:**
- Easy access from file manager
- Quick navigation
- Visible in GUI environment
- Standard location for active projects

---

## Network Configuration

**Verified:**
- Public internet access available
- DNS resolution working
- No proxy configuration needed
- IPv4 address available (required for Azure SQL firewall)

**IP Address Check:**
```bash
curl -4 ifconfig.me
# Output: Public IPv4 address
```

---

## Lessons Learned

### What Worked Well:
✅ Official Azure CLI installer worked perfectly  
✅ Parrot OS had most tools pre-installed  
✅ Terminal-based workflow efficient for cloud ops  

### Challenges Faced:
⚠️ None in Phase 0 - smooth setup process

### Best Practices Established:
✅ Always verify installations before proceeding  
✅ Document version numbers for reproducibility  
✅ Configure Git before making commits  
✅ Use official installation methods when available  

---

## Time Investment

**Total Time:** 30-45 minutes  
**Breakdown:**
- Azure CLI installation: 10 minutes
- Tool verification: 5 minutes
- Azure account setup: 15 minutes
- Directory preparation: 5 minutes
- Testing and validation: 10 minutes

---

## Commands Summary
```bash
# Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az --version
az login

# Node.js
sudo apt update
sudo apt install nodejs npm -y
node --version
npm --version

# Git configuration
git config --global user.name "Sai Sugeet"
git config --global user.email "saisugeet2004@gmail.com"

# Project directory
mkdir -p ~/Desktop/Azure-Community-Risk-Intelligence
cd ~/Desktop/Azure-Community-Risk-Intelligence
```

---

## Phase 0 Status: ✅ COMPLETE

**Outcome:** Development environment fully configured and ready for Phase 1

**Next Phase:** Phase 1 - Project Structure & GitHub Setup

---

*Completed: Early February 2026*  
*Duration: 30-45 minutes*  
*Difficulty: Beginner-friendly*
