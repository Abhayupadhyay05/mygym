create extension if not exists pgcrypto;

create type public.app_role as enum ('OWNER', 'RECEPTIONIST', 'TRAINER', 'MEMBER');
create type public.member_status as enum ('ACTIVE', 'INACTIVE', 'SUSPENDED');
create type public.membership_status as enum ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'FROZEN');
create type public.payment_status as enum ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
create type public.payment_method as enum ('CASH', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'OTHER');
create type public.enquiry_status as enum ('NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED');
create type public.notification_status as enum ('PENDING', 'SENT', 'FAILED', 'READ');
create type public.notification_channel as enum ('IN_APP', 'EMAIL', 'WHATSAPP');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  role public.app_role not null default 'MEMBER',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_not_blank check (length(trim(full_name)) > 0)
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete set null,
  member_number text not null,
  full_name text not null,
  email text,
  phone text not null,
  date_of_birth date,
  emergency_contact_name text,
  emergency_contact_phone text,
  address text,
  joined_at timestamptz not null default now(),
  status public.member_status not null default 'ACTIVE',
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint members_full_name_valid check (length(trim(full_name)) between 1 and 160),
  constraint members_email_length check (email is null or length(trim(email)) <= 254),
  constraint members_phone_length check (length(trim(phone)) between 8 and 32),
  constraint members_member_number_length check (length(trim(member_number)) between 1 and 50)
);

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_days integer,
  duration_months integer,
  price numeric(12, 2) not null check (price > 0),
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_plans_name_not_blank check (length(trim(name)) between 1 and 120),
  constraint membership_plans_valid_duration check (
    (duration_days is not null and duration_days between 1 and 7300 and duration_months is null)
    or (duration_months is not null and duration_months between 1 and 600 and duration_days is null)
  )
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete restrict,
  plan_id uuid not null references public.membership_plans (id) on delete restrict,
  status public.membership_status not null default 'PENDING',
  starts_on date not null,
  ends_on date not null,
  amount numeric(12, 2) not null check (amount >= 0),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_valid_dates check (ends_on >= starts_on)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete restrict,
  membership_id uuid references public.memberships (id) on delete restrict,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status public.payment_status not null default 'PENDING',
  method public.payment_method not null,
  provider text,
  provider_order_id text unique,
  provider_payment_id text unique,
  idempotency_key text not null unique default gen_random_uuid()::text,
  received_by uuid references public.profiles (id) on delete set null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payment_webhook_events_provider_event_unique unique (provider, provider_event_id)
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete restrict,
  attendance_date date not null default (timezone('Asia/Kolkata', now()))::date,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references public.profiles (id) on delete set null,
  method text not null default 'MANUAL' check (method in ('MANUAL', 'QR')),
  created_at timestamptz not null default now(),
  constraint attendance_one_check_in_per_day unique (member_id, attendance_date)
);

create table public.trainers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete set null,
  display_name text not null,
  bio text,
  specialties text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trainers_display_name_not_blank check (length(trim(display_name)) > 0)
);

create table public.trainer_assignments (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (id) on delete restrict,
  member_id uuid not null references public.members (id) on delete restrict,
  assigned_by uuid references public.profiles (id) on delete set null,
  assigned_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  constraint trainer_assignment_dates check (ended_at is null or ended_at >= assigned_at),
  constraint trainer_assignment_active_unique unique (trainer_id, member_id, ended_at)
);

create unique index trainer_assignments_one_active_per_pair
  on public.trainer_assignments (trainer_id, member_id)
  where ended_at is null;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  message text,
  status public.enquiry_status not null default 'NEW',
  follow_up_at timestamptz,
  converted_member_id uuid references public.members (id) on delete set null,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_full_name_valid check (length(trim(full_name)) between 1 and 160),
  constraint enquiries_phone_length check (length(trim(phone)) between 8 and 32),
  constraint enquiries_email_length check (email is null or length(trim(email)) <= 254),
  constraint enquiries_message_length check (message is null or length(message) <= 4000),
  constraint enquiries_conversion_link_required check (
    (status = 'CONVERTED') = (converted_member_id is not null)
  )
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  member_id uuid references public.members (id) on delete cascade,
  channel public.notification_channel not null default 'IN_APP',
  status public.notification_status not null default 'PENDING',
  subject text not null,
  body text not null,
  scheduled_for timestamptz,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_exactly_one_recipient check ((profile_id is not null) <> (member_id is not null))
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  occurred_at timestamptz not null default now()
);

create index members_status_joined_at_idx on public.members (status, joined_at desc);
create unique index members_member_number_lower_unique on public.members (lower(member_number));
create index memberships_member_dates_idx on public.memberships (member_id, starts_on desc, ends_on);
create index memberships_expiry_idx on public.memberships (ends_on) where status = 'ACTIVE';
create unique index memberships_one_pending_per_member_idx on public.memberships (member_id) where status = 'PENDING';
create index payments_member_created_idx on public.payments (member_id, created_at desc);
create index payments_status_created_idx on public.payments (status, created_at desc);
create unique index payments_one_settled_per_membership_idx on public.payments (membership_id)
  where membership_id is not null and status in ('PAID', 'REFUNDED', 'PARTIALLY_REFUNDED');
create unique index payments_one_pending_per_membership_idx on public.payments (membership_id)
  where membership_id is not null and status = 'PENDING';
create index payment_webhook_events_created_idx on public.payment_webhook_events (created_at desc);
create index attendance_date_idx on public.attendance (attendance_date desc);
create index trainer_assignments_member_active_idx on public.trainer_assignments (member_id) where ended_at is null;
create index enquiries_status_created_idx on public.enquiries (status, created_at desc);
create index notifications_profile_created_idx on public.notifications (profile_id, created_at desc);
create index audit_logs_record_idx on public.audit_logs (table_name, record_id, occurred_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function public.set_attendance_actor()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.checked_in_by := (select auth.uid());
  return new;
end;
$$;

create function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid()) and is_active = true;
$$;

create function public.get_assigned_member_summaries()
returns table (member_id uuid, member_number text, full_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select member.id, member.member_number, member.full_name
  from public.trainer_assignments assignment
  join public.trainers trainer on trainer.id = assignment.trainer_id
  join public.members member on member.id = assignment.member_id
  where trainer.profile_id = (select auth.uid())
    and assignment.ended_at is null
    and (select public.current_app_role()) = 'TRAINER'::public.app_role;
$$;

create function public.search_members(
  p_query text default null,
  p_status text default null,
  p_limit integer default 25,
  p_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  normalized_query text := nullif(trim(p_query), '');
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 50
    or p_offset is null or p_offset < 0 or p_offset > 250000 then
    raise exception 'Invalid pagination' using errcode = '22023';
  end if;
  if normalized_query is not null and length(normalized_query) > 100 then
    raise exception 'Search query is too long' using errcode = '22023';
  end if;
  if p_status is not null and p_status not in ('ACTIVE', 'INACTIVE', 'SUSPENDED') then
    raise exception 'Invalid member status' using errcode = '22023';
  end if;

  return (
    with filtered as materialized (
      select member.id, member.member_number, member.full_name, member.email, member.phone, member.status, member.joined_at
      from public.members member
      where (p_status is null or member.status::text = p_status)
        and (
          normalized_query is null
          or member.member_number ilike '%' || normalized_query || '%'
          or member.full_name ilike '%' || normalized_query || '%'
          or member.phone ilike '%' || normalized_query || '%'
          or coalesce(member.email, '') ilike '%' || normalized_query || '%'
        )
    ),
    page_rows as (
      select * from filtered
      order by joined_at desc, id
      limit p_limit offset p_offset
    )
    select jsonb_build_object(
      'total_count', (select count(*) from filtered),
      'items', coalesce((
        select jsonb_agg(to_jsonb(page_rows) order by page_rows.joined_at desc, page_rows.id)
        from page_rows
      ), '[]'::jsonb)
    )
  );
end;
$$;

create function public.assign_membership(
  target_member_id uuid,
  target_plan_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  local_today date := (now() at time zone 'Asia/Kolkata')::date;
  start_date date;
  end_date date;
  plan_row public.membership_plans%rowtype;
  created_membership_id uuid;
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if target_member_id is null or target_plan_id is null then
    raise exception 'Member and plan are required' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_member_id::text, 0));

  if not exists (
    select 1 from public.members member
    where member.id = target_member_id and member.status = 'ACTIVE'
  ) then
    raise exception 'Active member not found' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.memberships membership
    where membership.member_id = target_member_id and membership.status = 'PENDING'
  ) then
    raise exception 'A pending membership already exists for this member' using errcode = '23505';
  end if;

  select plan.* into plan_row
  from public.membership_plans plan
  where plan.id = target_plan_id and plan.is_active = true;
  if not found then
    raise exception 'Active membership plan not found' using errcode = 'P0002';
  end if;

  select greatest(local_today, coalesce(max(membership.ends_on + 1), local_today))
  into start_date
  from public.memberships membership
  where membership.member_id = target_member_id and membership.status = 'ACTIVE';

  if plan_row.duration_months is not null then
    end_date := (start_date + make_interval(months => plan_row.duration_months))::date - 1;
  else
    end_date := start_date + plan_row.duration_days - 1;
  end if;

  insert into public.memberships (
    member_id, plan_id, status, starts_on, ends_on, amount, created_by
  )
  values (
    target_member_id, target_plan_id, 'PENDING', start_date, end_date, plan_row.price, (select auth.uid())
  )
  returning id into created_membership_id;

  return created_membership_id;
end;
$$;

create function public.record_manual_payment(
  target_membership_id uuid,
  p_method public.payment_method,
  p_idempotency_key text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_payment public.payments%rowtype;
  membership_row public.memberships%rowtype;
  created_payment_id uuid;
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if p_method is null or p_method not in ('CASH', 'UPI', 'OTHER') then
    raise exception 'Unsupported manual payment method' using errcode = '22023';
  end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key)) not between 1 and 100 then
    raise exception 'Invalid idempotency key' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_key, 0));

  select payment.* into existing_payment
  from public.payments payment
  where payment.idempotency_key = p_idempotency_key;
  if found then
    if existing_payment.membership_id is distinct from target_membership_id
      or existing_payment.method is distinct from p_method
      or existing_payment.status <> 'PAID'
      or existing_payment.received_by is distinct from (select auth.uid()) then
      raise exception 'Idempotency key already used for a different payment' using errcode = '23505';
    end if;
    return existing_payment.id;
  end if;

  select membership.* into membership_row
  from public.memberships membership
  where membership.id = target_membership_id
  for update;
  if not found or membership_row.status <> 'PENDING' then
    raise exception 'Pending membership not found' using errcode = 'P0002';
  end if;
  if not exists (
    select 1 from public.members member
    where member.id = membership_row.member_id and member.status = 'ACTIVE'
  ) then
    raise exception 'Active member not found' using errcode = 'P0002';
  end if;
  if exists (
    select 1 from public.payments payment
    where payment.membership_id = membership_row.id and payment.status = 'PENDING'
  ) then
    raise exception 'An online payment is already pending for this membership' using errcode = '55000';
  end if;
  if membership_row.amount <= 0 then
    raise exception 'Membership amount must be positive' using errcode = '23514';
  end if;

  insert into public.payments (
    member_id, membership_id, amount, status, method, received_by, paid_at, idempotency_key
  )
  values (
    membership_row.member_id, membership_row.id, membership_row.amount, 'PAID',
    p_method, (select auth.uid()), now(), p_idempotency_key
  )
  returning id into created_payment_id;

  update public.memberships
  set status = 'ACTIVE'
  where id = membership_row.id;

  return created_payment_id;
end;
$$;

create function public.register_razorpay_order(
  target_member_id uuid,
  target_membership_id uuid,
  target_profile_id uuid,
  p_idempotency_key uuid,
  p_order_id text
)
returns table (
  registered_payment_id uuid,
  razorpay_order_id text,
  payment_amount numeric
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  member_row public.members%rowtype;
  membership_row public.memberships%rowtype;
  payment_row public.payments%rowtype;
begin
  if target_member_id is null or target_membership_id is null or target_profile_id is null
    or p_idempotency_key is null
    or p_order_id is null or length(trim(p_order_id)) not between 1 and 80 then
    raise exception 'Invalid order details' using errcode = '22023';
  end if;

  select member.* into member_row
  from public.members member
  where member.id = target_member_id
    and member.profile_id = target_profile_id
    and member.status = 'ACTIVE'
  for update;
  if not found then
    raise exception 'Active member profile not found' using errcode = 'P0002';
  end if;

  select membership.* into membership_row
  from public.memberships membership
  where membership.id = target_membership_id and membership.member_id = member_row.id
  for update;
  if not found or membership_row.status <> 'PENDING' then
    raise exception 'Pending membership not found' using errcode = 'P0002';
  end if;

  select payment.* into payment_row
  from public.payments payment
  where payment.idempotency_key = p_idempotency_key::text
  for update;
  if found then
    if payment_row.membership_id is distinct from membership_row.id
      or payment_row.provider is distinct from 'razorpay'
      or payment_row.provider_order_id is null then
      raise exception 'Idempotency key already used' using errcode = '23505';
    end if;
    return query select payment_row.id, payment_row.provider_order_id, payment_row.amount;
    return;
  end if;

  select payment.* into payment_row
  from public.payments payment
  where payment.membership_id = membership_row.id and payment.status = 'PENDING'
  for update;
  if found then
    if payment_row.provider is distinct from 'razorpay' or payment_row.provider_order_id is null then
      raise exception 'Another pending payment exists' using errcode = '55000';
    end if;
    return query select payment_row.id, payment_row.provider_order_id, payment_row.amount;
    return;
  end if;

  insert into public.payments (
    member_id, membership_id, amount, status, method, provider,
    provider_order_id, idempotency_key
  )
  values (
    member_row.id, membership_row.id, membership_row.amount, 'PENDING', 'OTHER',
    'razorpay', p_order_id, p_idempotency_key::text
  )
  returning * into payment_row;

  return query select payment_row.id, payment_row.provider_order_id, payment_row.amount;
end;
$$;

create function public.settle_razorpay_payment(
  p_order_id text,
  p_payment_id text,
  p_amount_paise bigint,
  p_currency text,
  p_method public.payment_method
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_row public.payments%rowtype;
  membership_row public.memberships%rowtype;
begin
  if p_order_id is null or p_payment_id is null
    or p_amount_paise is null or p_amount_paise <= 0
    or p_currency is distinct from 'INR'
    or p_method is null
    or p_method not in ('CARD', 'UPI', 'NET_BANKING', 'WALLET', 'OTHER') then
    raise exception 'Invalid captured payment details' using errcode = '22023';
  end if;

  select payment.* into payment_row
  from public.payments payment
  where payment.provider = 'razorpay' and payment.provider_order_id = p_order_id;
  if not found then
    raise exception 'Razorpay order not found' using errcode = 'P0002';
  end if;

  select membership.* into membership_row
  from public.memberships membership
  where membership.id = payment_row.membership_id
  for update;
  if not found or membership_row.status not in ('PENDING', 'ACTIVE') then
    raise exception 'Membership is not available for payment settlement' using errcode = '55000';
  end if;

  select payment.* into payment_row
  from public.payments payment
  where payment.id = payment_row.id
  for update;
  if not found or payment_row.provider_order_id is distinct from p_order_id then
    raise exception 'Razorpay order changed during settlement' using errcode = 'P0002';
  end if;

  if payment_row.amount * 100 <> p_amount_paise then
    raise exception 'Captured amount does not match the order' using errcode = '22023';
  end if;
  if payment_row.status = 'PAID' then
    if payment_row.provider_payment_id is distinct from p_payment_id then
      raise exception 'Order has a different captured payment' using errcode = '23505';
    end if;
    return payment_row.id;
  end if;
  if payment_row.status <> 'PENDING' then
    raise exception 'Payment is not pending' using errcode = '55000';
  end if;

  if membership_row.status <> 'PENDING' then
    raise exception 'Membership is not pending' using errcode = '55000';
  end if;

  update public.payments
  set status = 'PAID',
      method = p_method,
      provider_payment_id = p_payment_id,
      paid_at = now()
  where id = payment_row.id;

  update public.memberships
  set status = 'ACTIVE'
  where id = membership_row.id;

  return payment_row.id;
end;
$$;

create function public.process_razorpay_webhook(
  p_event_id text,
  p_event_type text,
  p_order_id text,
  p_payment_id text,
  p_amount_paise bigint,
  p_currency text,
  p_method public.payment_method
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_row public.payment_webhook_events%rowtype;
  settled_payment_id uuid;
begin
  if p_event_id is null or length(trim(p_event_id)) not between 1 and 255
    or p_event_type is distinct from 'payment.captured' then
    raise exception 'Invalid Razorpay event' using errcode = '22023';
  end if;

  insert into public.payment_webhook_events (provider, provider_event_id, event_type)
  values ('razorpay', p_event_id, p_event_type)
  on conflict (provider, provider_event_id) do nothing
  returning * into event_row;

  if not found then
    select event.* into event_row
    from public.payment_webhook_events event
    where event.provider = 'razorpay' and event.provider_event_id = p_event_id
    for update;
    if event_row.event_type is distinct from p_event_type then
      raise exception 'Webhook event ID reused' using errcode = '23505';
    end if;
    if event_row.processed_at is not null then
      select payment.id into settled_payment_id
      from public.payments payment
      where payment.provider = 'razorpay'
        and payment.provider_payment_id = p_payment_id;
      if settled_payment_id is null then
        raise exception 'Processed webhook has no payment record' using errcode = 'P0002';
      end if;
      return settled_payment_id;
    end if;
  end if;

  settled_payment_id := public.settle_razorpay_payment(
    p_order_id, p_payment_id, p_amount_paise, p_currency, p_method
  );
  update public.payment_webhook_events
  set processed_at = now()
  where provider = 'razorpay' and provider_event_id = p_event_id;

  return settled_payment_id;
end;
$$;

create function public.assign_trainer(
  target_trainer_id uuid,
  target_member_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_assignment_id uuid;
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if target_trainer_id is null or target_member_id is null then
    raise exception 'Trainer and member are required' using errcode = '22023';
  end if;

  perform 1 from public.trainers trainer
  where trainer.id = target_trainer_id and trainer.is_active = true
  for update;
  if not found then
    raise exception 'Active trainer not found' using errcode = 'P0002';
  end if;

  perform 1 from public.members member
  where member.id = target_member_id and member.status = 'ACTIVE'
  for update;
  if not found then
    raise exception 'Active member not found' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.trainer_assignments assignment
    where assignment.trainer_id = target_trainer_id
      and assignment.member_id = target_member_id
      and assignment.ended_at is null
  ) then
    raise exception 'An active assignment already exists' using errcode = '23505';
  end if;

  insert into public.trainer_assignments (trainer_id, member_id, assigned_by)
  values (target_trainer_id, target_member_id, (select auth.uid()))
  returning id into created_assignment_id;

  return created_assignment_id;
end;
$$;

create function public.set_trainer_active(
  target_trainer_id uuid,
  target_is_active boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if target_trainer_id is null or target_is_active is null then
    raise exception 'Trainer and status are required' using errcode = '22023';
  end if;

  perform 1 from public.trainers trainer
  where trainer.id = target_trainer_id
  for update;
  if not found then
    raise exception 'Trainer not found' using errcode = 'P0002';
  end if;

  if not target_is_active then
    update public.trainer_assignments
    set ended_at = now()
    where trainer_id = target_trainer_id and ended_at is null;
  end if;

  update public.trainers
  set is_active = target_is_active
  where id = target_trainer_id;
end;
$$;

create function public.is_assigned_trainer(target_trainer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.trainer_assignments assignment
    join public.members member on member.id = assignment.member_id
    where assignment.trainer_id = target_trainer_id
      and assignment.ended_at is null
      and member.profile_id = (select auth.uid())
      and (select public.current_app_role()) = 'MEMBER'::public.app_role
  );
$$;

create function public.admin_dashboard_summary()
returns table (
  total_members bigint,
  active_members bigint,
  expired_members bigint,
  expiring_soon bigint,
  today_attendance bigint,
  today_revenue numeric,
  monthly_revenue numeric
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  local_today date := (now() at time zone 'Asia/Kolkata')::date;
  today_start timestamptz := local_today::timestamp at time zone 'Asia/Kolkata';
  tomorrow_start timestamptz := (local_today + 1)::timestamp at time zone 'Asia/Kolkata';
  month_start timestamptz := date_trunc('month', local_today::timestamp) at time zone 'Asia/Kolkata';
  month_end timestamptz := (date_trunc('month', local_today::timestamp) + interval '1 month') at time zone 'Asia/Kolkata';
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select
    (select count(*) from public.members)::bigint,
    (
      select count(distinct membership.member_id)
      from public.memberships membership
      join public.members member on member.id = membership.member_id
      where membership.status = 'ACTIVE'
        and member.status = 'ACTIVE'
        and membership.starts_on <= local_today
        and membership.ends_on >= local_today
    )::bigint,
    (
      select count(distinct membership.member_id)
      from public.memberships membership
      join public.members member on member.id = membership.member_id
      where membership.status in ('ACTIVE', 'EXPIRED')
        and member.status = 'ACTIVE'
        and membership.ends_on < local_today
        and not exists (
          select 1
          from public.memberships current_membership
          where current_membership.member_id = membership.member_id
            and current_membership.status = 'ACTIVE'
            and current_membership.starts_on <= local_today
            and current_membership.ends_on >= local_today
        )
    )::bigint,
    (
      select count(distinct membership.member_id)
      from public.memberships membership
      join public.members member on member.id = membership.member_id
      where membership.status = 'ACTIVE'
        and member.status = 'ACTIVE'
        and membership.starts_on <= local_today
        and membership.ends_on between local_today and local_today + 7
    )::bigint,
    (
      select count(*)
      from public.attendance attendance
      where attendance.attendance_date = local_today
    )::bigint,
    coalesce((
      select sum(payment.amount)
      from public.payments payment
      where payment.status = 'PAID'
        and payment.paid_at >= today_start
        and payment.paid_at < tomorrow_start
    ), 0)::numeric,
    coalesce((
      select sum(payment.amount)
      from public.payments payment
      where payment.status = 'PAID'
        and payment.paid_at >= month_start
        and payment.paid_at < month_end
    ), 0)::numeric;
end;
$$;

create function public.admin_monthly_report(p_months integer default 12)
returns table (
  month_start date,
  paid_revenue numeric,
  new_members bigint,
  attendance_visits bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  local_today date := (now() at time zone 'Asia/Kolkata')::date;
  current_month date := date_trunc('month', local_today::timestamp)::date;
begin
  if coalesce((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'), false) = false then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if p_months is null or p_months not between 1 and 24 then
    raise exception 'Invalid report period' using errcode = '22023';
  end if;

  return query
  select
    report_month.month_start,
    coalesce((
      select sum(payment.amount)
      from public.payments payment
      where payment.status = 'PAID'
        and payment.paid_at >= (report_month.month_start::timestamp at time zone 'Asia/Kolkata')
        and payment.paid_at < ((report_month.month_start + interval '1 month') at time zone 'Asia/Kolkata')
    ), 0)::numeric,
    (
      select count(*)
      from public.members member
      where member.joined_at >= (report_month.month_start::timestamp at time zone 'Asia/Kolkata')
        and member.joined_at < ((report_month.month_start + interval '1 month') at time zone 'Asia/Kolkata')
    )::bigint,
    (
      select count(*)
      from public.attendance attendance
      where attendance.attendance_date >= report_month.month_start
        and attendance.attendance_date < (report_month.month_start + interval '1 month')::date
    )::bigint
  from (
    select (current_month - make_interval(months => month_offset))::date as month_start
    from generate_series(p_months - 1, 0, -1) as offsets(month_offset)
  ) report_month
  order by report_month.month_start;
end;
$$;

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  name_from_metadata text;
begin
  name_from_metadata := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(name_from_metadata, nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Member'),
    nullif(new.phone, '')
  );
  return new;
end;
$$;

create function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_id uuid;
begin
  if tg_op = 'DELETE' then
    changed_id := old.id;
  else
    changed_id := new.id;
  end if;

  insert into public.audit_logs (actor_id, action, table_name, record_id)
  values ((select auth.uid()), tg_op, tg_table_name, changed_id);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create function public.set_profile_role(target_profile_id uuid, new_role public.app_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.current_app_role() is distinct from 'OWNER'::public.app_role then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if target_profile_id = (select auth.uid())
    and new_role <> 'OWNER'::public.app_role
    and (select count(*) from public.profiles where role = 'OWNER' and is_active = true) <= 1 then
    raise exception 'The final active owner cannot be demoted' using errcode = '23514';
  end if;

  update public.profiles
  set role = new_role
  where id = target_profile_id;

  if not found then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;
end;
$$;

create function public.link_member_account(target_member_id uuid, target_profile_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  linked_member_id uuid;
begin
  if public.current_app_role() is distinct from 'OWNER'::public.app_role then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if target_member_id is null or target_profile_id is null then
    raise exception 'Member and profile are required' using errcode = '22023';
  end if;

  perform 1
  from public.profiles profile
  where profile.id = target_profile_id
    and profile.role = 'MEMBER'
    and profile.is_active = true
  for update;
  if not found then
    raise exception 'Active MEMBER profile not found' using errcode = 'P0002';
  end if;

  update public.members
  set profile_id = target_profile_id
  where id = target_member_id
    and profile_id is null
    and status = 'ACTIVE'
  returning id into linked_member_id;
  if not found then
    raise exception 'Unlinked active member not found' using errcode = 'P0002';
  end if;

  return linked_member_id;
end;
$$;

create trigger auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create trigger attendance_set_actor
  before insert on public.attendance
  for each row execute function public.set_attendance_actor();

do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles', 'members', 'membership_plans', 'memberships', 'payments', 'trainers', 'enquiries'] loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name, table_name
    );
  end loop;

  foreach table_name in array array['profiles', 'members', 'membership_plans', 'memberships', 'payments', 'attendance', 'trainers', 'trainer_assignments', 'enquiries', 'notifications'] loop
    execute format(
      'create trigger %I_audit after insert or update or delete on public.%I for each row execute function public.audit_row_change()',
      table_name, table_name
    );
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.payments enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.attendance enable row level security;
alter table public.trainers enable row level security;
alter table public.trainer_assignments enable row level security;
alter table public.enquiries enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "Profiles are visible to self and owners"
  on public.profiles for select to authenticated
  using (
    (id = (select auth.uid()) and (select public.current_app_role()) is not null)
    or (select public.current_app_role()) = 'OWNER'
  );
create policy "Users may update their own profile"
  on public.profiles for update to authenticated
  using (
    (id = (select auth.uid()) and (select public.current_app_role()) is not null)
    or (select public.current_app_role()) = 'OWNER'
  )
  with check (
    (id = (select auth.uid()) and (select public.current_app_role()) is not null)
    or (select public.current_app_role()) = 'OWNER'
  );

create policy "Staff can view members and members can view themselves"
  on public.members for select to authenticated
  using (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    or (
      (select public.current_app_role()) is not null
      and profile_id = (select auth.uid())
    )
  );
create policy "Staff can create members"
  on public.members for insert to authenticated
  with check (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    and (created_by is null or created_by = (select auth.uid()))
  );
create policy "Staff can update members"
  on public.members for update to authenticated
  using ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'))
  with check ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));

create policy "Active membership plans are visible publicly"
  on public.membership_plans for select to anon
  using (is_active);
create policy "Active plans and staff can view plans"
  on public.membership_plans for select to authenticated
  using (is_active or (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));
create policy "Staff can create membership plans"
  on public.membership_plans for insert to authenticated
  with check (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    and (created_by is null or created_by = (select auth.uid()))
  );
create policy "Staff can update membership plans"
  on public.membership_plans for update to authenticated
  using ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'))
  with check ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));

create policy "Staff and the member can view memberships"
  on public.memberships for select to authenticated
  using (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    or exists (
      select 1 from public.members member
      where member.id = memberships.member_id
        and member.profile_id = (select auth.uid())
        and (select public.current_app_role()) is not null
    )
  );
create policy "Staff and the member can view payments"
  on public.payments for select to authenticated
  using (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    or exists (
      select 1 from public.members member
      where member.id = payments.member_id
        and member.profile_id = (select auth.uid())
        and (select public.current_app_role()) is not null
    )
  );
create policy "Staff and the member can view attendance"
  on public.attendance for select to authenticated
  using (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    or exists (
      select 1 from public.members member
      where member.id = attendance.member_id
        and member.profile_id = (select auth.uid())
        and (select public.current_app_role()) is not null
    )
  );
create policy "Staff can record attendance"
  on public.attendance for insert to authenticated
  with check (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    and attendance_date = (now() at time zone 'Asia/Kolkata')::date
    and method = 'MANUAL'
    and exists (
      select 1
      from public.memberships membership
      join public.members member on member.id = membership.member_id
      where membership.member_id = attendance.member_id
        and membership.status = 'ACTIVE'
        and membership.starts_on <= attendance.attendance_date
        and membership.ends_on >= attendance.attendance_date
        and member.status = 'ACTIVE'
    )
  );

create policy "Trainers are visible to staff and their own profile"
  on public.trainers for select to authenticated
  using (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST', 'TRAINER')
    or (
      (select public.current_app_role()) is not null
      and profile_id = (select auth.uid())
    )
    or (select public.is_assigned_trainer(id))
  );
create policy "Staff can manage trainers"
  on public.trainers for all to authenticated
  using ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'))
  with check ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));

create policy "Staff, trainers and assigned members can view assignments"
  on public.trainer_assignments for select to authenticated
  using (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    or (
      (select public.current_app_role()) is not null
      and exists (
        select 1 from public.trainers trainer
        where trainer.id = trainer_assignments.trainer_id
          and trainer.profile_id = (select auth.uid())
      )
    )
    or (
      (select public.current_app_role()) is not null
      and exists (
        select 1 from public.members member
        where member.id = trainer_assignments.member_id
          and member.profile_id = (select auth.uid())
      )
    )
  );
create policy "Staff can create trainer assignments"
  on public.trainer_assignments for insert to authenticated
  with check (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    and (assigned_by is null or assigned_by = (select auth.uid()))
    and exists (
      select 1 from public.trainers trainer
      where trainer.id = trainer_assignments.trainer_id and trainer.is_active
    )
    and exists (
      select 1 from public.members member
      where member.id = trainer_assignments.member_id and member.status = 'ACTIVE'
    )
  );
create policy "Staff can update trainer assignments"
  on public.trainer_assignments for update to authenticated
  using ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'))
  with check ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));

create policy "Staff can view enquiries"
  on public.enquiries for select to authenticated
  using ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));
create policy "Staff can create enquiries"
  on public.enquiries for insert to authenticated
  with check (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    and status = 'NEW'
    and assigned_to is null
    and converted_member_id is null
  );
create policy "Staff can manage enquiries"
  on public.enquiries for update to authenticated
  using ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'))
  with check ((select public.current_app_role()) in ('OWNER', 'RECEPTIONIST'));

create policy "Users can view their notifications"
  on public.notifications for select to authenticated
  using (
    (
      (select public.current_app_role()) is not null
      and profile_id = (select auth.uid())
    )
    or (
      (select public.current_app_role()) is not null
      and exists (
        select 1 from public.members member
        where member.id = notifications.member_id
          and member.profile_id = (select auth.uid())
      )
    )
    or (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
  );
create policy "Staff can create notifications"
  on public.notifications for insert to authenticated
  with check (
    (select public.current_app_role()) in ('OWNER', 'RECEPTIONIST')
    and status = 'PENDING'
    and sent_at is null
    and read_at is null
  );
create policy "Users can mark their notifications as read"
  on public.notifications for update to authenticated
  using (
    (
      (select public.current_app_role()) is not null
      and profile_id = (select auth.uid())
    )
    or (
      (select public.current_app_role()) is not null
      and exists (
        select 1 from public.members member
        where member.id = notifications.member_id
          and member.profile_id = (select auth.uid())
      )
    )
  )
  with check (
    (
      (
        (select public.current_app_role()) is not null
        and profile_id = (select auth.uid())
      )
      or (
        (select public.current_app_role()) is not null
        and exists (
          select 1 from public.members member
          where member.id = notifications.member_id
            and member.profile_id = (select auth.uid())
        )
      )
    )
    and status = 'READ'
    and read_at is not null
  );

create policy "Owners can view audit logs"
  on public.audit_logs for select to authenticated
  using ((select public.current_app_role()) = 'OWNER');

revoke all on public.profiles, public.members, public.membership_plans, public.memberships,
  public.payments, public.payment_webhook_events, public.attendance, public.trainers,
  public.trainer_assignments, public.enquiries, public.notifications, public.audit_logs
  from anon, authenticated;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on public.profiles to authenticated;
revoke update (role, is_active, id) on public.profiles from authenticated;

grant select on public.members to authenticated;
grant insert (member_number, full_name, email, phone, date_of_birth, emergency_contact_name, emergency_contact_phone, address, status, notes, created_by) on public.members to authenticated;
grant update (member_number, full_name, email, phone, date_of_birth, emergency_contact_name, emergency_contact_phone, address, status, notes) on public.members to authenticated;
grant select on public.membership_plans to anon, authenticated;
grant insert (name, description, duration_days, duration_months, price, is_active, created_by) on public.membership_plans to authenticated;
grant update (name, description, duration_days, duration_months, price, is_active) on public.membership_plans to authenticated;
grant select on public.memberships to authenticated;
grant select on public.payments to authenticated;
grant select on public.attendance to authenticated;
grant insert (member_id) on public.attendance to authenticated;
grant select on public.trainers to authenticated;
grant insert (profile_id, display_name, bio, specialties, is_active) on public.trainers to authenticated;
grant update (profile_id, display_name, bio, specialties) on public.trainers to authenticated;
grant select on public.trainer_assignments to authenticated;
grant update (ended_at) on public.trainer_assignments to authenticated;
grant select on public.enquiries to authenticated;
grant update (full_name, email, phone, message, status, follow_up_at, converted_member_id, assigned_to) on public.enquiries to authenticated;
grant insert (full_name, email, phone, message) on public.enquiries to authenticated;
grant select on public.notifications to authenticated;
grant insert (profile_id, member_id, channel, subject, body, scheduled_for) on public.notifications to authenticated;
grant update (read_at, status) on public.notifications to authenticated;
grant select on public.audit_logs to authenticated;

revoke all on function public.current_app_role() from public, anon;
grant execute on function public.current_app_role() to authenticated;
revoke all on function public.get_assigned_member_summaries() from public, anon;
grant execute on function public.get_assigned_member_summaries() to authenticated;
revoke all on function public.search_members(text, text, integer, integer) from public, anon;
grant execute on function public.search_members(text, text, integer, integer) to authenticated;
revoke all on function public.assign_membership(uuid, uuid) from public, anon, authenticated;
grant execute on function public.assign_membership(uuid, uuid) to authenticated;
revoke all on function public.record_manual_payment(uuid, public.payment_method, text) from public, anon, authenticated;
grant execute on function public.record_manual_payment(uuid, public.payment_method, text) to authenticated;
revoke all on function public.register_razorpay_order(uuid, uuid, uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.register_razorpay_order(uuid, uuid, uuid, uuid, text) to service_role;
revoke all on function public.settle_razorpay_payment(text, text, bigint, text, public.payment_method) from public, anon, authenticated;
grant execute on function public.settle_razorpay_payment(text, text, bigint, text, public.payment_method) to service_role;
revoke all on function public.process_razorpay_webhook(text, text, text, text, bigint, text, public.payment_method) from public, anon, authenticated;
grant execute on function public.process_razorpay_webhook(text, text, text, text, bigint, text, public.payment_method) to service_role;
revoke all on function public.assign_trainer(uuid, uuid) from public, anon, authenticated;
grant execute on function public.assign_trainer(uuid, uuid) to authenticated;
revoke all on function public.set_trainer_active(uuid, boolean) from public, anon, authenticated;
grant execute on function public.set_trainer_active(uuid, boolean) to authenticated;
revoke all on function public.is_assigned_trainer(uuid) from public, anon;
grant execute on function public.is_assigned_trainer(uuid) to authenticated;
revoke all on function public.admin_dashboard_summary() from public, anon;
grant execute on function public.admin_dashboard_summary() to authenticated;
revoke all on function public.admin_monthly_report(integer) from public, anon;
grant execute on function public.admin_monthly_report(integer) to authenticated;
revoke all on function public.set_profile_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.set_profile_role(uuid, public.app_role) to authenticated;
revoke all on function public.link_member_account(uuid, uuid) from public, anon, authenticated;
grant execute on function public.link_member_account(uuid, uuid) to authenticated;
