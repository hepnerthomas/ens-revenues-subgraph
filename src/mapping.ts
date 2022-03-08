import { BigInt, Address } from "@graphprotocol/graph-ts";
import { ENS } from "../generated/schema";
import {
  NameRegistered as ControllerNameRegisteredEvent,
  NameRenewed as ControllerNameRenewedEvent
} from "../generated/EthRegistrarController/EthRegistrarController"
import { EthPurchase, TokenPurchase } from "../generated/UniswapV1Pool/UniswapV1Pool"

let EIGHT_DECIMALS = BigInt.fromI32(10).pow(8).toBigDecimal()
let TWELVE_DECIMALS = BigInt.fromI32(10).pow(12).toBigDecimal()
let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

function getSingleton(): ENS {
  let ens = ENS.load('ens')
  if (!ens) {
    ens = new ENS('ens')
    ens.ethCollected = BigInt.fromI32(0).toBigDecimal()
    ens.usdCollected = BigInt.fromI32(0).toBigDecimal()
    ens.ethPrice = BigInt.fromI32(0).toBigDecimal()
  }
  return ens!
}

export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
  let ens = getSingleton()
  let cost = event.params.cost.divDecimal(EIGHTEEN_DECIMALS)
  ens.ethCollected += cost
  ens.usdCollected += cost * ens.ethPrice
  ens.save()
}

export function handleNameRenewedByController(event: ControllerNameRenewedEvent): void {
  let ens = getSingleton()
  let cost = event.params.cost.divDecimal(EIGHTEEN_DECIMALS)
  ens.ethCollected += cost
  ens.usdCollected += cost * ens.ethPrice
  ens.save()
}


export function handleETHPurchase(event: EthPurchase): void {
  let ens = getSingleton()
  ens.ethPrice = event.params.tokens_sold
    .divDecimal(event.params.eth_bought.toBigDecimal())
    .times(TWELVE_DECIMALS)

  ens.save()
}

export function handleUSDCPurchase(event: TokenPurchase): void {
  let ens = getSingleton()
  ens.ethPrice = event.params.tokens_bought
    .divDecimal(event.params.eth_sold.toBigDecimal())
    .times(TWELVE_DECIMALS)

  ens.save()
} 

