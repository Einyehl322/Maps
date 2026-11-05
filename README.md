# Nuestros lugares

Mapa para guardar los lugares donde fuimos juntos: dónde comimos, qué platos
probamos (con nota y precio) y fotos de cada sitio. También una lista de
lugares a los que queremos ir.

- **Mapa:** MapLibre + OpenStreetMap (CARTO y satélite de Esri). Gratis, sin API key.
- **Datos:** Supabase (Postgres + Storage + login por correo). Sin configurar,
  la app funciona en modo local y guarda todo solo en este navegador.
- **Hosting:** Vercel.

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:5173
```

## 1. Crear la base de datos en Supabase (una sola vez)

1. Crea una cuenta y un proyecto gratis en <https://supabase.com>
   (región recomendada: *South America (São Paulo)*).
2. **SQL Editor → New query**, pega todo `supabase/schema.sql` y pulsa **Run**.
3. En el mismo editor, añade los correos de los dos (en minúsculas):

   ```sql
   insert into public.members (email) values
     ('tu@correo.com'),
     ('ella@correo.com');
   ```

4. **Authentication → URL Configuration**:
   - *Site URL*: la URL de Vercel cuando la tengas (al principio `http://localhost:5173`).
   - *Redirect URLs*: añade `http://localhost:5173` y la URL de Vercel.
5. **Project Settings → API** (o el botón **Connect**): copia la *Project URL*
   y la *anon / publishable key*.
6. Copia `.env.example` como `.env.local` y pega esos dos valores.
   Reinicia `npm run dev`.

Solo los correos de `members` pueden ver o subir algo; las fotos van a un
bucket privado.

## 2. Publicar en Vercel

1. Sube el repo a GitHub e impórtalo en <https://vercel.com/new>
   (Vercel detecta Vite solo).
2. En **Settings → Environment Variables** añade `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` con los mismos valores que en `.env.local`.
3. Despliega y añade la URL resultante en Supabase (paso 1.4).

## 3. Aviso por correo cuando la otra persona marca "Queremos ir"

1. Crea una cuenta gratis en <https://resend.com> **con el correo donde
   quieres recibir los avisos** y crea una API key.
   (Sin verificar un dominio, Resend solo envía al correo de tu cuenta.)
2. Supabase → **Edge Functions → Deploy a new function → Via Editor**,
   nombre `notify-wish`, pega `supabase/functions/notify-wish/index.ts` y despliega.
3. Supabase → **Edge Functions → Secrets**:
   - `RESEND_API_KEY`: la key de Resend.
   - `APP_URL`: la URL de Vercel (para el botón "Abrir nuestro mapa").
4. Opcional, para que el correo diga "Ana quiere ir a…":

   ```sql
   update public.members set name = 'Ana' where email = 'ella@correo.com';
   ```

El correo llega a todos los miembros menos a quien marcó el lugar, con el
mensaje 💌 si lo escribió.

## El diario

Toca el corazón ♥ de la cabecera: se abre "Nuestro diario", con todo lo que
han hecho (lugares, visitas, platos con nota y precio, fotos, cotizaciones y
mensajes) ordenado por fecha. Lo que ya existía antes del diario se reconstruye
con las fechas guardadas.

## Estructura

- `src/map/` mapa, buscador y capas base.
- `src/restaurants/` lugares, platos, fotos. `storage.ts` elige entre
  `cloudStore.ts` (Supabase) y `localStore.ts` (IndexedDB).
- `src/auth/` inicio de sesión y control de acceso.
- `src/osm/` capa viva de locales de OpenStreetMap.
- `supabase/schema.sql` tablas, políticas de seguridad y bucket de fotos.
