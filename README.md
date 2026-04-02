# DeFi Trading Bot - Frontend Interface

Interface web professionnelle pour un bot de trading DeFi utilisant la stratégie Mean Reversion sur Layer 2 (Arbitrum).

## ⚠️ AVERTISSEMENT IMPORTANT

**SÉCURITÉ ET RISQUES :**
- Ce bot est conçu à des fins **éducatives et de démonstration**
- Le trading de crypto-monnaies comporte des risques financiers importants
- Ne tradez qu'avec des fonds que vous pouvez vous permettre de perdre
- Testez TOUJOURS sur testnet avant d'utiliser de vrais fonds
- L'utilisation de clés privées comporte des risques de sécurité - utilisez MetaMask

## 🚀 Fonctionnalités Implémentées

### 1. **Prix en Temps Réel**
- Intégration avec l'API Binance (sans clé API requise)
- WebSocket pour les mises à jour de prix en temps réel
- Données historiques (chandeliers 5 minutes)
- Calcul des Bandes de Bollinger en direct

### 2. **Connexion Wallet Sécurisée**
- ✅ **MetaMask** : Connexion sécurisée via extension navigateur
- Vos clés privées ne quittent JAMAIS votre appareil
- Support multi-réseau (Arbitrum, Ethereum, Optimism, etc.)
- Affichage des balances en temps réel (ETH, USDT, USDC, WBTC)

### 3. **Indicateurs Techniques**
- **SMA 50** : Moyenne mobile simple (centre du range)
- **Bollinger Bands** : Bandes supérieure/inférieure (±2σ)
- **ADX** : Détection de marché (trending vs range-bound)

### 4. **Interface Complète**
- Graphique de prix interactif avec Recharts
- Vue d'ensemble des positions ouvertes
- Historique des trades récents
- Statistiques de performance (PnL, Win Rate, etc.)
- Panneau de configuration des paramètres

## 📋 Prérequis

### Installation de MetaMask
1. Installer l'extension MetaMask : https://metamask.io/download/
2. Créer un wallet ou importer un wallet existant
3. Ajouter le réseau Arbitrum One (sera proposé automatiquement par l'app)

### Configuration du Réseau Arbitrum
```
Network Name: Arbitrum One
RPC URL: https://arb1.arbitrum.io/rpc
Chain ID: 42161
Symbol: ETH
Block Explorer: https://arbiscan.io/
```

## 🛠️ Installation

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

## 📱 Utilisation

### 1. Connexion du Wallet
1. Cliquez sur "Connect MetaMask" dans le panneau Wallet Management
2. Approuvez la connexion dans MetaMask
3. Si demandé, changez de réseau vers Arbitrum One
4. Vos balances s'affichent automatiquement

### 2. Visualisation des Prix
- Le graphique affiche les prix BTC/USDT en temps réel via WebSocket
- Les bandes de Bollinger se mettent à jour automatiquement
- L'indicateur ADX montre si le marché est en "range" ou "trending"

### 3. Statut du Marché
- **Range-Bound (ADX < 25)** : Trading actif ✅
- **Trending (ADX ≥ 25)** : Trading en pause ⏸️

### 4. Configuration des Paramètres
Ajustez les paramètres de risque dans le panneau Settings :
- Capital par trade (%)
- Slippage toléré (%)
- Stop-loss (%)
- Max drawdown (%)
- Cooldown entre trades (secondes)

## 🔧 Architecture Technique

### Services Créés

#### `priceService.ts`
- Récupère les prix via l'API Binance
- WebSocket pour les mises à jour en temps réel
- Calcul des indicateurs (Bollinger Bands, ADX)

#### `web3Service.ts`
- Connexion wallet via MetaMask
- Lecture des balances ERC20
- Changement de réseau
- Écoute des événements wallet

### Composants React

- **App.tsx** : Composant principal
- **WalletManager.tsx** : Gestion de la connexion wallet
- **LivePriceChart.tsx** : Graphique de prix en temps réel
- **TradingOverview.tsx** : Vue des positions et trades
- **SettingsPanel.tsx** : Configuration des paramètres
- **PerformanceStats.tsx** : Statistiques de performance

## 🔐 Sécurité

### ✅ Ce qui est SÛR
- Utilisation de MetaMask (clés privées dans l'extension)
- Aucune clé privée stockée côté serveur
- Connexion via Web3 standard
- Transactions signées localement

### ❌ NE JAMAIS
- Partager vos clés privées
- Utiliser des fonds que vous ne pouvez pas perdre
- Déployer en production sans tests approfondis
- Faire confiance aveuglément aux bots de trading

## 📊 Stratégie de Trading

### Mean Reversion / Range Trading

**Entrées :**
- **BUY** quand prix ≤ Bande inférieure
- **SELL** quand prix ≥ Bande supérieure

**Sorties :**
- Take profit à la SMA (retour à la moyenne)
- Stop-loss à ±3σ au-delà des bandes

**Filtre de Marché :**
- Trading actif si ADX < 25 (marché en range)
- Trading désactivé si ADX ≥ 25 (marché trending)

## 🧪 Tests Recommandés

### Phase 1 : Testnet
1. Utiliser Arbitrum Goerli testnet
2. Tester toutes les fonctionnalités avec des faux tokens
3. Vérifier les connexions wallet
4. Valider les calculs d'indicateurs

### Phase 2 : Mainnet (Petites Sommes)
1. Commencer avec de très petites sommes ($10-50)
2. Surveiller pendant plusieurs jours
3. Vérifier les performances
4. Ajuster les paramètres

### Phase 3 : Production (Optionnel)
1. Augmenter progressivement le capital
2. Surveillance active 24/7
3. Stop-loss global configuré
4. Backup des configurations

## 🔮 Prochaines Étapes (Backend)

Pour un bot complet de trading automatique, il faudrait ajouter :

### Backend Python
```python
# Composants nécessaires :
- Connexion DEX (Uniswap V3, Camelot, etc.)
- Moteur d'exécution des trades
- Gestion des positions
- Base de données pour l'historique
- Système de logging avancé
- Backtesting engine
```

### Smart Contracts
- Approbations ERC20 automatiques
- Gestion des swaps DEX
- Protection contre le front-running
- Optimisation du gas

## 📚 Ressources

- [Binance API Docs](https://binance-docs.github.io/apidocs/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Docs](https://docs.metamask.io/)
- [Arbitrum Docs](https://docs.arbitrum.io/)
- [Recharts Documentation](https://recharts.org/)

## 📄 Licence

MIT License - À des fins éducatives uniquement

## 🤝 Support

Pour des questions ou du support :
- Ouvrir une issue sur GitHub
- Documentation MetaMask pour les problèmes de wallet
- Documentation Binance pour les problèmes d'API

---

**Disclaimer :** Ce logiciel est fourni "tel quel" sans garantie d'aucune sorte. Les auteurs ne sont pas responsables des pertes financières. Utilisez à vos propres risques.
