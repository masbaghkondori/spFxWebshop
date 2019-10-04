import { sp } from '@pnp/sp';
import { IProductItem } from '../models/ISPList';
import { IDataService } from './IService';

export default class PNPDataService implements IDataService {

  private _listTitle: string;

  constructor(listTitle: string) {
    this._listTitle = listTitle;

    this.addToCart = this.addToCart.bind(this);
  }

  public addToCart(id: number) : Promise<IProductItem[]> {
    console.log("Handling update with PNP");
    

     return sp.web.lists.getByTitle(this._listTitle).items.getById(id).get().then((result: IProductItem) => {
        return sp.web.lists.getByTitle(this._listTitle).items.getById(id).select("Completed").get().then((item: any) => {
            return sp.web.lists.getByTitle(this._listTitle).items.getById(id).update({
                'Completed': !item.Completed
            }).then(() => {
                return this.get();
            });
        });
    });
  }

  public get(): Promise<IProductItem[]> {
    return sp.web.lists.getByTitle(this._listTitle).items.get().then((result) => {
      let productItemsList: IProductItem[] = [];

      result.map((item: any) => {
        productItemsList.push({ Id: item.Id, Title: item.Title, Price: item.ECWS_x002e_Price, Category:item.ECWS_x002e_Category, Bild:item.ECWS_x002e_ImageUrl});
      });

      return productItemsList;
    });
  }
}
