'use strict';
const _ = require('lodash');
const async = require('async');
const utils = require('./utils');
const parseOrderbookOrder = require('./parse/orderbook-order');
const validate = utils.common.validate;
const composeAsync = utils.common.composeAsync;

// account is to specify a "perspective", which affects which unfunded offers
// are returned
function getBookOffers(remote, account, ledgerVersion, limit,
    takerGets, takerPays, callback) {
  remote.requestBookOffers(utils.renameCounterpartyToIssuerInOrder({
    taker_gets: takerGets,
    taker_pays: takerPays,
    ledger: ledgerVersion || 'validated',
    limit: limit,
    taker: account
  }), composeAsync(data => data.offers, callback));
}

function isSameIssue(a, b) {
  return a.currency === b.currency && a.counterparty === b.counterparty;
}

function orderFilter(issue, direction, order) {
  return isSameIssue(issue, order.specification.quantity)
    && order.specification.direction === direction;
}

function formatBidsAndAsks(orderbook, offers) {
  // the "base" currency is the currency that you are buying or selling
  // the "counter" is the currency that the "base" is priced in
  // a "bid"/"ask" is an order to buy/sell the base, respectively
  // for bids: takerGets = totalPrice = counter, takerPays = quantity = base
  // for asks: takerGets = quantity = base, takerPays = totalPrice = counter
  // quality = takerPays / takerGets; price = totalPrice / quantity
  // for bids: lowest quality => lowest quantity/totalPrice => highest price
  // for asks: lowest quality => lowest totalPrice/quantity => lowest price
  // for both bids and asks, lowest quality is closest to mid-market
  // we sort the orders so that earlier orders are closer to mid-market
  const orders = _.sortBy(offers, 'quality').map(parseOrderbookOrder);
  const bids = orders.filter(_.partial(orderFilter, orderbook.base, 'buy'));
  const asks = orders.filter(_.partial(orderFilter, orderbook.base, 'sell'));
  return {bids, asks};
}

function getOrderBook(account, orderbook, options, callback) {
  validate.address(account);
  validate.orderbook(orderbook);
  validate.options(options);

  const getter = _.partial(getBookOffers, this.remote, account,
    options.ledgerVersion, options.limit);
  const getOffers = _.partial(getter, orderbook.base, orderbook.counter);
  const getReverseOffers = _.partial(getter, orderbook.counter, orderbook.base);
  async.parallel([getOffers, getReverseOffers],
    composeAsync((data) => formatBidsAndAsks(orderbook, _.flatten(data)),
                 callback));
}

module.exports = utils.wrapCatch(getOrderBook);
