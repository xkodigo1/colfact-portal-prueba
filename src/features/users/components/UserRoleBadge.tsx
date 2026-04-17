import { Badge } from '@/components/ui/Badge';
import type { UserRole } from '@/types/auth.types';

interface UserRoleBadgeProps {
  role: UserRole;
}

const roleToneMap: Record<UserRole, 'primary' | 'warning' | 'neutral'> = {
  Admin: 'primary',
  Issuer: 'warning',
  IssuerViewer: 'neutral',
};

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  return <Badge tone={roleToneMap[role]}>{role}</Badge>;
};
