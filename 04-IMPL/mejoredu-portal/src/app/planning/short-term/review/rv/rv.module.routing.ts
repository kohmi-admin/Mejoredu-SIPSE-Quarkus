import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RvComponent } from "./rv.component";

const routes: Routes = [
    {
        path: '',
        component: RvComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReviewRoutingModule {}