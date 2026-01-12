# Creem 支付接入说明

本项目已接入 `@creem_io/nextjs`（Checkout/Portal/Webhook），对应路由如下：

- 下单：`/checkout`
- 客户门户：`/portal`
- Webhook：`/api/webhook/creem`
- 支付成功页：`/success`

## 1) 在 Vercel / 本地设置环境变量

在 Vercel：Project → Settings → Environment Variables 添加（Production/Preview 视情况勾选）。

在本地：复制 `.env.example` 到 `.env.local` 并填写。

必填：

- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CREEM_PRODUCT_STARTER_MONTHLY`
- `NEXT_PUBLIC_CREEM_PRODUCT_STARTER_YEARLY`
- `NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY`
- `NEXT_PUBLIC_CREEM_PRODUCT_PRO_YEARLY`
- `NEXT_PUBLIC_CREEM_PRODUCT_TEAM_MONTHLY`
- `NEXT_PUBLIC_CREEM_PRODUCT_TEAM_YEARLY`

可选：

- `CREEM_TEST_MODE=true`（使用 Creem 测试环境 API；生产环境请移除或设为 `false`）

## 2) 在 Creem 控制台配置产品与 Webhook

1. 在 Creem Dashboard 创建对应的产品（如 Starter/Pro/Team；月付/年付通常是不同的 Product ID）。
2. 把每个产品的 Product ID 写入上述 `NEXT_PUBLIC_CREEM_PRODUCT_*` 环境变量。
3. 在 Creem Dashboard 配置 Webhook：
   - Endpoint：`https://<你的域名>/api/webhook/creem`
   - Secret：与 `CREEM_WEBHOOK_SECRET` 保持一致

## 3) 成功回跳与验签

前端下单按钮会把 `successUrl` 设置为 `/success?...`，Creem 会在成功后把用户带回该页面，并附带 `signature` 等参数。

本项目会在 `app/success/page.tsx` 中基于 `CREEM_API_KEY` 对回跳参数进行签名验证：

- 如果 `CREEM_API_KEY` 未配置，会显示“签名未验证”（但页面仍可访问）。

## 4) 订阅权限落库（待你定义）

`app/api/webhook/creem/route.ts` 已接上 Webhook 并输出事件日志（包含 `metadata`）。

下一步通常是：

- 在 `onGrantAccess` / `onRevokeAccess` 中把订阅状态写入你的数据库（例如 Supabase 表），并用 `metadata.referenceId` 关联用户。

