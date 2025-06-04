interface HasRoleProps{
    userRoles: string[] | null;
    requiredRole: string;
}
export const hasRole = ({userRoles,requiredRole}:HasRoleProps) => {
    if (!userRoles || !Array.isArray(userRoles)) {
        return false;
    }
    return userRoles.includes(requiredRole);
};