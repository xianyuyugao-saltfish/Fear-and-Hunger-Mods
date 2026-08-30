/*:
 * @plugindesc v2.0 - Includes a list of QoL and General changes to the game.
 * @author Toby Yasha, Fokuto, Nemesis, Atlasle, 咸鱼鱼糕
 *
 * @help
 *
 * ------------------------ CHANGES ------------------------------
 *
 * [!] General Changes:
 * - Fixed battle status window showing status effect icons.
 *
 * - Added option for enabling/disabling waiting for 
 *   animations to complete before applying damage/healing.
 *
 * - Fixed 'scope' of null and hopefully 'action' of null crashes
 *   by porting changes from the RPG Maker MZ 1.7.0 update.
 *
 * - Fixed various action methods that would having undefined:
 *   - Subject
 *   - Target
 *   - Action Item(aka skill or item data)
 *
 * - Fixed Hardened heart and Last Defense reducing damage
 *   by too much.
 *
 * - Fixed select highlight not playing correctly on
 *   enemies when they have a state animation.
 *
 * - Fixed the NW.js process not properly closing due to NW.js
 *   update to v78.
 *   - This basically means the game would still be open in the 
 *     Task Manager.
 *
 * [!] PrettySleekGauges Changes:
 * - Fixed gauges not clearing number values when updating.
 *
 * [!] YEP_BattleEngineCore Changes:
 * - Added option for enabling/disabling waiting
 *   for reflect animation before applying effect.
 *
 * - Prevents access to the party window(Fight, Run) by any means.
 *
 * - Prevents actor window from changing selected command when pressing cancel.
 *
 * - Fixed crash when unable to retrieve action speed.
 *
 * [!] YEP_X_AnimatedSVEnemies Changes:
 * - Fixed crash when trying to update enemy position.
 *
 * [!] GALV_LayerGraphics Changes:
 * - Fixed crash on hexen scene by preventing the plugin from 
 *   removing non-existing layers.
 *
 * [!] Galv_ExAgiTurn Changes:
 * - Extra turn label will now be hidden when in the equipment menu.
 *
 * [!] malcommandequip_edits Changes:
 * - Extra turn label will now be hidden when in the equipment menu.
 *
 * [!] HIME_EnemyReinforcements Changes:
 * - Fixed enemy sprites being on top of actor sprites in battle
 *   when adding reinforcements.
 *
 * [!] VE_BasicModule/VE_FogAndOverlay Changes:
 * - Fixed sprite order in battle being messed up because it was
 *   updated every frame.
 *
 * [!] Place below these plugins or as low as possible:
 * - PrettySleekGauges
 * - YEP_BattleEngineCore
 * - YEP_BuffsStatesCore
 * - YEP_X_AnimatedSVEnemies
 * - HIME_EnemyReinforcements
 * - VE_BasicModule
 * - VE_FogAndOverlay
 *
 * ------------------------ UPDATES ------------------------------
 *
 * Version 1.1 - 10/1/2024
 * - Added plugin parameters for animation waiting.
 * - Improved code to prevent potential errors if 
 * certain plugins are not present.
 * - Fixed a bug with the party window code that prevented
 *   actors from cancelling their actions.
 * - Added fix for a crash with YEP_X_AnimatedSVEnemies.
 * 
 * Version 1.2 - 10/2/2024
 * - Added fix for crashes related to forced actions in battle:
 *   'scope' of null and hopefully 'action' of null.
 *
 * Version 1.3 - 10/4/2024
 * - Added fix for crashing on hexen due to GALV_LayerGraphics
 *   trying to remove invalid layer.
 *
 * Version 1.3.1 - 10/5/2024
 * - Removed GALV_LayerGraphics fix from this plugin, instead
 *   fix is applied directly on the GALV_LayerGraphics.js plugin.
 *   NOTE: This is done in order to prevent "Sprite_LayerGraphicS
 *   is not defined" from happening.
 *
 * Version 1.4 - 10/6/2024
 * - Added a fix for wrong sprite layering caused by 
 *   HIME_EnemyReinforcements in battle.
 *  
 * Version 1.5 - 10/8/2024
 * - Added a fix to a method from VE_BasicModule/VE_FogAndOverlay
 *   which was messing with the order of battle sprites.
 *
 * Version 1.6 - 10/9/2024
 * - Added a fix for crashing due to not being able to retrieve 
 *   action speed from YEP_BattleEngineCore's Game_Action method.
 *
 * Version 1.7 - 10/11/2024
 * - Added a fix for select highlight not playing correctly on
 *   enemies when they have a state animation.
 * - Added a fix Hardened heart and Last Defense reducing damage
 *   by too much.
 * - Added a fix for 0% state rate to not prevent statuses when
 *   inflicted with certain hits/add state.
 *
 * Version 1.8 - 10/12/2024
 * - Added failsafe measurements to actions if subject doesn't exist
 *   anymore.
 *
 * Version 1.8.1 - 10/15/2024
 * - Removed the fix for jittering in the overworld.
 * - Added checks for the extra turn label so that it gets hidden
 *   when in the Equip menu.
 *
 * Version 1.8.2 - 10/16/2024
 * - Moved the check for the action's item to be before we decide
 *   on a target for a forced action.
 *   - Game_Battler.prototype.forceAction (Affected method)
 *   - This change is done in order to prevent crashing when the
 *     action's item is undefined/null.
 *
 * Version 1.8.3 - 10/17/2024
 * - Fixed command remember option not mattering.
 *   - Window_ActorCommand.prototype.selectLast (Affected method)
 *
 * Version 1.9 - 7/7/2025
 * - Removed "Wait for Animation" parameter (temporarily(?)).
 * - Removed "Wait for Reflect" parameter (temporarily(?)).
 * Dev Comment: These two were basically not even used.
 * Might return them in the future if used or in another form.
 * 
 * - Removed "0% state rate" fix since it would crash the game.
 * 
 * - Slightly refactored code.
 * - Added JSDoc style comments for members and methods.
 * - Added compatibility patches for "TY_QuickSave":
 *   - Added a patch to ensure game window can be properly closed.
 *     - SceneManager.terminate (Affected method)
 *   - Fixed "SceneManager.onKeyDown" overwriting changes made by 
 *     "TY_QuickSave".
 * - Added a fix to ensure NW.js process is properly ended when
 *   the game window is closed.
 *   - NOTE: This happened because of the update to v78 of NW.js.
 * - DevTools now can be called even during the deployed version
 *   of the game.
 *
 * Version 2.0 - 8/30/2026
 * - Fixed flickering of event sprites using character images
 *   when executing the "Change Tileset" map command.
 *   - Fixed bug where event image persists when switching to 
 *     a blank image event page from previous fix
 */

var TY = TY || {};
TY.terminaTweaks = TY.terminaTweaks || {};
 
(function(_) {

    let fEXTURNvisible = true;

//===============================================================
    // Public Methods
//===============================================================

    /**
     * NOTE: This has been taken from the RPG Maker MZ "main.js" file
     * in order to fix issues brought with updating the NW.js version to v78.
    */
    _.hookNwjsClose = function() {
        // [Note] When closing the window, the NW.js process sometimes does
        //   not terminate properly. This code is a workaround for that.
        if (typeof nw === "object") {
            nw.Window.get().on("close", () => nw.App.quit());
        }
    }

    _.hookNwjsClose();

//===============================================================
    // Game_Battler
//===============================================================

    /**
     * BUGFIX: Adds a new action only if the action's item/skill data is valid.
     * NOTE: This bug fix is important in combating the "removeCurrentAction" of null.
     * NOTE: This is bug fix is ported from the RPG Maker MZ 1.7.0 update.
    */
    Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
        this.clearActions();

        const action = new Game_Action(this, true);
        action.setSkill(skillId);

        if (action.item()) {

            if (targetIndex === -2) {
                action.setTarget(this._lastTargetIndex);
            } else if (targetIndex === -1) {
                action.decideRandomTarget();
            } else {
                action.setTarget(targetIndex);
            }
    
            this._actions.push(action);

        }
    };

//===============================================================
    // Game_Action
//===============================================================
    
    /**
     * BUGFIX: Ensures the subject is defined when trying to 
     * obtain the action's speed. 
     * 
     * @alias Game_Action.prototype.speed
     * 
     * @returns {number} The action speed used for the turn 
     * order in battle.
    */
    const TY_Game_Action_speed = Game_Action.prototype.speed;
    Game_Action.prototype.speed = function() {
        if (this.subject()) {
            return TY_Game_Action_speed.call(this);
        } else {
            let speed = 0;
            if (this.item()) {
                speed += this.item().speed;
            }
            if (this.subject() && this.isAttack()) {
                speed += this.subject().attackSpeed();
            }
            return speed;
        }
    };

    /**
     * BUGFIX: Ensure subject exists before checking for confusion.
    */
    Game_Action.prototype.prepare = function() {
        if (this.subject() && this.subject().isConfused() && !this._forcing) {
            this.setConfusion();
        }
    };
    
    /**
     * BUGFIX: Ensure subject exists before checking if action can be used.
     * 
     * @returns {boolean} True is action is valid and can be used.
    */
    Game_Action.prototype.isValid = function() {
        return (this._forcing && this.item()) || (this.subject() && this.subject().canUse(this.item()));
    };

    /**
     * BUGFIX: Hardened heart and last defense fix(by Fokuto).
    */
    Game_Action.prototype.onReactStateEffects = function(target, value) {
        let states = target.states();
        states = states.reverse();

        let originalValue = value;

        for (let i = 0; i < states.length; ++i) {
            let state = states[i];
            if (!state) continue;
            value = this.processStProtectEffects(target, state, value, originalValue);
        }

        return Yanfly.LunStPro.Game_Action_onReact.call(this, target, value);
    };

//===============================================================
    // Window_Base
//===============================================================

    /**
     * Replace level with status effects (5x3).
    */
    Window_Base.prototype.drawActorLevel = function(actor, x, y) {
        let icons = actor.allIcons();

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 5; i++) {
                this.drawIcon(icons[i + ( 5 * j)], x + Window_Base._iconWidth * i, y + Window_Base._iconHeight * j);
            }
        }
    };
    
    /**
     * Replace status effects in equip and skill menu with nothing.
    */
    Window_Base.prototype.drawActorIcons = function(actor, x, y) {
        wzSOffset = false;

        let z = SceneManager._scene; 
        let n = 22;

        // check if on pause menu and reduce visible states to 5
        if ((SceneManager._scene instanceof Scene_Menu) || (SceneManager._scene instanceof Scene_Item)) { n = 5 };

        // im going to hell for this
        if ((z._actorCommandWindow && !(z._actorCommandWindow.active)) && (z._actorWindow && !(z._actorWindow.active)) && (z._equipStatusWindow && z._equipStatusWindow.active) && (z._enemyWindow && !(z._enemyWindow.active)) || (z._statusWindow && z._statusWindow.active)) {
            n = 5;
            this.resetTextColor();
            wzSOffset = true;
        } else {
            fEXTURNvisible = true
            var icons = actor.allIcons();
            for (let i = 0; i < n; i++) {
                this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y);
            }
        }

        if (((z._actorCommandWindow && !(z._actorCommandWindow.active))) && (z._enemyWindow && !(z._enemyWindow.active)) && (z._actorWindow && !(z._actorWindow.active))) {
        } else if (wzSOffset) {
            this.drawActorIconsTurns(actor, x, y - (Window_Base._iconHeight + 6), n * Window_Base._iconWidth);
        } else {
            this.drawActorIconsTurns(actor, x, y - 2, n * Window_Base._iconWidth);
        }
    };

//===============================================================
    // Window_BattleStatus
//===============================================================

    /**
     * BUGFIX: Changed battle status window to not draw status effect icons(by Toby Yasha).
     * 
     * NOTE: Because they aren't draw properly due to limited space.
    */
    Window_BattleStatus.prototype.drawActorIcons = function() {};

//===============================================================
    // Window_ActorCommand
//===============================================================

    /**
     * Reset the cursor's position to index 0 only if "Command Remember"
     * isn't enabled.
    */
    Window_ActorCommand.prototype.selectLast = function() {
        if (this._actor && ConfigManager.commandRemember) {
            var symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
            if (symbol === 'skill') {
                var skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt(skill.stypeId);
                }
            }
        } else {
            this.select(0);
        }
    };

//===============================================================
	// Special_Gauge
//===============================================================

    if (Imported.PrettySleekGauges) {

        /**
         * BUGFIX: Fixed gauges not clearing number values when updating(by Toby Yasha).
        */
        Special_Gauge.prototype.refresh = function() {
            var gy = this._y + this._window.lineHeight() - 2;
            if (this._vocab) {
        		this._window.contents.clearRect(this._x - 1, this._y, this._width + 2, this._window.lineHeight()); // Fixed Here
            } else {
                gy -= this._height;
                this._window.contents.clearRect(this._x, gy, this._width + 2, this._height);
            }
            this.drawGauge();
            this.drawText();
        }

    }

//===============================================================
    // Sprite_Battler
//===============================================================

    /**
     * BUGFIX: Fix select highlight not playing if the enemy has a
     * state animation which makes their sprite flash(by Fokuto).
    */
    Sprite_Battler.prototype.updateSelectionEffect = function() {
        var target = this._effectTarget;
        if (this._battler.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                target._colorTone = [40, 40, 40, 40];
                target.setBlendColor([255, 255, 255, 1]);
            } else {
                target._colorTone = [0, 0, 0, 0];
                target.setBlendColor([0, 0, 0, 0]);
            }
        } else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            target._colorTone = [0, 0, 0, 0];
            target.setBlendColor([0, 0, 0, 0]);
        }
    };

//===============================================================
    // Sprite_Actor
//===============================================================

    /**
     * Removes delay when being hit (only useful for damage DURING animations)
    */
    Sprite_Actor.prototype.startMotion = function(motionType) {
        const newMotion = Sprite_Actor.MOTIONS[motionType];

        if (this._motion !== newMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        } else {
            this._actor.clearMotion();
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    };

//===============================================================
    // Sprite_ExTurn
//===============================================================

    /**
     * Make the extra turn label not overlap on the larger skill and item windows(by Fokuto).
    */
    Sprite_ExTurn.prototype.update = function() {
        Sprite.prototype.update.call(this);
        z = SceneManager._scene;

        if ((z._skillWindow && (z._skillWindow.active)) || (z._itemWindow && (z._itemWindow.active))) {
            fEXTURNvisible = false;
        } else if (z._actorCommandWindow && (z._actorCommandWindow.active)) {
            fEXTURNvisible = true;
        }

        this.opacity += (Galv.EXTURN.active && fEXTURNvisible) ? Galv.EXTURN.fade : -Galv.EXTURN.fade;
    };

//===============================================================
    // Sprite_Animation
//===============================================================

    if (Imported.YEP_X_AnimatedSVEnemies) {

        /**
         * BUGFIX: Fixed crash caused by YEP_X_AnimatedSVEnemies.js at line 2773.
         * The problem is that "parent" can be null and if "parent._battler" is called
         * then that results in an error.
         * 
         * @alias Sprite_Animation.prototype.updateSvePosition
        */
        const TY_Sprite_Animation_updateSvePosition = Sprite_Animation.prototype.updateSvePosition;
        Sprite_Animation.prototype.updateSvePosition = function() {
            if (this._target && this._target.parent) {
                TY_Sprite_Animation_updateSvePosition.call(this);
            }
        };

    }

//===============================================================
	// Spriteset_Battle
//===============================================================

    /**
     * Initializes member property that keeps track of sorted battler sprites
     * 
     * @alias Spriteset_Battle.prototype.initialize
    */
    const TY_Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
    Spriteset_Battle.prototype.initialize = function() {
        TY_Spriteset_Battle_initialize.call(this);
        this._battleSpritesSorted = false;
    }

    if (Imported.EnemyReinforcements) { /** HIME_EnemyReinforcements */
    
        /**
         * Calls the method for ordering the battler sprites(actors and enemies).
         * 
         * @alias Spriteset_Battle.prototype.refreshEnemyReinforcements
        */
        const TY_Spriteset_Battle_refreshEnemyReinforcements = Spriteset_Battle.prototype.refreshEnemyReinforcements;
        Spriteset_Battle.prototype.refreshEnemyReinforcements = function() {
            TY_Spriteset_Battle_refreshEnemyReinforcements.call(this);
            this.reorderBattlerSprites();
        }
    
        /**
         * Get the index of the last enemy, then use it to move
         * the first actor above the enemies in the battlefield container.
         * Then move the rest of the actors based on the index of the previous actor.
         * 
         * NOTE: This is done in order to prevent the "Gas Canister" enemy from rendering over actor sprites.
        */
        Spriteset_Battle.prototype.reorderBattlerSprites = function() {
            const lastEnemyIndex = this._enemySprites.length - 1;
    
            if (lastEnemyIndex >= 0) {
                const enemy = this._enemySprites[lastEnemyIndex];
                const enemyIndex = this._battleField.getChildIndex(enemy);
    
                for (let i = 0; i < this._actorSprites.length; i++) {
                    const actor = this._actorSprites[i];
    
                    if (i === 0) {
                        this._battleField.setChildIndex(actor, enemyIndex);
                    } else {
                        const prevActor = this._actorSprites[i - 1];
                        const prevIndex = this._battleField.getChildIndex(prevActor);
                        this._battleField.setChildIndex(actor, prevIndex);
                    }
    
                }
    
            }
        }
    
    } /** HIME_EnemyReinforcements */

    if (Imported['VE - Basic Module']) { /** VE_BasicModule -- VE_FogAndOverlay */
        
        /**
         * BUGFIX: Sort battle sprites only once instead of every frame.
         * 
         * NOTE: This is done in order to prevent the "Gas Canister" enemy from rendering over actor sprites.
         * 
         * @alias Spriteset_Battle.prototype.sortBattleSprites
        */
        const TY_Spriteset_Battle_sortBattleSprites = Spriteset_Battle.prototype.sortBattleSprites;
        Spriteset_Battle.prototype.sortBattleSprites = function() {
            if (!this._battleSpritesSorted) {
                TY_Spriteset_Battle_sortBattleSprites.call(this);
                this._battleSpritesSorted = true;
            }
        };

    } /** VE_BasicModule -- VE_FogAndOverlay */

//===============================================================
	// Scene_Battle
//===============================================================

    /**
     * Reverts the method back to native RPG Maker MV.
     * 
     * NOTE:This is because there was a conflict with YEP_BattleEngineCore.
     * 
     * NOTE: I think the conflict was that the battle either froze when trying to
     * go previous command(ex: from actor command window to party command window)
     * 
     * @alias Scene_Battle.prototype.createActorCommandWindow
    */
    const TY_Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        TY_Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    };
    
    /**
     * Reverts the method back to native RPG Maker MV.
     * 
     * NOTE: This is because there was a conflict with YEP_BattleEngineCore.
    */
    Scene_Battle.prototype.selectPreviousCommand = function() {
        BattleManager.selectPreviousCommand();
        this.changeInputWindow();
    }
    
    /**
     * Prevents going to the the party command window when cancelling your current command.
     * Example: actor command window -> party command window
     * 
     * @override
    */
    Scene_Battle.prototype.changeInputWindow = function() {
        if (BattleManager.isInputting()) {
            if (BattleManager.actor()) {
                this.startActorCommandSelection();
            } else {
                this.selectNextCommand();
            }
        } else {
            this.endCommandSelection();
        }
    };

    /**
     * Make the extra turn label hide itself in the equip menu(by Fokuto).
    */
    Scene_Battle.prototype.commandEquipment = function() {
        fEXTURNvisible = false;
        fWINDOWopen = true;

        MalcommandEquipment.call(this);
        BattleManager.actor()._origEquips = [];

        for (let i = 0; i < BattleManager.actor()._equips.length; i++) {
            if (BattleManager.actor()._equips[i]) {
                BattleManager.actor()._origEquips[i] = BattleManager.actor()._equips[i]._itemId;
            } else {
                BattleManager.actor()._origEquips[i] = 0;
            }
        }
    };

//===============================================================
    // SceneManager
//===============================================================

    /**
     * Opens up the the Chrome DevTools when pressing the F8 key.
    */
    SceneManager.showDevTools = function(event) {
        if (!event.ctrlKey && !event.altKey && event.keyCode === 119) { // F8
            nw.Window.get().showDevTools();
        }
    }

    /**
     * Allows using DevTools even during the deployed build.
     * 
     * @alias SceneManager.onKeyDown
    */
    const TY_SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown = function(event) {
        if (Utils.isNwjs()) {
            SceneManager.showDevTools(event);
        }
        TY_SceneManager_onKeyDown.call(this, event);
    };

    /**
     * Ensures the game window can be properly closed.
     * 
     * NOTE: It seems Window.close() no longer works as intended after adding
     * hooks/callbacks to the the NW.js window "Close" listener.
     * This is a workaround for that.
     * 
     * @alias SceneManager.terminate
    */
    const TY_SceneManager_terminate = SceneManager.terminate;
    SceneManager.terminate = function() {
        if (Utils.isNwjs()) {
            nw.App.quit();
        } else {
            TY_SceneManager_terminate.call(this);
        }
    };

//===============================================================
    // BattleManager
//===============================================================

    /**
     * BUGFIX: Ensures the battler exists and has actions before being forced to act.
     * NOTE: This bug fix is important in combating the "removeCurrentAction" of null.
     * NOTE: This is bug fix is ported from the RPG Maker MZ 1.7.0 update.
     * 
     * @alias BattleManager.forceAction
    */
    const TY_BattleManager_forceAction = BattleManager.forceAction;
    BattleManager.forceAction = function(battler) {
        if (battler && battler.numActions() > 0) {
            TY_BattleManager_forceAction.call(this, battler);
        }
    };
	
//===============================================================
  // Sprite_Character
//===============================================================
    /**
	 * BUGFIX: Prevents flickering of event sprites using character images
	 *         when executing the "Change Tileset" map command.
	 * NOTE  :  The engine used to rebind textures just because tilesetId changed 
	 *			even if the character image didn't.
     * 			This fix ignores tilesetId for non‑tile events, 
	 *			only update when the actual image changes.
     * 			Tile‑based events keep the original behavior, so nothing else breaks.
    */
  var _updateBitmap = Sprite_Character.prototype.updateBitmap;

  Sprite_Character.prototype.updateBitmap = function () {
    var tileId = this._character.tileId();

    if (tileId > 0) {
      _updateBitmap.call(this);
      return;
    }
    var characterName = this._character.characterName();
    var characterIndex = this._character.characterIndex();

    var isChanged =
      this._tileId !== tileId ||
      this._characterName !== characterName ||
      this._characterIndex !== characterIndex;

    if (isChanged) {
      var newBitmap = ImageManager.loadCharacter(characterName);
      this.bitmap = newBitmap;
      this._tileId = tileId;
      this._characterName = characterName;
      this._characterIndex = characterIndex;
      this._isBigCharacter = ImageManager.isBigCharacter(characterName);
    }
  };
	
//==========================================================
    // End of File
//==========================================================

})(TY.terminaTweaks);
