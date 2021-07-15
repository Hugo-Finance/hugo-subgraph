import {
    ProposalCanceled,
    ProposalCreated,
    ProposalExecuted,
    ProposalQueued,
    VoteCast
} from "../../generated/HugoDao/HugoDao"
import {HugoDao, Proposal, Receipt} from "../../generated/schema"
import {DAO_ADDRESS, ZERO_BI} from "./helpers";
import { Address, Bytes } from '@graphprotocol/graph-ts'


export function handleProposalCreated(event: ProposalCreated): void {
    let dao = HugoDao.load(DAO_ADDRESS);
    if (dao === null) {
        dao = new HugoDao(DAO_ADDRESS)
        dao.proposalsCount = 0;
        dao.save()
    }

    let proposal = new Proposal(event.params.id.toString());
    proposal.proposer = event.params.proposer;

    proposal.targets = event.params.targets as Array<Bytes>;
    proposal.values = event.params.values;
    proposal.signatures = event.params.signatures;
    proposal.calldatas = event.params.calldatas;

    proposal.startBlock = event.params.startBlock;
    proposal.endBlock = event.params.endBlock;
    proposal.title = event.params.title;
    proposal.description = event.params.description;
    proposal.category = event.params.category;

    proposal.forVotes = ZERO_BI;
    proposal.againstVotes = ZERO_BI;
    proposal.abstainVotes = ZERO_BI;

    proposal.canceled = false;
    proposal.executed = false;
    proposal.eta = ZERO_BI;

    proposal.createdAt = event.block.timestamp;
    proposal.save()

    dao.proposalsCount += 1;
    dao.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
    let proposal = Proposal.load(event.params.id.toString());
    proposal.executed = true;
    proposal.save()
}

export function handleProposalCanceled(event: ProposalCanceled): void {
    let proposal = Proposal.load(event.params.id.toString());
    proposal.canceled = true;
    proposal.save()
}

export function handleProposalQueued(event: ProposalQueued): void {
    let proposal = Proposal.load(event.params.id.toString());
    proposal.eta = event.params.eta;
    proposal.save()
}

export function handleVoteCast(event: VoteCast): void {
    let receipt = new Receipt(event.transaction.hash.toHex() + "-" + event.logIndex.toString());

    let proposal = Proposal.load(event.params.proposalId.toString());

    receipt.proposal = proposal.id;
    receipt.voter = event.params.voter;
    receipt.support = event.params.support;
    receipt.votes = event.params.votes;

    if (receipt.support == 1) {
        proposal.forVotes = proposal.forVotes.plus(receipt.votes);
    } else if (receipt.support == 0) {
        proposal.againstVotes = proposal.againstVotes.plus(receipt.votes);
    } else if (receipt.support == 2) {
        proposal.abstainVotes = proposal.abstainVotes.plus(receipt.votes);
    }
    proposal.save();

    receipt.createdAt = event.block.timestamp;
    receipt.save();
}
