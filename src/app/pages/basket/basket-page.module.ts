import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HackathonScannerModule } from 'src/app/hackathon-scanner/hackathon-scanner.module';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketPageComponent } from './basket-page.component';
import { ShoppingBasketEmptyComponent } from './shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from './shopping-basket/shopping-basket.component';

const basketPageRoutes: Routes = [{ path: '', component: BasketPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(basketPageRoutes), HackathonScannerModule, SharedModule],
  declarations: [BasketPageComponent, ShoppingBasketComponent, ShoppingBasketEmptyComponent],
})
export class BasketPageModule {}
