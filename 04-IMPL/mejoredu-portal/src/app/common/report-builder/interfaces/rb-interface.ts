import { QuestionBase } from "@common/form/classes/question-base.class";

export interface ReportBuilderI {
    questions: QuestionBase<any>[];
    reportName: string;
}