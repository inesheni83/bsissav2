# Guide de contribution

## Architecture des branches

### Branches principales
- `main` : Production (protégée)
- `develop` : Intégration (protégée)

### Branches de travail

#### Nouvelles fonctionnalités
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-fonctionnalite

#### Corrections de bugs
git checkout develop
git checkout -b bugfix/description-du-bug

#### Hotfix (urgent - production)
git checkout main
git checkout -b hotfix/description-critique

#### Release
git checkout develop
git checkout -b release/vX.Y.Z

## Workflow

1. Crée ta branche depuis `develop` (ou `main` pour hotfix)
2. Développe et commite régulièrement
3. Pousse ta branche : `git push -u origin ma-branche`
4. Ouvre une Pull Request vers `develop` (ou `main` pour hotfix)
5. Attends la revue de code et l'approbation
6. Merge via GitHub (squash ou merge commit selon préférence)
7. Supprime la branche après merge

## Convention de commits

Utilise des messages clairs :
- `feat: ajoute l'authentification OAuth`
- `fix: corrige la validation email`
- `docs: met à jour le README`
- `refactor: restructure le module utilisateur`
- `test: ajoute tests pour le login`

## Versioning

Nous suivons [Semantic Versioning](https://semver.org/) :
- MAJOR.MINOR.PATCH (ex: 1.2.3)