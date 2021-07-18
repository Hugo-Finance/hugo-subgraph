import {BigInt, ethereum, Address} from '@graphprotocol/graph-ts'
import {Holder, HugoToken, TokenDayData} from "../../generated/schema";

export const DAO_ADDRESS = '0x3A9170cCac88AfE43C4Bd409c6163F807188D1B0';
export const TOKEN_ADDRESS = '0xce195c777e1ce96c30ebec54c91d20417a068706';
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dead';

export let ZERO_BI = BigInt.fromI32(0);

export function getOrCreateToken(): HugoToken {
    let token = HugoToken.load(TOKEN_ADDRESS);
    if (token === null) {
        token = new HugoToken(TOKEN_ADDRESS)
        token.holdersCount = 0;
        token.distributed = ZERO_BI;
        token.burned = ZERO_BI;
        token.save()
    }
    return token as HugoToken;
}

export function getOrCreateHolder(addr: Address): Holder {
    let holder = Holder.load(addr.toHexString());
    if (holder === null) {
        holder = new Holder(addr.toHexString());
        holder.token = TOKEN_ADDRESS;
        holder.transfersCount = 0;
        holder.balance = ZERO_BI;
        holder.feesAccrued = ZERO_BI;
        holder.feesPaid = ZERO_BI;
        holder.save();
    }
    return holder as Holder;
}

export function getOrCreateTokenDayData(event: ethereum.Event): TokenDayData {
    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let dayTokenID = event.address
        .toHexString()
        .concat('-')
        .concat(BigInt.fromI32(dayID).toString());
    let tokenDayData = TokenDayData.load(dayTokenID)
    if (tokenDayData === null) {
        tokenDayData = new TokenDayData(dayTokenID);
        tokenDayData.date = dayStartTimestamp;
        tokenDayData.token = event.address.toHexString();

        tokenDayData.dailyTransactionsCount = 0;
        tokenDayData.dailyFees = ZERO_BI;
    }
    tokenDayData.save();
    return tokenDayData as TokenDayData;
}
