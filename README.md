# Permis B — Entraînement théorique (Belgique)

Application Nuxt 3 + Tailwind CSS pour s'entraîner au code de la route belge (catégorie B) :

- **QCM par leçon** : un jeu de questions par PDF de cours, avec correction immédiate et lien direct vers la page exacte du PDF source.
- **Simulation d'examen** : 50 questions tirées au hasard dans toutes les leçons, avec le barème officiel (départ à 50 points, -1 point par faute simple, -5 points par faute grave, réussite à partir de 41/50, arrêt anticipé si l'objectif n'est plus mathématiquement atteignable).

Les questions sont générées à partir du contenu réel des PDF fournis dans `content/questions/*.json` (un fichier par leçon). Chaque question référence uniquement des faits explicitement présents dans le PDF correspondant.

## Développement

```bash
npm install
npm run dev
```

## Génération statique (GitHub Pages)

```bash
npm run generate
```

Le site statique est produit dans `.output/public`. Le déploiement sur GitHub Pages est automatisé via `.github/workflows/deploy.yml` à chaque push sur `main`.

## Structure

- `content/questions/*.json` — banques de questions par leçon (générées à partir des PDF).
- `public/pdf/*.pdf` — copie des supports de cours, utilisés pour les liens de référence (`/pdf/<fichier>.pdf#page=N`).
- `app/pages/` — pages Nuxt (accueil, leçon, examen).
- `app/composables/useQuestionBanks.ts` — chargement des banques de questions.
- `app/composables/useExamSession.ts` — logique de tirage et de barème de l'examen blanc.

## Limites de précision

Les questions ne portent que sur des informations textuelles explicites des PDF. Certaines données présentées sous forme d'images ou de tableaux non extractibles (ex. certains tableaux de vitesses maximales) n'ont volontairement pas été utilisées pour éviter toute approximation.
