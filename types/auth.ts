export interface BibbleAccount {
  name: string;
  email: string;
}

export interface BibbleSession {
  name: string;
  email: string;
  signedInAt: number;
}

export const BIBBLE_ACCOUNT_KEY = "bibble-account";
export const BIBBLE_SESSION_KEY = "bibble-session";
export const BIBBLE_AUTH_CHANGE_EVENT = "bibble-auth-change";
