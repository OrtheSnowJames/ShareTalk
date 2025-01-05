#!/bin/bash

# Check if the script is being run inside a project directory
if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_project>"
    exit 1
fi

# Define the directory
PROJECT_DIR="$1"

# Find and remove all ._ files recursively
find "$PROJECT_DIR" -name '._*' -exec rm -f {} \;

echo "All macOS-specific files (starting with ._) have been removed from $PROJECT_DIR."
