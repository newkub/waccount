import { getWorkOS, getWorkOSClientId } from "../integrations/workos";
import type { User } from '../../shared/types';
import { mapWorkOSUserToUser } from "./user";
import { callWorkOS } from "./api";
import type { H3Event } from 'h3';

export const refreshSession = async (refreshToken: string) => {
    const workos = getWorkOS();
    const result = await callWorkOS(
        () => workos.userManagement.authenticateWithRefreshToken({
            clientId: getWorkOSClientId(),
            refreshToken,
        }),
        "Failed to refresh session"
    );
    return {
        user: mapWorkOSUserToUser(result.user),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    };
};

export const clearAuthCookies = (event: H3Event) => {
    deleteCookie(event, "workos-session");
    deleteCookie(event, "workos-refresh");
    deleteCookie(event, "user-id");
};

export const setAuthCookies = (event: H3Event, userId: string, accessToken: string, refreshToken?: string) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
    };

    setCookie(event, "user-id", userId, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 }); // 30 days

    setCookie(event, "workos-session", accessToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 }); // 7 days

    if (refreshToken) {
        setCookie(event, "workos-refresh", refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 }); // 30 days
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

export const authenticateWithCode = async (code: string) => {
    const workos = getWorkOS();
    const result = await callWorkOS(
        () => workos.userManagement.authenticateWithCode({
            clientId: getWorkOSClientId(),
            code,
        }),
        'Failed to authenticate with OAuth provider'
    );
    return {
        user: mapWorkOSUserToUser(result.user),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    };
};

export const getAuthorizationUrl = (provider: string) => {
    const workos = getWorkOS();
    const clientId = getWorkOSClientId();
    const config = useRuntimeConfig();
    return { 
        authorizationUrl: workos.userManagement.getAuthorizationUrl({
            clientId,
            provider,
            redirectUri: config.workosRedirectUri,
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
