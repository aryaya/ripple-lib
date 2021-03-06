/* @flow */
'use strict';
const utils = require('./utils');
const validate = utils.common.validate;
const trustlineFlags = utils.common.txFlags.TrustSet;
const BigNumber = require('bignumber.js');
import type {Instructions, Prepare} from './types.js';
import type {TrustLineSpecification} from '../ledger/trustlines-types.js';

function convertQuality(quality) {
  return quality === undefined ? undefined :
    (new BigNumber(quality)).shift(9).truncated().toNumber();
}

function createTrustlineTransaction(account: string,
    trustline: TrustLineSpecification
): Object {
  validate.address(account);
  validate.trustline(trustline);

  const limit = {
    currency: trustline.currency,
    issuer: trustline.counterparty,
    value: trustline.limit
  };

  const txJSON: Object = {
    TransactionType: 'TrustSet',
    Account: account,
    LimitAmount: limit,
    Flags: 0
  };
  if (trustline.qualityIn !== undefined) {
    txJSON.QualityIn = convertQuality(trustline.qualityIn);
  }
  if (trustline.qualityOut !== undefined) {
    txJSON.QualityOut = convertQuality(trustline.qualityOut);
  }
  if (trustline.authorized === true) {
    txJSON.Flags |= trustlineFlags.SetAuth;
  }
  if (trustline.ripplingDisabled !== undefined) {
    txJSON.Flags |= trustline.ripplingDisabled ?
      trustlineFlags.NoRipple : trustlineFlags.ClearNoRipple;
  }
  if (trustline.frozen !== undefined) {
    txJSON.Flags |= trustline.frozen ?
      trustlineFlags.SetFreeze : trustlineFlags.ClearFreeze;
  }
  return txJSON;
}

function prepareTrustline(account: string,
    trustline: TrustLineSpecification, instructions: Instructions = {}
): Promise<Prepare> {
  const txJSON = createTrustlineTransaction(account, trustline);
  return utils.prepareTransaction(txJSON, this, instructions);
}

module.exports = prepareTrustline;
