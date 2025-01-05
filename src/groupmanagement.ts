import * as fs from 'fs/promises';
import { readGroupsFile, writeGroupsFile } from './filemanagement';

function deleteGroup(groupId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const groupsData = await readGroupsFile();
            const groupIndex = groupsData.Groups.findIndex((group: any) => group.id === groupId);
            if (groupIndex === -1) {
                throw new Error('Group not found');
            }
            groupsData.Groups.splice(groupIndex, 1);
            await writeGroupsFile(groupsData);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

export { deleteGroup };