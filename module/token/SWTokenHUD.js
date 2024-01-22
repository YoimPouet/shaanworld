export class SWTokenHUD extends TokenHUD {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "token-hud",
      template: "systems/shaanworld/templates/hud/tokenHUD.hbs",
    });
  }

  getData(options = {}) {
    let data = super.getData(options);
    this.object.document.bar1 = { attribute: "trihns.esprit" };
    this.object.document.bar2 = { attribute: "trihns.ame" };
    this.object.document.bar3 = { attribute: "trihns.corps" };
    const bar1 = this.object.document.getBarAttribute("bar1");
    const bar2 = this.object.document.getBarAttribute("bar2");
    const bar3 = this.object.document.getBarAttribute("bar3");
    let bars = [bar1, bar2, bar3];
    if (this.object.actor.type !== "adversite") {
      bars.forEach((b) => {
        if (b & b.value) {
          if (b.value > b.max) {
            b.value = b.max;
          }
        }
      });
      data = foundry.utils.mergeObject(data, {
        canConfigure: game.user.can("TOKEN_CONFIGURE"),
        canToggleCombat: ui.combat !== null,
        displayBar1: bar1 && bar1.type !== "none",
        bar1Data: bar1,
        displayBar2: bar2 && bar2.type !== "none",
        bar2Data: bar2,
        displayBar3: bar3 && bar3.type !== "none",
        bar3: bar3.attribute,
        bar3Data: bar3,
        visibilityClass: data.hidden ? "active" : "",
        effectsClass: this._statusEffects ? "active" : "",
        combatClass: this.object.inCombat ? "active" : "",
        targetClass: this.object.targeted.has(game.user) ? "active" : "",
      });
    }
    data.statusEffects = this._getStatusEffectChoices(data);
    return data;
  }
}
