export function requireRole(userRole, allowedRoles = []) {
  return allowedRoles.includes(userRole);
}
