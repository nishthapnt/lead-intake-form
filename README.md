# Lead Intake Form

A small polished fake client inquiry page for the LeadFlow CRM + n8n demo.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_N8N_WEBHOOK_URL` to your n8n webhook URL.

## Intended flow

Website form → n8n webhook → AI qualification → CRM `POST /api/webhooks/leads` → MongoDB → LeadFlow UI.

## Important

The form intentionally sends the inquiry directly to n8n rather than email first. This keeps the demo fast and avoids requiring an email provider. If you want to demonstrate email-triggered automation later, put an email-sending step between the form backend and n8n.
