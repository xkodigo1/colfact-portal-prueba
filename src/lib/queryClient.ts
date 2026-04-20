import { QueryClient } from '@tanstack/react-query';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * CONFIGURACION GLOBAL DE REACT QUERY
 *
 * React Query maneja el lifecycle de las llamadas HTTP:
 * - Fresh: dato recien traido (confiable)
 * - Stale: dato viejo pero valido (se puede reutilizar)
 * - Expired: dato muy viejo (se debe refetch)
 *
 * DECISION: staleTime = 5 minutos (para queries)
 * → Un usuario lista usuarios, se va a otra seccion.
 * → Vuelve a usuarios en 2 minutos: ve los datos cacheados (fresh).
 * → Si vuelve en 6 minutos: los datos estan stale, se refetch silenciosamente.
 * → Evita llamadas innecesarias sin sacrificar actualidad.
 *
 * DECISION: retry = 1 (para queries)
 * → Si la red falla por timeout temporal, reintentar una vez.
 * → Si sigue fallando, mostrar error (no reintentar forever).
 * → Evita confundir errores reales con glitches de red.
 *
 * DECISION: refetchOnWindowFocus = false
 * → Si el usuario minimiza la ventana y la vuelve a abrir,
 *   NO automaticamente refetch. Esto puede ser molesto.
 * → Para mantener frescura, depender de staleTime es suficiente.
 * → Si necesita lo mas reciente, el usuario puede presionar F5.
 *
 * DECISION: mutations { retry: 0 }
 * → Un POST, PUT, DELETE no debe reintentar automaticamente.
 * → Si falla una creacion, puede causar duplicados o inconsistencias.
 * → El usuario debe reintentar manualmente si lo desea.
 * → El hook (useCreateUser) muestra el error para que reaccione.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // Sin reintentos para POST/PUT/DELETE
    },
  },
});
