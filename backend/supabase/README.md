# Supabase Backend Blueprint

## Functions
- Runtime functions live in `../../supabase/functions`
- `resolve` resolves a tap or long-press to place context
- `place` fetches a full brief by id
- `search` searches by place name

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
