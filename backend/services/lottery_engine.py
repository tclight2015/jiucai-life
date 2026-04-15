"""
Draw algorithm — weighted random selection using block hash as seed.
"""
import random
import hashlib
import logging
from datetime import datetime, timezone
from models import db, Wallet, LotteryWinner, UserCard

logger = logging.getLogger(__name__)


def _get_eligible_wallets(module: str):
    """Return list of Wallet objects eligible for this module."""
    q = Wallet.query.filter_by(is_blacklisted=False).filter(
        Wallet.jiucai_balance > 0
    )
    all_wallets = q.all()
    if not all_wallets:
        return []

    # Sort by balance descending for rank-based filtering
    all_wallets.sort(key=lambda w: int(w.jiucai_balance or 0), reverse=True)
    total = len(all_wallets)

    if module == "top50":
        cutoff = total // 2
        return all_wallets[:cutoff]
    elif module == "bottom50":
        cutoff = total // 2
        return all_wallets[cutoff:]
    elif module == "worst50":
        # Would filter by loss — default to all for now
        return all_wallets
    elif module == "all":
        return all_wallets
    else:
        return all_wallets  # custom: caller pre-filters


def _get_card_multiplier(wallet_address: str) -> float:
    """Return combined weight card multiplier for enabled cards."""
    cards = UserCard.query.filter_by(wallet_address=wallet_address).filter(
        UserCard.card_type == "weight",
        UserCard.enabled_quantity > 0,
    ).all()

    multiplier = 1.0
    used = 0
    for card in cards:
        for _ in range(min(card.enabled_quantity, 2 - used)):
            multiplier *= (card.card_multiplier or 1.0)
            used += 1
            if used >= 2:
                break
        if used >= 2:
            break

    # Check for special star card
    star = UserCard.query.filter_by(
        wallet_address=wallet_address, card_type="special"
    ).filter(UserCard.expires_at > datetime.now(timezone.utc)).first()
    if star:
        # Grant top-rank weight: 5x
        return max(multiplier, 5.0)

    return multiplier


def run_draw(lottery) -> list:
    """
    Run the draw for a Lottery object.
    Returns list of LotteryWinner objects (not yet committed).
    """
    eligible = _get_eligible_wallets(lottery.module)
    if not eligible:
        logger.warning("No eligible wallets for lottery %s", lottery.id)
        return []

    # Build weighted population
    seed_input = (lottery.block_hash or str(lottery.id)).encode()
    seed = int(hashlib.sha256(seed_input).hexdigest(), 16)
    rng = random.Random(seed)

    population = []
    weights = []

    for w in eligible:
        card_mult = _get_card_multiplier(w.address)
        final_w = w.final_weight(card_multiplier=card_mult)
        population.append(w)
        weights.append(max(final_w, 0.01))  # floor at 0.01 so everyone has a chance

    # Sample without replacement
    count = min(lottery.winner_count, len(population))
    chosen = []
    remaining_pop = list(zip(population, weights))

    for _ in range(count):
        if not remaining_pop:
            break
        pop_list = [x[0] for x in remaining_pop]
        w_list = [x[1] for x in remaining_pop]
        total_w = sum(w_list)
        r = rng.uniform(0, total_w)
        cumulative = 0
        selected_idx = 0
        for i, wt in enumerate(w_list):
            cumulative += wt
            if r <= cumulative:
                selected_idx = i
                break
        chosen.append(remaining_pop[selected_idx])
        remaining_pop.pop(selected_idx)

    usdt_each = float(lottery.usdt_prize or 0) / count if count else 0
    jiucai_each = int(lottery.jiucai_prize or 0) // count if count else 0

    winners = []
    for wallet, weight in chosen:
        cards = UserCard.query.filter_by(
            wallet_address=wallet.address, card_type="prize", enabled_quantity=1
        ).all()
        prize_mult = 1.0
        used = 0
        for card in cards:
            if used >= 2:
                break
            prize_mult *= (card.card_multiplier or 1.0)
            used += 1

        win = LotteryWinner(
            lottery_id=lottery.id,
            wallet_address=wallet.address,
            usdt_amount=usdt_each * prize_mult,
            jiucai_amount=jiucai_each * prize_mult,
            weight_at_draw=weight,
            cards_used=[c.to_dict() for c in cards[:2]],
        )
        db.session.add(win)
        winners.append(win)

    lottery.eligible_snapshot = [
        {"address": w.address, "weight": wt} for w, wt in zip(population, weights)
    ]
    db.session.flush()
    return winners
