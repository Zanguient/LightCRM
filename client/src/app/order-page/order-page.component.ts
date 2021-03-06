import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  isRoot: boolean;
  private modal: MaterialInstance;
  pending = false;
  oSub: Subscription;

  constructor(private router: Router, private order: OrderService, private ordersService: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
        this.isRoot = this.router.url === '/order';
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub)
      this.oSub.unsubscribe();
  }

  open(): void {
    this.modal.open();
  }

  cancel(): void {
    this.modal.close();
  }

  submit(): void {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id; // remove irrelevant member
        return item;
      })
    };

    this.oSub = this.ordersService.create(order).subscribe(
      sentOrder => {
        MaterialService.toast(`Order with ${sentOrder.order} has been added.`);
        this.order.clear();
      },
        error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }


  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }
}
