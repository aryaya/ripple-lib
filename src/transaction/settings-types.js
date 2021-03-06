/* @flow */
'use strict';

type SettingPasswordSpent = {
  passwordSpent?: boolean,
}
type SettingRequireDestinationTag = {
  requireDestinationTag?: boolean,
}
type SettingRequireAuthorization = {
  requireAuthorization?: boolean,
}
type SettingDisallowIncomingXRP = {
  disallowIncomingXRP?: boolean,
}
type SettingDisableMasterKey = {
  disableMasterKey?: boolean,
}
type SettingEnableTransactionIDTracking = {
  enableTransactionIDTracking?: boolean,
}
type SettingNoFreeze = {
  noFreeze?: boolean,
}
type SettingGlobalFreeze = {
  globalFreeze?: boolean,
}
type SettingDefaultRipple = {
  defaultRipple?: boolean,
}
type SettingEmailHash = {
  emailHash?: ?string,
}
type SettingWalletLocator = {
  walletLocator?: ?string,
}
type SettingWalletSize = {
  walletSize?: ?number,
}
type SettingMessageKey = {
  messageKey?: string,
}
type SettingDomain = {
  domain?: string,
}
type SettingTransferRate = {
  transferRate?: ?number,
}
type SettingSigners = {
  signers?: string,
}
type SettingRegularKey = {
  regularKey?: string
}

export type Settings = SettingRegularKey | SettingSigners |
  SettingTransferRate | SettingDomain | SettingMessageKey | SettingWalletSize |
  SettingWalletLocator | SettingEmailHash | SettingDefaultRipple |
  SettingGlobalFreeze | SettingNoFreeze | SettingEnableTransactionIDTracking |
  SettingDisableMasterKey | SettingDisallowIncomingXRP |
  SettingRequireAuthorization | SettingRequireDestinationTag |
  SettingPasswordSpent
