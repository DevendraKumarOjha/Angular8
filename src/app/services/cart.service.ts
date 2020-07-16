import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {



  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in the cart  
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart based on item id

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      /*for(let tempcartItem of this.cartItems){
        if(tempcartItem.id === theCartItem.id){
          existingCartItem = tempcartItem;
          break;
        }
      }*/

      //check if we foud it

      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      //increment the quantity:
      existingCartItem.quantity++;
    } else {
      //just add the item to the cart:
      this.cartItems.push(theCartItem);
    }

    //compute the cart total price and   total quantity:
    this.computeCartTotals();

  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get the index of the item in the array .
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    //and if found then remove the item from the array at the given index.
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    //publish the new Values .. all subscribers recieves the new data:
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data for debugig purpose:

    this.logCartData(totalPriceValue, totalQuantityValue);

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contets of the cart`);
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name = ${tempCartItem.name}, quantity= ${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice},subTotal=${subTotalPrice}`);
      console.log(`totalPrice:${totalPriceValue.toFixed(2)},totalQuantity: ${totalQuantityValue}`);
      console.log(`-------`);
    }
  }
}
