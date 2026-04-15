"""
APScheduler tasks — runs inside the Flask app process on Railway.
"""
import logging
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler(timezone="Asia/Taipei")


def update_holding_days():
    """Increment holding_days for all wallets that currently hold JIUCAI."""
    with scheduler.app.app_context():
        from models import db, Wallet
        wallets = Wallet.query.filter(Wallet.jiucai_balance > 0).all()
        for w in wallets:
            w.holding_days = (w.holding_days or 0) + 1
        db.session.commit()
        logger.info("Updated holding_days for %d wallets", len(wallets))


def refresh_holding_ranks():
    """Recalculate holding rank for all wallets (every 6h)."""
    with scheduler.app.app_context():
        from models import db, Wallet
        wallets = Wallet.query.filter(
            Wallet.jiucai_balance > 0, Wallet.is_blacklisted == False
        ).order_by(Wallet.jiucai_balance.desc()).all()
        total = len(wallets)
        now = datetime.now(timezone.utc)
        for i, w in enumerate(wallets, 1):
            w.holding_rank = i
            w.total_holders = total
            w.rank_updated_at = now
        db.session.commit()
        logger.info("Refreshed ranks for %d wallets", total)


def send_daily_report():
    with scheduler.app.app_context():
        from models import Pool, Claim, Wallet
        from services.telegram_notify import send_daily_report as tg_report
        pool = Pool.query.first()
        pending_claims = Claim.query.filter_by(status="pending").count()
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        new_wallets = Wallet.query.filter(Wallet.first_seen >= today_start).count()
        tg_report({
            "usdt_balance": str(pool.usdt_balance if pool else 0),
            "jiucai_prize": str(pool.jiucai_prize_balance if pool else 0),
            "total_usdt_paid_out": str(pool.total_usdt_paid_out if pool else 0),
            "pending_claims": pending_claims,
            "new_wallets": new_wallets,
        })


def process_scheduled_lotteries():
    """Check for lotteries due to run and trigger the draw."""
    with scheduler.app.app_context():
        from models import Lottery
        from services.lottery_engine import run_draw
        from services.telegram_notify import notify_owner_draw_preview
        from models import db
        now = datetime.now(timezone.utc)
        due = Lottery.query.filter(
            Lottery.status == "scheduled",
            Lottery.draw_time <= now,
        ).all()
        for l in due:
            try:
                winners = run_draw(l)
                l.status = "pending_confirm"
                db.session.commit()
                notify_owner_draw_preview(l, winners)
                logger.info("Draw complete for lottery %d, %d winners", l.id, len(winners))
            except Exception as e:
                logger.error("Draw failed for lottery %d: %s", l.id, e)


def reset_iron_fan_monthly():
    """First day of month: reset iron fan days."""
    with scheduler.app.app_context():
        from models import db, Wallet
        Wallet.query.update({"iron_fan_days_this_month": 0})
        db.session.commit()
        logger.info("Reset iron fan days for all wallets")


def init_scheduler(app):
    scheduler.app = app
    scheduler.add_job(update_holding_days, "cron", hour=0, minute=5, id="holding_days")
    scheduler.add_job(refresh_holding_ranks, "interval", hours=6, id="ranks")
    scheduler.add_job(send_daily_report, "cron", hour=9, minute=0, id="daily_report")
    scheduler.add_job(process_scheduled_lotteries, "interval", minutes=5, id="lottery_check")
    scheduler.add_job(reset_iron_fan_monthly, "cron", day=1, hour=0, minute=1, id="iron_fan_reset")
    scheduler.start()
    logger.info("Scheduler started")
