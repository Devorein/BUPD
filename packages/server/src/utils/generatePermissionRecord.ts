import { IPermissionsRecord, TAccessApproval, TAccessPermission } from '@bupd/types';

export function generatePermissionRecord(permissions: string) {
	const permissionRecord: IPermissionsRecord = {};
	permissions.split(',').forEach((permissionApproval) => {
		const [permission, approval] = permissionApproval.split(' ');
		permissionRecord[permission as TAccessPermission] = parseInt(approval, 10) as TAccessApproval;
	});
	return permissionRecord;
}
