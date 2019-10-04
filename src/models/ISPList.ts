export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Id:number;
  Title: string;  
  Price: number;  
  Category: string;  
  Bild: string;  

}

export interface IProductItem {
  Id: number;
  Title: string;  
  Price: number;  
  Category: string;  
  Bild: IImage;
}

export interface IImage {
  Description: string;
  Url: string;
}
export interface IOrders {

  Title: string;  //userID
  User: string;  //UserName fernanda 
  Date: string;  //

}

// orderrader:  order:u2  product:sko
// ordrar: Title:u1  user:fernanda  Date: date time