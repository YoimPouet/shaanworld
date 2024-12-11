import { objectHasKey } from "../utils/utils.js";
export class TokenDocumentSW extends TokenDocument {
  getBarAttribute(barName, { alternative } = {}) {
    this.bar3 = { attribute: "trihns.corps" };
    const attribute = alternative || this[barName]?.attribute;
    if (!attribute || !this.actor) return null;
    const system = this.actor.system;
    const isSystemDataModel = system instanceof foundry.abstract.DataModel;
    const templateModel = game.model.Actor[this.actor.type];

    // Get the current attribute value
    const data = foundry.utils.getProperty(system, attribute);
    if (data === null || data === undefined) return null;

    // Single values
    if (Number.isNumeric(data)) {
      let editable = foundry.utils.hasProperty(templateModel, attribute);
      if (isSystemDataModel) {
        const field = system.schema.getField(attribute);
        if (field) editable = field instanceof foundry.data.fields.NumberField;
      }
      return { type: "value", attribute, value: Number(data), editable };
    }

    // Attribute objects
    else if ("value" in data && "max" in data) {
      let editable = foundry.utils.hasProperty(templateModel, `${attribute}.value`);
      if (isSystemDataModel) {
        const field = system.schema.getField(`${attribute}.value`);
        if (field) editable = field instanceof foundry.data.fields.NumberField;
      }
      return { type: "bar", attribute, value: parseInt(data.value || 0), max: parseInt(data.max || 0), editable };
    }

    // Otherwise null
    return null;
  }
}
