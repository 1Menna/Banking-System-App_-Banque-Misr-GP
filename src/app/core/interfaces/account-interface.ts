import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface AccountInterface {
  id: number;
  accountNo: string;
  accountType: AccountType;
  balance: number;
  userId: number | string;
}
export enum AccountType {
  Savings = 'Savings',
  Current = 'Current'
}

