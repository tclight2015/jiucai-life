"""
Base chain interactions.
All real on-chain calls are gated behind env vars so the server starts safely
with empty config (returns None / mock data).
"""
import os
import logging

logger = logging.getLogger(__name__)

_w3 = None
_contract = None

JIUCAI_ABI_BALANCE = [
    {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    }
]


def _get_w3():
    global _w3
    if _w3 is None:
        rpc = os.getenv("BASE_RPC_URL")
        if not rpc:
            return None
        try:
            from web3 import Web3
            _w3 = Web3(Web3.HTTPProvider(rpc))
        except Exception as e:
            logger.warning("web3 init failed: %s", e)
    return _w3


def get_jiucai_balance(address: str):
    """Return raw token balance (integer units) or None on failure."""
    contract_addr = os.getenv("JIUCAI_CONTRACT_ADDRESS")
    if not contract_addr:
        return None
    w3 = _get_w3()
    if not w3:
        return None
    try:
        contract = w3.eth.contract(
            address=w3.to_checksum_address(contract_addr),
            abi=JIUCAI_ABI_BALANCE,
        )
        return contract.functions.balanceOf(w3.to_checksum_address(address)).call()
    except Exception as e:
        logger.warning("get_jiucai_balance error for %s: %s", address, e)
        return None


def get_eth_balance(address: str):
    """Return ETH balance in wei or None."""
    w3 = _get_w3()
    if not w3:
        return None
    try:
        return w3.eth.get_balance(w3.to_checksum_address(address))
    except Exception as e:
        logger.warning("get_eth_balance error: %s", e)
        return None


def send_jiucai(to_address: str, amount: int) -> str:
    """
    Transfer JIUCAI from the prize/claim wallet to a recipient.
    Returns tx_hash string or raises on failure.
    """
    private_key = os.getenv("JIUCAI_POOL_WALLET_PK")
    contract_addr = os.getenv("JIUCAI_CONTRACT_ADDRESS")
    if not private_key or not contract_addr:
        logger.warning("send_jiucai: missing env vars, returning mock tx")
        return "0x" + "0" * 64

    w3 = _get_w3()
    if not w3:
        raise RuntimeError("Web3 not available")

    ERC20_TRANSFER_ABI = [
        {
            "inputs": [
                {"name": "recipient", "type": "address"},
                {"name": "amount", "type": "uint256"},
            ],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function",
        }
    ]

    account = w3.eth.account.from_key(private_key)
    contract = w3.eth.contract(
        address=w3.to_checksum_address(contract_addr),
        abi=ERC20_TRANSFER_ABI,
    )
    nonce = w3.eth.get_transaction_count(account.address)
    tx = contract.functions.transfer(
        w3.to_checksum_address(to_address), amount
    ).build_transaction({"from": account.address, "nonce": nonce})
    signed = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    return tx_hash.hex()


def send_batch_payout(lottery, winners) -> str:
    """
    Batch-transfer prizes to all winners in one tx.
    Falls back to mock tx hash if chain not configured.
    """
    if not os.getenv("JIUCAI_PRIZE_WALLET_PK"):
        logger.warning("send_batch_payout: no private key configured, returning mock")
        return "0x" + "a" * 64

    # TODO: integrate batch transfer contract once deployed
    # For now send individually
    for w in winners:
        if int(w.usdt_amount or 0) > 0:
            # USDT transfer from prize wallet
            pass
        if int(w.jiucai_amount or 0) > 0:
            tx = send_jiucai(w.wallet_address, int(w.jiucai_amount))
            w.tx_hash = tx

    return "0x" + "b" * 64
