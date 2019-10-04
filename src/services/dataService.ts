import { IProductItem } from './../models/ISPList';
import { sp } from '@pnp/sp';

export default class MockHttpClient  {

   private _items:IProductItem[];
/*     public constructor() {
        this._items= [{ Title: 'Gå ut med hunden', Complete: true },
                      { Title: 'Handla mat', Complete: false },
                      { Title: 'Spring 10 km', Complete: false }];
                      //när vi har en handelse med this ska använda bind
                        this.changeComplete=this.changeComplete.bind(this);
    } */
//: ITodoItem[]  skickar till handel for updated
    public changeComplete(i: number): IProductItem[] {
        //uppdatering av listan
      /* alert("Changed value from " + this._items[i].Complete + " to " + !this._items[i].Complete);
      this._items[i].Complete = !this._items[i].Complete; */
      return this._items;  // till state för att strikat på
    }
//skickar tillbaka listan




    public get(): Promise<any> {

         return sp.web.lists.getByTitle('Produkter').items.get().then((items: any) => {   
     
           
   /*          return  sp.web.lists.getByTitle("Produkter").items.get().then((response: any[]) => {
        let productCollection=response.map(item=>new ClassProducts(item));
        this.setState({productList: productCollection});
        console.log('MY COLUMNS,,,,,,,! ', productCollection); */



        
            return items;
        }); 
    }
}
