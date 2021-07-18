import {
    Approval,
    DelegateChanged,
    feesAccrued,
    feesPaid,
    OwnershipTransferred,
    Transfer
} from "../../generated/HUGO/HUGO"
import { log } from '@graphprotocol/graph-ts'
import {BURN_ADDRESS, getOrCreateHolder, getOrCreateToken, getOrCreateTokenDayData, ZERO_BI} from "./helpers";


export function handleApproval(event: Approval): void {
    let tokenDayData = getOrCreateTokenDayData(event);

    tokenDayData.dailyTransactionsCount += 1;
    tokenDayData.save();
}

export function handleDelegateChanged(event: DelegateChanged): void {
    let tokenDayData = getOrCreateTokenDayData(event);

    tokenDayData.dailyTransactionsCount += 1;
    tokenDayData.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
    let tokenDayData = getOrCreateTokenDayData(event);

    tokenDayData.dailyTransactionsCount += 1;
    tokenDayData.save();
}

export function handleTransfer(event: Transfer): void {
    let token = getOrCreateToken();
    let receiver = getOrCreateHolder(event.params.to);
    let sender = getOrCreateHolder(event.params.from);
    let tokenDayData = getOrCreateTokenDayData(event);

    if (receiver.balance == ZERO_BI) {
        // looks like we have new holder;
        token.holdersCount += 1;
    }

    receiver.balance = receiver.balance.plus(event.params.amount);
    if (receiver.id === BURN_ADDRESS) {
        token.burned = receiver.balance;
    }

    sender.balance = sender.balance.minus(event.params.amount);
    sender.transfersCount += 1;
    if (sender.balance == ZERO_BI) {
        token.holdersCount -= 1;
    }

    tokenDayData.dailyTransactionsCount += 1;

    tokenDayData.save();
    token.save();
    receiver.save();
    sender.save();
}

export function handlefeesAccrued(event: feesAccrued): void {
    let token = getOrCreateToken();
    let holder = getOrCreateHolder(event.params.account);

    if (holder.balance == ZERO_BI) {
        token.holdersCount += 1;
    }

    holder.balance = holder.balance.plus(event.params.amount);
    holder.feesAccrued = holder.feesAccrued.plus(event.params.amount);

    if (holder.id === BURN_ADDRESS) {
        token.burned = holder.balance;
    }

    holder.save();
    token.save();
}

export function handlefeesPaid(event: feesPaid): void {
    let token = getOrCreateToken();
    let tokenDayData = getOrCreateTokenDayData(event);
    let holder = getOrCreateHolder(event.params.account);

    holder.balance = holder.balance.minus(event.params.amount);
    holder.feesPaid = holder.feesPaid.plus(event.params.amount);

    token.distributed = token.distributed.plus(event.params.amount);

    tokenDayData.dailyFees = tokenDayData.dailyFees.plus(event.params.amount);

    holder.save();
    token.save();
    tokenDayData.save();
}
