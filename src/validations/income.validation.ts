/** Mirrors ENUM_TRANSACTION_TYPE / the transaction model enums on the API. */
export const transactionTypes = ["Donation", "Subscription"] as const;

export const transactionPlans = ["Standard", "Premium"] as const;

export const transactionCurrencies = ["USD", "ARS"] as const;
