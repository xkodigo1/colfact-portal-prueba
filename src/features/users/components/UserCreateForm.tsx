import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateUser } from '@/features/users/hooks/useCreateUser';
import { userSchema, type UserFormValues } from '@/features/users/schemas/userSchema';
import { getApiErrorMessage } from '@/utils/auth';

/**
 * Formulario lateral de creacion. Mantiene feedback inline y toast para que
 * el resultado de la accion quede evidente durante la evaluacion.
 */
export const UserCreateForm = () => {
  const { createUser, error, isPending, reset: resetMutation } = useCreateUser();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      userName: '',
      identification: '',
      email: '',
      role: 'Issuer',
      password: '',
      isActive: true,
    },
  });

  const isActiveValue = useWatch({
    control,
    name: 'isActive',
  });
  const submitError = error ? getApiErrorMessage(error, 'No fue posible crear el usuario.') : '';

  const onSubmit = async (values: UserFormValues): Promise<void> => {
    try {
      resetMutation();
      setSuccessMessage('');
      await createUser(values);

      // El formulario se resetea solo despues del exito real para no perder
      // informacion si la operacion falla.
      setSuccessMessage('Usuario creado correctamente. La tabla ya fue actualizada.');
      toast.success('Usuario creado correctamente');
      reset({
        fullName: '',
        userName: '',
        identification: '',
        email: '',
        role: 'Issuer',
        password: '',
        isActive: true,
      });
    } catch (requestError) {
      setSuccessMessage('');
      toast.error(getApiErrorMessage(requestError, 'No fue posible crear el usuario.'));
    }
  };

  return (
    <Card className="xl:sticky xl:top-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-600">Nuevo usuario</p>
        <h2 className="mt-3 text-2xl font-bold text-surface-900">Crear cuenta operativa</h2>
        <p className="mt-2 text-sm text-surface-700">
          Registra administradores, emisores o visualizadores con validacion inmediata.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input error={errors.fullName?.message} id="fullName" label="Nombre completo" {...register('fullName')} />
        <Input error={errors.userName?.message} id="userName" label="Nombre de usuario" {...register('userName')} />
        <Input
          error={errors.identification?.message}
          id="identification"
          label="Identificacion"
          {...register('identification')}
        />
        <Input error={errors.email?.message} id="email" label="Correo electronico" {...register('email')} />
        <Select error={errors.role?.message} id="role" label="Rol" {...register('role')}>
          <option value="Admin">Admin</option>
          <option value="Issuer">Issuer</option>
          <option value="IssuerViewer">IssuerViewer</option>
        </Select>
        <Input
          error={errors.password?.message}
          id="password"
          label="Contrasena temporal"
          type="password"
          {...register('password')}
        />
        <Select
          id="isActive"
          label="Estado inicial"
          onChange={(event) => setValue('isActive', event.target.value === 'true')}
          value={String(isActiveValue)}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </Select>

        {submitError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </div>
        ) : null}
        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
            {successMessage}
          </div>
        ) : null}

        <Button className="w-full" isLoading={isPending || isSubmitting} type="submit">
          {isPending || isSubmitting ? 'Creando...' : 'Crear usuario'}
        </Button>
      </form>
    </Card>
  );
};
