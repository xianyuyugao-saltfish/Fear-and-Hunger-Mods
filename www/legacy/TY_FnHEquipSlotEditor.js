var TY = TY || {};
TY.fnHEquipSlotEditor = TY.fnHEquipSlotEditor || {};

var Imported = Imported || {};
Imported.TY_FnHEquipSlotEditor = true;

(function(_) {

	_.profiles = [
		[1, 2, 3, 4, 5], // Weapon, Shield, Head, Body, Accessory -- Default
		[1, 1, 3, 4, 5], // Weapon, Weapon, Head, Body, Accessory -- Dual Weapon
		[2, 2, 3, 4, 5], // Shield, Shield, Head, Body, Accessory -- Dual Shield
		[1, 1, 5, 5], // Weapon, Weapon, Accessory, Accessory -- Dual Weapon and Accessory
		[1, 1, 1, 5], // Weapon, Weapon, Weapon, Accessory -- Triple Weapon
		[]
	];

	_.setProfile = function(profileId) {
		const actor = $gameParty.leader();
		Game_Actor.prototype.equipSlots = () => _.profiles[profileId];
		actor.releaseUnequippableItems(); // if this is set to "true" then items may be completely removed when changing equip slots
    	actor.refresh();
	}

    

})(TY.fnHEquipSlotEditor);

//Game_Actor.prototype.initEquips
//Game_Actor.prototype.equipSlots
//Game_Actor.prototype.equips

//Scene_Save.prototype.onSaveSuccess -- before saving, disable the mod's functionality and backup its data, then re-enable it
//Scene_Load.prototype.onLoadSuccess -- if there exists saved mod data restore it here




/*
function Window_HorzCommand() {
    this.initialize.apply(this, arguments);
}

Window_HorzCommand.prototype = Object.create(Window_Command.prototype);
Window_HorzCommand.prototype.constructor = Window_HorzCommand;

Window_HorzCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

[NOTE]:
For the profile list do the following changes:
(Adjust based on the number of existing profiles)
(oh, and don't forget to hide the last element in the list)

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 2; // will only be 1
};

Window_HorzCommand.prototype.maxCols = function() {
    return 4;
};


*/



/*
function Window_Help() {
    this.initialize.apply(this, arguments);
}

Window_Help.prototype = Object.create(Window_Base.prototype);
Window_Help.prototype.constructor = Window_Help;

Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
};
*/




/* -- Make another prototype of this class and eliminate the Actor Face!

Window_NewNameHere.prototype = Object.create(Window_NameEdit.prototype);
Window_NewNameHere.prototype.constructor = Window_NewNameHere;

Window_NameEdit.prototype.refresh = function() {
    this.contents.clear();
    this.drawActorFace(this._actor, 0, 0); // remove this
    for (var i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (var j = 0; j < this._name.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

or just do this...

Window_NewNameHere.prototype.drawActorFace = function() {
	// deprecated
}

Window_NameEdit.prototype.initialize = function(actor, maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = actor; // remove this after patch
    this._name = actor.name().slice(0, this._maxLength); // change to something like "Custom Profile (1)"
    this._index = this._name.length; // readjust to the changes of "this._name"
    this._maxLength = maxLength;
    this._defaultName = this._name; // readjust to the changes of "this._name"
    this.deactivate();
    this.refresh();
    ImageManager.reserveFace(actor.faceName());
};

Window_NameEdit.prototype.faceWidth = function() { // should return 0 instead
    return 144;
};

And lastly.
You can indeed use "Window_NameInput" and pass the "editWindow" as being the "Window_NewNameHere".

 */

// Helper method
// (Check if number is odd by checking if the remainder is 1)
// 18 % 2 === 1


// Don't forget to use "Window_Status.prototype.drawHorzLine" to handle horizontal lines.
// Or more precisely, take inspiration from how the method is designed.
