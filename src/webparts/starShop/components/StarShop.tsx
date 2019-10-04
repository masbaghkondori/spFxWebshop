import * as React from "react";
import styles from "./StarShop.module.scss";
import { IStarShopProps } from "./IStarShopProps";
import { IProductItem } from "../../../models/ISPList";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardActivity,
  IDocumentCardPreviewProps
} from "office-ui-fabric-react/lib/DocumentCard";
import { sp } from "@pnp/sp";

export interface IProductListState {
  productList: IProductItem[]; //listan som vi skickar via componet till props i component ska skicka till state
  cart: IProductItem[];
  checkButton:Boolean,
}

export default class StarShop extends React.Component<  IStarShopProps,  IProductListState> {
  constructor(props: IStarShopProps) {
    super(props);

    this.state = {
      productList: this.props.productItems,
      cart: [],
       checkButton:false,
    }
  }
  public back(): void {
    this.setState({ checkButton:false });
  }
  public doPayment(): void {
   
    let totalPrice: number;
    totalPrice=0;
    sp.web.currentUser.get().then(user=>{
      console.log("user: ", user);
       sp.web.lists.getByTitle("ordrar").items.add({"Title":user.Title,
        'ECWS_x002e_Date':new Date(),
        'ECWS_x002e_UserId':user.Id  
         }).then(newOrder=>{  

           for (let i = 0; i < this.state.cart.length; i++) {
              sp.web.lists.getByTitle("orderrader").items.add({
                "Title":this.state.cart[i].Title,      
                "ECWS_x002e_ProductId":this.state.cart[i].Id,
                "ECWS_x002e_OrderId":newOrder.data.Id,              })
                 totalPrice=totalPrice+this.state.cart[i].Price;     
                console.log("neworder: ", newOrder);  
              }
           });
      });
     this.setState({ checkButton:true });
    }

  private handleChange(id: number) {
        //for stickat item
    for (let i = 0; i < this.props.productItems.length; i++) {
      if (this.props.productItems[i].Id === id) {
        let tempList = this.state.cart;
        tempList.push(this.props.productItems[i]);
        this.setState({  cart: tempList  });
      }
    }
    console.log("ordered: ", this.state.cart);
  }

  public render(): React.ReactElement<IStarShopProps> { 
    let listItems: JSX.Element[] = [];
     listItems.push( <table className={styles.table}>
        <tr>
          <th> Title </th>
          <th> Price </th>
          <th> Category </th>
          <th>Bild</th>
        </tr>
      </table>
    );
    for (let i = 0; i < this.state.productList.length; i++) {
      //när klickar på li skickar tilickbakas li till webdel och därifrån service.changecomplete skickar till funktion changecomplete()
      listItems.push( <table  className="TFtable"  style={{  margin: "Auto",  borderCollapse: "collapse",  backgroundColor: "Green", borderColor: "Yellow",  width: "600px",  fontSize: "20px", border: "5px solid"  }}
          key={i} onClick={this.handleChange.bind(this, this.state.productList[i].Id)}>
          <tr>
            <td> {this.state.productList[i].Title}</td>
            <td> {this.state.productList[i].Price} kr</td>
            <td> {this.state.productList[i].Category}</td>
            <td>{" "}  {<img  src={this.state.productList[i].Bild.Url} style={{ width: 40, height: 50 }} /> }{" "} </td>
          </tr>
        </table>
      );
    }
    let cartItems: JSX.Element[] = [];
    let totalPrice: number;
    totalPrice = 0;
    for (let i = 0; i < this.state.cart.length; i++) {
       cartItems.push( <table className="table" >
                          <tr>
                            <td> {this.state.productList[i].Title}</td>                          
                            <td> {this.state.productList[i].Price}kr</td>
                          </tr>
                      </table>
      );
      totalPrice = totalPrice + this.state.productList[i].Price;
    }
    cartItems.push(
      <table >
        <tr>
          <td  >
            Total price: {totalPrice}
          </td>{" "}
        </tr>
      </table>
    );
    let ordersList: JSX.Element[] = [];
    for (let i = 0; i < this.state.cart.length; i++) {
     
      ordersList.push(  <table  className={styles.tableBetalt} >
        <tr>
          <td  key={i}> {this.state.cart[i].Title}</td>  <td  key={i}> {this.state.cart[i].Price} kr   </td>
        </tr>  </table>);
    }
    ordersList.push(<table  className={ styles.table} > <tr  ><td></td>
        <td className={ styles.tdBetalt} > Total price: {totalPrice} kr   </td>
        <td></td></tr>
      </table>);

    if(this.state.checkButton==false){
      return (
        <div className={ styles.starShop }>
             <div className={ styles.container }> 
             <div className={ styles.row }>
             <div className={ styles.column }>
                  <div className={ styles.title }> Welcome to StarShop! </div>
                  <div className={ styles.title } > Products List </div>
                                         
             
           
              <div className={styles.column}>
                {listItems}     
                <button onClick={this.doPayment.bind(this)}>Betala</button>
                </div>
              </div>
              </div>

            <div>
              <div id="spListContainer" >{" "} </div>                
           </div>
        </div> 
      </div>
      );
    }
        else{
          return (
            <div className={ styles.starShopFaktura  }>
              <div className={ styles.container }>
                <div className={ styles.row }>
                
                   <div className={ styles.titleFaktura }>  Faktura   </div>      
                    <div className={ styles.title }>
                       {ordersList}              
                      <button onClick={this.back.bind(this)}>Back</button>
                     </div>
                 
             </div>
           </div>
        </div>
      );
    }
  }
}





/* 
    return (
      <div className={ styles.starShop }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to StarShop!</span>
               <p className={ styles.description }>{escape(this.props.description)}</p>  
             <p className={ styles.description }>Produkter4: {this.props.numberOfItems}</p>
            <ul>
                {listItems}
              </ul>
              <p className={ styles.description }>Du har valt: {this.state.cart}</p>
              <ul>
              {cartItems}


              </ul>

                <a href="https://aka.ms/spfx" className={ styles.button }>
               <span className={ styles.label }>Learn more</span>
              </a> 
            </div>
          </div>
        </div>
      </div>
    );*/
    