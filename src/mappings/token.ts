import { BigInt } from "@graphprotocol/graph-ts"
import {
    HUGO,
    Approval,
    DelegateChanged,
    DelegateVotesChanged,
    OwnershipTransferred,
    Transfer,
    feesAccrued,
    feesPaid
} from "../../generated/HUGO/HUGO"

export function handleApproval(event: Approval): void {}

export function handleDelegateChanged(event: DelegateChanged): void {}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {}

export function handlefeesAccrued(event: feesAccrued): void {}

export function handlefeesPaid(event: feesPaid): void {}
