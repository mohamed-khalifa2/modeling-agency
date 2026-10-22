-- =============================================================================
-- One-time admin seed — run once in the Supabase SQL Editor
--
-- Creates a confirmed email/password auth user and grants it access to the
-- admin dashboard (public.admins row).
--
-- Idempotent: if the user already exists, the password is reset to the value
-- below and the admins row is ensured. Delete this file after running it if
-- you don't want the password living in the repository — and change the
-- password after the first sign-in.
--
-- Run AFTER the initial schema migration.
-- =============================================================================

do $$
declare
  admin_email     constant text := 'mohamed.khalifa4090@gmail.com';
  admin_password  constant text := 'khalifa500';
  password_hash   text;
  uid             uuid;
  has_provider_id boolean;
begin
  -- Resolve bcrypt hash regardless of which schema pgcrypto lives in.
  begin
    execute
      'select extensions.crypt($1, extensions.gen_salt(''bf''))'
      using admin_password into password_hash;
  exception
    when undefined_function or invalid_schema_name then
      execute
        'select crypt($1, gen_salt(''bf''))'
        using admin_password into password_hash;
  end;

  select id into uid
  from auth.users
  where lower(email) = lower(admin_email);

  if uid is null then
    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      uid,
      'authenticated',
      'authenticated',
      admin_email,
      password_hash,
      now(),
      jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
      jsonb_build_object(
        'sub', uid,
        'email', admin_email,
        'email_verified', true,
        'provider', 'email'
      ),
      now(),
      now()
    );

    -- GoTrue versions differ on the provider_id column.
    select exists (
      select 1
      from information_schema.columns
      where table_schema = 'auth'
        and table_name = 'identities'
        and column_name = 'provider_id'
    ) into has_provider_id;

    if has_provider_id then
      insert into auth.identities (
        id, user_id, provider_id, provider, identity_data,
        last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), uid, uid::text, 'email',
        jsonb_build_object(
          'sub', uid,
          'email', admin_email,
          'email_verified', true
        ),
        now(), now(), now()
      );
    else
      insert into auth.identities (
        id, user_id, provider, identity_data,
        last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), uid, 'email',
        jsonb_build_object(
          'sub', uid,
          'email', admin_email,
          'email_verified', true
        ),
        now(), now(), now()
      );
    end if;
  else
    -- Keep the injected credentials authoritative on re-runs.
    update auth.users
    set encrypted_password = password_hash,
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        updated_at = now()
    where id = uid;
  end if;

  insert into public.admins (user_id)
  values (uid)
  on conflict (user_id) do nothing;

  raise notice 'Admin ready: %', admin_email;
end $$;
