import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { createGroupDirectory, groupExists } from './middleware';

export class Handle {
    private groupsFilePath: string;

    constructor() {
        this.groupsFilePath = path.join(__dirname, '../groups.json');
    }

    private async ensureGroupsFile(): Promise<void> {
        try {
            await fs.access(this.groupsFilePath);
        } catch {
            // File doesn't exist, create it with default structure
            await fs.writeFile(this.groupsFilePath, JSON.stringify({ Groups: [], Banned: [] }, null, 2));
        }
    }

    private async readGroupsFile(): Promise<any> {
        await this.ensureGroupsFile();
        try {
            const data = await fs.readFile(this.groupsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading groups.json:', err);
            return { Groups: [], Banned: [] };
        }
    }

    private async writeGroupsFile(data: any): Promise<void> {
        try {
            await fs.writeFile(this.groupsFilePath, JSON.stringify(data, null, 2), { flag: 'w' });
        } catch (err) {
            console.error('Error writing to groups.json:', err);
            throw new Error('Failed to update groups.json');
        }
    }

    async handle(message: any): Promise<any> {
        console.log('Handling message:', message);

        let result = {};

        // Utility function to normalize strings
        const normalizeString = (str: string): string =>
            str.toLowerCase().replace(/\s+/g, '');

        // Handle LoginRequest
        if ('LoginRequest' in message) {
            const loginRequest = {
                GroupName: normalizeString(message.LoginRequest.GroupName),
                GroupPassword: normalizeString(message.LoginRequest.GroupPassword),
                Name: normalizeString(message.LoginRequest.Name),
            };

            const groupsData = await this.readGroupsFile();

            const groupIsBanned = groupsData.Banned.includes(loginRequest.GroupName);

            if (groupIsBanned) {
                console.log('Group is banned:', loginRequest.GroupName);
                result = { GroupIsBanned: loginRequest.GroupName };
            } else {
                const matchingGroup = groupsData.Groups.find((group: any) => {
                    return (
                        normalizeString(group.GroupName) === loginRequest.GroupName &&
                        normalizeString(group.GroupPassword) === loginRequest.GroupPassword &&
                        group.names.map(normalizeString).includes(loginRequest.Name)
                    );
                });

                if (matchingGroup) {
                    const token = crypto.randomBytes(32).toString('hex');
                    console.log('Login successful for:', loginRequest.Name);
                    result = {
                        LoginSuccessful: matchingGroup.GroupName,
                        Name: loginRequest.Name,
                        Password: loginRequest.GroupPassword,
                        token: token
                    };
                } else {
                    console.log('Invalid login credentials for:', loginRequest.Name);
                    result = { InvalidCredentials: true };
                }
            }
        }

        // Handle SignupRequest
        else if ('SignupRequest' in message) {
            const signupRequest = {
                GroupName: normalizeString(message.SignupRequest.GroupName),
                GroupPassword: normalizeString(message.SignupRequest.GroupPassword),
                Names: message.SignupRequest.Names.map(normalizeString),
            };

            const groupsData = await this.readGroupsFile();
            
            const groupExistsInJson = groupsData.Groups.some((group: any) => 
                normalizeString(group.GroupName) === signupRequest.GroupName
            );

            const groupIsBanned = groupsData.Banned.includes(signupRequest.GroupName);

            if (groupExistsInJson || groupIsBanned) {
                console.log('Group already exists or is banned:', message.SignupRequest.GroupName);
                result = { GroupAlreadyExistsOrBanned: message.SignupRequest.GroupName };
            } else {
                groupsData.Groups.push({
                    GroupName: message.SignupRequest.GroupName, // Keep original case
                    GroupPassword: message.SignupRequest.GroupPassword,
                    names: message.SignupRequest.Names,
                });

                await this.writeGroupsFile(groupsData);
                await createGroupDirectory(message.SignupRequest.GroupName);
                console.log('New group created:', message.SignupRequest.GroupName);
                result = { GroupMade: true };
            }
        }

        // Handle unknown request type
        else {
            console.error('Unknown request type:', message);
            result = { Error: 'Unknown request type' };
        }

        return result;
    }
}