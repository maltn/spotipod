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

const findParent = (obj: IItem, value: IItem) => {
  if(obj.items.includes(value)) {
    return obj
  } else if(obj.items) {
    for(let i = 0; i < obj.items.length; i++) {
      const result = findParent(obj.items[i], value)
      if (result) return result
    }
  }
  return null
}

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

const imageBytesToBase64 = (data: Uint8Array) => {
  let base64String = "";
  for (var i = 0; i < data.length; i++) {
    base64String += String.fromCharCode(data[i]);
  }
  const base64 = "data:image/jpeg;base64," + window.btoa(base64String);
  return base64
}

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

export {findNestedObj, updateNestedByIdentifier, findParent, imageBytesToBase64, fmtMSS}