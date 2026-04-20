import { zodResolver } from '@hookform/resolvers/zod';
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
 * ═════════════════════════════════════════════════════════════════════════
 * Formulario de creacion de usuarios
 *
 * RESPONSABILIDADES:
 * 1. Renderizar 7 campos con validacion Zod
 * 2. Mantener estado del formulario con react-hook-form
 * 3. Ejecutar mutacion POST /api/users
 * 4. Mostrar estados: inline errors, loading, success, submit error
 * 5. Refresco automatico de tabla via React Query
 * 6. Toast de confirmacion visual
 *
 * CAMPOS VALIDADOS:
 * - fullName: requerido, min 2 caracteres
 * - userName: requerido, regex ^[a-z0-9._]+ (sin espacios)
 * - identification: requerido, numero
 * - email: requerido, formato email
 * - role: enum ['Admin', 'Issuer', 'IssuerViewer']
 * - password: requerido, min 8 caracteres (seguridad)
 * - isActive: booleano (Activo/Inactivo)
 *
 * DECISION: ¿Por qué useWatch para isActive en lugar de register?
 * → El Select necesita setValue() para cambiar valor desde onChange.
 * → useWatch monitorea el cambio en tiempo real para rerender.
 * → De otro modo, el Select no mostraria la seleccion del usuario.
 *
 * DECISION: ¿Por qué reset DESPUES de onSuccess?
 * → Si hay error, el usuario NO pierde lo que escribio.
 * → Solo limpiamos campos si la creacion fue exitosa.
 * → Esto evita frustration de perder datos por un error temporal.
 *\n * DECISION: ¿Por qué toast ADEMAS de successMessage inline?
 * → Toast es temporal (desaparece en 3 segundos).
 * → successMessage permanece hasta que el usuario hace otra accion.
 * → Ambas senales aseguran que vea el feedback incluso si se distrae.
 *\n * DECISION: ¿Por qué mostrar errores inline Y rechazar mutacion?
 * → Zod valida antes de enviar (username regex, email format).
 * → El backend puede rechazar (409: username existe, 400: email existe).
 * → Zod errors son UX local (feedback al instante).
 * → HTTP errors son backend logic (validaciones duplicate, restricciones).
 * → Ambas se muestran para transparencia total.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const UserCreateForm = () => {
  const { createUser, error, isPending, reset: resetMutation } = useCreateUser();
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
  const roleValue = useWatch({
    control,
    name: 'role',
  });
  const submitError = error ? getApiErrorMessage(error, 'No fue posible crear el usuario.') : '';

  const onSubmit = async (values: UserFormValues): Promise<void> => {
    try {
      resetMutation();
      await createUser(values);

      // El feedback de exito es un toast temporal; el formulario solo se
      // limpia cuando la API confirma la creacion.
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
      toast.error(getApiErrorMessage(requestError, 'No fue posible crear el usuario.'));
    }
  };

  return (
    <Card className="h-full min-h-0 p-5 xl:sticky xl:top-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-600">Nuevo usuario</p>
        <h2 className="mt-2 text-xl font-bold text-surface-900 dark:text-surface-100">Crear cuenta operativa</h2>
        <p className="mt-1 text-sm text-surface-700 dark:text-surface-100/75">
          Registra administradores, emisores o visualizadores con validacion inmediata.
        </p>
      </div>

      <form className="mt-4 space-y-3 overflow-y-auto pr-1" onSubmit={handleSubmit(onSubmit)}>
        <Input error={errors.fullName?.message} id="fullName" label="Nombre completo" {...register('fullName')} />
        <Input error={errors.userName?.message} id="userName" label="Nombre de usuario" {...register('userName')} />
        <Input
          error={errors.identification?.message}
          id="identification"
          label="Identificacion"
          {...register('identification')}
        />
        <Input error={errors.email?.message} id="email" label="Correo electronico" {...register('email')} />
        <Select
          error={errors.role?.message}
          id="role"
          label="Rol"
          onValueChange={(value) => setValue('role', value as UserFormValues['role'])}
          options={[
            { label: 'Admin', value: 'Admin' },
            { label: 'Issuer', value: 'Issuer' },
            { label: 'IssuerViewer', value: 'IssuerViewer' },
          ]}
          value={roleValue}
        />
        <Input
          error={errors.password?.message}
          id="password"
          label="Contrasena temporal"
          type="password"
          {...register('password')}
        />
        <Select
          error={errors.isActive?.message}
          id="isActive"
          label="Estado inicial"
          onValueChange={(value) => setValue('isActive', value === 'active')}
          options={[
            { label: 'Activo', value: 'active' },
            { label: 'Inactivo', value: 'inactive' },
          ]}
          value={isActiveValue ? 'active' : 'inactive'}
        />

        {submitError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-300">
            {submitError}
          </div>
        ) : null}

        <Button className="w-full" isLoading={isPending || isSubmitting} type="submit">
          {isPending || isSubmitting ? 'Creando...' : 'Crear usuario'}
        </Button>
      </form>
    </Card>
  );
};
