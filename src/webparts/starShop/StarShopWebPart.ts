import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneSlider,
  
  PropertyPaneChoiceGroup,
  PropertyPaneDropdownOptionType
    } from '@microsoft/sp-webpart-base';

import * as strings from 'StarShopWebPartStrings';
import StarShop from './components/StarShop';
import { IStarShopProps } from './components/IStarShopProps';
import { IProductItem } from '../../models/ISPList';
import MockHttpClient from '../../services/dataService';

import { sp } from '@pnp/sp';
import PNPDataService from '../../services/pnpDataService';
export interface IStarShopWebPartProps {
  description: string;
  workDone: boolean;
  showNumberOfItems: number;
  orderOption:boolean;
}

export default class StarShopWebPart extends BaseClientSideWebPart<IStarShopWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  // private _getMockListData(): Promise<ITodoItem[]> {
  //   return MockHttpClient.get() //
  //     .then((data: ITodoItem[]) => {
  //       return data;
  //     }) as Promise<ITodoItem[]>;
  // }
  public render(): void {
    let service = new PNPDataService("Produkter");//testdata  title, completed

    //Gör anrop (i detta fall till MockDataService)
    service.get()

      // När anropet är klart (kan ta flera sekunder), gör följande
      .then(products => {

        // Logga resultate
        console.log(products);

    const element: React.ReactElement<IStarShopProps > = React.createElement(
      StarShop,
      {
        description: this.properties.description,
        numberOfItems: this.properties.showNumberOfItems,

        // Använd resultatet från anropet till att ge spLists
        // det värde som kom från SharePoint
        productItems: products,

        addToCart: service.addToCart
      }
    );

    ReactDom.render(element, this.domElement);
  });
}

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneCheckbox('workDone', {
                  text: 'Markera som klar'
                }),
                PropertyPaneSlider('showNumberOfItems', {
                  label: 'Välj antal',
                  min: 1,
                  max: 20,
                  step: 1
                }),
            
              ]
            }
          ]
        }
      ]
    };
  }
}
