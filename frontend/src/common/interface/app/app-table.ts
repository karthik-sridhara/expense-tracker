export interface AppTableColumn<T = Record<string, unknown>> {
  field: keyof T & string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}