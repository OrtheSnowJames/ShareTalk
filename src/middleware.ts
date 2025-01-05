import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';

const GROUPS_DIR = path.join(__dirname, 'groups');
const GROUPS_FILE = path.join(__dirname, '../groups.json');

let groupCache: string[] = [];

async function updateGroupCache() {
    try {
        const directories = await fs.readdir(GROUPS_DIR);
        groupCache = directories.filter(async (dir) => {
            const stat = await fs.stat(path.join(GROUPS_DIR, dir));
            return stat.isDirectory();
        });
    } catch (error) {
        console.error('Error updating group cache:', error);
    }
}

// Initial cache population
updateGroupCache();

// Update cache every 5 minutes
setInterval(updateGroupCache, 5 * 60 * 1000);

export function validateGroupAccess(req: Request, res: Response, next: NextFunction) {
    const requestedPath = req.path;
    const groupMatch = requestedPath.match(/\/groups\/([^\/]+)/);
    
    if (!groupMatch) {
        return next(); // Not a group request, continue
    }

    const requestedGroup = groupMatch[1];
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    if (!groupCache.includes(requestedGroup)) {
        return res.status(404).json({ error: 'Group not found' });
    }

    // Get stored token from localStorage for this group
    const storedToken = localStorage.getItem(`groupToken_${requestedGroup}`);
    if (token !== storedToken) {
        return res.status(403).json({ error: 'Invalid token for this group' });
    }

    next();
}

// Helper to check if a group exists
export async function groupExists(groupName: string): Promise<boolean> {
    try {
        await fs.access(path.join(GROUPS_DIR, groupName));
        return true;
    } catch {
        return false;
    }
}

// Helper to create a new group directory
export async function createGroupDirectory(groupName: string): Promise<void> {
    const groupPath = path.join(GROUPS_DIR, groupName);
    await fs.mkdir(groupPath, { recursive: true });
    await updateGroupCache(); // Update cache after creating new directory
}