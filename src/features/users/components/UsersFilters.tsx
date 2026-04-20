import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { UserRole } from '@/types/auth.types';

const ROLE_ALL_VALUE = 'all';
const STATUS_ALL_VALUE = 'all';

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
  // Usamos valores sentinela para que el Select maneje siempre strings;
  // luego los traducimos a undefined/boolean para la API.
  const roleValue = role ?? ROLE_ALL_VALUE;
  const statusValue = typeof isActive === 'boolean' ? (isActive ? 'active' : 'inactive') : STATUS_ALL_VALUE;

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
        onValueChange={(value) => setRole(value === ROLE_ALL_VALUE ? undefined : (value as UserRole))}
        options={[
          { label: 'Todos', value: ROLE_ALL_VALUE },
          { label: 'Admin', value: 'Admin' },
          { label: 'Issuer', value: 'Issuer' },
          { label: 'IssuerViewer', value: 'IssuerViewer' },
        ]}
        value={roleValue}
      />
      <Select
        id="isActive"
        label="Estado"
        onValueChange={(value) => {
          if (value === STATUS_ALL_VALUE) {
            setIsActive(undefined);
            return;
          }

          setIsActive(value === 'active');
        }}
        options={[
          { label: 'Todos', value: STATUS_ALL_VALUE },
          { label: 'Activo', value: 'active' },
          { label: 'Inactivo', value: 'inactive' },
        ]}
        value={statusValue}
      />
    </div>
  );
};
