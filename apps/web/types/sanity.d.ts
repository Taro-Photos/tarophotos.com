declare module "sanity" {
  export function defineType<T = unknown>(definition: T): T;
  export function defineField<T = unknown>(definition: T): T;
}
