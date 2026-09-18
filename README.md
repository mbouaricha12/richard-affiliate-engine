# Richard Affiliate Engine v0.6

Funnel personnel Richard Darius pour acquisition, qualification, routage broker et mesure.

## Architecture production
- `POST /api/events` : événements acquisition anonymes et filtrés.
- `POST /api/business-events` : résultats broker saisis manuellement, protégés par token admin.
- `GET /api/summary` : agrégation privée du funnel.
- Netlify Functions + Netlify Blobs pour le stockage durable.

## Principes
- Aucun PII dans le tracking.
- Activation, premier dépôt, premier trade et commission ne sont jamais simulés : ils viennent des back-offices broker et sont saisis manuellement.
- Routage neutre selon le besoin déclaré : synthétiques → Deriv, Forex/Or → HFM, indécis → choix des deux.
- Aucun token admin ne doit être committé dans le dépôt.

## Déploiement
Configurer `RAE_ADMIN_TOKEN` comme variable d'environnement Netlify avant d'utiliser le Command Center.