import { IProductItem } from '../models/ISPList';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IDataService } from './IService';

export default class SPDataService implements IDataService  {

    private _httpClient: SPHttpClient;
    private _url: string;
    private _listTitle: string;

    public constructor(httpClient: SPHttpClient, url: string, listTitle: string) {
      this._httpClient = httpClient;
      this._url = url;
      this._listTitle = listTitle;

      this.addToCart = this.addToCart.bind(this);
    }

    public addToCart(id: number) : Promise<IProductItem[]> {
        console.log("id  ", id);

        let etag: string = undefined;// etag en sträng som kommer innehålla info om vilken typ in sharepoint kommer vi vill uppdatera saker.
//unrop till sharepointlista
        return this._httpClient.get(`${this._url}/_api/web/lists/getbytitle('${this._listTitle}')/items(${id})?$select=Id,Completed`,
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            })
            .then((response: SPHttpClientResponse): Promise<IProductItem> => {
                etag = response.headers.get('ETag');

                return response.json();
            })
            .then((item: any): Promise<SPHttpClientResponse> => {//uppdatera listrad
                const body: string = JSON.stringify({
                    '__metadata': {
                        'type': 'SP.Data.' + this._listTitle + 'ListItem'
                    },
                    'Completed': !item.Completed
                });
                return this._httpClient.post(`${this._url}/_api/web/lists/getbytitle('${this._listTitle}')/items(${id})`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'Accept': 'application/json;odata=nometadata',
                            'Content-type': 'application/json;odata=verbose',
                            'odata-version': '',
                            'IF-MATCH': etag,
                            'X-HTTP-Method': 'MERGE'
                        },
                        body: body
                    });
            })
            .then((): Promise<IProductItem[]> => {
              return this.get();
            });
    }

    public get(): Promise<IProductItem[]> {
      return this._httpClient.get(this._url + `/_api/web/lists/getbytitle('${this._listTitle}')/items`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        console.log(response);

        return response.json()
          .then(jsonResult => {
            console.log('jsonResult.value=',jsonResult.value);//get

            let productListItem: IProductItem[] = jsonResult.value.map(item => {
              return {   Title: item.Title,
                Price: item.ECWS_x002e_Price,
                Bild: item.ECWS_x002e_ImageUrl,
                Category: item.ECWS_x002e_Category  };
            });

            return productListItem;
          });
      });
    }
}
