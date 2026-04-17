import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { UserRole } from '@/types/auth.types';

interface UsersFiltersProps {
  isActive?: boolean;
  role?: UserRole;
  search: string;
  setIsActive: (value?: boolean) => void;
  setRole: (value?: UserRole) => void;
  setSearch: (value: string) => void;
}

export const UsersFilters = ({
  isActive,
  role,
  search,
  setIsActive,
  setRole,
  setSearch,
}: UsersFiltersProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-[1.8fr_repeat(2,minmax(0,1fr))]">
      <Input
        id="search"
        label="Buscar usuario"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Nombre, identificación o username"
        value={search}
      />
      <Select
        id="role"
        label="Rol"
        onChange={(event) => setRole((event.target.value || undefined) as UserRole | undefined)}
        value={role ?? ''}
      >
        <option value="">Todos</option>
        <option value="Admin">Admin</option>
        <option value="Issuer">Issuer</option>
        <option value="IssuerViewer">IssuerViewer</option>
      </Select>
      <Select
        id="isActive"
        label="Estado"
        onChange={(event) => {
          if (event.target.value === '') {
            setIsActive(undefined);
            return;
          }

          setIsActive(event.target.value === 'true');
        }}
        value={typeof isActive === 'boolean' ? String(isActive) : ''}
      >
        <option value="">Todos</option>
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </Select>
    </div>
  );
};
