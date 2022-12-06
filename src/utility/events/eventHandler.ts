import { IButtonEventPayload } from "../interfaces";
import settingsEventHandler from "./settingsEventHandler"

const eventHandler = (e) => {
  const payload: IButtonEventPayload = e.detail

  switch (payload.type) {
    case "setting":
      settingsEventHandler(payload)
      break;
    default:
      console.log("eventhandler got passed an undefined or unhandled typing, typing: ", payload.type)
      break;
  }
}

export default eventHandler