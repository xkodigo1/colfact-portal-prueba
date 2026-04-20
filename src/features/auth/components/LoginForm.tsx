import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/loginSchema';
import { getApiErrorMessage } from '@/utils/auth';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * Formulario de login
 *
 * RESPONSABILIDADES:
 * 1. Renderizar campos usuario/contrasena con validacion Zod
 * 2. Capturar submit y llamar a login() del contexto
 * 3. Mostrar errores inline por campo (Zod) y error general (HTTP)
 * 4. Mostrar estado loading en el boton
 *
 * DECISION: ¿Por qué react-hook-form + Zod en lugar de solo Zod?
 * → react-hook-form maneja el estado del formulario (values, touched, dirty)
 * → Zod valida schema (tipos + restricciones)
 * → zodResolver integra ambos: react-hook-form usa Zod para validacion
 * → El formulario no re-renderiza campo sin cambios (performance)
 *
 * DECISION: ¿Por qué setState para error en lugar de state del hook?
 * → El error HTTP viene de login() del contexto.
 * → React Hook Form solo maneja errores de validacion (Zod).
 * → El error HTTP es de negocio (credenciales incorrectas), no de validacion.
 * → Lo mantenemos en estado aparte para claridad.
 *
 * DECISION: ¿Por qué defaultValues con admin/Admin123?
 * → Para que la demo sea mas rapida: no necesita escribir credenciales.
 * → En produccion seria {}, pero para evaluacion es util.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const LoginForm = () => {
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: 'admin',
      password: 'Admin123!',
    },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      setSubmitError('');
      await login(values);
    } catch (error) {
      // El error se deja inline para que sea visible durante la demo sin
      // obligar a revisar consola ni herramientas de red.
      setSubmitError(getApiErrorMessage(error, 'No fue posible iniciar sesion.'));
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Colfact Portal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900">Acceso administrativo</h1>
        <p className="mt-3 text-sm text-surface-700">
          Inicia sesion con tus credenciales para gestionar usuarios y operacion electronica.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          autoComplete="username"
          error={errors.userName?.message}
          id="userName"
          label="Usuario"
          placeholder="admin"
          {...register('userName')}
        />
        <Input
          autoComplete="current-password"
          error={errors.password?.message}
          id="password"
          label="Contrasena"
          placeholder="********"
          type="password"
          {...register('password')}
        />

        {submitError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </div>
        ) : null}

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          {isSubmitting ? 'Ingresando...' : 'Ingresar al portal'}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-surface-50 p-4 text-sm text-surface-700">
        <p className="font-semibold text-surface-900">Credenciales de prueba</p>
        <p className="mt-1">Usuario: admin</p>
        <p>Contrasena: Admin123!</p>
      </div>
    </Card>
  );
};
