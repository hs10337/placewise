# Supabase Backend Blueprint

## Functions
- `functions/resolve` resolve tap/long-press to place context
- `functions/place` fetch full brief by id
- `functions/search` search by place name

## Local workflow
```bash
supabase start
supabase functions serve --env-file .env.local
```

## Deploy
```bash
supabase link --project-ref <project-ref>
supabase db push
supabase functions deploy resolve
supabase functions deploy place
supabase functions deploy search
```
