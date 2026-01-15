-- 用于订阅管理的最小表结构（Webhook 落库 + 账户页读取）
-- 在 Supabase SQL Editor 中执行。

create table if not exists public.billing_state (
  user_id uuid primary key,
  creem_customer_id text,
  creem_subscription_id text,
  creem_subscription_status text,
  creem_product_id text,
  updated_at timestamptz default now()
);

-- 建议：禁止客户端直接读写（由服务端使用 service role 写入/读取）。
alter table public.billing_state enable row level security;

-- 如果你希望客户端也能读取自己的订阅状态，可以开启以下策略（可选）：
-- create policy "read own billing state"
-- on public.billing_state
-- for select
-- using (auth.uid() = user_id);

