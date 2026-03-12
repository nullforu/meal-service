## Build

```bash
npm run build
```

## Envs

- `NEIS_KEY`
- `BAND_ACCESS_TOKEN`
- `BAND_KEY`

## Infrastructure

```bash
export TF_VAR_neis_key="neis-key"
export TF_VAR_band_access_token="band-access-token"
export TF_VAR_band_key="band-key"
```

```bash
terraform init
# terraform plan
terraform apply
```
