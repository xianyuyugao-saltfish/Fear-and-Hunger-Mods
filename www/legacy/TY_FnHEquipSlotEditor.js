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

    _.windowHubCommands = [
        { name: "Open", symbol: "open" },
        { name: "Create", symbol: "create" },
        { name: "Options", symbol: "options" },
        { name: "Exit", symbol: "exit" },
    ]

    _.centerOnScreen = function(sprite) {
        sprite.x = (Graphics.width - sprite.width) / 2;
        sprite.y = (Graphics.height - sprite.height) / 2;
    }

    _.centerInsideSprite = function(child, parent) {
        child.x = parent.x + (parent.width - child.width) / 2;
        child.y = parent.y + (parent.height - child.height) / 2;
    }

    // needs a layer system or something
    // because i'll need to place a ScreenSprite between or above windows

    // maybe a "layerId" passed along the window object?
    // and the scene decides which layer is active
    _.addWindowToScene = function(win) {
        SceneManager._scene.addWindow(win);
    }

    //==========================================================
        // EditorLayout
    //==========================================================

    function EditorLayout() {
        throw new Error("This is a static class");
    }

    EditorLayout.LINE_HEIGHT = 36;
    EditorLayout.TITLE_AREA_HEIGHT = EditorLayout.LINE_HEIGHT * 2;
    EditorLayout.MIN_WINDOW_HEIGHT = 240;
    EditorLayout.COMMAND_MARGIN = 36;
    //EditorLayout.COMMAND_WIDTH = 300;

    _.EditorLayout = EditorLayout;

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

        //this.drawList();
    }

    Window_Hub.prototype.drawList = function() {
        this.clearContents();
        this.drawTitle();
        this.drawAuthor();
        this.drawVersion();
    }

    /*Window_Hub.prototype.commandHeight = function() {
        return Window_HubCommands.prototype.itemHeight.call(this) * _.windowHubCommands.length;
    }*/

    Window_Hub.prototype.shortLineHeight = function() {
        return this.lineHeight() / 2 + 4;
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

        const textArgs = {
            text: "By Toby Yasha",
            x: -this.padding,
            y: this.height - this.commandHeight() - this.shortLineHeight() * 2,
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
            y: this.height - this.commandHeight() + this.shortLineHeight(),
            width: this.width,
            align: "center"
        }

        this.changeTextColor(this.systemColor());
        this.contents.fontSize = this.standardFontSize() - 8;
        this.drawText(...Object.values(textArgs));
    }

    Window_Hub.prototype.clearContents = function() {
        this.contents.clear();
        this.createContents(); // temporarily added here
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
    
    Window_HubCommands.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this);

        this._hideFrame();
    };

    // should only update when the window is active
    Window_HubCommands.prototype.update = function() {
        if (!this.active) return;

        Window_Command.prototype.update.call(this);
    };

    // should only update when the window is active
    Window_HubCommands.prototype.updateTransform = function() {
        if (!this.active) return;

        Window_Command.prototype.updateTransform.call(this);
    };

    Window_HubCommands.prototype._hideFrame = function() {
        this._windowFrameSprite.visible = false;
        this.margin = 0;
    }

    // the frame is hidden
    Window_HubCommands.prototype._refreshFrame = function() { 
        // deprecated 
    };

    // Based on MZ Code -- Window.prototype._refreshBack
    Window_HubCommands.prototype._refreshBack = function() {
        //const backgroundOffsetX = -1;
        const backgroundOffsetX = 0;
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

    // we don't need this sprite
    /*Window_HubCommands.prototype._updatePauseSign = function() {
        // deprecated
    }*/

    // the game ignores scroll wheel inputs
    Window_HubCommands.prototype.processWheel = function() {
        // deprecated
    };
    
    // the game ignores mouse inputs
    Window_HubCommands.prototype.processTouch = function() {
        // deprecated
    };

    Window_HubCommands.prototype.createContents = function() {
        Window_Command.prototype.createContents.call(this);

        this.createBackContents();
    }

    Window_HubCommands.prototype.createBackContents = function() {
        const width = this.contentsWidth();
        const height = this.contentsHeight();
        const bitmap = new Bitmap(width, height);

        this._contentsBackSprite = new Sprite(bitmap);
        this._windowSpriteContainer.addChild(this._contentsBackSprite);
    }

    Window_HubCommands.prototype.standardPadding = function() {
        return 0;
    }

    Window_HubCommands.prototype.itemHeight = function() {
        return this.lineHeight() * 1.5;
    };

    Window_HubCommands.prototype.itemRectForText = function(index) {
        let rect = Window_Command.prototype.itemRectForText.call(this, index);
        rect.y += this.lineHeight() / 4;
        return rect;
    };

    Window_HubCommands.prototype.windowHeight = function() {
        const padding = 48;
        return this.itemHeight() * (this.maxItems() + 1) - padding;
    };

    Window_HubCommands.prototype.makeCommandList = function() {
        for (const command of _.windowHubCommands) {
            this.addCommand(command.name, command.symbol, true);
        }
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

        const margin = 8;

        const c = "#403840";
        const x = rect.x + margin / 2;
        const y = rect.y + margin / 2;
        const w = rect.width - margin;
        const h = rect.height - margin;
        this._contentsBackSprite.bitmap.fillRect(x, y, w, h, c);
    };

    Window_HubCommands.prototype.itemTextAlign = function() {
        return 'center';
    };

    _.Window_HubCommands = Window_HubCommands;

    //==========================================================
        // Hub Controller
    //==========================================================

    function HubController() {
        this.initialize.apply(this, arguments);
    }

    HubController.prototype.initMembers = function() {
        this._hubWindow = null;
        this._hubCommandsWindow = null;
    }

    HubController.prototype.initialize = function() {
        this.initMembers();
        this.createHubWindow();
        this.createHubCommands();
    }

    HubController.prototype.hubWindowRect = function() {
        const width = Graphics.width / 2;
        const height = (
            EditorLayout.MIN_WINDOW_HEIGHT + 
            EditorLayout.LINE_HEIGHT * 
            _.windowHubCommands.length
        ); // debating making this into a method inside the "EditorLayout"

        return {
            width,
            height,
            x: (Graphics.width - width) / 2,
            y: (Graphics.height - height) / 2
        };
    }

    HubController.prototype.hubCommandsWindowRect = function() {
        const width = this._hubWindow.width - EditorLayout.COMMAND_MARGIN;

        return {
            width,
            x: this._hubWindow.x + (this._hubWindow.width - width) / 2,
            y: this._hubWindow.y + EditorLayout.TITLE_AREA_HEIGHT,
        }
    }

    HubController.prototype.createHubWindow = function() {
        const rect = this.hubWindowRect();

        this._hubWindow = new Window_Hub(rect.x, rect.y, rect.width, rect.height);
        _.addWindowToScene(this._hubWindow);
    }

    HubController.prototype.createHubCommands = function() {
        const rect = this.hubCommandsWindowRect();

        this._hubCommandsWindow = new Window_HubCommands();
        this._hubCommandsWindow.x = rect.x;
        this._hubCommandsWindow.y = rect.y;
        this._hubCommandsWindow.width = rect.width;
        this._hubCommandsWindow.refresh();
        this._hubCommandsWindow.reselect();
        _.addWindowToScene(this._hubCommandsWindow);
    }

    _.HubController = HubController;

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
        this.createControllers();
    };

    Scene_Editor.prototype.createBackground = function() {
        const bitmap = ImageManager.loadBattleback2("cave");
        const backgroundWidth = 1000;

        this._backgroundSprite = new Sprite(bitmap);
        this._backgroundSprite.x = (Graphics.width - backgroundWidth) / 2;
        this._backgroundSprite.opacity = 192;

        this.addChild(this._backgroundSprite);
    }

    Scene_Editor.prototype.createControllers = function() {
        this._hubController = new HubController();
    }

    _.Scene_Editor = Scene_Editor;

    //==========================================================
        // End of File
    //==========================================================

})(TY.fnHEquipSlotEditor);

/*

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


// Don't forget to use "Window_Status.prototype.drawHorzLine" to handle horizontal lines.
// Or more precisely, take inspiration from how the method is designed.


// Don't forget about localization options
