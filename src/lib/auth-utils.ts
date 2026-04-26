export const SUPER_ADMIN_EMAIL = "mehwishsheikh451sheikh@gmail.com";

// Additional hardcoded admins if needed
export const HARDCODED_ADMINS = [
  "mehwishsheikh451sheikh@gmail.com",
];

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  CO_ADMIN = "co_admin",
  USER = "user",
}

/**
 * Utility to check user roles based on email or metadata.
 * Mehwish is the Super Admin who handles all pages.
 */
export function getUserRole(email?: string | null, publicMetadata?: any): UserRole {
  if (email === SUPER_ADMIN_EMAIL) return UserRole.SUPER_ADMIN;
  
  if (email && HARDCODED_ADMINS.includes(email)) return UserRole.CO_ADMIN;
  
  // Use metadata if available (set by super admin via dashboard)
  if (publicMetadata?.role === UserRole.CO_ADMIN || publicMetadata?.role === "admin") return UserRole.CO_ADMIN;
  
  return UserRole.USER;
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.CO_ADMIN;
}
