interface IItem {
  name: string;
  items?: IItem[];
  selected?: boolean;
  hover: boolean;
  type: string;
}

export type {IItem}