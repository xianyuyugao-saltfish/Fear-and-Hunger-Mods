//==========================================================
	// VERSION 2.0.0 -- by Toby Yasha
//==========================================================

/**
 * [QUICK-SUMMARY]:
 * 
 * Stops certain parellel map events and common events 
 * from running their commands when dialogue is being displayed.
 * 
 * This in turn may prevent losing/gaining:
 * - Body
 * - Mind
 * - Hunger
 * 
 * The mod may also potentially improve the game's
 * performance while dialogue is being displayed.
 * 
 * [SPECIAL-THANKS]:
 * 
 * This mod has been commissioned by s0mthinG.
 */

var TY = TY || {};
TY.fnhWaitForDialogue = TY.fnhWaitForDialogue || {};

var Imported = Imported || {};
Imported.TY_FnHWaitForDialogue = true;

// NOTE: Make it so that you don't lose mind/hunger when the Hexen map/system is active.

(function(_) { 

	//==========================================================
		// Mod Parameters 
	//==========================================================

	/**
	 * The name of Parallel Map Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * These are named the same in both games, thankfully.
	 * 
	 * @typeDef {string[]} restrictedMapEvents
	 * 
	 * @property {string} [blood | blood2] - 
	 * Alternative bleeding or Nausea debuff(Termina)
	 * 
	 * @property {string} [bleeding | bleeding2 | bleeding3] - 
	 * Applies bleeding damage and the bleeding blood trail on the map
	 * 
	 * @property {string} sanity - Lose your sanity in dark or unsafe places.
	 * [WARNING]: Some events may not properly work or work at all, but those cases
	 * should be few in numbers.
	 * 
	 * @property {string} regain_sanity - Regains sanity in well lit or safe places.
	 * [WARNING]: Some events may not properly work or work at all, but those cases
	 * should be few in numbers.
	 */
	const restrictedMapEvents = [
		"blood",
		"blood2",
		"bleeding",
		"bleeding2",
		"bleeding3",
		"sanity",
		"regain_sanity"
	]

	/**
	 * The name of Parallel Map Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * NOTE(For Users): Feel free to remove the hound timer
	 * from here if you don't like it.
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @typeDef {string[]} fnh1RestrictedMapEvents
	 * 
	 * @property {string} [hound_TIMER | hound_TIMER2] - The timer used outside 
	 * the fortress to call the hounds to attack you if you idle too long.
	 * 
	 * @property {string} [mahabre_TIMER | mahabre_TIMER2] - The timer used in
	 * Mahabre when you teleport via the Mahabre book.
	 */
	const fnh1RestrictedMapEvents = [
		...restrictedMapEvents,
		"hound_TIMER",
		"hound_TIMER2",
		"mahabre_TIMER",
		"mahabre_TIMER2"
	]

	/**
	 * The name of Parallel Common Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @typeDef {string[]} fnh1RestrictedCommonEvents
	 * 
	 * @property {string} HUNGER_of_* - 
	 * Handles the hunger gain of a specific character.
	 * 
	 * @property {string} TORCH_TIMER - 
	 * Handles the luminosity and duration of the torch.
	 */
	const fnh1RestrictedCommonEvents = [
		"HUNGER_of_GIRL",
		"HUNGER_of_KNIGHT",
		"HUNGER_of_Mercenary",
		"HUNGER_of_DKPRIEST",
		"HUNGER_of_OUTLANDER",
		"HUNGER_of_LEGARDE",
		"HUNGER_of_MOONLESS",
		"HUNGER_of_KIDDEMON",
		"HUNGER_of_MARRIAGE",
		"HUNGER_of_FUSION",
		"HUNGER_of_BABYDEMON",
		"HUNGER_of_Ghoul1",
		"HUNGER_of_Ghoul2",
		"HUNGER_of_Ghoul3",
		"TIMER", // probably legarde timer?
		"TIMER_buckman",
		"TORCH_TIMER"
	]

	/**
	 * The name of Parallel Common Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * This is for Fear and Hunger 2.
	 * 
	 * @typeDef {string[]} fnh2RestrictedCommonEvents
	 * 
	 * @property {string} HUNGER_of_* - 
	 * Handles the hunger gain of a specific character.
	 * 
	 * @property {string} RIFLEMAN_ATTENTION! - 
	 * Handles the rifleman shooting on the riverside map.
	 */
	const fnh2RestrictedCommonEvents = [
		"HUNGER_of_OCCULTIST", // Marina
		"HUNGER_of_MERCENARY", // Levi
		"HUNGER_of_DOCTOR", // Daan
		"HUNGER_of_MECHANIC", // Abella
		"HUNGER_of_YELLOW_PRIEST", // O'saa
		"HUNGER_of_BLACK_KALEV",
		"HUNGER_of_Ghoul1",
		"HUNGER_of_Ghoul2",
		"HUNGER_of_Ghoul3",
		"HUNGER_of_Thug", // Marcoh
		"HUNGER_of_Journalist", // Karin
		"HUNGER_of_Botanist", // Olivia
		"HUNGER_of_Villager1",
		"HUNGER_of_Villager2",
		"HUNGER_of_Villager3",
		"RIFLEMAN_ATTENTION!"
	]

	//==========================================================
		// Mod Parameters -- Edge Case Handling
	//==========================================================

	/**
	 * The ids of Game Switches that are found in the page
	 * conditions of certain Game_Event instance.
	 * 
	 * NOTE: This is used to dynamically retrieve the name of
	 * events that do not have a naming convention and
	 * instead use the default RPG Maker event naming.
	 * (ex: "EV176")
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @type {number[]}
	 */
	const fnh1RestrictedSwitchIds = [343]; // Yellow Mage Dance

	/**
	 * The ids of Game Switches that are found in the page
	 * conditions of certain Game_Event instance.
	 * 
	 * This is for Fear and Hunger 2.
	 * 
	 * @type {number[]}
	 */
	const fnh2RestrictedSwitchIds = [3772]; // Yellow Mage Dance

	//==========================================================
		// Mod Utility Methods
	//==========================================================

	/**
	 * Checks which FnH game instance is currently being played.
	 * 
	 * @returns {boolean} True if the current FnH instance is Termina.
	 */
	function isGameTermina() {
		return $dataSystem.gameTitle.match(/TERMINA/gi);
	}

	/**
	 * Get a list of restricted Parallel Map Events by their name.
	 * 
	 * @returns {string[]} A list with the names of the restricted
	 * Parallel Map Events based on the Fear and Hunger game.
	 */
	function getRestrictedMapEvents() {
		return isGameTermina() ? restrictedMapEvents : fnh1RestrictedMapEvents;
	}

	/**
	 * Get a list of restricted Parallel Common Events by their name.
	 * 
	 * @returns {string[]} A list with the names of the restricted
	 * Parallel Common Events based on the Fear and Hunger game.
	 */
	function getRestrictedCommonEvents() {
		return isGameTermina() ? fnh2RestrictedCommonEvents : fnh1RestrictedCommonEvents;
	}

	/**
	 * Get a list of restricted Game Switches by their id.
	 * 
	 * @returns {number[]} A list with the ids of the restricted
	 * Game Switches based on the Fear and Hunger game.
	 */
	function getRestrictedSwitches() {
		return isGameTermina() ? fnh2RestrictedSwitchIds : fnh1RestrictedSwitchIds;
	}

	//==========================================================
		// Game_Map 
	//==========================================================

	_.checkEventHasSwitchId = function(event, targetSwitchId) {
		return event.pages.some(page => {
			const c = page.conditions;
			return (
				(c.switch1Id === targetSwitchId && c.switch1Valid) ||
				(c.switch2Id === targetSwitchId && c.switch2Valid)
			)
		});
	}

	_.isEventRestricted = function(event) {
		return restrictedEvents.includes(event.name) || _.checkEventHasSwitchId(event, /*switch_list*/);
	}

	_.test1 = function() {
		const restrictedEvents = getRestrictedMapEvents();

		for (const event of $gameMap.events()) {
			if (!restrictedEvents.includes(event.event().name)) continue;

			//
		}
	}

	_.test2 = function() {
		const restrictedEvents = getRestrictedCommonEvents();

		for (const event of $gameMap._commonEvents) {
			if (!restrictedEvents.includes(event.event().name)) continue;
		}
	}

	/*const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		_Game_Map_setupEvents.call(this);

	    
	};*/

	//==========================================================
		// Game_CommonEvent 
	//==========================================================

	/*
	const _Game_CommonEvent_update = Game_CommonEvent.prototype.update;
	Game_CommonEvent.prototype.update = function() {
		_Game_CommonEvent_update.call(this);
	};*/

	//==========================================================
		// Game_Event 
	//==========================================================

	/*
	const _Game_Event_updateParallel = Game_Event.prototype.updateParallel
	Game_Event.prototype.updateParallel = function() {
		_Game_Event_updateParallel.call(this);
	};*/

	//==========================================================
		// Game_Interpreter 
	//==========================================================

	/**
	 * Check if an interpreter instance is allowed to change an actor's hp(body).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const _Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
	Game_Interpreter.prototype.command311 = function() {

		//if (!InterpreterHelper.isSystemLocked()) {
			return _Game_Interpreter_command311.call(this);
		//}

	    return true;
	};
	
	/**
	 * Check if an interpreter instance is allowed to change an actor's mp(mind).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const _Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
	Game_Interpreter.prototype.command312 = function() {

		//if (!InterpreterHelper.isSystemLocked()) {
	    	return _Game_Interpreter_command312.call(this);
		//}

		return true;
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's exp(hunger).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const _Game_Interpreter_command315 = Game_Interpreter.prototype.command315;
	Game_Interpreter.prototype.command315 = function() {

		//if (!InterpreterHelper.isSystemLocked()) {
	    	return _Game_Interpreter_command315.call(this);
		//}

	    return true;
	};

		//==========================================================
		// Message Helper
	//==========================================================

	// split the system into message handler and interpreter handler

	_._messageStarted = false;

	_._messageGraceTimer = 0;

	_._MESSAGE_GRACE_FRAMES = 60;

	_.onMessageStarted = function() {
		_._messageStarted = true;
		// stop events
		console.log("message started");
	}

	_.getMessageGraceFrames = function() {
		return _._MESSAGE_GRACE_FRAMES;
	}

	_.startMessageGracePeriod = function() {
		_._messageGraceTimer = _.getMessageGraceFrames();
		console.log("message concluded");
	}

	_.isMessageGracePeriodActive = function(messageWindow) {
		return _._messageStarted && _._messageGraceTimer > 0 && messageWindow.isClosed();
	}

	_.updateMessageGracePeriod = function() {
		_._messageGraceTimer--;

		if (_._messageGraceTimer <= 0) {
			_.onMessageConcluded();
		}
	}

	_.onMessageConcluded = function() {
		_._messageStarted = false;
		// resume events
		console.log("no new message started");
	}

	//==========================================================
		// Window_Message
	//==========================================================

	const _Window_Message_update = Window_Message.prototype.update;
	Window_Message.prototype.update = function() {
		_Window_Message_update.call(this);

		if (_.isMessageGracePeriodActive(this)) _.updateMessageGracePeriod();
	};

	const _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
	    _Window_Message_startMessage.call(this);
	    
	    _.onMessageStarted();
	};


	const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
	Window_Message.prototype.terminateMessage = function() {
		_Window_Message_terminateMessage.call(this);

		_.startMessageGracePeriod();
	};

	//==========================================================
		// Sprite_HelperPopup
	//==========================================================

	function Sprite_HelperPopup() {
	    this.initialize.apply(this, arguments);
	}
	
	Sprite_HelperPopup.prototype = Object.create(Sprite.prototype);
	Sprite_HelperPopup.prototype.constructor = Sprite_HelperPopup;

	/**
	 * 
	 */
	Sprite_HelperPopup.VISIBILITY_INTERVAL = 120;

	Sprite_HelperPopup.TEXT_DISPLAY = {
		SYSTEM_STATUS: "systemStatus",
		HUNGER_STATUS: "hungerStatus",
	}

	/**
	 * Field that stores the Rectangle object for the popup bitmap
	 * so that we don't need to re-create the Rectangle object 
	 * every single time we try to retrieve it.
	 * 
	 * @type {Rectangle}
	 * @private
	 */
	Sprite_HelperPopup._defaultBitmapRect = null;

	Sprite_HelperPopup.createDefaultBitmapRect = function() {
		const padding = 16;

		const width = 350; // hardcoded bitmap width
		const height = Window_Base.prototype.lineHeight();
		const x = Graphics.boxWidth - width - padding;
		const y = padding;

		return new Rectangle(x, y, width, height);
	}

	Sprite_HelperPopup.getDefaultBitmapRect = function() {
		if (!this._defaultBitmapRect) {
			this._defaultBitmapRect = this.createDefaultBitmapRect();
		} 

		return this._defaultBitmapRect;
	}

	/*Sprite_HelperPopup.getInterpreterHelperSystemStatus = function() {
		const systemStatus = InterpreterHelper.isSystemEnabled();
		const systemStatus = true;
		const statusText = systemStatus ? "Enabled" : "Disabled";
		return `Interpreter Helper Status: ${statusText}`;
	}*/

	Sprite_HelperPopup.getPlayerHungerStatus = function() {
		return `Player Hunger Updated: ${$gameParty.leader().nextRequiredExp()}`;
	}

	Sprite_HelperPopup.getTextDisplay = function(displayKey) {
		const displayEntries = {
			//[this.TEXT_DISPLAY.SYSTEM_STATUS]: this.getInterpreterHelperSystemStatus(),
			[this.TEXT_DISPLAY.HUNGER_STATUS]: this.getPlayerHungerStatus()
		}

		return displayEntries[displayKey] || "";
	}

	Sprite_HelperPopup.prototype.initialize = function() {

		this.opacity = 0;

		this._visibilityInterval = 0;

		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();
		const bitmap = new Bitmap(bitmapRect.width, bitmapRect.height);

		Sprite.prototype.initialize.call(this, bitmap);
	}

	Sprite_HelperPopup.prototype.refreshDisplay = function() {
		const text = Sprite_HelperPopup.getTextDisplay(this.mode);
		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();

		const textObject = {
			text,
			x: 0,
			y: 0,
			maxWidth: bitmapRect.width,
			lineHeight: bitmapRect.height,
			align: "center"
		};

		if (this.bitmap) {
			this.bitmap.clear();

			this.bitmap.paintOpacity = 192;
			this.bitmap.fillAll("black");
			this.bitmap.paintOpacity = 255;
			
			this.bitmap.fontFace = Window_Base.prototype.standardFontFace();
			this.bitmap.fontSize = Window_Base.prototype.standardFontSize() - 6;
			this.bitmap.drawText(...Object.values(textObject));
		}

		this.opacity = 255;
		this._visibilityInterval = Sprite_HelperPopup.VISIBILITY_INTERVAL;
	}

	Sprite_HelperPopup.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.updateVisibility();
	};

	Sprite_HelperPopup.prototype.updateVisibility = function() {
		if (this._visibilityInterval > 0) {

			const fadeInterval = Sprite_HelperPopup.VISIBILITY_INTERVAL / 2;

			this._visibilityInterval--;

			if (this._visibilityInterval < fadeInterval) {
				this.opacity = 255 * this._visibilityInterval / fadeInterval;
			}
		}
	};

	//==========================================================
		// Scene_Map 
	//==========================================================

	const TY_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		TY_Scene_Map_createDisplayObjects.call(this);

		//this.createSystemStatusPopup();
		this.createHungerStatusPopup();
	};

	/*Scene_Map.prototype.createSystemStatusPopup = function() {
		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();

	    this._systemstatusPopup = new Sprite_HelperPopup();
	    this._systemstatusPopup.mode = Sprite_HelperPopup.TEXT_DISPLAY.SYSTEM_STATUS;
	    this._systemstatusPopup.x = bitmapRect.x;
		this._systemstatusPopup.y = bitmapRect.y;

	    this.addChild(this._systemstatusPopup);
	};*/

	Scene_Map.prototype.createHungerStatusPopup = function() {
		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();
		const padding = 8;

	    this._hungerStatusPopup = new Sprite_HelperPopup();
	    this._hungerStatusPopup.mode = Sprite_HelperPopup.TEXT_DISPLAY.HUNGER_STATUS;
	    this._hungerStatusPopup.x = bitmapRect.x;
		this._hungerStatusPopup.y = bitmapRect.y + bitmapRect.height + padding;

	    this.addChild(this._hungerStatusPopup);
	};

	/*Scene_Map.prototype.refreshHelperPopupSprites = function() {
	    this._systemstatusPopup.refreshDisplay();
	};*/

	const TY_Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		TY_Scene_Map_update.call(this);

		this._playerRequiredExp = this._playerRequiredExp || null;

		if ($gameParty.leader().nextRequiredExp() !== this._playerRequiredExp) {
			this._hungerStatusPopup.refreshDisplay();
			this._playerRequiredExp = $gameParty.leader().nextRequiredExp();
		}
	};

	//==========================================================
		// End of File
	//==========================================================

})(TY.fnhWaitForDialogue);
