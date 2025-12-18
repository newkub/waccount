import { getWorkOS } from "../integrations/workos";
import type { User as WorkOSUser } from "@workos-inc/node";
import type { UpdateProfileData, User } from "~/shared/types";
import { callWorkOS } from "./api";

export const mapWorkOSUserToUser = (workosUser: WorkOSUser): User => ({
    id: workosUser.id,
    email: workosUser.email,
    firstName: workosUser.firstName,
    lastName: workosUser.lastName,
    emailVerified: workosUser.emailVerified,
    avatar: workosUser.profilePictureUrl,
    createdAt: workosUser.createdAt,
    updatedAt: workosUser.updatedAt,
});

export const getUserProfile = async (userId: string) => {
    const workos = getWorkOS();
    const user = await callWorkOS(
        () => workos.userManagement.getUser(userId),
        "Failed to fetch user profile"
    );
    return mapWorkOSUserToUser(user);
};

export const updateUserProfile = async (userId: string, data: UpdateProfileData) => {
    const workos = getWorkOS();
    const user = await callWorkOS(
        () => workos.userManagement.updateUser({
            userId,
            firstName: data.firstName,
            lastName: data.lastName,
            ...(data.avatar && { profilePictureUrl: data.avatar }),
        }),
        "Failed to update profile"
    );
    return mapWorkOSUserToUser(user);
};

export const deleteUserAccount = (userId: string) => {
    const workos = getWorkOS();
    return callWorkOS(
        () => workos.userManagement.deleteUser(userId),
        "Failed to delete account"
    ).then(() => ({ success: true }));
};

export const sendPasswordResetEmail = (email: string, passwordResetUrl: string) => {
    const workos = getWorkOS();
    return callWorkOS(
        () => workos.userManagement.sendPasswordResetEmail({ email, passwordResetUrl }),
        "Failed to send password reset email"
    ).then(() => ({ success: true }));
};

export const sendVerificationEmail = (userId: string) => {
    const workos = getWorkOS();
    return callWorkOS(
        () => workos.userManagement.sendVerificationEmail({ userId }),
        "Failed to send verification email"
    ).then(() => ({ success: true }));
};
