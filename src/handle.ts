import * as fs from 'fs/promises';

export class Handle {
    async handle(message: any): Promise<any> {
        let result = {};

        // Utility function to normalize strings
        const normalizeString = (str: string): string =>
            str.toLowerCase().replace(/\s+/g, '');

        // Read and parse groups.json safely
        const readGroupsFile = async (): Promise<any> => {
            try {
                const data = await fs.readFile('./groups.json', 'utf8');
                return JSON.parse(data);
            } catch (err) {
                console.error('Error reading groups.json:', err);
                return { Groups: [] }; // Default empty structure if file doesn't exist or is malformed
            }
        };

        // Write data back to groups.json safely
        const writeGroupsFile = async (data: any): Promise<void> => {
            try {
                await fs.writeFile('./groups.json', JSON.stringify(data, null, 2));
                console.log('groups.json updated successfully');
            } catch (err) {
                console.error('Error writing to groups.json:', err);
                throw new Error('Failed to update groups.json');
            }
        };

        // Handle LoginRequest
        if ('LoginRequest' in message) {
            const loginRequest = {
                GroupName: normalizeString(message.LoginRequest.GroupName),
                GroupPassword: normalizeString(message.LoginRequest.GroupPassword),
                Name: normalizeString(message.LoginRequest.Name),
            };

            const groupsData = await readGroupsFile();

            const matchingGroup = groupsData.Groups.find((group: any) => {
                return (
                    normalizeString(group.GroupName) === loginRequest.GroupName &&
                    normalizeString(group.GroupPassword) === loginRequest.GroupPassword &&
                    group.names.map(normalizeString).includes(loginRequest.Name)
                );
            });

            if (matchingGroup) {
                console.log('Login successful for:', loginRequest.Name);
                result = {
                    LoginSuccessful: matchingGroup.GroupName,
                    Name: loginRequest.Name,
                    Password: loginRequest.GroupPassword,
                };
            } else {
                console.log('Invalid login credentials for:', loginRequest.Name);
                result = { InvalidCredentials: true };
            }
        }

        // Handle SignupRequest
        else if ('SignupRequest' in message) {
            const signupRequest = {
                GroupName: normalizeString(message.SignupRequest.GroupName),
                GroupPassword: normalizeString(message.SignupRequest.GroupPassword),
                Names: message.SignupRequest.Names.map(normalizeString),
            };

            const groupsData = await readGroupsFile();

            const groupExists = groupsData.Groups.some((group: any) =>
                normalizeString(group.GroupName) === signupRequest.GroupName
            );

            if (groupExists) {
                console.log('Group already exists:', message.SignupRequest.GroupName);
                result = { GroupAlreadyExists: true };
            } else {
                groupsData.Groups.push({
                    GroupName: message.SignupRequest.GroupName, // Keep original case
                    GroupPassword: message.SignupRequest.GroupPassword,
                    names: message.SignupRequest.Names,
                });

                await writeGroupsFile(groupsData);
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
