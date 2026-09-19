# RAE — Deployment Blocker Status

Date: 2026-09-19

## Etat
Le code source continue sur GitHub/main. La production Netlify existante reste en ligne, mais les nouveaux déploiements sont actuellement bloqués par les crédits opérationnels de l'équipe Netlify.

## Règle
- Ne pas utiliser le drag-and-drop Netlify pour contourner le blocage.
- Ne pas créer un second projet Netlify.
- Ne pas lancer de trafic important en supposant que les derniers changements GitHub sont déjà en production.
- Continuer les améliorations source et la préparation acquisition dans GitHub.

## Reprise
Quand les déploiements Netlify redeviennent disponibles :
1. publier main ;
2. confirmer le SHA déployé ;
3. tester landing mobile ;
4. tester /api/events ;
5. tester authentification /api/summary ;
6. tester attribution UTM ;
7. exécuter PRE_LAUNCH_QA.md ;
8. passer l'organique en GO uniquement si les contrôles passent.
