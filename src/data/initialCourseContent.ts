import type { CourseData } from "../types";

export const initialCourseContent: CourseData = {
  generics: {
    title: "Generics",
    learningObjectives: [
      "Understand the purpose of generics in creating reusable components.",
      "Create generic functions, classes, and interfaces.",
      "Use generic constraints to limit type parameters.",
    ],
    chunks: [
      {
        title: "What are Generics?",
        content:
          "Generics allow you to write flexible, reusable code that can work with any data type. Think of them as placeholders for types. Instead of writing a separate function for each data type, you can write one generic function.",
        code: `function identity<T>(arg: T): T {\n  return arg;\n}\n\nlet output1 = identity<string>("myString");\nlet output2 = identity<number>(100);`,
        mnemonic: {
          title: "Memory Hack: The 'T' for Template",
          text: "Think of `<T>` as a **T**emplate or a **T**ype variable that you can use to create a blueprint for your functions and classes.",
        },
      },
      {
        title: "Generic Constraints",
        content:
          "Sometimes you want to limit the types that can be used with a generic function. For example, you might want to ensure that a type has a specific property. This is where generic constraints come in.",
        code: `interface Lengthwise {\n  length: number;\n}\n\nfunction loggingIdentity<T extends Lengthwise>(arg: T): T {\n  console.log(arg.length); // Now we know it has a .length property\n  return arg;\n}\n\nloggingIdentity({ length: 10, value: 3 }); // OK\n// loggingIdentity(3); // Error: number does not have .length property`,
        mnemonic: {
          title: "Memory Hack: The 'Extends' Leash",
          text: "Think of `extends` as putting a leash on your generic type `T`. It can't be just *any* type; it must have the properties of the type it **extends**.",
        },
      },
    ],
    quiz: {
      type: "drag-and-drop",
      question:
        "Drag the correct TypeScript keyword to complete the generic function.",
      options: ["<T>", "{T}", "(T)", "[T]"],
      answer: "<T>",
      codeSnippet: `function getFirstElement____(arr: any[]) {\n  return arr[0];\n}`,
    },
  },
  "utility-types": {
    title: "Utility Types",
    learningObjectives: [
      "Leverage built-in utility types to transform types.",
      "Understand and use Partial<T>, Readonly<T>, Pick<T, K>, and Omit<T, K>.",
      "Combine utility types to create complex type transformations.",
    ],
    chunks: [
      {
        title: "Introduction to Utility Types",
        content:
          "TypeScript provides several utility types to facilitate common type transformations. These types are available globally and help you create new types based on existing ones without writing complex manual transformations.",
        code: `interface Todo {\n  title: string;\n  description: string;\n  completed: boolean;\n}\n\n// Makes all properties of Todo optional\ntype PartialTodo = Partial<Todo>;\n\n// Makes all properties of Todo readonly\ntype ReadonlyTodo = Readonly<Todo>;`,
      },
      {
        title: "Pick & Omit",
        content:
          "`Pick` allows you to create a new type by picking a set of properties from an existing type. `Omit` is the opposite: it creates a type by removing a set of properties.",
        code: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  age: number;\n}\n\n// Creates a type with only 'name' and 'email'\ntype UserContactInfo = Pick<User, 'name' | 'email'>;\n\n// Creates a type without 'age'\ntype UserWithoutAge = Omit<User, 'age'>;`,
      },
    ],
    quiz: {
      type: "drag-and-drop",
      question: "Which utility type makes all properties of a type optional?",
      options: ["Readonly", "Partial", "Pick", "Omit"],
      answer: "Partial",
      codeSnippet: `interface Config {\n  endpoint: string;\n  apiKey: string;\n}\n\n// How to make a config object with optional properties?\ntype OptionalConfig = ____<Config>;`,
    },
  },
  "mapped-types": {
    title: "Mapped Types",
    learningObjectives: [
      "Understand how mapped types work.",
      "Create your own mapped types to transform properties of an existing type.",
      "Use keyof and lookup types in mapped types.",
    ],
    chunks: [
      {
        title: "What are Mapped Types?",
        content:
          "Mapped types are a powerful feature that allows you to create new types by transforming the properties of an existing type. The syntax is similar to for...in for objects, but for types.",
        code: `type Flags = { [K in 'option1' | 'option2']: boolean };\n// is equivalent to:\n// type Flags = {\n//   option1: boolean;\n//   option2: boolean;\n// }`,
      },
      {
        title: "Advanced Mapped Types",
        content:
          "You can combine mapped types with other advanced features like conditional types to create very powerful and flexible type transformations.",
        code: `type Nullable<T> = { [P in keyof T]: T[P] | null };\n\ninterface Person {\n name: string;\n age: number;\n}\n\n// All properties are now string | null and number | null\ntype NullablePerson = Nullable<Person>;`,
      },
    ],
    quiz: {
      type: "drag-and-drop",
      question: "Which operator is used to iterate over keys in a mapped type?",
      options: ["of", "for", "in", "as"],
      answer: "in",
      codeSnippet: `type ReadonlyProperties<T> = {\n readonly [P ____ keyof T]: T[P];\n}`,
    },
  },
};
