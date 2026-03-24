import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ConceptCategory {
    title: string;
    description: string;
}
export interface Testimonial {
    author: string;
    message: string;
}
export interface backendInterface {
    addConceptCategory(category: ConceptCategory): Promise<void>;
    getAllConceptCategories(): Promise<Array<ConceptCategory>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    submitTestimonial(testimonial: Testimonial): Promise<void>;
}
