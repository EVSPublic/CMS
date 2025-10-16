#!/bin/bash

# Configuration
PUBLISH_DIR="${PUBLISH_DIR:-/var/www/cms-api.oslosoft.tr}"
PROJECT_DIR="./backend"
PROJECT_FILE="AdminPanel.csproj"
CONFIGURATION="${CONFIGURATION:-Release}"
RUNTIME="${RUNTIME:-linux-x64}"
SERVICE_NAME="${SERVICE_NAME:-test-cms}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Building and Publishing Project ===${NC}"
echo -e "Project: ${PROJECT_DIR}/${PROJECT_FILE}"
echo -e "Configuration: ${CONFIGURATION}"
echo -e "Runtime: ${RUNTIME}"
echo -e "Publish Directory: ${PUBLISH_DIR}"
echo ""

# Check if we need sudo for publish directory
if [ ! -w "$(dirname "${PUBLISH_DIR}")" ] && [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Permission denied to write to ${PUBLISH_DIR}${NC}"
    echo -e "${YELLOW}Please run this script with sudo:${NC}"
    echo -e "  sudo ./build.sh"
    exit 1
fi

# Clean previous build
echo -e "${YELLOW}Cleaning previous build...${NC}"
rm -rf "${PUBLISH_DIR}"
mkdir -p "${PUBLISH_DIR}"

# Navigate to project directory
cd "${PROJECT_DIR}" || {
    echo -e "${RED}Error: Could not navigate to ${PROJECT_DIR}${NC}"
    exit 1
}

# Restore dependencies
echo -e "${YELLOW}Restoring dependencies...${NC}"
dotnet restore "${PROJECT_FILE}"
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to restore dependencies${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}Building project...${NC}"
dotnet build "${PROJECT_FILE}" --configuration "${CONFIGURATION}" --no-restore
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

# Publish the project
echo -e "${YELLOW}Publishing project...${NC}"
dotnet publish "${PROJECT_FILE}" \
    --configuration "${CONFIGURATION}" \
    --output "${PUBLISH_DIR}" \
    --runtime "${RUNTIME}" \
    --self-contained false
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Publish failed${NC}"
    exit 1
fi

# Return to root directory
cd ..

# Set proper ownership for the published files
if [ "$EUID" -eq 0 ]; then
    echo ""
    echo -e "${YELLOW}Setting ownership to www-data:www-data...${NC}"
    chown -R www-data:www-data "${PUBLISH_DIR}"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Ownership updated successfully${NC}"
    else
        echo -e "${RED}Warning: Failed to set ownership${NC}"
    fi
fi

# Restart the service if running as root
if [ "$EUID" -eq 0 ] && [ -n "${SERVICE_NAME}" ]; then
    echo ""
    echo -e "${YELLOW}Restarting service: ${SERVICE_NAME}${NC}"
    if systemctl restart "${SERVICE_NAME}"; then
        echo -e "${GREEN}Service restarted successfully${NC}"
        systemctl status "${SERVICE_NAME}" --no-pager -l
    else
        echo -e "${RED}Warning: Failed to restart service${NC}"
        echo -e "${YELLOW}You may need to restart it manually:${NC}"
        echo -e "  sudo systemctl restart ${SERVICE_NAME}"
    fi
fi

echo ""
echo -e "${GREEN}=== Build and Publish Completed Successfully ===${NC}"
echo -e "Published files are in: ${PUBLISH_DIR}"
echo ""
echo -e "To change the publish directory, set the PUBLISH_DIR environment variable:"
echo -e "  ${YELLOW}PUBLISH_DIR=/path/to/publish ./build.sh${NC}"
echo ""
echo -e "To change the configuration (Debug/Release):"
echo -e "  ${YELLOW}CONFIGURATION=Debug ./build.sh${NC}"
echo ""
echo -e "To change the runtime:"
echo -e "  ${YELLOW}RUNTIME=win-x64 ./build.sh${NC}"
echo ""
echo -e "To change the service name:"
echo -e "  ${YELLOW}SERVICE_NAME=my-service ./build.sh${NC}"
