export function requireAuth(user) {
    if (!user) {
        return {
            success: false,
            message: "Unauthorized"
        };
    }

    return null;
}

export function requireRole(user, roles = []) {
    if (!user) {
        return {
            success: false,
            message: "Unauthorized"
        };
    }

    if (!roles.includes(user.role)) {
        return {
            success: false,
            message: "Forbidden"
        };
    }

    return null;
}
