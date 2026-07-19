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

    //==========================================================
        // Utility Methods
    //==========================================================

    _.centerOnScreen = function(sprite) {
        sprite.x = (Graphics.width - sprite.width) / 2;
        sprite.y = (Graphics.height - sprite.height) / 2;
    }

    _.centerInsideSprite = function(child, parent) {
        child.x = parent.x + (parent.width - child.width) / 2;
        child.y = parent.y + (parent.height - child.height) / 2;
    }

    //==========================================================
        // Window_Hub
    //==========================================================

    function Window_Hub() {
        this.initialize.apply(this, arguments);
    }
    
    Window_Hub.prototype = Object.create(Window_Base.prototype);
    Window_Hub.prototype.constructor = Window_Hub;

    Window_Hub.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);

        this.drawTitle();
        this.drawAuthor();
        this.drawVersion();
    }

    Window_Hub.prototype.drawTitle = function() {

        const textArgs = {
            text: "Equip Slot Editor",
            x: -this.padding,
            y: 0,
            width: this.width,
            align: "center"
        }

        this.changeTextColor(this.systemColor());
        this.contents.fontSize = this.standardFontSize() + 6;
        this.drawText(...Object.values(textArgs));
    }

    Window_Hub.prototype.drawAuthor = function() {

        const padding = 4;

        const textArgs = {
            text: "By Toby Yasha",
            x: -this.padding,
            y: this.height - (this.lineHeight() - padding) * 3,
            width: this.width,
            align: "center"
        }

        this.changeTextColor(this.systemColor());
        this.contents.fontSize = this.standardFontSize() - 8;
        this.drawText(...Object.values(textArgs));
    }

    Window_Hub.prototype.drawVersion = function() {

        const textArgs = {
            text: "v1.0.0",
            x: -this.padding,
            y: this.height - this.lineHeight() * 2,
            width: this.width,
            align: "center"
        }

        this.changeTextColor(this.systemColor());
        this.contents.fontSize = this.standardFontSize() - 8;
        this.drawText(...Object.values(textArgs));
    }

    _.Window_Hub = Window_Hub;

    //==========================================================
        // Window_HubCommands
    //==========================================================

    function Window_HubCommands() {
        this.initialize.apply(this, arguments);
    }
    
    Window_HubCommands.prototype = Object.create(Window_Command.prototype);
    Window_HubCommands.prototype.constructor = Window_HubCommands;
    
    Window_HubCommands.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);

        this._contentsBackSprite = new Sprite();
        this._contentsBackSprite.bitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this._windowSpriteContainer.addChild(this._contentsBackSprite);

        this._windowFrameSprite.visible = false;
        this.margin = 0;

        this.refresh();
    };

    Window_HubCommands.prototype.makeCommandList = function() {
        this.addCommand("Open", "open", true);
        this.addCommand("Create", "create", true);
        //this.addCommand("Options", "create", true);
        this.addCommand("Exit", "exit", true);
    };

    Window_HubCommands.prototype.refresh = function() {
        if (this._contentsBackSprite) {
            this._contentsBackSprite.bitmap.clear();
        }

        Window_Command.prototype.refresh.call(this);
    };

    Window_HubCommands.prototype.drawItem = function(index) {
        Window_Command.prototype.drawItem.call(this, index);

        const rect = this.itemRect(index);
        this.drawBackgroundRect(rect);
    };

    Window_HubCommands.prototype.drawBackgroundRect = function(rect) {
        if (!this._contentsBackSprite) return;

        //const c = "#5a4256";
        const c = "rgba(90, 66, 86, 0.5)";
        const x = rect.x + 2;
        const y = rect.y + 2;
        const w = rect.width - 4;
        const h = rect.height - 4;
        this._contentsBackSprite.bitmap.fillRect(x, y, w, h, c);
    };

    Window_HubCommands.prototype.itemTextAlign = function() {
        return 'center';
    };

    Window_HubCommands.prototype.windowWidth = function() {
        return Graphics.width / 2.5;
    }

    Window_HubCommands.prototype.windowHeight = function() {
        const padding = 32;
        return this.itemHeight() * (this.maxItems() + 1) - padding;
    };

    Window_HubCommands.prototype.itemHeight = function() {
        return this.lineHeight() * 1.5;
    };

    Window_HubCommands.prototype.standardPadding = function() {
        return 0;
    }

    Window_HubCommands.prototype.itemRectForText = function(index) {
        let rect = Window_Command.prototype.itemRectForText.call(this, index);
        rect.y += this.lineHeight() / 4;
        return rect;
    };

    Window_HubCommands.prototype._refreshBack = function() {
        const backgroundOffsetX = -1;
        const backgroundWidth = 96;
        const backgroundHeight = 96;
    
        this._windowBackSprite.bitmap = this._windowskin;
        this._windowBackSprite.setFrame(0, 0, backgroundWidth, backgroundHeight);
        // [NOTE] There is an issue where artifacts on the sides of the window, 
        // This is only noticeable when hiding a window's frame and reducing its margin to 0.
        // To fix that, we add a tiny offset.
        this._windowBackSprite.move(backgroundOffsetX, 0);
        this._windowBackSprite.scale.x = this._width / backgroundWidth;
        this._windowBackSprite.scale.y = this._height / backgroundHeight;
        this._windowBackSprite.setColorTone(this._colorTone);
    };

    _.Window_HubCommands = Window_HubCommands;

    //==========================================================
        // Scene Editor
    //==========================================================

    function Scene_Editor() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_Editor.prototype = Object.create(Scene_Base.prototype);
    Scene_Editor.prototype.constructor = Scene_Editor;

    Scene_Editor.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
    
        this.createBackground();
        this.createWindowLayer();
        this.createHubWindow();
        this.createHubCommandsWindow();
    };

    Scene_Editor.prototype.createBackground = function() {
        const bitmap = ImageManager.loadBattleback2("cave");
        const backgroundWidth = 1000;

        this._backgroundSprite = new Sprite(bitmap);
        this._backgroundSprite.x = (Graphics.width - backgroundWidth) / 2;
        this._backgroundSprite.opacity = 192;

        this.addChild(this._backgroundSprite);
    }

    Scene_Editor.prototype.createHubWindow = function() {

        const padding = 16;

        const rect = {
            x: 0,
            y: 0,
            width: Graphics.width / 2,
            height: Graphics.height / 2 + padding
        };

        this._hubWindow = new Window_Hub(...Object.values(rect));
        this.addWindow(this._hubWindow);
        _.centerOnScreen(this._hubWindow);
    }

    Scene_Editor.prototype.createHubCommandsWindow = function() {

        const rect = {
            x: 0,
            y: 32,
        };

        this._hubCommandsWindow = new Window_HubCommands(...Object.values(rect));
        this.addWindow(this._hubCommandsWindow);
        _.centerInsideSprite(this._hubCommandsWindow, this._hubWindow);
    }

    _.Scene_Editor = Scene_Editor;

    //==========================================================
        // End of File
    //==========================================================

})(TY.fnHEquipSlotEditor);


/*function Window_Hub() {
    this.initialize.apply(this, arguments);
}

Window_Hub.prototype = Object.create(Window_Base.prototype);
Window_Hub.prototype.constructor = Window_Hub;

Window_Hub.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};*/

// center window
//
// winHub.x = (Graphics.width - 400) / 2;
// winHub.y = (Graphics.height - 400) / 2;
//
// "400" is the window's with or height respectively




// hide window background and frame
//winCom._windowFrameSprite.visible = false;
//winCom.margin = 0; // remove weird transparency created by removing the window frame






/*

Window_Command.prototype._refreshBack = function() {
var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;
    var bitmap = new Bitmap(w, h);

    this._windowBackSprite.bitmap = bitmap;
    this._windowBackSprite.setFrame(0, 0, w, h);
    this._windowBackSprite.move(m, m);

    if (w > 0 && h > 0 && this._windowskin) {
        var p = 95; // leaving this at 96 leaves a clipping line when hiding the window frame
        bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);
        for (var y = 0; y < h; y += p) {
            for (var x = 0; x < w; x += p) {
                bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
            }
        }
        var tone = this._colorTone;
        bitmap.adjustTone(tone[0], tone[1], tone[2]);
    }
};
*/


/*

Window_Command.prototype._refreshFrame = function() { //deprecated };

*/



/*

Window.prototype.update = function() {
    if (this.active) {
        this._animationCount++;
    }
    this.children.forEach(function(child) { // children should only update if the window is active!
        if (child.update) {
            child.update();
        }
    });
};

// deprecate, not very useful here
Window.prototype._updatePauseSign

// should only update when the window is active
Window.prototype.updateTransform = function() {
    this._updateCursor();
    this._updateArrows();
    this._updatePauseSign();
    this._updateContents();
    PIXI.Container.prototype.updateTransform.call(this);
};

*/





// ScreenSprite
// Set opacity to 160




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


// Don't forget about localization options
