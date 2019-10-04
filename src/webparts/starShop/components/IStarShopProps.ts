
import { IProductItem } from "../../../models/ISPList";
export interface IStarShopProps {
  description: string;
  numberOfItems: number;

  productItems: IProductItem[];
 
  

  addToCart(i: number): Promise<IProductItem[]>;// för att vi skickar tillbaka fron dataservice det här ska finnas istället void ;

}
