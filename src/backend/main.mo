import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type ConceptCategory = {
    title : Text;
    description : Text;
  };

  type Testimonial = {
    author : Text;
    message : Text;
  };

  module ConceptCategory {
    public func compare(category1 : ConceptCategory, category2 : ConceptCategory) : Order.Order {
      Text.compare(category1.title, category2.title);
    };
  };

  var conceptCategories = [
    {
      title = "Mechanics";
      description = "Study of force and motion.";
    },
  ];

  var testimonials = [
    {
      author = "Alice";
      message = "The tutorial was clear and helpful!";
    },
  ];

  public shared ({ caller }) func addConceptCategory(category : ConceptCategory) : async () {
    if (conceptCategories.any(func(existingCategory) { existingCategory.title == category.title })) {
      Runtime.trap("Category already exists");
    } else {
      conceptCategories := conceptCategories.concat([category]);
    };
  };

  public query ({ caller }) func getAllConceptCategories() : async [ConceptCategory] {
    conceptCategories.sort();
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials;
  };

  public shared ({ caller }) func submitTestimonial(testimonial : Testimonial) : async () {
    testimonials := testimonials.concat([testimonial]);
  };
};
