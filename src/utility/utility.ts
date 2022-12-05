import { IItem } from "./interfaces";

function findNestedObj(entireObj: IItem, keyToFind: string, valToFind: any): IItem | undefined {
  let foundObj: IItem;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind] === valToFind) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj ? foundObj : entireObj;
};

let updateNestedByIdentifier = (name:string, val: any, obj: IItem) => {
  // console.log(`Currently: "${obj.name}" Looking: ${name}`)
  if (obj.name == name) {
    obj = val
  } else if (obj.items) {
    for (let i = 0; i < obj.items.length; i++) {
      updateNestedByIdentifier(name, val, obj.items[i])
    }
  }
};

export {findNestedObj, updateNestedByIdentifier}