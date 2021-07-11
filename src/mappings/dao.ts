import { BigInt } from "@graphprotocol/graph-ts"
import {
    HugoDao,
    ProposalCanceled,
    ProposalCreated,
    ProposalExecuted,
    ProposalQueued,
    ProposalThresholdSet,
    VoteCast,
    VotingDelaySet,
    VotingPeriodSet
} from "../generated/HugoDao/HugoDao"
import { ExampleEntity } from "../generated/schema"

export function handleProposalCanceled(event: ProposalCanceled): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = ExampleEntity.load(event.transaction.from.toHex())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (entity == null) {
        entity = new ExampleEntity(event.transaction.from.toHex())

        // Entity fields can be set using simple assignments
        entity.count = BigInt.fromI32(0)
    }

    // BigInt and BigDecimal math are supported
    entity.count = entity.count + BigInt.fromI32(1)

    // Entity fields can be set based on event parameters
    entity.id = event.params.id

    // Entities can be written to the store with `.save()`
    entity.save()

    // Note: If a handler doesn't require existing field values, it is faster
    // _not_ to load the entity from the store. Instead, create it fresh with
    // `new Entity(...)`, set the fields that should be updated and save the
    // entity back to the store. Fields that were not set or unset remain
    // unchanged, allowing for partial updates to be applied.

    // It is also possible to access smart contracts from mappings. For
    // example, the contract that has emitted the event can be connected to
    // with:
    //
    // let contract = Contract.bind(event.address)
    //
    // The following functions can then be called on this contract to access
    // state variables and other data:
    //
    // - contract.BALLOT_TYPEHASH(...)
    // - contract.DOMAIN_TYPEHASH(...)
    // - contract.MAX_PROPOSAL_THRESHOLD(...)
    // - contract.MAX_VOTING_DELAY(...)
    // - contract.MAX_VOTING_PERIOD(...)
    // - contract.MIN_PROPOSAL_THRESHOLD(...)
    // - contract.MIN_VOTING_DELAY(...)
    // - contract.MIN_VOTING_PERIOD(...)
    // - contract.getActions(...)
    // - contract.getReceipt(...)
    // - contract.hugo(...)
    // - contract.initialProposalId(...)
    // - contract.latestProposalIds(...)
    // - contract.name(...)
    // - contract.proposalCount(...)
    // - contract.proposalMaxOperations(...)
    // - contract.proposalThreshold(...)
    // - contract.proposals(...)
    // - contract.propose(...)
    // - contract.quorumVotes(...)
    // - contract.state(...)
    // - contract.timelock(...)
    // - contract.version(...)
    // - contract.votingDelay(...)
    // - contract.votingPeriod(...)
}

export function handleProposalCreated(event: ProposalCreated): void {}

export function handleProposalExecuted(event: ProposalExecuted): void {}

export function handleProposalQueued(event: ProposalQueued): void {}

export function handleProposalThresholdSet(event: ProposalThresholdSet): void {}

export function handleVoteCast(event: VoteCast): void {}

export function handleVotingDelaySet(event: VotingDelaySet): void {}

export function handleVotingPeriodSet(event: VotingPeriodSet): void {}