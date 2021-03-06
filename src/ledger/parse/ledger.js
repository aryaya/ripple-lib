/* @flow */
'use strict';
const _ = require('lodash');
const {removeUndefined, rippleTimeToISO8601} = require('./utils');
const parseTransaction = require('./transaction');
import type {GetLedger} from '../types.js';

function parseTransactionWrapper(tx) {
  const transaction = _.assign({}, _.omit(tx, 'metaData'),
    {meta: tx.metaData});
  return parseTransaction(transaction);
}

function parseTransactions(transactions) {
  if (_.isEmpty(transactions)) {
    return {};
  }
  if (_.isString(transactions[0])) {
    return {transactionHashes: transactions};
  }
  return {
    transactions: _.map(transactions, parseTransactionWrapper),
    rawTransactions: JSON.stringify(transactions)
  };
}

function parseState(state) {
  if (_.isEmpty(state)) {
    return {};
  }
  if (_.isString(state[0])) {
    return {stateHashes: state};
  }
  return {rawState: JSON.stringify(state)};
}

function parseLedger(ledger: Object): GetLedger {
  return removeUndefined(_.assign({
    accepted: ledger.accepted,
    closed: ledger.closed,
    stateHash: ledger.account_hash,
    closeTime: rippleTimeToISO8601(ledger.close_time),
    closeTimeResolution: ledger.close_time_resolution,
    closeFlags: ledger.close_flags,
    ledgerHash: ledger.hash || ledger.ledger_hash,
    ledgerVersion: parseInt(ledger.ledger_index || ledger.seqNum, 10),
    parentLedgerHash: ledger.parent_hash,
    parentCloseTime: rippleTimeToISO8601(ledger.parent_close_time),
    totalDrops: ledger.total_coins || ledger.totalCoins,
    transactionHash: ledger.transaction_hash
  },
  parseTransactions(ledger.transactions),
  parseState(ledger.accountState)
  ));
}

module.exports = parseLedger;
