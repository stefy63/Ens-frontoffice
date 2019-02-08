import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  private storage = localStorage;

  constructor() { }

  public setItem(key: string, data: string): void {
    this.storage.setItem(key, JSON.stringify(data));
  }

  public clear(): void {
    this.storage.clear();
  }

  public setKey(key: string, data: string): void {
    try {
        const dataValue = JSON.parse(this.storage.getItem('data'));
        dataValue[key] = JSON.stringify(data);
        return dataValue[key];
      } catch (err) {
        return undefined;
      }
  }

  public getItem(key: string): any {
    try {
      const data = JSON.parse(this.storage.getItem('data'));
      return data[key];
    } catch (err) {
      return undefined;
    }
  }
}
