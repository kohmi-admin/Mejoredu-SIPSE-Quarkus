import { actionsQuestions } from "./actions";
import { activitiesQuestions } from "./activities";
import { budgetsQuestions } from "./budgets";
import { productsQuestions } from "./products";
import { projectsQuestions } from "./projects";

export const cancelationQuestions = {
    projects: projectsQuestions,
    activities: activitiesQuestions,
    products: productsQuestions,
    actions: actionsQuestions,
    budgets: budgetsQuestions
};