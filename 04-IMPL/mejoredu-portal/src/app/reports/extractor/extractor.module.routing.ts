import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ExtractorComponent } from "./extractor.component";

const routes:  Route[] = [
    {
        path: '',
        component: ExtractorComponent,
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExtractorRoutingModule {}