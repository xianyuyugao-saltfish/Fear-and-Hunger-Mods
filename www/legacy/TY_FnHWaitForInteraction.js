//==========================================================
	// VERSION 2.0.0 -- by Toby Yasha
//==========================================================

/**
 * [SUMMARY]:
 * 
 * Stops certain events from advancing while
 * dialogue interactions appear.
 * Or, if the player visit special scenes like
 * the hexen.
 * 
 * Affected events include:
 * - Hunger Management
 * - Bleeding 
 * - Sanity Effects 
 * - Hound Timer
 * - Mahabre Timer
 * - Rescue Timers(Le'garde, Buckman)
 * etc.
 * 
 * [SPECIAL-THANKS]:
 * - This mod has been commissioned by s0mthinG.
 */

var TY = TY || {};
TY.fnhWaitForInteraction = TY.fnhWaitForInteraction || {};

var Imported = Imported || {};
Imported.TY_FnHWaitForInteraction = true;

(function(_) { 

	//==========================================================
		// Mod Constants
	//==========================================================

	/**
	 * [USED-IN-BOTH-GAMES]:
	 * 
	 * The names of Parallel Map Events that are not allowed
	 * to update when:
	 *     - Dialogue is displayed
	 *     - The hexen or the fishing minigame is running.
	 * 
	 * [blood | blood2] - 
	 *     Displays a blood trail if affected by "Anus Bleed" debuff.
	 *     [NOTE]: In Termina this is used by the "Nausea" debuff instead.
	 * 
	 * [bleeding | bleeding2 | bleeding3] - 
	 *     Displays a blood trail if affected by "Bleeding" debuff.
	 *     [NOTE]: Only the first "bleeding" event handles the bleeding logic.
	 * 
	 * [sanity] - 
	 *     Lose your sanity in dark or unsafe places.
	 *     [WARNING]: Some events may not properly work or work at all, 
	 *     but those cases should be few in numbers.
	 * 
	 * [regain_sanity] - 
	 *     Regains sanity in well lit or safe places.
	 *     [WARNING]: Some events may not properly work or work at all,
	 *     but those cases should be few in numbers.
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
	 * [FEAR-AND-HUNGER-1]:
	 * 
	 * The names of Parallel Map Events that are not allowed
	 * to update.
	 * 
	 * [!] NOTE(For Users): Feel free to remove the hound timer
	 * from here if you don't like it.
	 * 
	 * [hound_TIMER | hound_TIMER2] - 
	 *     The timer used outside 
	 *     the fortress to call the hounds to attack you if you idle too long.
	 * 
	 * [mahabre_TIMER | mahabre_TIMER2] - 
	 *     The timer used in
	 *     Mahabre when you teleport via the Mahabre book.
	 */
	const fnh1RestrictedMapEvents = [
		...restrictedMapEvents,
		"hound_TIMER",
		"hound_TIMER2",
		"mahabre_TIMER",
		"mahabre_TIMER2"
	]

	/**
	 * [FEAR-AND-HUNGER-1]:
	 * 
	 * The name of Parallel Common Events that are not allowed
	 * to update when:
	 *     - Dialogue is displayed
	 *     - The hexen or the fishing minigame is running.
	 * 
	 * [HUNGER_of_*] - 
	 *     Handles the hunger gain of a specific character.
	 * 
	 * [TIMER] -
	 *     Probably the timer which limits how much time you
	 *     have to save Le'garde.
	 * 
	 * [TIMER_buckman] - 
	 *     How much time you have to reach Buckman before he
	 *     forms a marriage with Ser Seymor.
	 * 
	 * [TORCH_TIMER] - 
	 *     Handles the luminosity and duration of the torch.
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
		"TIMER",
		"TIMER_buckman",
		"TORCH_TIMER"
	]

	/**
	 * [FEAR-AND-HUNGER-TERMINA]:
	 * 
	 * The name of Parallel Common Events that are not allowed
	 * to update.
	 * 
	 * [HUNGER_of_*] - 
	 *     Handles the hunger gain of a specific character.
	 * 
	 * [RIFLEMAN_ATTENTION!] - 
	 *     Handles the rifleman shooting on the riverside map.
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

	/**
	 * [FEAR-AND-HUNGER-1]:
	 * 
	 * The ids of Game Switches that are found in the page
	 * conditions of certain Map Events.
	 * 
	 * [NOTE]: The switches here are used in case an
	 * event doesn't have a name assigned which can
	 * be easily referenced.
	 * 
	 * [EXAMPLE]: 
	 * "EV176" on "level5_A" handles the "Yellow Mage Dance" mechanic.
	 * 
	 */
	const fnh1RestrictedSwitchIds = [
		343, // Yellow Mage Dance
	];

	/**
	 * [FEAR-AND-HUNGER-TERMINA]:
	 * 
	 * The ids of Game Switches that are found in the page
	 * conditions of certain Map Events.
	 */
	const fnh2RestrictedSwitchIds = [
		3772, // Yellow Mage Dance
	];

	/**
	 * [FEAR-AND-HUNGER-1]:
	 * 
	 * The ids of Game Switches that are found in the 
	 * command list of certain Map Events.
	 * 
	 * [NOTE]: Unlike restricted events, these switches
	 * are used to pause/resume events themselves.
	 * 
	 * [NOTE]: Switches added here should only be used
	 * in cases like the Hexen Table where we don't want
	 * restricted events to run.
	 * (Like the Hunger altering ones)
	 */
	const fnh1GameModeSwitchIds = [
		1210, // Hexen Cursor
	]

	/**
	 * [FEAR-AND-HUNGER-TERMINA]:
	 * 
	 * The ids of Game Switches that are found in the 
	 * command list of certain Map Events.
	 * 
	 * [NOTE]: The Fishing Minigame switch may only
	 * be available in the Termina Update.
	 * (Aka not Version 1.9.1)
	 */
	const fnh2GameModeSwitchIds = [
		2420, // Hexen GFX
		4813, // Fishing Minigame
	]

	//==========================================================
		// Compatibility Mode
	//==========================================================

	/**
	 * This is a feature dedicated to keeping the mod compatible
	 * with third-party mods or future game updates.
	 * 
	 * Normally the mod works off of configurations defined
	 * in the "Mod Constants" section of the mod.
	 * 
	 * But in case a mod decides to add additional 
	 * "Map Events" / "Common Events" which alter the following:
	 * - BODY
	 * - MIND
	 * - HUNGER
	 * 
	 * Compatibility Mode should ensure that at least those properties
	 * of characters should not be changed, when:
	 *     - Dialogue is displayed
	 *     - The hexen or the fishing minigame is running.
	 * 
	 * [NOTE]: For proper compatibility or to include
	 * cases not mentioned above, it is advised you create
	 * a patch for the mod.
	 * 
	 * [P.S]: I have left a couple properties and methods below
	 * in case they make modding easier or to handle bugs
	 * (if there happen to be any).
	 */

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
	 * Check if the current Fear and Hunger game being played is TERMINA.
	 */
	function isGameTermina() {
		return $dataSystem.gameTitle.match(/TERMINA/gi);
	}

	function getRestrictedMapEvents() {
		return isGameTermina() ? restrictedMapEvents : fnh1RestrictedMapEvents;
	}

	function getRestrictedCommonEvents() {
		return isGameTermina() ? fnh2RestrictedCommonEvents : fnh1RestrictedCommonEvents;
	}

	function getRestrictedSwitches() {
		return isGameTermina() ? fnh2RestrictedSwitchIds : fnh1RestrictedSwitchIds;
	}

	function getGameModeSwitches() {
		return isGameTermina() ? fnh2GameModeSwitchIds : fnh1GameModeSwitchIds;
	}

	//==========================================================
		// RestrictedEventsRegistrar 
	//==========================================================

	/**
	 * This class is responsible for deciding which 
	 * map events and common events should be classified as restricted.
	 */
	function RestrictedEventsRegistrar() {
		throw new Error("This is a static class");
	}

	RestrictedEventsRegistrar._dataReady = false;
	RestrictedEventsRegistrar._mapEventNames = null;
	RestrictedEventsRegistrar._mapEventSwitches = null;
	RestrictedEventsRegistrar._commonEventNames = null;

	RestrictedEventsRegistrar.setup = function() {
		this.initializeData();
		this.setupMapEvents();
		this.setupCommonEvents();
	}

	/**
	 * [NOTE]: This is a good method to patch in case
	 * you want to add/remove anything.
	 */
	RestrictedEventsRegistrar.initializeData = function() {
		if (this._dataReady) return;

		this._mapEventNames = getRestrictedMapEvents();
		this._mapEventSwitches = getRestrictedSwitches();
		this._commonEventNames = getRestrictedCommonEvents();
		this._dataReady = true;
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

	// allow the class to be access via the mod's namespace
	_.RestrictedEventsRegistrar = RestrictedEventsRegistrar;

	//==========================================================
		// RestrictedEventsManager 
	//==========================================================

	/**
	 * The central class which handles whether 
	 * events should be paused or resumed.
	 * 
	 * This is used by other Manager classes, such as:
	 * - GameModeManager
	 * - DialogueManager
	 */
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

	// allow the class to be access via the mod's namespace
	_.RestrictedEventsManager = RestrictedEventsManager;

	//==========================================================
		// Game_Map 
	//==========================================================

	/**
	 * [NOTE]: This won't trigger when loading a save file.
	 * Although it will trigger when you move to another map as normal.
	 *
	 * See "Scene_Map.prototype.onMapLoaded" for fix.
	 */
	const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		_Game_Map_setupEvents.call(this);

	    RestrictedEventsRegistrar.setup();
	    GameModeManager.initializeData();
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

	/**
	 * Notify the "GameModeManager" every time a switch's value has been changed.
	 */
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
	 * Actor HP - Body
	 */
	const _Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
	Game_Interpreter.prototype.command311 = function() {

		if (_.isCompatibilityMode() && RestrictedEventsManager.isPaused()) return true;
		return _Game_Interpreter_command311.call(this);
	};
	
	/**
	 * Actor MP - Mind
	 */
	const _Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
	Game_Interpreter.prototype.command312 = function() {

		if (_.isCompatibilityMode() && RestrictedEventsManager.isPaused()) return true;
	    return _Game_Interpreter_command312.call(this);
	};

	/**
	 * Actor EXP - Hunger
	 */
	const _Game_Interpreter_command315 = Game_Interpreter.prototype.command315;
	Game_Interpreter.prototype.command315 = function() {

		if (_.isCompatibilityMode() && RestrictedEventsManager.isPaused()) return true;
	    return _Game_Interpreter_command315.call(this);
	};

	//==========================================================
		// GameModeManager
	//==========================================================

	/**
	 * This class is dedicated to the moments enters special
	 * scenes which shouldn't affecting certain properties, like:
	 * - BODY
	 * - MIND
	 * - HUNGER
	 * 
	 * The common special scene across both games being the Hexen.
	 */
	function GameModeManager() {
		throw new Error("This is a static class");
	}

	GameModeManager._dataReady = false;
	GameModeManager._gameModeSwitches = null;
	GameModeManager._active = false;

	/**
	 * [NOTE]: This is a good method to patch in case
	 * you want to add/remove anything.
	 */
	GameModeManager.initializeData = function() {
		if (this._dataReady) return;

		this._gameModeSwitches = getGameModeSwitches();
		this._dataReady = true;
	}

	GameModeManager.isActive = function() {
		return this._active;
	}

	GameModeManager.setActive = function(value) {
		this._active = value;
	}

	GameModeManager.canChangeActiveState = function(newState) {
		const currentState = this.isActive();
		return currentState !== newState;
	}

	GameModeManager.isGameModeSwitch = function(switchId) {
		return this._gameModeSwitches.includes(switchId);
	}

	GameModeManager.onSwitchChanged = function(switchId, value) {
		if (!this.isGameModeSwitch(switchId)) return;
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

	// allow the class to be access via the mod's namespace
	_.GameModeManager = GameModeManager;

	//==========================================================
		// DialogueManager
	//==========================================================

	/**
	 * This class is dedicated to when the player interacts
	 * with Objects or NPCs which trigger dialogue sequences.
	 * 
	 * There is also a brief period of time that the system
	 * stay active for even after an interaction has concluded.
	 */
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

	// allow the class to be access via the mod's namespace
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

	_._hungerDebugValue = null;

	_.updateHungerDebug = function() {
		if ($gameParty.leader().nextRequiredExp() === _._hungerDebugValue) return;

		if (_._hungerDebugValue !== null) console.warn("hunger updated!");
		_._hungerDebugValue = $gameParty.leader().nextRequiredExp();
	}

	/**
	 * Ensure the system is set up even after loading an existing save file.
	 */
	const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function() {
		_Scene_Map_onMapLoaded.call(this);

		if (!SceneManager.isPreviousScene(Scene_Load)) return;
		RestrictedEventsRegistrar.setup();
		GameModeManager.initializeData();
	};

	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.call(this);

		//_.updateHungerDebug();
		if (!DialogueManager.isMessageGracePeriodActive()) return;
		DialogueManager.updateMessageGracePeriod();
	};

	//==========================================================
		// End of File
	//==========================================================

})(TY.fnhWaitForInteraction);
