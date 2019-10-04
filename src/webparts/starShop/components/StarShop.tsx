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
                  // alert("Tack för din bestält "+ "\n\r Din orderNumber är: "+ newOrder.data.Id + "  \n\r "+this.state.cart[i].Title+ "   "+this.state.cart[i].Price + "\n\r   totalPrice:   "+totalPrice  );
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
     listItems.push( <table className="ms-Grid-row align: center ms-bgColor-themeDark ms-fontColor-white {styles.row}"
        style={{  margin: "Auto",  border: "5px solid",   backgroundColor: "Black",   fontSize: "20px",  fontWeight: "bold",          width: "700px",          color: "white"        }}     >
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
      listItems.push( <table  className="TFtable"  style={{  margin: "Auto",  borderCollapse: "collapse",  backgroundColor: "Green", borderColor: "Yellow",  width: "700px",  fontSize: "20px", border: "5px solid"  }}
          key={i} onClick={this.handleChange.bind(this, this.state.productList[i].Id)}>
          <tr>
            <td> {this.state.productList[i].Title}</td>
            <td> {this.state.productList[i].Price}</td>
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
       cartItems.push(
        <table
          className="TFtable"  style={{  margin: "Auto", borderCollapse: "collapse", backgroundColor: "Blue", borderColor: "Yellow",       width: "700px",       fontSize: "20px",   border: "5px solid" }} >
          <tr style={{     margin: "Auto",       borderCollapse: "collapse",    backgroundColor: "Pink",   borderColor: "Yellow",  width: "700px",   fontSize: "20px",  border: "5px solid"    }} >
            <td> {this.state.productList[i].Title}</td>
           
            <td> {this.state.productList[i].Price}</td>

            {/* <td>  { <img  src={this.state.productList[i].Bild.Url } style={{width: 40,height: 50 }}  /> } </td>     */}
          </tr> </table>
      );
      totalPrice = totalPrice + this.state.productList[i].Price;
    }
    cartItems.push(
      <table>
        <tr>
          <td style={{ width: "700px", fontSize: "20px", border: "1px solid",   backgroundColor: "Yellow"  }} >
            Total price: {totalPrice}
          </td>{" "}
        </tr>
      </table>
    );
    let ordersList: JSX.Element[] = [];

    for (let i = 0; i < this.state.cart.length; i++) {
     
      ordersList.push( <li style={{ width: "700px", fontSize: "20px",   backgroundColor: "Yellow"  }} key={i}> {this.state.cart[i].Title}  {this.state.cart[i].Price}{" "} </li> );
    }
    ordersList.push( <li style={{ width: "700px", fontSize: "20px", border: "1px solid",   backgroundColor: "Yellow"  }} >
    Total price: {totalPrice} </li>);

    if(this.state.checkButton==false){
      return (
        <div className="{styles.starShop  } ">
          <div className="{styles.container  align: center }">
            <div className="style={{background-color:Yellow; color:white; text-align: center;f ont-weight: bold ;font-size:18px;left:300;}} ">
              <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1  ">
                <div className="ms-font-xl ms-fontColor-white  ">
                  Welcome to StarShop!
                </div>
                <div className="style={{background-color:black; color:white; text-align: center; font-weight: bold; font-size:30px; left:400;}} ">
                  Products List
                </div>
                {/* <p className={ styles.description }>{escape(this.props.description)}</p>    */}
                <br></br>
                {/*            
            <p  className="ms-font-xl ms-fontColor-white background-color: $ms-color-themePrimary " > Produkter4: {this.props.numberOfItems}</p> */}
                {/* <p className="ms-font-l ms-fontColor-white">Demo : Retrieve Employee Data from SharePoint List</p>  */}
              </div>
            </div>

            <div className="ms-Grid-row ms-bgColor-green ms-fontColor-white {styles.row}">
              {listItems}
                        {/* <p className={ styles.description }>Du har valt: {this.state.cart}</p> */}          
              {/* Cart! {cartItems}  */}
  
              <button onClick={this.doPayment.bind(this)}>Betala</button>
            </div>
            <div>
              <div id="spListContainer" />{" "}
            </div>
          </div>
        </div>
      );
    }
        else{
          return (
          <div className="{styles.starShop  } ">
          <div className="{styles.container  align: center }">
            <div className="style={{background-color:Yellow; color:white; text-align: center;f ont-weight: bold ;font-size:18px;left:300;}} ">
              <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1  ">
                <div className="ms-font-xl ms-fontColor-white  ">      </div>
                <div className="style={{background-color:black; color:white; text-align: center; font-weight: bold; font-size:30px; left:400;}} ">
                 Faktora
                </div>
                </div>
            </div>
  
            <div className="{styles.table}">
                  {ordersList}              
                      <button onClick={this.back.bind(this)}>Back</button>
            </div>
            <div>
              <div id="spListContainer" />{" "}
            </div>
          </div>
        </div>
      );
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
    }