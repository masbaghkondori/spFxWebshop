import { IProductItem } from "../models/ISPList";

export interface IDataService {
  get(): Promise<IProductItem[]>;
  addToCart(id: number) : Promise<IProductItem[]>;
}
