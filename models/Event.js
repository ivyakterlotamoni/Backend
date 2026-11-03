
import { getDB } from "../config/db.js";

const eventsCollection = () => {
  return getDB().collection("events");
};

export default eventsCollection;
