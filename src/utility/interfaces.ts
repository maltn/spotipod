interface IItem {
  id?: string,
  name: string;
  items?: IItem[];
  type?: string
}

interface IButtonEventPayload {
  name: string,
  type: string | undefined
}

export type {IItem, IButtonEventPayload}