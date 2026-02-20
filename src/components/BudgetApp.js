/**
 * @file BudgetApp.jsx
 * @description Application de gestion de budget personnel.
 *              Permet de suivre revenus et dépenses, visualiser des graphiques
 *              CSS natifs (donut + barres), filtrer et rechercher les transactions.
 *
 * Fonctionnalités :
 *  - Ajout / suppression de transactions (revenu ou dépense)
 *  - Solde total calculé en temps réel
 *  - Graphique Donut (ratio revenus / dépenses)
 *  - Graphique en barres (dépenses par catégorie)
 *  - Recherche temps réel + filtre par type
 *  - Historique trié par date décroissante
 *  - Design 100% responsive avec gradient sombre teal/cyan
 *
 * @author VoaybeDev
 * @link   https://github.com/VoaybeDev?tab=repositories
 * @version 1.0.0
 */

import { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

/** Catégories de dépenses disponibles */
const EXPENSE_CATEGORIES = [
  "Alimentation",
  "Logement",
  "Transport",
  "Santé",
  "Loisirs",
  "Vêtements",
  "Éducation",
  "Autre",
];

/** Catégories de revenus disponibles */
const INCOME_CATEGORIES = [
  "Salaire",
  "Freelance",
  "Investissement",
  "Remboursement",
  "Cadeau",
  "Autre",
];

/** Emoji associé à chaque catégorie pour un affichage expressif */
const CATEGORY_ICONS = {
  Alimentation:   "🍔",
  Logement:       "🏠",
  Transport:      "🚗",
  Santé:          "💊",
  Loisirs:        "🎮",
  Vêtements:      "👕",
  Éducation:      "📚",
  Salaire:        "💼",
  Freelance:      "💻",
  Investissement: "📈",
  Remboursement:  "🔄",
  Cadeau:         "🎁",
  Autre:          "📦",
};

/** Transactions de démonstration */
const INITIAL_TRANSACTIONS = [
  { id: 1, type: "income",   label: "Salaire mars",         amount: 2400, category: "Salaire",       date: "2025-03-01" },
  { id: 2, type: "expense",  label: "Loyer",                amount: 750,  category: "Logement",      date: "2025-03-02" },
  { id: 3, type: "expense",  label: "Courses semaine",      amount: 85,   category: "Alimentation",  date: "2025-03-05" },
  { id: 4, type: "income",   label: "Mission freelance",    amount: 600,  category: "Freelance",     date: "2025-03-08" },
  { id: 5, type: "expense",  label: "Abonnement transport", amount: 48,   category: "Transport",     date: "2025-03-10" },
  { id: 6, type: "expense",  label: "Pharmacie",            amount: 32,   category: "Santé",         date: "2025-03-12" },
  { id: 7, type: "expense",  label: "Netflix + Spotify",   amount: 22,   category: "Loisirs",       date: "2025-03-14" },
  { id: 8, type: "expense",  label: "Livres technique",    amount: 57,   category: "Éducation",     date: "2025-03-18" },
];

let nextId = 9;

/**
 * Formate un nombre en euros (fr-FR).
 * @param {number} n - Montant à formater.
 * @returns {string} Exemple : "2 400,00 €"
 */
const formatCurrency = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

/**
 * Formate une date ISO en date lisible (fr-FR).
 * @param {string} iso - Date au format "YYYY-MM-DD".
 * @returns {string} Exemple : "5 mars 2025"
 */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/**
 * Retourne la date du jour au format ISO "YYYY-MM-DD".
 * @returns {string}
 */
const today = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Carte de statistique (solde, revenus, dépenses).
 * @param {{ label: string, value: string, sub: string, variant: string, icon: string }} props
 */
function StatCard({ label, value, sub, variant, icon }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

/**
 * Graphique Donut en CSS pur (conic-gradient).
 * Affiche le ratio revenus / dépenses.
 *
 * @param {{ income: number, expense: number }} props
 */
function DonutChart({ income, expense }) {
  const total = income + expense;
  /** Pourcentage des revenus sur le total (0–100) */
  const incomePct = total === 0 ? 50 : Math.round((income / total) * 100);
  const expensePct = 100 - incomePct;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Répartition</h3>
      <div className="donut-wrap">
        <div
          className="donut"
          style={{
            background: `conic-gradient(
              #00d2ff 0% ${incomePct}%,
              #ff6b6b ${incomePct}% 100%
            )`,
          }}
        >
          <div className="donut-hole">
            <p className="donut-pct">{incomePct}%</p>
            <p className="donut-label">Revenus</p>
          </div>
        </div>
      </div>
      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot legend-dot--income" />
          <span>Revenus ({incomePct}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-dot--expense" />
          <span>Dépenses ({expensePct}%)</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Graphique en barres horizontal par catégorie de dépenses.
 * Les barres sont en CSS pur, la largeur est calculée en %.
 *
 * @param {{ transactions: Array }} props
 */
function BarChart({ transactions }) {
  /** Calcule le total dépensé par catégorie */
  const byCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 catégories
  }, [transactions]);

  const max = byCategory[0]?.[1] || 1;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Top dépenses</h3>
      {byCategory.length === 0 ? (
        <p className="chart-empty">Aucune dépense enregistrée.</p>
      ) : (
        <div className="bar-list">
          {byCategory.map(([cat, amt]) => {
            const pct = Math.round((amt / max) * 100);
            return (
              <div key={cat} className="bar-row">
                <div className="bar-meta">
                  <span className="bar-icon">{CATEGORY_ICONS[cat] || "📦"}</span>
                  <span className="bar-cat">{cat}</span>
                  <span className="bar-amt">{formatCurrency(amt)}</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BudgetApp — Composant racine de l'application de budget.
 * Gère l'état global : transactions, formulaire, recherche, filtre.
 */
export default function BudgetApp() {

  // ── State ─────────────────────────────────────────────────────────────────

  /** Liste de toutes les transactions */
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  /** Type sélectionné dans le formulaire : "income" ou "expense" */
  const [txType, setTxType] = useState("expense");

  /** Données du formulaire d'ajout */
  const [form, setForm] = useState({
    label:    "",
    amount:   "",
    category: EXPENSE_CATEGORIES[0],
    date:     today(),
  });

  /** Texte de recherche */
  const [search, setSearch] = useState("");

  /** Filtre type : "all" | "income" | "expense" */
  const [filterType, setFilterType] = useState("all");

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Met à jour le formulaire lors d'un changement d'input.
   * @param {React.ChangeEvent} e
   */
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /**
   * Change le type de transaction (income / expense) et adapte
   * la catégorie par défaut en conséquence.
   * @param {"income"|"expense"} type
   */
  const handleTypeChange = (type) => {
    setTxType(type);
    setForm((f) => ({
      ...f,
      category: type === "income"
        ? INCOME_CATEGORIES[0]
        : EXPENSE_CATEGORIES[0],
    }));
  };

  /**
   * Ajoute une nouvelle transaction si les champs sont valides.
   * Valide : label non vide, montant > 0, date renseignée.
   */
  const handleSubmit = () => {
    const amount = parseFloat(form.amount);
    if (!form.label.trim() || isNaN(amount) || amount <= 0 || !form.date) return;

    const newTx = {
      id: nextId++,
      type: txType,
      label: form.label.trim(),
      amount,
      category: form.category,
      date: form.date,
    };

    setTransactions((prev) =>
      [newTx, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
    );

    // Réinitialise le formulaire (conserve type et date)
    setForm((f) => ({
      label:    "",
      amount:   "",
      category: txType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      date:     f.date,
    }));
  };

  /**
   * Supprime une transaction par son ID.
   * @param {number} id
   */
  const handleDelete = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  // ── Calculs dérivés ───────────────────────────────────────────────────────

  /** Total des revenus */
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  /** Total des dépenses */
  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  /** Solde net */
  const balance = totalIncome - totalExpense;

  /**
   * Transactions filtrées selon la recherche textuelle et le type sélectionné.
   * La recherche porte sur le libellé et la catégorie.
   */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((t) => {
      const matchText =
        t.label.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchType = filterType === "all" || t.type === filterType;
      return matchText && matchType;
    });
  }, [transactions, search, filterType]);

  /** Catégories disponibles selon le type sélectionné dans le formulaire */
  const categories =
    txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="navbar">
        <span className="navbar-brand">💰 BudgetCraft</span>
        <span className="navbar-count">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </span>
      </nav>

      <div className="container">

        {/* ── Cartes de statistiques ─────────────────────────────────── */}
        <div className="stats-grid">
          <StatCard
            label="Solde net"
            value={formatCurrency(balance)}
            sub={balance >= 0 ? "En bonne santé 🟢" : "Attention ⚠️"}
            variant={balance >= 0 ? "balance" : "balance-neg"}
            icon="⚖️"
          />
          <StatCard
            label="Total revenus"
            value={formatCurrency(totalIncome)}
            sub={`${transactions.filter((t) => t.type === "income").length} entrées`}
            variant="income"
            icon="📈"
          />
          <StatCard
            label="Total dépenses"
            value={formatCurrency(totalExpense)}
            sub={`${transactions.filter((t) => t.type === "expense").length} sorties`}
            variant="expense"
            icon="📉"
          />
        </div>

        {/* ── Graphiques ─────────────────────────────────────────────── */}
        <div className="charts-grid">
          <DonutChart income={totalIncome} expense={totalExpense} />
          <BarChart transactions={transactions} />
        </div>

        {/* ── Formulaire d'ajout ─────────────────────────────────────── */}
        <div className="form-card">
          <p className="section-title">Nouvelle transaction</p>
          <p className="section-sub">Enregistrez un revenu ou une dépense.</p>

          {/* Sélecteur type */}
          <div className="type-toggle">
            <button
              className={`toggle-btn${txType === "expense" ? " toggle-btn--active-expense" : ""}`}
              onClick={() => handleTypeChange("expense")}
            >
              📉 Dépense
            </button>
            <button
              className={`toggle-btn${txType === "income" ? " toggle-btn--active-income" : ""}`}
              onClick={() => handleTypeChange("income")}
            >
              📈 Revenu
            </button>
          </div>

          {/* Champs */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="label">Libellé</label>
              <input
                id="label"
                type="text"
                name="label"
                placeholder="Ex : Courses du week-end"
                value={form.label}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Montant (€)</label>
              <input
                id="amount"
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className={`btn btn--submit btn--${txType}`}
              onClick={handleSubmit}
            >
              {txType === "income" ? "＋ Ajouter revenu" : "＋ Ajouter dépense"}
            </button>
          </div>
        </div>

        {/* ── Historique des transactions ────────────────────────────── */}
        <section aria-label="Historique des transactions">
          <div className="topbar">
            <div className="search-wrap">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="Rechercher une transaction…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {["all", "income", "expense"].map((v) => (
                <button
                  key={v}
                  className={`filter-tab${filterType === v ? " filter-tab--active" : ""}`}
                  onClick={() => setFilterType(v)}
                >
                  {v === "all" ? "Tout" : v === "income" ? "📈 Revenus" : "📉 Dépenses"}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div className="tx-list">
            {filtered.length === 0 ? (
              <div className="empty">
                <span className="empty-icon" aria-hidden="true">🔎</span>
                <h3>Aucun résultat</h3>
                <p>Essayez un autre mot-clé ou ajoutez une transaction.</p>
              </div>
            ) : (
              filtered.map((tx, i) => (
                <div
                  key={tx.id}
                  className={`tx-item tx-item--${tx.type}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Icône catégorie */}
                  <div className={`tx-icon-wrap tx-icon-wrap--${tx.type}`}>
                    <span className="tx-icon">
                      {CATEGORY_ICONS[tx.category] || "📦"}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="tx-info">
                    <p className="tx-label">{tx.label}</p>
                    <p className="tx-meta">
                      <span className="tx-category">{tx.category}</span>
                      <span className="tx-date">{formatDate(tx.date)}</span>
                    </p>
                  </div>

                  {/* Montant */}
                  <p className={`tx-amount tx-amount--${tx.type}`}>
                    {tx.type === "income" ? "+" : "−"}
                    {formatCurrency(tx.amount)}
                  </p>

                  {/* Supprimer */}
                  <button
                    className="tx-delete"
                    onClick={() => handleDelete(tx.id)}
                    aria-label={`Supprimer la transaction : ${tx.label}`}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── Footer — Signature VoaybeDev ──────────────────────────────── */}
      <footer className="footer">
        <a
          href="https://github.com/VoaybeDev?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="signature"
          aria-label="Voir les projets de VoaybeDev sur GitHub"
        >
          <span className="signature-icon">⌨️</span>
          <span className="signature-text">
            Crafted by <strong>VoaybeDev</strong>
          </span>
          <span className="signature-arrow">→</span>
        </a>
      </footer>

    </div>
  );
}