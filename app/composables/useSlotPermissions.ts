import type { SlotConfig } from "~/shared/types/slots";

export const useSlotPermissions = () => {
	const user = useUser();

	const hasPermission = (permission: string): boolean => {
		if (!user.value) return false;

		const userPermissions = (user.value as any).permissions || [];
		return userPermissions.includes(permission) || userPermissions.includes("*");
	};

	const hasAnyPermission = (permissions: string[]): boolean => {
		return permissions.some((p) => hasPermission(p));
	};

	const hasAllPermissions = (permissions: string[]): boolean => {
		return permissions.every((p) => hasPermission(p));
	};

	const canAccessSlot = (slot: SlotConfig): boolean => {
		if (!slot.permissions || slot.permissions.length === 0) return true;
		return hasAnyPermission(slot.permissions);
	};

	const filterAccessibleSlots = (slots: SlotConfig[]): SlotConfig[] => {
		return slots.filter((slot) => canAccessSlot(slot));
	};

	return {
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		canAccessSlot,
		filterAccessibleSlots,
	};
};
