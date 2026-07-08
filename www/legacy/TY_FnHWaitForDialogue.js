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
	const fnh1RestrictedSwitchIds = [
		343, // Yellow Mage Dance
	];

	/**
	 * The ids of Game Switches that are found in the page
	 * conditions of certain Game_Event instance.
	 * 
	 * This is for Fear and Hunger 2.
	 * 
	 * @type {number[]}
	 */
	const fnh2RestrictedSwitchIds = [
		3772, // Yellow Mage Dance
	];

	//==========================================================
		// Mod Parameters -- Game Mode
	//==========================================================

	//
	const fnh1GameModeSwitchIds = [
		1210, // Hexen Cursor
	]

	//
	const fnh2GameModeSwitchIds = [
		2420, // Hexen GFX
		4813, // Fishing
	]

	//==========================================================
		// Mod Parameters -- Compatibility Mode
	//==========================================================

	// Whether to allow the interpreter to block the commands 
	// for changing Body, Mind and Hunger.

	_._compatibilityMode = true;

	_.setCompatibilityMode = function(value) {
		_._compatibilityMode = value;
	}

	_.isCompatibilityMode = function() {
		return _._compatibilityMode;
	}

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

	function getGameModeSwitches() {
		return isGameTermina() ? fnh2GameModeSwitchIds : fnh1GameModeSwitchIds;
	}

	//==========================================================
		// RestrictedEventsRegistrar 
	//==========================================================

	function RestrictedEventsRegistrar() {
		throw new Error("This is a static class");
	}

	RestrictedEventsRegistrar._mapEventNames = null;
	RestrictedEventsRegistrar._mapEventSwitches = null;
	RestrictedEventsRegistrar._commonEventNames = null;

	RestrictedEventsRegistrar.setup = function() {
		this.initializeData();
		this.setupMapEvents();
		this.setupCommonEvents();
	}

	RestrictedEventsRegistrar.initializeData = function() {
		this._mapEventNames = getRestrictedMapEvents();
		this._mapEventSwitches = getRestrictedSwitches();
		this._commonEventNames = getRestrictedCommonEvents();
	}

	RestrictedEventsRegistrar.setupMapEvents = function() {
		for (const event of $gameMap.events()) {

			if (!this.isRestrictedMapEvent(event.event())) continue;
			RestrictedEventsManager.configureEvent(event);
		}
	}

	RestrictedEventsRegistrar.setupCommonEvents = function() {
		for (const event of $gameMap._commonEvents) {

			if (!this.isRestrictedCommonEvent(event.event())) continue;
			RestrictedEventsManager.configureEvent(event);
		}
	}

	RestrictedEventsRegistrar.isRestrictedMapEvent = function(eventData) {
		return (
			this.isEventRestrictedByName(eventData, this._mapEventNames) || 
			this.isEventRestrictedBySwitch(eventData, this._mapEventSwitches)
		);
	}

	RestrictedEventsRegistrar.isRestrictedCommonEvent = function(eventData) {
		return this.isEventRestrictedByName(eventData, this._commonEventNames);
	}

	RestrictedEventsRegistrar.isEventRestrictedByName = function(eventData, restrictedNames) {
		return restrictedNames.includes(eventData.name);
	}

	RestrictedEventsRegistrar.isEventRestrictedBySwitch = function(eventData, restrictedSwitches) {
		return restrictedSwitches.some(switchId => this.checkEventSwitchCondition(eventData, switchId));
	}

	RestrictedEventsRegistrar.checkEventSwitchCondition = function(eventData, targetSwitchId) {
		return eventData.pages.some(page => {
			const c = page.conditions;
			return (
				(c.switch1Id === targetSwitchId && c.switch1Valid) ||
				(c.switch2Id === targetSwitchId && c.switch2Valid)
			)
		});
	}

	_.RestrictedEventsRegistrar = RestrictedEventsRegistrar;

	//==========================================================
		// RestrictedEventsManager 
	//==========================================================

	function RestrictedEventsManager() {
		throw new Error("This is a static class");
	}

	RestrictedEventsManager._paused = false;

	RestrictedEventsManager.configureEvent = function(event) {
		event.setRestrictedUpdates(true);
	}

	RestrictedEventsManager.isPaused = function() {
		return this._paused;
	}

	RestrictedEventsManager.pauseEvents = function() {
		this._paused = true;
	}

	RestrictedEventsManager.resumeEvents = function() {
		this._paused = false;
	}

	_.RestrictedEventsManager = RestrictedEventsManager;

	//==========================================================
		// Game_Map 
	//==========================================================

	// NOTE: This won't trigger when loading a save file.
	// Although it will trigger when you move to another map as normal.
	//
	// SEE "Scene_Map.prototype.onMapLoaded" for fix.
	const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		_Game_Map_setupEvents.call(this);

	    RestrictedEventsRegistrar.setup();
	};

	//==========================================================
		// Game_CommonEvent 
	//==========================================================

	const _Game_CommonEvent_initialize = Game_CommonEvent.prototype.initialize;
	Game_CommonEvent.prototype.initialize = function(commonEventId) {
		_Game_CommonEvent_initialize.call(this, commonEventId);
		
		this._hasRestrictedUpdates = false;
	};

	Game_CommonEvent.prototype.setRestrictedUpdates = function(value) {
		this._hasRestrictedUpdates = value;
	}

	Game_CommonEvent.prototype.isUpdatePaused = function() {
		return this._hasRestrictedUpdates && RestrictedEventsManager.isPaused();
	}
	
	const _Game_CommonEvent_update = Game_CommonEvent.prototype.update;
	Game_CommonEvent.prototype.update = function() {
		if (this.isUpdatePaused()) return;

		_Game_CommonEvent_update.call(this);
	};

	//==========================================================
		// Game_Event 
	//==========================================================

	const _Game_Event_initMembers = Game_Event.prototype.initMembers;
	Game_Event.prototype.initMembers = function() {
		_Game_Event_initMembers.call(this);

		this._hasRestrictedUpdates = false;
	};

	Game_Event.prototype.setRestrictedUpdates = function(value) {
		Game_CommonEvent.prototype.setRestrictedUpdates.call(this, value);
	}

	Game_Event.prototype.isUpdatePaused = function() {
		return Game_CommonEvent.prototype.isUpdatePaused.call(this);
	}
	
	const _Game_Event_updateParallel = Game_Event.prototype.updateParallel;
	Game_Event.prototype.updateParallel = function() {
		if (this.isUpdatePaused()) return;

		_Game_Event_updateParallel.call(this);
	};

	//==========================================================
		// Game_Interpreter 
	//==========================================================

	// Control Switches
	const _Game_Interpreter_command121 = Game_Interpreter.prototype.command121;
	Game_Interpreter.prototype.command121 = function() {
	      
		const switchId = this._params[0];
	    const lastSwitchId = this._params[1];
	    const newValue = this._params[2] === 0; // 0 = true, 1 = false
	
		for (let i = switchId; i <= lastSwitchId; i++) {
			GameModeManager.onSwitchChanged(i, newValue);
		}
	
		return _Game_Interpreter_command121.call(this);
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's hp(body).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const _Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
	Game_Interpreter.prototype.command311 = function() {

		if (_.isCompatibilityMode() && RestrictedEventsManager.isPaused()) return true;
		return _Game_Interpreter_command311.call(this);
	};
	
	/**
	 * Check if an interpreter instance is allowed to change an actor's mp(mind).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const _Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
	Game_Interpreter.prototype.command312 = function() {

		if (_.isCompatibilityMode() && RestrictedEventsManager.isPaused()) return true;
	    return _Game_Interpreter_command312.call(this);
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's exp(hunger).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const _Game_Interpreter_command315 = Game_Interpreter.prototype.command315;
	Game_Interpreter.prototype.command315 = function() {

		if (_.isCompatibilityMode() && RestrictedEventsManager.isPaused()) return true;
	    return _Game_Interpreter_command315.call(this);
	};

	//==========================================================
		// GameModeManager
	//==========================================================

	function GameModeManager() {
		throw new Error("This is a static class");
	}

	GameModeManager._active = false;

	GameModeManager.setActive = function(value) {
		this._active = value;
	}

	GameModeManager.isActive = function() {
		return this._active;
	}

	GameModeManager.canChangeActiveState = function(newState) {
		const currentState = this.isActive();
		return currentState !== newState;
	}

	GameModeManager.onSwitchChanged = function(switchId, value) {
		if (!this.canChangeActiveState(value)) return;
		this.setActive(value);

		if (value) {
			this.onGameModeStart();
		} else {
			this.onGameModeEnd();
		}
	}

	GameModeManager.onGameModeStart = function() {
		DialogueManager.clear();
		RestrictedEventsManager.pauseEvents();
	}

	GameModeManager.onGameModeEnd = function() {
		RestrictedEventsManager.resumeEvents();
	}

	//==========================================================
		// DialogueManager
	//==========================================================

	function DialogueManager() {
		throw new Error("This is a static class");
	}

	DialogueManager._messageActive = false;
	DialogueManager._messageGraceTimer = 0;

	DialogueManager.clear = function() {
		this._messageActive = false;
		this._messageGraceTimer = 0;
	}

	DialogueManager.isEnabled = function() {
		return !GameModeManager.isActive();
	}

	DialogueManager.onMessageStarted = function() {
		this._messageActive = true;
		RestrictedEventsManager.pauseEvents();
	}

	DialogueManager.getMessageGraceFrames = function() {
		return 60;
	}

	DialogueManager.startMessageGracePeriod = function() {
		this._messageGraceTimer = this.getMessageGraceFrames();
	}

	DialogueManager.isMessageGracePeriodActive = function() {
		const messageWindow = SceneManager._scene._messageWindow;
		return this._messageActive && this._messageGraceTimer > 0 && messageWindow.isClosed();
	}

	DialogueManager.updateMessageGracePeriod = function() {
		this._messageGraceTimer--;

		if (this._messageGraceTimer > 0) return;
		this.onMessageConcluded();
	}

	DialogueManager.onMessageConcluded = function() {
		this._messageActive = false;
		RestrictedEventsManager.resumeEvents();
	}

	_.DialogueManager = DialogueManager;

	//==========================================================
		// Window_Message
	//==========================================================

	const _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
	    _Window_Message_startMessage.call(this);
	    
	    if (!DialogueManager.isEnabled()) return;
	    DialogueManager.onMessageStarted();
	};

	const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
	Window_Message.prototype.terminateMessage = function() {
		_Window_Message_terminateMessage.call(this);

		if (!DialogueManager.isEnabled()) return;
		DialogueManager.startMessageGracePeriod();
	};

	//==========================================================
		// Scene_Map 
	//==========================================================

	_._playerRequiredExp = null;

	_.updateHungerDebug = function() {
		if ($gameParty.leader().nextRequiredExp() === _._playerRequiredExp) return;

		if (_._playerRequiredExp !== null) console.warn("hunger updated!");
		_._playerRequiredExp = $gameParty.leader().nextRequiredExp();
	}

	// Ensure the system is set up even after loading an existing save file.
	const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function() {
		_Scene_Map_onMapLoaded.call(this);

		if (!SceneManager.isPreviousScene(Scene_Load)) return;
		RestrictedEventsRegistrar.setup();
	};

	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.call(this);

		_.updateHungerDebug();
		if (!DialogueManager.isMessageGracePeriodActive()) return;
		DialogueManager.updateMessageGracePeriod();
	};

	//==========================================================
		// End of File
	//==========================================================

})(TY.fnhWaitForDialogue);
