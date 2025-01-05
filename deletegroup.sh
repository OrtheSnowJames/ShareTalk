#!/bin/bash

# Check if the script is run as sudo
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root to get red button for deleting groups"
    exit 1
fi

# Check if at least one argument is supplied
if [ "$#" -lt 1 ]; then
    echo "Usage:$ sudo/# deletegroup.sh groupname [--ban]"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install sox if it is not installed
if ! command_exists sox; then
    echo "sox is not installed. Installing sox..."

    if command_exists brew; then
        brew install sox
    elif command_exists apt; then
        sudo apt update && sudo apt install -y sox
    elif command_exists yum; then
        sudo yum install -y sox
    elif command_exists zypper; then
        sudo zypper install -y sox
    elif command_exists pacman; then
        sudo pacman -Sy sox
    elif command_exists apk; then
        apk add sox
    else
        echo "No known package manager found. Please install sox manually."
        exit 1
    fi
fi

# Prompt the user for confirmation
if play -n synth 2 sine 880 vol 0.5 fade h 0.1 2 0.1 2>/dev/null; then
    read -p "Are you sure you want to swing the banhammer on the group / delete the group '$1'? [y/n]: " confirm
else
    read -p "Are you sure you want to swing the banhammer on the group / delete the group '$1'? [y/n]: " confirm
fi

if [[ "$confirm" != [yY] ]]; then
    echo "Group deletion cancelled."
    exit 1
fi

# Check if the --ban flag is provided
if [[ "$2" == "--ban" ]]; then
    # Node.js script to ban group name in groups.json
    node -e "
    const fs = require('fs');
    const path = require('path');

    const groupName = '$1';
    const jsonFilePath = path.join(__dirname, 'groups.json');

    // Add group to banned list in groups.json
    if (fs.existsSync(jsonFilePath)) {
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        if (!data.Banned.includes(groupName)) {
            data.Banned.push(groupName);
            fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
            console.log(\`Banned group: \${groupName}\`);
        } else {
            console.log(\`Group already banned: \${groupName}\`);
        }
    } else {
        console.log('groups.json file not found');
    }
    "
    echo "Group '$1' banned successfully."
    exit 0
fi

# Proceed with group deletion
groupdel "$1"
if [ $? -eq 0 ] || grep -q "\"GroupName\": \"$1\"" groups.json; then
    # Node.js script to delete group name in groups/, grpsrc/ and groups.json
    node -e "
    const fs = require('fs');
    const path = require('path');

    const groupName = '$1';
    const directories = ['groups', 'grpsrc'];
    const jsonFilePath = path.join(__dirname, 'groups.json');

    // Delete group directories
    directories.forEach(dir => {
        const dirPath = path.join(__dirname, dir, groupName);
        if (fs.existsSync(dirPath)) {
            fs.rmdirSync(dirPath, { recursive: true });
            console.log(\`Deleted directory: \${dirPath}\`);
        } else {
            console.log(\`Directory not found: \${dirPath}\`);
        }
    });

    // Delete group entry from groups.json
    if (fs.existsSync(jsonFilePath)) {
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        if (data.Groups && Array.isArray(data.Groups)) {
            const index = data.Groups.findIndex(group => group.GroupName === groupName);
            if (index > -1) {
                data.Groups.splice(index, 1);
                fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
                console.log(\`Deleted group from JSON: \${groupName}\`);
            } else {
                console.log(\`Group not found in JSON: \${groupName}\`);
            }
        } else {
            console.log('Invalid JSON format in groups.json');
        }
    } else {
        console.log('groups.json file not found');
    }
    "
    echo "Group '$1' deleted successfully."
else
    echo "Failed to delete group '$1'."
    exit 1
fi
