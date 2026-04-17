import { Badge } from '@/components/ui/Badge';

interface UserStatusBadgeProps {
  isActive: boolean;
}

export const UserStatusBadge = ({ isActive }: UserStatusBadgeProps) => {
  return <Badge tone={isActive ? 'success' : 'danger'}>{isActive ? 'Activo' : 'Inactivo'}</Badge>;
};
