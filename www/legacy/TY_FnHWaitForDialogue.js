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
	 * (See "EventHelper" class for use case)
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
		const eventNames = isGameTermina() ? restrictedMapEvents : fnh1RestrictedMapEvents;
		return eventNames.concat(EventHelper.getRestrictedMapEvents());
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

	/**
	 * Check if a Game_Event should be treated as a restricted event.
	 * 
	 * @param {Game_Event} gameEvent - The Game_Event instance to verify.
	 * @returns {boolean} True if the Game_Event is going to be a restricted event.
	 */
	function isRestrictedMapEvent(gameEvent) {
		const eventNames = getRestrictedMapEvents();
		const eventData = gameEvent.event();
		return eventNames.includes(eventData.name);
	}

	/**
	 * Check if a Game_CommonEvent should be treated as a restricted event.
	 * 
	 * @param {Game_CommonEvent} gameEvent - The Game_CommonEvent instance to verify.
	 * @returns {boolean} True if the Game_CommonEvent is going to be a restricted event. 
	 */
	function isRestrictedCommonEvent(commonEvent) {
		const commonEventNames = getRestrictedCommonEvents();
		const commonEventData = commonEvent.event();
		return commonEventNames.includes(commonEventData.name);
	}

	/**
	 * Check if the Interpreter of a Game_Event needs to have their 
	 * update cycles delayed after the Map Interpreter is no longer busy.
	 * 
	 * NOTE: I am aware that this is technically hardcoded at the moment,
	 * but unless events that aren't switch based require a proper integration,
	 * this will be left as is.
	 * 
	 * @see {@link gameEvent} in the "isRestrictedMapEvent" method for more details.
	 * @returns {boolean} True if the Game_Event interpreter will resume running its
	 * commands after a certain delay interval.
	 */
	function isInterpreterDelayed(gameEvent) {
		const eventNames = EventHelper.getRestrictedMapEvents();
		const eventData = gameEvent.event();
		return eventNames.includes(eventData.name); 
 	}

	//==========================================================
		// EventHelper
	//==========================================================

	function EventHelper() {
		throw new Error("This is a static class");
	}

	/**
	 * A container for restricted Parallel Map Events.
	 * This is used to store/retrieve event names based on a given map id.
	 * 
	 * @type {Object<{ mapId: string[] }>}
	 * @private
	 */
	EventHelper._restrictedMapEvents = {};

	/**
	 * Check if the page conditions of a Game_Event instance uses a given 
	 * restricted switch id as a condition and that switch must be ON.
	 * 
	 * @param {Object} page - The page object of a Game_Event instance.
	 * @param {number} targetSwitchId - The restricted switch id to look for.
	 * 
	 * @returns {boolean} True if the current page of a 
	 * Game_Event uses a restricted switch id.
	 */
	EventHelper.checkPageHasSwitchId = function(page, targetSwitchId) {
		const c = page.conditions;
		return (
			(c.switch1Id === targetSwitchId && c.switch1Valid) ||
			(c.switch2Id === targetSwitchId && c.switch2Valid)
		)
	}

	/**
	 * Check if a Game_Event instance uses a given restricted switch id in
	 * any of their page conditions.
	 * 
	 * @param {Game_Event} gameEvent - The Game_Event instance to inspect.
	 * @see {@link targetSwitchId} in the "checkPageHasSwitchId" method for more details.
	 * 
	 * @returns {boolean} True if any of the Game_Event's 
	 * page conditions use a restricted switch id.
	 */
	EventHelper.checkEventHasSwitchId = function(gameEvent, targetSwitchId) {
		const eventData = gameEvent.event();
		return eventData.pages.some(page => 
			this.checkPageHasSwitchId(page, targetSwitchId)
		);
	}

	/**
	 * Search a Game_Event instance from the current Game_Map to
	 * see if it uses any restricted switch ids.
	 * 
	 * If the Game_Event uses any restricted switch ids, it will
	 * be stored and referenced any time the current Game_Map is
	 * loaded into the game.
	 * 
	 * @see {@link gameEvent} in the "checkEventHasSwitchId" method for more details.
	 */
	EventHelper.searchForRestrictedSwitches = function(gameEvent) {
		const switchIds = getRestrictedSwitches();

		if (this.isRestrictedMapEvent(gameEvent)) return;

		for (const id of switchIds) {
			if (this.checkEventHasSwitchId(gameEvent, id)) {
				this.addRestrictedMapEvent(gameEvent);
				gameEvent.refresh();
			}
		}
	}

	/**
	 * Store the name of a Game_Event instance into the container for
	 * restricted map events based on the current Game_Map map id.
	 * 
	 * @see {@link gameEvent} in the "checkEventHasSwitchId" method for more details.
	 */
	EventHelper.addRestrictedMapEvent = function(gameEvent) {
		const mapId = $gameMap.mapId();
		const eventName = gameEvent.event().name;

		this._restrictedMapEvents[mapId] = this._restrictedMapEvents[mapId] || [];
		this._restrictedMapEvents[mapId].push(eventName);
	}

	/**
	 * Check if a Game_Event instance is already considered
	 * to be a restricted map event, so that we don't add it again.
	 * 
	 * @see {@link gameEvent} in the "checkEventHasSwitchId" method for more details.
	 * @returns {boolean} True if the Game_Event instance is already stored internally.
	 */
	EventHelper.isRestrictedMapEvent = function(gameEvent) {
		const mapId = $gameMap.mapId();
		const eventName = gameEvent.event().name;
		const restrictedEvents = this._restrictedMapEvents[mapId] || [];

		return restrictedEvents.includes(eventName);
	}

	/**
	 * Get all Game_Event instances that are considered
	 * restricted events based on the current map.
	 * 
	 * @returns {string[]} A list of Game_Event instance names 
	 * that are considered restricted.
	 */
	EventHelper.getRestrictedMapEvents = function() {
		const mapId = $gameMap.mapId();
		return this._restrictedMapEvents[mapId] || [];
	}

	window._EventHelper = EventHelper;

	//==========================================================
		// Game_Map 
	//==========================================================

	/**
	 * Call the method for preparing the 
	 * restricted switches based on the map events.
	 */
	const TY_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		TY_Game_Map_setupEvents.call(this);

	    this.prepareRestrictedSwitches();
	};

	/**
	 * Search all Game_Event instances for restricted switches and
	 * convert the events that use them into restricted map events. 
	 */
	Game_Map.prototype.prepareRestrictedSwitches = function() {
	    for (const event of this.events()) {
	    	EventHelper.searchForRestrictedSwitches(event);
	    }
	};

	//==========================================================
		// Game_CommonEvent 
	//==========================================================

	/*Game_CommonEvent.prototype.update = function() {

	};*/

	//==========================================================
		// Game_Event 
	//==========================================================

	/*Game_Event.prototype.updateParallel = function() {

	};*/

	//==========================================================
		// Game_Interpreter 
	//==========================================================

	/*Game_Interpreter.prototype.setup = function(list, eventId) {
	    this.clear();
	    this._mapId = $gameMap.mapId();
	    this._eventId = eventId || 0;
	    this._list = list;
	    Game_Interpreter.requestImages(list);
	};*/

	/**
	 * Define new properties for the Game_Interpreter class.
	 * 
	 * @property {boolean} _updateLocked - Internal flag used to check
	 * if an interpreter is allowed to be update or not.
	 * 
	 * @property {number} _delayFrames - The amount of frames to wait
	 * before updates can be resumed.
	 */
	const TY_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
	Game_Interpreter.prototype.clear = function() {
		TY_Game_Interpreter_clear.call(this);

		this._commonEventId = 0;
	};

	const TY_Game_Interpreter_setupReservedCommonEvent = 
		Game_Interpreter.prototype.setupReservedCommonEvent;
	Game_Interpreter.prototype.setupReservedCommonEvent = function() {

		if ($gameTemp.isCommonEventReserved()) {
			this._commonEventId = $gameTemp.reservedCommonEvent();
		}
	    
		return TY_Game_Interpreter_setupReservedCommonEvent.call(this);
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's hp(body).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const TY_Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
	Game_Interpreter.prototype.command311 = function() {

		//if (!InterpreterHelper.isSystemLocked()) {
			return TY_Game_Interpreter_command311.call(this);
		//}

	    return true;
	};
	
	/**
	 * Check if an interpreter instance is allowed to change an actor's mp(mind).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const TY_Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
	Game_Interpreter.prototype.command312 = function() {

		//if (!InterpreterHelper.isSystemLocked()) {
	    	return TY_Game_Interpreter_command312.call(this);
		//}

		return true;
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's exp(hunger).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const TY_Game_Interpreter_command315 = Game_Interpreter.prototype.command315;
	Game_Interpreter.prototype.command315 = function() {

		//if (!InterpreterHelper.isSystemLocked()) {
	    	return TY_Game_Interpreter_command315.call(this);
		//}

	    return true;
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

	window._messageStarted = false;
	window._messageTimer = 0;
	window._MESSAGE_TIMER_VALUE = 60;

	const _Window_Message_update = Window_Message.prototype.update;
	Window_Message.prototype.update = function() {
		_Window_Message_update.call(this);

		if (window._messageStarted && window._messageTimer > 0 && this.isClosed()) {
			window._messageTimer--;

			if (window._messageTimer <= 0) {
				window._messageStarted = false;
				console.log("no new message started");
			}
		}
	};

	const _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
	    _Window_Message_startMessage.call(this);
	    
	    window._messageStarted = true;
	    console.log("message started");
	};


	const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
	Window_Message.prototype.terminateMessage = function() {
		_Window_Message_terminateMessage.call(this);

		window._messageTimer = window._MESSAGE_TIMER_VALUE;
		console.log("message ended");
	};

})(TY.fnhWaitForDialogue);
