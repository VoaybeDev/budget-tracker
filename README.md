# 💰 BudgetCraft — Application de Gestion de Budget

> Application de budget personnel construite avec **React**, dotée d'un design dark teal/cyan premium, de graphiques CSS natifs (Donut + Barres), d'une recherche temps réel et d'un suivi revenus/dépenses complet.

<br/>

## 📸 Aperçu

```
┌──────────────────────────────────────────────────────┐
│  💰 BudgetCraft                       8 transactions │  ← Navbar sticky
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  ← Stats
│  │ ⚖️ Solde   │  │ 📈 Revenus │  │ 📉 Dépenses│     │
│  │ 3 107,00 € │  │ 3 000,00 € │  │   994,00 € │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  ┌─────────────────┐  ┌───────────────────────────┐ │  ← Graphiques
│  │   ◎ Donut       │  │ 📊 Barres catégories       │ │
│  │  75% Revenus    │  │ 🏠 Logement    750 €  ████ │ │
│  │                 │  │ 🍔 Alimentation 85 €  ██   │ │
│  │  ● Cyan 75%     │  │ 📚 Éducation    57 €  █    │ │
│  │  ● Rouge 25%    │  │ 🚗 Transport    48 €  █    │ │
│  └─────────────────┘  └───────────────────────────┘ │
│                                                      │
│  Nouvelle transaction                                │  ← Formulaire
│  [ 📉 Dépense ]  [ 📈 Revenu ]                      │
│  ┌─────────────┐  ┌──────────┐                      │
│  │ Libellé     │  │ Montant  │                      │
│  └─────────────┘  └──────────┘                      │
│  ┌─────────────┐  ┌──────────┐                      │
│  │ Catégorie ▾ │  │ Date     │                      │
│  └─────────────┘  └──────────┘                      │
│  [ ＋ Ajouter dépense ]                              │
│                                                      │
│  🔍 Rechercher…    [ Tout ][ 📈 Revenus ][ 📉 Dép ] │  ← Filtres
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 💼  Salaire mars       Salaire · 1 mars  +2 400│ │  ← Transactions
│  │ 🏠  Loyer              Logement · 2 mars  − 750│ │
│  │ 🍔  Courses semaine    Aliment. · 5 mars  −  85│ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│          ⌨️ Crafted by VoaybeDev →                  │  ← Signature
└──────────────────────────────────────────────────────┘
```

<br/>

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) ≥ 18.x
- npm ≥ 9.x (ou pnpm / yarn)

### Installation

```bash
# 1. Créer le projet React
npx create-react-app budget-tracker
cd budget-tracker

# 2. Copier les fichiers
cp BudgetApp.jsx  src/BudgetApp.jsx
cp index.css      src/index.css

# 3. Modifier src/App.jsx
```

**`src/App.jsx`**
```jsx
import BudgetApp from './BudgetApp';

export default function App() {
  return <BudgetApp />;
}
```

```bash
# 4. Lancer l'application
npm start
```

L'application s'ouvre sur **http://localhost:3000**

<br/>

## 🗂️ Structure des fichiers

```
budget-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx           ← Point d'entrée React
│   ├── BudgetApp.jsx     ← Composant principal + logique + sous-composants
│   └── index.css         ← Tous les styles (design tokens + composants)
├── package.json
└── README.md
```

<br/>

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| **Ajout transaction** | Formulaire : libellé, montant, catégorie, date |
| **Type toggle** | Basculer entre Revenu et Dépense d'un clic |
| **Suppression** | Bouton ✕ sur chaque transaction |
| **Solde en temps réel** | Calculé automatiquement (revenus − dépenses) |
| **Carte solde adaptatif** | Verte si positif, rouge si négatif |
| **Graphique Donut** | Ratio revenus/dépenses en CSS pur (`conic-gradient`) |
| **Graphique Barres** | Top 5 catégories de dépenses en CSS pur |
| **Recherche** | Filtre temps réel sur libellé et catégorie |
| **Filtre type** | Onglets : Tout / Revenus / Dépenses |
| **Tri automatique** | Transactions triées par date décroissante |
| **Signature** | Lien cliquable VoaybeDev → GitHub |
| **100% Responsive** | Mobile, tablette, desktop |

<br/>

## 🧩 Architecture du composant

```
<BudgetApp>
 ├── State
 │    ├── transactions[]    → Liste complète des transactions
 │    ├── txType            → "income" | "expense" (type du formulaire)
 │    ├── form{}            → { label, amount, category, date }
 │    ├── search            → Texte de recherche
 │    └── filterType        → "all" | "income" | "expense"
 │
 ├── Calculs (useMemo)
 │    ├── totalIncome       → Somme des revenus
 │    ├── totalExpense      → Somme des dépenses
 │    ├── balance           → totalIncome − totalExpense
 │    └── filtered          → Transactions filtrées (search + type)
 │
 ├── Handlers
 │    ├── handleChange()    → Met à jour un champ du formulaire
 │    ├── handleTypeChange()→ Change le type + adapte les catégories
 │    ├── handleSubmit()    → Valide et ajoute la transaction
 │    └── handleDelete()    → Supprime une transaction par ID
 │
 └── Sous-composants
      ├── <StatCard />      → Carte de statistique (solde, revenus, dépenses)
      ├── <DonutChart />    → Graphique donut CSS (conic-gradient)
      └── <BarChart />      → Graphique barres CSS horizontal (top 5 dépenses)
```

<br/>

## 🎨 Design System

### Palette (CSS Custom Properties)

| Variable | Valeur | Usage |
|---|---|---|
| `--grad-bg` | `#020c18 → #071e33 → #0a2744` | Fond sombre de l'app |
| `--grad-text` | `#00d2ff → #48cae4 → #90e0ef` | Titres en gradient cyan |
| `--grad-income` | `#00d2ff → #00b4d8` | Revenus (cyan) |
| `--grad-expense` | `#ff6b6b → #ee5a24` | Dépenses (corail) |
| `--grad-balance` | `#f9c74f → #f4a261` | Solde positif (ambre) |
| `--grad-balance-neg` | `#ff6b6b → #c9184a` | Solde négatif (rouge) |
| `--text` | `rgba(255,255,255,0.92)` | Texte principal |
| `--text-muted` | `rgba(255,255,255,0.42)` | Texte secondaire |

### Typographie

| Police | Usage |
|---|---|
| [Syne](https://fonts.google.com/specimen/Syne) | Titres, valeurs financières, navbar |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | Corps de texte, labels, inputs |

### Breakpoints responsive

| Breakpoint | Comportement |
|---|---|
| `> 900px` | 3 stats, graphiques côte à côte |
| `≤ 900px` | Stats 2 colonnes, graphiques empilés |
| `≤ 640px` | Tout en 1 colonne, topbar vertical |
| `≤ 480px` | Boutons pleine largeur, date masquée dans les items |

<br/>

## 📦 Catégories disponibles

### Dépenses
```
Alimentation · Logement · Transport · Santé
Loisirs · Vêtements · Éducation · Autre
```

### Revenus
```
Salaire · Freelance · Investissement
Remboursement · Cadeau · Autre
```

Pour ajouter des catégories, modifier les tableaux dans `BudgetApp.jsx` :

```jsx
const EXPENSE_CATEGORIES = [
  "Alimentation",
  "Ma nouvelle catégorie", // ← Ajouter ici
  // ...
];

// Ajouter aussi l'emoji dans CATEGORY_ICONS :
const CATEGORY_ICONS = {
  "Ma nouvelle catégorie": "🏷️",
  // ...
};
```

<br/>

## 🛠️ Personnalisation

### Changer les couleurs du thème

Modifier les variables dans `index.css` → section `DESIGN TOKENS` :

```css
:root {
  --grad-bg:      linear-gradient(135deg, #votre-fond-1, #votre-fond-2);
  --grad-text:    linear-gradient(90deg, #titre-1, #titre-2);
  --grad-income:  linear-gradient(135deg, #revenu-1, #revenu-2);
  --grad-expense: linear-gradient(135deg, #dépense-1, #dépense-2);
}
```

### Connecter une API REST

Remplacer `useState(INITIAL_TRANSACTIONS)` par un `useEffect` :

```jsx
import { useState, useEffect } from "react";

const [transactions, setTransactions] = useState([]);

// Chargement initial
useEffect(() => {
  fetch("https://votre-api.com/transactions")
    .then((res) => res.json())
    .then(setTransactions);
}, []);

// Ajout
const handleSubmit = async () => {
  const res = await fetch("https://votre-api.com/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, type: txType }),
  });
  const newTx = await res.json();
  setTransactions((prev) => [newTx, ...prev]);
};

// Suppression
const handleDelete = async (id) => {
  await fetch(`https://votre-api.com/transactions/${id}`, { method: "DELETE" });
  setTransactions((prev) => prev.filter((t) => t.id !== id));
};
```

### Ajouter localStorage (persistance)

```jsx
// Charger depuis localStorage au démarrage
const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("budget-transactions");
  return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
});

// Sauvegarder à chaque changement
useEffect(() => {
  localStorage.setItem("budget-transactions", JSON.stringify(transactions));
}, [transactions]);
```

<br/>

## 🔍 Guide des classes CSS

| Classe | Description |
|---|---|
| `.app` | Wrapper global + blobs décoratifs |
| `.navbar` | Barre de navigation sticky glassmorphism |
| `.container` | Conteneur centré (max 1140px) avec `flex-direction: column` |
| `.stats-grid` | Grille 3 colonnes des cartes de stat |
| `.stat-card` | Card de statistique générique |
| `.stat-card--balance` | Variante solde positif (ambre) |
| `.stat-card--balance-neg` | Variante solde négatif (rouge) |
| `.stat-card--income` | Variante revenus (cyan) |
| `.stat-card--expense` | Variante dépenses (corail) |
| `.charts-grid` | Grille 2 colonnes pour les graphiques |
| `.chart-card` | Card partagée donut + barres |
| `.donut` | Graphique donut (`conic-gradient` via style inline) |
| `.donut-hole` | Centre creux du donut |
| `.bar-track` / `.bar-fill` | Barre de progression horizontale |
| `.form-card` | Card du formulaire d'ajout |
| `.type-toggle` | Sélecteur Revenu / Dépense |
| `.toggle-btn--active-income` | Bouton actif (cyan) |
| `.toggle-btn--active-expense` | Bouton actif (rouge) |
| `.btn--income` | Bouton ajouter revenu |
| `.btn--expense` | Bouton ajouter dépense |
| `.topbar` | Barre recherche + filtres |
| `.filter-tab` | Onglet de filtre |
| `.filter-tab--active` | Onglet sélectionné |
| `.tx-list` | Liste des transactions |
| `.tx-item` | Item de transaction |
| `.tx-item--income` | Bordure cyan au hover |
| `.tx-item--expense` | Bordure corail au hover |
| `.tx-amount--income` | Montant en cyan |
| `.tx-amount--expense` | Montant en corail |
| `.tx-delete` | Bouton ✕ de suppression |
| `.signature` | Lien signature footer |

<br/>

## 📄 Licence

Ce projet est open source — libre de le modifier et de le distribuer.  
Un ⭐ sur le dépôt est toujours apprécié !

<br/>

---

<div align="center">

**⌨️ Crafted with ❤️ by [VoaybeDev](https://github.com/VoaybeDev?tab=repositories)**

</div>