import * as fs from 'fs/promises';

export async function readGroupsFile(): Promise<any> {
    try {
        const data = await fs.readFile('./groups.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading groups.json:', err);
        return { Groups: [] }; // Default empty structure if file doesn't exist or is malformed
    }
};

// Write data back to groups.json safely
export async function writeGroupsFile(data: any): Promise<void> {
    try {
        await fs.writeFile('./groups.json', JSON.stringify(data, null, 2));
        console.log('groups.json updated successfully');
    } catch (err) {
        console.error('Error writing to groups.json:', err);
        throw new Error('Failed to update groups.json');
    }
};

export async function writeFile(filePath: string, data: any): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`${filePath} updated successfully`);
    } catch (err) {
        console.error(`Error writing to ${filePath}:`, err);
        throw new Error(`Failed to update ${filePath}`);
    }
}

export async function readFile(filePath: string): Promise<any> {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return null;
    }
}

export async function deleteFile(filePath: string): Promise<void> {
    try {
        await fs.unlink(filePath);
        console.log(`${filePath} deleted successfully`);
    } catch (err) {
        console.error(`Error deleting ${filePath}:`, err);
        throw new Error(`Failed to delete ${filePath}`);
    }
}

export async function readDir(dirPath: string): Promise<string[]> {
    try {
        return await fs.readdir(dirPath);
    } catch (err) {
        console.error(`Error reading directory ${dirPath}:`, err);
        return [];
    }
}