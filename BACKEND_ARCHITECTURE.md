# Backend Architecture - Bot de Trading DeFi

Guide complet pour implémenter le backend Python du bot de trading.

## ⚠️ ATTENTION - Sécurité Critique

**Avant de commencer :**
1. Ce backend gérera de l'argent réel - chaque bug peut coûter cher
2. Ne JAMAIS stocker de clés privées en clair
3. Tester exhaustivement sur testnet avant mainnet
4. Implémenter des limites de pertes strictes
5. Avoir un système de monitoring 24/7

## 🏗️ Architecture Globale

```
┌─────────────────┐
│   Frontend      │  React + Web3
│   (Cette App)   │  ← Connexion wallet sécurisée
└────────┬────────┘
         │ API REST / WebSocket
         ↓
┌─────────────────┐
│   Backend API   │  FastAPI / Flask
│   Python        │  ← Point d'entrée
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────┐
    ↓         ↓            ↓          ↓
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Trading│ │ Market │ │  Risk  │ │  DEX   │
│ Engine │ │  Data  │ │  Mgmt  │ │ Client │
└────────┘ └────────┘ └────────┘ └────────┘
    │         │            │          │
    └─────────┴────────────┴──────────┘
                    │
                    ↓
            ┌───────────────┐
            │   Database    │  PostgreSQL / SQLite
            │   (Positions, │
            │    Trades,    │
            │    Config)    │
            └───────────────┘
```

## 📦 Stack Technique Recommandé

### Core
- **Python 3.10+**
- **FastAPI** : API REST moderne
- **Web3.py** : Interaction blockchain
- **Pandas / NumPy** : Calculs et indicateurs
- **SQLAlchemy** : ORM pour la base de données
- **Redis** : Cache et queue de jobs

### Data & Analysis
- **TA-Lib** : Indicateurs techniques avancés
- **ccxt** : Interface multi-exchange (optionnel)
- **websockets** : Connexions WebSocket

### Monitoring & Sécurité
- **python-dotenv** : Variables d'environnement
- **cryptography** : Chiffrement des clés
- **prometheus-client** : Métriques
- **loguru** : Logging avancé

## 📁 Structure du Projet

```
defi-trading-bot/
├── frontend/                 # Cette application React
│   ├── src/
│   └── ...
│
├── backend/
│   ├── main.py              # Point d'entrée FastAPI
│   ├── config.py            # Configuration globale
│   ├── requirements.txt     # Dépendances Python
│   │
│   ├── core/
│   │   ├── strategy.py      # Logique de trading
│   │   ├── indicators.py    # Calcul des indicateurs
│   │   ├── risk.py          # Gestion du risque
│   │   └── executor.py      # Exécution des trades
│   │
│   ├── services/
│   │   ├── dex.py           # Client DEX (Uniswap, etc.)
│   │   ├── market_data.py   # Récupération prix
│   │   ├── wallet.py        # Gestion wallet
│   │   └── notifications.py # Alertes (Telegram, email)
│   │
│   ├── models/
│   │   ├── position.py      # Modèle Position
│   │   ├── trade.py         # Modèle Trade
│   │   └── config.py        # Modèle Config
│   │
│   ├── api/
│   │   ├── routes.py        # Endpoints API
│   │   └── websocket.py     # WebSocket handlers
│   │
│   ├── database/
│   │   ├── session.py       # Configuration DB
│   │   └── migrations/      # Alembic migrations
│   │
│   └── utils/
│       ├── logger.py        # Configuration logging
│       ├── encryption.py    # Chiffrement clés
│       └── helpers.py       # Fonctions utilitaires
│
├── scripts/
│   ├── install.sh           # Installation
│   ├── run.sh               # Lancement
│   └── backtest.py          # Backtesting
│
├── tests/
│   ├── test_strategy.py
│   ├── test_indicators.py
│   └── test_dex.py
│
├── .env.example             # Exemple de configuration
├── docker-compose.yml       # Docker (optionnel)
└── README.md
```

## 🔧 Configuration (.env)

```bash
# Network
NETWORK=arbitrum_mainnet  # ou arbitrum_goerli pour tests
RPC_URL=https://arb1.arbitrum.io/rpc
CHAIN_ID=42161

# Wallet (CHIFFRÉ !)
WALLET_PRIVATE_KEY_ENCRYPTED=...  # Jamais en clair
WALLET_ADDRESS=0x...

# DEX
DEX_ROUTER_ADDRESS=0x...  # Uniswap V3, Camelot, etc.
DEX_FACTORY_ADDRESS=0x...

# Trading Pairs
PAIR_TOKEN_A=WBTC
PAIR_TOKEN_B=USDT
TOKEN_A_ADDRESS=0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f
TOKEN_B_ADDRESS=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9

# Strategy Parameters
SMA_PERIOD=50
BOLLINGER_STD=2.0
ADX_THRESHOLD=25
POSITION_SIZE_PERCENT=10  # % du capital par trade

# Risk Management
MAX_OPEN_POSITIONS=3
STOP_LOSS_PERCENT=3.0
MAX_DRAWDOWN_PERCENT=15.0
COOLDOWN_SECONDS=300

# API
API_HOST=0.0.0.0
API_PORT=8000
API_SECRET_KEY=...  # Pour JWT tokens

# Database
DATABASE_URL=postgresql://user:pass@localhost/trading_bot
# ou sqlite:///./trading_bot.db pour dev

# Monitoring
ENABLE_PROMETHEUS=true
TELEGRAM_BOT_TOKEN=...  # Pour alertes
TELEGRAM_CHAT_ID=...

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/bot.log
```

## 🚀 Implémentation Étape par Étape

### Phase 1 : Core Infrastructure (Semaine 1)

#### 1.1 Configuration de Base
```python
# backend/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Network
    network: str
    rpc_url: str
    chain_id: int

    # Trading
    sma_period: int = 50
    bollinger_std: float = 2.0
    adx_threshold: float = 25.0
    position_size_percent: float = 10.0

    # Risk
    max_open_positions: int = 3
    stop_loss_percent: float = 3.0
    max_drawdown_percent: float = 15.0
    cooldown_seconds: int = 300

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
```

#### 1.2 Database Setup
```python
# backend/models/trade.py
from sqlalchemy import Column, Integer, Float, String, DateTime, Enum
from datetime import datetime
import enum

class TradeSide(enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    side = Column(Enum(TradeSide))
    price = Column(Float)
    amount = Column(Float)
    gas_cost = Column(Float)
    tx_hash = Column(String)
    pnl = Column(Float, nullable=True)
    status = Column(String)  # pending, completed, failed
```

### Phase 2 : Market Data (Semaine 1-2)

```python
# backend/services/market_data.py
import asyncio
import websockets
import json
from typing import Callable, List

class MarketDataService:
    def __init__(self):
        self.ws = None
        self.subscribers: List[Callable] = []

    async def connect_websocket(self, symbol: str = "btcusdt"):
        """Connexion WebSocket Binance"""
        uri = f"wss://stream.binance.com:9443/ws/{symbol}@trade"

        async with websockets.connect(uri) as websocket:
            self.ws = websocket
            async for message in websocket:
                data = json.loads(message)
                price = float(data['p'])

                # Notify subscribers
                for callback in self.subscribers:
                    await callback(price)

    def subscribe(self, callback: Callable):
        """S'abonner aux mises à jour de prix"""
        self.subscribers.append(callback)

    async def get_historical_candles(
        self,
        symbol: str,
        interval: str = "5m",
        limit: int = 200
    ):
        """Récupérer les chandeliers historiques"""
        # Implémentation via API Binance
        pass
```

### Phase 3 : Indicators (Semaine 2)

```python
# backend/core/indicators.py
import pandas as pd
import numpy as np
from typing import Tuple

class Indicators:
    @staticmethod
    def calculate_bollinger_bands(
        prices: pd.Series,
        period: int = 20,
        std_dev: float = 2.0
    ) -> Tuple[float, float, float]:
        """Calcul des Bandes de Bollinger"""
        sma = prices.rolling(window=period).mean().iloc[-1]
        std = prices.rolling(window=period).std().iloc[-1]

        upper = sma + (std_dev * std)
        lower = sma - (std_dev * std)

        return upper, sma, lower

    @staticmethod
    def calculate_adx(
        high: pd.Series,
        low: pd.Series,
        close: pd.Series,
        period: int = 14
    ) -> float:
        """Calcul de l'ADX (Average Directional Index)"""
        # Implémentation complète de l'ADX
        # Utiliser TA-Lib pour plus de précision
        import talib
        adx = talib.ADX(high, low, close, timeperiod=period)
        return adx.iloc[-1]

    @staticmethod
    def is_range_bound(adx: float, threshold: float = 25.0) -> bool:
        """Détermine si le marché est en range"""
        return adx < threshold
```

### Phase 4 : DEX Integration (Semaine 2-3)

```python
# backend/services/dex.py
from web3 import Web3
from typing import Optional
import json

class DEXClient:
    def __init__(self, web3: Web3, router_address: str):
        self.web3 = web3
        self.router_address = router_address

        # Charger l'ABI du router (Uniswap V3, etc.)
        with open("abis/router.json") as f:
            self.router_abi = json.load(f)

        self.router = self.web3.eth.contract(
            address=router_address,
            abi=self.router_abi
        )

    async def swap_exact_input(
        self,
        token_in: str,
        token_out: str,
        amount_in: int,
        amount_out_min: int,
        slippage: float = 0.5
    ) -> Optional[str]:
        """Exécuter un swap sur le DEX"""
        try:
            # Construire la transaction
            tx = self.router.functions.swapExactInputSingle({
                'tokenIn': token_in,
                'tokenOut': token_out,
                'fee': 3000,  # 0.3% fee tier
                'recipient': self.web3.eth.default_account,
                'deadline': int(time.time()) + 300,
                'amountIn': amount_in,
                'amountOutMinimum': amount_out_min,
                'sqrtPriceLimitX96': 0
            }).build_transaction({
                'from': self.web3.eth.default_account,
                'gas': 200000,
                'gasPrice': self.web3.eth.gas_price,
                'nonce': self.web3.eth.get_transaction_count(
                    self.web3.eth.default_account
                )
            })

            # Signer et envoyer
            signed_tx = self.web3.eth.account.sign_transaction(
                tx,
                private_key=os.getenv('WALLET_PRIVATE_KEY')
            )

            tx_hash = self.web3.eth.send_raw_transaction(
                signed_tx.rawTransaction
            )

            # Attendre confirmation
            receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)

            return receipt['transactionHash'].hex()

        except Exception as e:
            logger.error(f"Swap failed: {e}")
            return None
```

### Phase 5 : Trading Strategy (Semaine 3-4)

```python
# backend/core/strategy.py
from typing import Optional, Literal
import pandas as pd

class MeanReversionStrategy:
    def __init__(self, config):
        self.config = config
        self.indicators = Indicators()
        self.positions = []

    async def analyze(
        self,
        price_data: pd.DataFrame
    ) -> Optional[Literal["BUY", "SELL"]]:
        """Analyser le marché et générer un signal"""

        # 1. Calculer les indicateurs
        prices = price_data['close']
        upper, middle, lower = self.indicators.calculate_bollinger_bands(
            prices,
            period=self.config.sma_period,
            std_dev=self.config.bollinger_std
        )

        adx = self.indicators.calculate_adx(
            price_data['high'],
            price_data['low'],
            price_data['close']
        )

        current_price = prices.iloc[-1]

        # 2. Vérifier le filtre de marché
        if not self.indicators.is_range_bound(adx, self.config.adx_threshold):
            logger.info(f"Market is trending (ADX={adx:.2f}), no trading")
            return None

        # 3. Générer les signaux
        if current_price <= lower:
            logger.info(f"BUY signal: price {current_price} <= lower band {lower}")
            return "BUY"

        elif current_price >= upper:
            logger.info(f"SELL signal: price {current_price} >= upper band {upper}")
            return "SELL"

        return None

    def should_take_profit(self, position, current_price: float) -> bool:
        """Vérifier si on doit prendre profit"""
        # Si le prix est revenu vers la moyenne
        pass

    def should_stop_loss(self, position, current_price: float) -> bool:
        """Vérifier le stop-loss"""
        # Si perte > seuil configuré
        pass
```

### Phase 6 : Risk Management (Semaine 4)

```python
# backend/core/risk.py
from typing import Optional

class RiskManager:
    def __init__(self, config):
        self.config = config
        self.total_capital = 0
        self.current_drawdown = 0

    def can_open_position(self, positions: list) -> bool:
        """Vérifier si on peut ouvrir une nouvelle position"""

        # 1. Vérifier le nombre max de positions
        if len(positions) >= self.config.max_open_positions:
            logger.warning("Max positions reached")
            return False

        # 2. Vérifier le drawdown global
        if self.current_drawdown >= self.config.max_drawdown_percent:
            logger.error(f"Max drawdown reached: {self.current_drawdown}%")
            return False

        return True

    def calculate_position_size(
        self,
        capital: float,
        price: float
    ) -> float:
        """Calculer la taille de position"""

        # Utiliser un % du capital disponible
        amount_usd = capital * (self.config.position_size_percent / 100)
        amount_tokens = amount_usd / price

        return amount_tokens

    def update_drawdown(self, pnl: float):
        """Mettre à jour le drawdown courant"""
        if pnl < 0:
            self.current_drawdown += abs(pnl)
        else:
            self.current_drawdown = max(0, self.current_drawdown - pnl)
```

### Phase 7 : Main Bot Loop (Semaine 4-5)

```python
# backend/main.py
import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager

app = FastAPI()

class TradingBot:
    def __init__(self):
        self.config = get_settings()
        self.strategy = MeanReversionStrategy(self.config)
        self.risk_manager = RiskManager(self.config)
        self.dex_client = DEXClient(web3, router_address)
        self.market_data = MarketDataService()

        self.is_running = False
        self.price_buffer = []

    async def start(self):
        """Démarrer le bot"""
        self.is_running = True

        # Démarrer le WebSocket de prix
        asyncio.create_task(self.market_data.connect_websocket())

        # S'abonner aux mises à jour
        self.market_data.subscribe(self.on_price_update)

        # Boucle principale
        await self.run_loop()

    async def on_price_update(self, price: float):
        """Callback sur nouvelle mise à jour de prix"""
        self.price_buffer.append({
            'timestamp': datetime.now(),
            'price': price
        })

        # Garder seulement les 200 dernières
        if len(self.price_buffer) > 200:
            self.price_buffer.pop(0)

    async def run_loop(self):
        """Boucle principale du bot"""

        while self.is_running:
            try:
                # 1. Vérifier qu'on a assez de données
                if len(self.price_buffer) < 50:
                    await asyncio.sleep(5)
                    continue

                # 2. Convertir en DataFrame
                df = pd.DataFrame(self.price_buffer)

                # 3. Analyser et obtenir un signal
                signal = await self.strategy.analyze(df)

                # 4. Exécuter si signal
                if signal:
                    await self.execute_trade(signal, df['price'].iloc[-1])

                # 5. Gérer les positions ouvertes
                await self.manage_positions()

                # 6. Attendre avant la prochaine itération
                await asyncio.sleep(10)

            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                await asyncio.sleep(60)

    async def execute_trade(self, signal: str, price: float):
        """Exécuter un trade"""

        # 1. Vérifier les risques
        if not self.risk_manager.can_open_position(self.positions):
            return

        # 2. Calculer la taille
        size = self.risk_manager.calculate_position_size(
            self.capital,
            price
        )

        # 3. Exécuter sur le DEX
        tx_hash = await self.dex_client.swap_exact_input(
            token_in=TOKEN_A if signal == "BUY" else TOKEN_B,
            token_out=TOKEN_B if signal == "BUY" else TOKEN_A,
            amount_in=int(size * 10**18),  # Convertir en wei
            amount_out_min=...,  # Calculer avec slippage
            slippage=0.5
        )

        # 4. Enregistrer le trade
        if tx_hash:
            trade = Trade(
                side=signal,
                price=price,
                amount=size,
                tx_hash=tx_hash,
                status="completed"
            )
            session.add(trade)
            session.commit()

            logger.info(f"Trade executed: {signal} {size} @ {price}")

# FastAPI endpoints
@app.get("/status")
async def get_status():
    """Statut du bot"""
    return {
        "is_running": bot.is_running,
        "positions": len(bot.positions),
        "capital": bot.capital
    }

@app.post("/start")
async def start_bot():
    """Démarrer le bot"""
    asyncio.create_task(bot.start())
    return {"message": "Bot started"}

@app.post("/stop")
async def stop_bot():
    """Arrêter le bot"""
    bot.is_running = False
    return {"message": "Bot stopped"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🧪 Testing

### Unit Tests
```python
# tests/test_strategy.py
import pytest
from backend.core.strategy import MeanReversionStrategy

def test_buy_signal():
    strategy = MeanReversionStrategy(mock_config)

    # Prix en dessous de la bande inférieure
    signal = strategy.analyze(mock_data_low_price)

    assert signal == "BUY"
```

### Backtesting
```python
# scripts/backtest.py
import pandas as pd
from backend.core.strategy import MeanReversionStrategy

def run_backtest(historical_data: pd.DataFrame):
    """Exécuter un backtest sur des données historiques"""

    strategy = MeanReversionStrategy(config)

    pnl = 0
    trades = []

    for i in range(50, len(historical_data)):
        window = historical_data.iloc[i-50:i]
        signal = strategy.analyze(window)

        if signal:
            # Simuler le trade
            pass

    return {
        'total_pnl': pnl,
        'trades': trades,
        'win_rate': calculate_win_rate(trades)
    }
```

## 🚀 Déploiement

### Option 1 : VPS (Recommandé)
```bash
# Sur un VPS (DigitalOcean, AWS, etc.)
git clone your-repo
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Lancer avec supervisor ou systemd
supervisord -c supervisor.conf
```

### Option 2 : Docker
```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📊 Monitoring

### Prometheus Metrics
```python
from prometheus_client import Counter, Gauge, Histogram

trades_total = Counter('trades_total', 'Total trades executed')
pnl_total = Gauge('pnl_total', 'Total PnL')
trade_duration = Histogram('trade_duration_seconds', 'Trade duration')
```

### Logging
```python
from loguru import logger

logger.add(
    "logs/bot_{time}.log",
    rotation="1 day",
    retention="30 days",
    level="INFO"
)
```

## 🎯 Prochaines Étapes

1. **Implémenter le backend complet** selon cette architecture
2. **Tester exhaustivement sur testnet** (Arbitrum Goerli)
3. **Connecter frontend et backend** via API REST/WebSocket
4. **Backtester** avec 6-12 mois de données historiques
5. **Déployer sur VPS** avec monitoring
6. **Commencer avec de petites sommes** en production
7. **Optimiser les paramètres** basé sur les performances réelles

---

**Note :** Cette architecture est un guide complet mais nécessite une implémentation minutieuse. Prenez le temps de bien tester chaque composant avant de passer en production.
