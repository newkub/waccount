import { getWorkOS, getWorkOSClientId } from "../integrations/workos";
import { mapWorkOSUserToUser } from "./user";

const callWorkOS = async <T>(apiCall: () => Promise<T>, errorMessage: string): Promise<T> => {
    try {
        return await apiCall();
    } catch (err: unknown) {
        console.error(`WorkOS Error: ${errorMessage}`, err);
        const message = err instanceof Error ? err.message : errorMessage;
        throw new Error(message);
    }
};

export const signInWithPassword = async (email: string, password: string) => {
    const workos = getWorkOS();
    const result = await callWorkOS(
        () => workos.userManagement.authenticateWithPassword({
            clientId: getWorkOSClientId(),
            email,
            password,
        }),
        "Failed to sign in with password"
    );
    return {
        user: mapWorkOSUserToUser(result.user),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    };
};

export const signUpWithPassword = async (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => {
    const workos = getWorkOS();
    const result = await callWorkOS(
        () => workos.userManagement.createUser({
            email,
            password,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            emailVerified: false,
        }),
        "Failed to create account"
    );
    return {
        user: mapWorkOSUserToUser(result),
        message: "Account created successfully. Please verify your email.",
    };
};

export const getAuthorizationUrl = (provider: string) => {
    const workos = getWorkOS();
    const clientId = getWorkOSClientId();
    return { 
        authorizationUrl: workos.userManagement.getAuthorizationUrl({
            clientId,
            provider,
            redirectUri: process.env.WORKOS_REDIRECT_URI || "",
        })
    };
};

export const sendMagicLink = (email: string) => {
    const workos = getWorkOS();
    return callWorkOS(
        () => workos.userManagement.sendMagicAuthCode({ email }),
        "Failed to send magic link"
    ).then(() => ({ success: true }));
};

export const verifyMagicLink = async (token: string) => {
    const workos = getWorkOS();
    const result = await callWorkOS(
        () => workos.userManagement.authenticateWithCode({
            clientId: getWorkOSClientId(),
            code: token,
        }),
        "Invalid or expired magic link"
    );
    return {
        user: mapWorkOSUserToUser(result.user),
        accessToken: result.accessToken,
    };
};

export const verifyEmail = (token: string, userId: string) => {
    const workos = getWorkOS();
    return callWorkOS(
        () => workos.userManagement.verifyEmail({ userId, code: token }),
        "Failed to verify email"
    ).then(() => ({ success: true }));
};

export const getUserById = async (userId: string) => {
    const workos = getWorkOS();
    const user = await callWorkOS(
        () => workos.userManagement.getUser(userId),
        "Failed to fetch user"
    );
    return mapWorkOSUserToUser(user);
};
