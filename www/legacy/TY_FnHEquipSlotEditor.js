//==========================================================
    // VERSION 1.0.0 -- by Toby Yasha
//==========================================================

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

    function isGameTermina() {
        return $dataSystem.gameTitle.match(/TERMINA/gi);
    }

    _.hubCommandSymbols = [
        "open",
        "create",
        "exit",
    ]

    _.profileListCommands = [
        { name: "Default", symbol: "default" },
        { name: "Blender", symbol: "blender" },
        { name: "Blender2", symbol: "blender2" },
        { name: "Blender3", symbol: "blender3" },
        { name: "Blender4", symbol: "blender4" },
        { name: "Blender5", symbol: "blender5" },
        { name: "Blender6", symbol: "blender6" },
        { name: "Blender7", symbol: "blender7" },
        //{ name: "Blender8", symbol: "blender8" },
        //{ name: "Blender9", symbol: "blender9" },
        //{ name: "Blender10", symbol: "blender10" },
        { name: "Cancel", symbol: "cancel" },
    ]

    _.profileEquipSlots = {
        default: ["Weapon", "Shield", "Head", "Body", "Accessory"],
        blender: ["Weapon", "Weapon", "Head", "Body", "Accessory"],
        blender2: ["Shield", "Shield", "Head", "Body", "Accessory"],
        blender3: ["Weapon", "Weapon", "Accessory", "Accessory", "Accessory"],
        blender4: ["Weapon", "Weapon", "Weapon", "Accessory", "Accessory", "Accessory"],
        blender5: ["Accessory", "Accessory", "Accessory", "Accessory", "Accessory", "Accessory"]
    }

    _.profileActors = {
        default: ["Cahara", "D'arce"],
        blender: ["Enki"],
        blender2: ["Cahara", "D'arce", "Ragnavaldr", "Enki"],
        blender3: ["Cahara", "D'arce", "Enki"],
        blender4: ["Cahara", "D'arce"],
        blender5: ["Enki"],
    }

    _.profileOptionSymbols = [
        "assign",
        "edit",
        "rename",
        "duplicate",
        "delete",
        "cancel"
    ]

    //==========================================================
        // EditorLayout
    //==========================================================

    function EditorLayout() {
        throw new Error("This is a static class");
    }

    EditorLayout.LINE_HEIGHT = 36;
    EditorLayout.HEADER_AREA_HEIGHT = EditorLayout.LINE_HEIGHT * 2;
    EditorLayout.FOOTER_AREA_HEIGHT = EditorLayout.LINE_HEIGHT * 1.5;
    EditorLayout.PROFILE_AREA_HEIGHT = EditorLayout.LINE_HEIGHT * 6;
    EditorLayout.COMMAND_HEIGHT = EditorLayout.LINE_HEIGHT * 1.5;
    EditorLayout.COMMAND_MARGIN = 36;
    EditorLayout.PADDING = 16;

    _.EditorLayout = EditorLayout;

    //==========================================================
        // EditorStrings
    //==========================================================

    function EditorStrings() {
        throw new Error("This is a static class");
    }

    EditorStrings._defaultLocale = "EN";
    EditorStrings._currentLocale = "EN";

    EditorStrings.AUTHOR = "By Toby Yasha";
    EditorStrings.VERSION = "v1.0.0";

    EditorStrings.KEYS = {
        HUB_TITLE: "hubTitle",
        OPEN: "open",
        CREATE: "create",
        EXIT: "exit",
        PROFILE_LIST_TITLE: "profileListTitle",
        PREVIEW: "preview",
        ASSIGNED: "assigned",
        PROFILE_OPTIONS_TITLE: "profileOptionsTitle",
        ASSIGN: "assign",
        EDIT: "edit",
        RENAME: "rename",
        DUPLICATE: "duplicate",
        DELETE: "delete",
        PROFILE_EDITOR_TITLE: "profileEditorTitle",
        EQUIP_SLOTS: "equipSlots",
        ADD: "add",
        REMOVE: "remove",
        MOVE: "move",
        SAVE: "save",
        HELP: "help",
        CANCEL: "cancel",
    }

    EditorStrings.LOCALES = {
        EN: {
            hubTitle: "Equip Slot Editor",
            open: "Open",
            create: "Create",
            exit: "Exit",
            profileListTitle: "Profile List",
            preview: "Preview",
            assigned: "Assigned",
            profileOptionsTitle: "Profile Options",
            assign: "Assign",
            edit: "Edit",
            rename: "Rename",
            duplicate: "Duplicate",
            delete: "Delete",
            profileEditorTitle: "Profile Editor",
            equipSlots: "Equip Slots",
            add: "Add",
            remove: "Remove",
            move: "Move",
            save: "Save",
            help: "Help",
            cancel: "Cancel",
        }
    }

    EditorStrings.setLocale = function(locale) {
        if (!EditorStrings.LOCALES.hasOwnProperty(locale)) {
            console.warn(`TY_FnHEquipSlotEditor - Locale: ${locale} is not valid!`);
            return;
        }

        EditorStrings._currentLocale = locale;
    }

    EditorStrings.get = function(key) {
        return (
            EditorStrings.LOCALES[EditorStrings._currentLocale][key] || 
            EditorStrings.LOCALES[EditorStrings._defaultLocale][key]
        );
    }

    _.EditorStrings = EditorStrings;

    //==========================================================
        // EditorContext
    //==========================================================

    function EditorContext() {
        throw new Error("This is a static class");
    }

    EditorContext.selectedProfile = null;

    //==========================================================
        // Window_EditorBase
    //==========================================================

    function Window_EditorBase() {
        this.initialize.apply(this, arguments);
    }
    
    Window_EditorBase.prototype = Object.create(Window_Base.prototype);
    Window_EditorBase.prototype.constructor = Window_EditorBase;

    Window_EditorBase.prototype.drawCenteredLabel = function(text, y, fontSize) {
        this.changeTextColor(this.systemColor());
        this.contents.fontSize = fontSize;
    
        this.drawText(
            text,
            0,
            y,
            this.contentsWidth(),
            "center"
        );
    };

    Window_EditorBase.prototype.drawTitle = function(text) {
        const fontSize = this.standardFontSize() + 6;
        this.drawCenteredLabel(text, 0, fontSize);
    };

    _.Window_EditorBase = Window_EditorBase;

    //==========================================================
        // Window_EditorCommandBase
    //==========================================================

    function Window_EditorCommandBase() {
        this.initialize.apply(this, arguments);
    }
    
    Window_EditorCommandBase.prototype = Object.create(Window_Command.prototype);
    Window_EditorCommandBase.prototype.constructor = Window_EditorCommandBase;
    
    Window_EditorCommandBase.prototype.initialize = function(x, y, width) {
        Window_Command.prototype.initialize.call(this);

        this._hideFrame();
        this.x = x;
        this.y = y;
        this.width = width;
        this.refresh();
        this.reselect();
        this.setBackgroundType(1);
    };

    Window_EditorCommandBase.prototype.dimColor1 = function() {
        return 'rgba(0, 0, 0, 0.7529411764705882)';
    };
    
    Window_EditorCommandBase.prototype.dimColor2 = function() {
        return this.dimColor1();
    };

    // should only update when the window is active
    Window_EditorCommandBase.prototype.update = function() {
        if (!this.active) return;

        Window_Command.prototype.update.call(this);
    };

    // should only update when the window is active
    Window_EditorCommandBase.prototype.updateTransform = function() {
        if (!this.active) return;

        Window_Command.prototype.updateTransform.call(this);
    };

    Window_EditorCommandBase.prototype._hideFrame = function() {
        //this._windowFrameSprite.visible = false;
        //this.margin = 0;
    }

    /**
     * @deprecated the frame is hidden
     */
    //Window_EditorCommandBase.prototype._refreshFrame = function() {};

    /**
     * [NOTE] The original MV implementation may produce edge artifacts when the
     * window frame is hidden and the margin is set to 0. The code below only 
     * partially fixes the issue. 
     * 
     * Implementation based on MZ Code -- Window.prototype._refreshBack
     */
    /*Window_EditorCommandBase.prototype._refreshBack = function() {
        const backgroundWidth = 96;
        const backgroundHeight = 96;
    
        this._windowBackSprite.bitmap = this._windowskin;
        this._windowBackSprite.setFrame(0, 0, backgroundWidth, backgroundHeight);
        this._windowBackSprite.scale.x = this._width / backgroundWidth;
        this._windowBackSprite.scale.y = this._height / backgroundHeight;
        this._windowBackSprite.setColorTone(this._colorTone);
    };*/

    /**
     * @deprecated the game ignores scroll wheel inputs
     */
    Window_EditorCommandBase.prototype.processWheel = function() {};
    
    /**
     * @deprecated the game ignores mouse inputs
     */
    Window_EditorCommandBase.prototype.processTouch = function() {};

    Window_EditorCommandBase.prototype.createContents = function() {
        Window_Command.prototype.createContents.call(this);

        this.createBackContents();
    }

    Window_EditorCommandBase.prototype.createBackContents = function() {
        const width = this.contentsWidth();
        const height = this.contentsHeight();
        const bitmap = new Bitmap(width, height); // NOTE: The "contents" bitmap and this bitmap need to be destroyed when the scene ends.

        this._contentsBackSprite = new Sprite(bitmap);
        this.addChildToBack(this._contentsBackSprite);
        //this._windowSpriteContainer.addChild(this._contentsBackSprite);
    }

    Window_EditorCommandBase.prototype.standardPadding = function() {
        return 0;
    }

    Window_EditorCommandBase.prototype.fittingHeight = function(numLines) {
        const padding = 6;
        return numLines * this.itemHeight() + padding;
    };

    Window_EditorCommandBase.prototype.itemHeight = function() {
        return EditorLayout.COMMAND_HEIGHT;
    };

    Window_EditorCommandBase.prototype.itemRectForText = function(index) {
        let rect = Window_Command.prototype.itemRectForText.call(this, index);
        rect.y += this.lineHeight() / 4;
        return rect;
    };

    Window_EditorCommandBase.prototype.drawItem = function(index) {
        Window_Command.prototype.drawItem.call(this, index);

        const rect = this.itemRect(index);
        const color = this.backgroundRectColor(index);
        this.drawBackgroundRect(rect, color);
    };

    Window_EditorCommandBase.prototype.backgroundRectColor = function(index) {
        return "#403840";
    }

    Window_EditorCommandBase.prototype.drawBackgroundRect = function(rect, color) {
        if (!this._contentsBackSprite) return;

        const margin = 8;
        const x = rect.x + margin / 2;
        const y = rect.y + margin / 2;
        const w = rect.width - margin;
        const h = rect.height - margin;
        this._contentsBackSprite.bitmap.fillRect(x, y, w, h, color);
    };

    Window_EditorCommandBase.prototype.itemTextAlign = function() {
        return 'center';
    };

    _.Window_EditorCommandBase = Window_EditorCommandBase;

    //==========================================================
        // EditorController
    //==========================================================

    function EditorController() {
        this.initialize.apply(this, arguments);
    }

    EditorController.prototype.initMembers = function() {
        this._mainWindow = null;
        this._commandWindow = null;
        this._windows = [];
    }

    EditorController.prototype.initialize = function() {
        this.initMembers();
        this.createMainWindow();
        this.createCommandWindow();
        this.refresh();
    }

    EditorController.prototype.registerWindow = function(win) {
        win.hide();
        win.deactivate();
        SceneManager._scene.addWindow(win);
        this._windows.push(win);
    }

    EditorController.prototype.createMainWindow = function() {
        // override
    }

    EditorController.prototype.createCommandWindow = function() {
        // override
    }

    EditorController.prototype.refresh = function() {
        // override
    }

    EditorController.prototype.activate = function() {
        this._windows.forEach(win => win.activate());
    }

    EditorController.prototype.deactivate = function() {
        this._windows.forEach(win => win.deactivate());
    }

    EditorController.prototype.show = function() {
        this._windows.forEach(win => win.show());
    }

    EditorController.prototype.hide = function() {
        this._windows.forEach(win => win.hide());
    }

    EditorController.prototype.reset = function() {
        if (this._commandWindow) this._commandWindow.select(0);
    }

    EditorController.prototype.popController = function() {
        SceneManager._scene.popController();
    }

    _.EditorController = EditorController;

    //==========================================================
        // Window_Hub
    //==========================================================

    function Window_Hub() {
        this.initialize.apply(this, arguments);
    }
    
    Window_Hub.prototype = Object.create(Window_EditorBase.prototype);
    Window_Hub.prototype.constructor = Window_Hub;

    Window_Hub.prototype.drawTitle = function() {
        const text = EditorStrings.get(EditorStrings.KEYS.HUB_TITLE);

        Window_EditorBase.prototype.drawTitle.call(this, text);
    };

    Window_Hub.prototype.drawFooter = function(commandHeight) {
        const fontSize = this.standardFontSize() - 8;

        const footerY = commandHeight + 48; // TODO: Figure out why "48" works here
        const footerLineSpacing = this.lineHeight() / 2 + 4;
        const footerY2 = footerY + footerLineSpacing;
    
        this.drawCenteredLabel(EditorStrings.AUTHOR, footerY, fontSize);
        this.drawCenteredLabel(EditorStrings.VERSION, footerY2, fontSize);
    }

    _.Window_Hub = Window_Hub;

    //==========================================================
        // Window_HubCommands
    //==========================================================

    function Window_HubCommands() {
        this.initialize.apply(this, arguments);
    }
    
    Window_HubCommands.prototype = Object.create(Window_EditorCommandBase.prototype);
    Window_HubCommands.prototype.constructor = Window_HubCommands;

    Window_HubCommands.prototype.makeCommandList = function() {
        for (const symbol of _.hubCommandSymbols) {
            this.addCommand(EditorStrings.get(symbol), symbol, true);
        }
    };

    _.Window_HubCommands = Window_HubCommands;

    //==========================================================
        // HubController
    //==========================================================

    function HubController() {
        this.initialize.apply(this, arguments);
    }

    HubController.prototype = Object.create(EditorController.prototype);
    HubController.prototype.constructor = HubController;

    HubController.prototype.mainWindowRect = function() {
        const width = Graphics.width / 2;

        const commandHeight = (
            EditorLayout.COMMAND_HEIGHT * 
            _.hubCommandSymbols.length
        );

        const height = (
            EditorLayout.HEADER_AREA_HEIGHT + 
            commandHeight + 
            EditorLayout.FOOTER_AREA_HEIGHT + 
            EditorLayout.PADDING
        );

        return {
            width,
            height,
            x: (Graphics.width - width) / 2,
            y: (Graphics.height - height) / 2
        };
    }

    HubController.prototype.commandWindowRect = function() {
        const width = this._mainWindow.width - EditorLayout.COMMAND_MARGIN;

        return {
            width,
            x: this._mainWindow.x + (this._mainWindow.width - width) / 2,
            y: this._mainWindow.y + EditorLayout.HEADER_AREA_HEIGHT
        }
    }

    HubController.prototype.createMainWindow = function() {
        const rect = this.mainWindowRect();

        this._mainWindow = new Window_Hub(rect.x, rect.y, rect.width, rect.height);
        this.registerWindow(this._mainWindow);
    }

    HubController.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();

        this._commandWindow = new Window_HubCommands(rect.x, rect.y, rect.width);
        this._commandWindow.setHandler('open', this.openProfileList.bind(this));
        this._commandWindow.setHandler('exit', this.popScene.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.registerWindow(this._commandWindow);
    }

    HubController.prototype.refresh = function() {
        const commandHeight = this._commandWindow.height;
        this._mainWindow.drawTitle();
        this._mainWindow.drawFooter(commandHeight);
    }

    HubController.prototype.openProfileList = function() {
        SceneManager._scene.pushController("profileList");
    }

    HubController.prototype.popScene = function() {
        SceneManager.pop();
    }

    _.HubController = HubController;

    //==========================================================
        // Window_ProfileList
    //==========================================================

    function Window_ProfileList() {
        this.initialize.apply(this, arguments);
    }
    
    Window_ProfileList.prototype = Object.create(Window_EditorBase.prototype);
    Window_ProfileList.prototype.constructor = Window_ProfileList;

    Window_ProfileList.prototype.initialize = function(x, y, width, height) {
        Window_EditorBase.prototype.initialize.call(this, x, y, width, height);

        this._profileSymbol = null;
    }

    Window_ProfileList.prototype.update = function() {
        Window_EditorBase.prototype.update.call(this);

        if (this.active) this.updateLayout();
    }

    Window_ProfileList.prototype.updateLayout = function() {
        if (EditorContext.selectedProfile === this._profileSymbol) return;

        this._profileSymbol = EditorContext.selectedProfile;
        this.drawLayout();
    }

    Window_ProfileList.prototype.drawLayout = function() {
        this.contents.clear();
        this.drawTitle();
        this.drawPreviewHeader();
        this.drawPreviewContents();
        this.drawAssignedHeader();
        this.drawAssignedContents();
    }

    Window_ProfileList.prototype.drawTitle = function() {
        const text = EditorStrings.get(EditorStrings.KEYS.PROFILE_LIST_TITLE);

        Window_EditorBase.prototype.drawTitle.call(this, text);
    };

    Window_ProfileList.prototype.drawHorizontalLine = function(lineY) {
        const margin = 4;
        const x = margin / 2;
        const y = lineY + margin / 2;
        const w = this.contentsWidth() - margin;
        const h = 4;

        this.contents.fillRect(x, y, w, h, "#403840");
    }

    Window_ProfileList.prototype.drawSectionHeader = function(text, lineY) {
        const margin = 4;

        this.changeTextColor(this.systemColor());
        this.contents.fontSize = this.standardFontSize();

        this.drawText(text, margin, this.lineHeight() * lineY, this.contentsWidth());
        this.drawHorizontalLine(this.lineHeight() * (lineY + 1));
    }

    Window_ProfileList.prototype.drawPreviewHeader = function() {
        const text = EditorStrings.get(EditorStrings.KEYS.PREVIEW);
        const lineY = 1;
        this.drawSectionHeader(text, lineY);
    }

    Window_ProfileList.prototype.prepareContentText = function() {
        this.changeTextColor(this.normalColor());
        this.contents.fontSize = this.standardFontSize() - 4;
    }

    Window_ProfileList.prototype.drawPreviewContents = function() {
        this.prepareContentText();

        const maxColumns = 5;
        const margin = 4;
        const columnSpacing = EditorLayout.PADDING * 2 - 4;
        const rowSpacing = EditorLayout.PADDING * 2 - 4;
        let x = margin;
        const startY = this.lineHeight() * 2 + margin;

        const equipSlots = _.profileEquipSlots[this._profileSymbol];

        if (!equipSlots || equipSlots.length === 0) return;

        const maxSlots = Math.min(equipSlots.length, 10);

        for (let i = 0; i < maxSlots; i++) {
            let row = Math.floor(i / maxColumns);
            let column = i % maxColumns;
            let y = startY + row * rowSpacing;

            const textWidth = this.textWidth(equipSlots[i]);

            if (column === 0) x = margin;
            this.drawText(equipSlots[i], x, y, textWidth);
            x += textWidth + columnSpacing;
        }
    }

    Window_ProfileList.prototype.drawAssignedHeader = function() {
        const text = EditorStrings.get(EditorStrings.KEYS.ASSIGNED);
        const lineY = 4;
        this.drawSectionHeader(text, lineY);
    }

    Window_ProfileList.prototype.drawAssignedContents = function() {
        this.prepareContentText();

        const margin = 4;
        const spacing = EditorLayout.PADDING * 2 - 4;
        let x = margin;
        const y = this.lineHeight() * 5 + margin;

        const actors = _.profileActors[this._profileSymbol];

        if (!actors || actors.length === 0) return;

        for (let i = 0; i < actors.length; i++) {

            const textWidth = this.textWidth(actors[i]);

            this.drawText(actors[i], x, y, textWidth);

            x += textWidth + spacing;
        }
    }

    _.Window_ProfileList = Window_ProfileList;

    //==========================================================
        // Window_ProfileListCommands
    //==========================================================

    function Window_ProfileListCommands() {
        this.initialize.apply(this, arguments);
    }
    
    Window_ProfileListCommands.prototype = Object.create(Window_EditorCommandBase.prototype);
    Window_ProfileListCommands.prototype.constructor = Window_ProfileListCommands;

    Window_ProfileListCommands.prototype.select = function(index) {
        Window_EditorCommandBase.prototype.select.call(this, index);

        const symbol = this.currentSymbol();
        if (symbol !== "cancel") EditorContext.selectedProfile = symbol;
    };

    Window_ProfileListCommands.prototype.maxCols = function() {
        return 2;
    };

    Window_ProfileListCommands.prototype.numVisibleRows = function() {
        const currentRows = Window_EditorCommandBase.prototype.numVisibleRows.call(this);
        const maxRows = 5;
        return Math.min(currentRows, maxRows);
    };

    Window_ProfileListCommands.prototype.makeCommandList = function() {
        for (const command of _.profileListCommands) {
            this.addCommand(command.name, command.symbol, true);
        }
    };

    _.Window_ProfileListCommands = Window_ProfileListCommands;

    //==========================================================
        // ProfileListController
    //==========================================================

    function ProfileListController() {
        this.initialize.apply(this, arguments);
    }

    ProfileListController.prototype = Object.create(EditorController.prototype);
    ProfileListController.prototype.constructor = ProfileListController;

    ProfileListController.prototype.mainWindowRect = function() {
        const width = Graphics.width * 0.9;

        const maxCommandRows = 5;
        const commandCount = Math.ceil(_.profileListCommands.length / 2);
        const commandHeight = (
            EditorLayout.COMMAND_HEIGHT * 
            Math.min(commandCount, maxCommandRows)
        );

        const height = (
            EditorLayout.HEADER_AREA_HEIGHT +
            EditorLayout.PROFILE_AREA_HEIGHT +
            commandHeight +
            EditorLayout.PADDING
        );

        return {
            width,
            height,
            x: (Graphics.width - width) / 2,
            y: (Graphics.height - height) / 2
        };
    }

    ProfileListController.prototype.commandWindowRect = function() {
        const width = this._mainWindow.width - EditorLayout.COMMAND_MARGIN;

        return {
            width,
            x: this._mainWindow.x + (this._mainWindow.width - width) / 2,
            y: this._mainWindow.y + EditorLayout.HEADER_AREA_HEIGHT + EditorLayout.PROFILE_AREA_HEIGHT
        }
    }

    ProfileListController.prototype.createMainWindow = function() {
        const rect = this.mainWindowRect();

        this._mainWindow = new Window_ProfileList(rect.x, rect.y, rect.width, rect.height);
        this.registerWindow(this._mainWindow);
    }

    ProfileListController.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();

        this._commandWindow = new Window_ProfileListCommands(rect.x, rect.y, rect.width);
        this._commandWindow.setHandler('ok', this.openProfileOptions.bind(this));
        this._commandWindow.setHandler('cancel', this.popController.bind(this));
        this.registerWindow(this._commandWindow);
    }

    ProfileListController.prototype.openProfileOptions = function() {
        SceneManager._scene.pushController("profileOptions");
    }

    _.ProfileListController = ProfileListController;

    //==========================================================
        // Window_ProfileOptions
    //==========================================================

    function Window_ProfileOptions() {
        this.initialize.apply(this, arguments);
    }
    
    Window_ProfileOptions.prototype = Object.create(Window_EditorBase.prototype);
    Window_ProfileOptions.prototype.constructor = Window_ProfileOptions;

    Window_ProfileOptions.prototype.drawTitle = function() {
        const text = EditorStrings.get(EditorStrings.KEYS.PROFILE_OPTIONS_TITLE);

        Window_EditorBase.prototype.drawTitle.call(this, text);
    };

    _.Window_ProfileOptions = Window_ProfileOptions;

    //==========================================================
        // Window_ProfileOptionsCommands
    //==========================================================

    function Window_ProfileOptionsCommands() {
        this.initialize.apply(this, arguments);
    }
    
    Window_ProfileOptionsCommands.prototype = Object.create(Window_EditorCommandBase.prototype);
    Window_ProfileOptionsCommands.prototype.constructor = Window_ProfileOptionsCommands;

    Window_ProfileOptionsCommands.prototype.backgroundRectColor = function(index) {
        if (this.commandSymbol(index) === "delete") return "#602217";
        return Window_EditorCommandBase.prototype.backgroundRectColor.call(index);
    }

    Window_ProfileOptionsCommands.prototype.makeCommandList = function() {
        for (const symbol of _.profileOptionSymbols) {
            this.addCommand(EditorStrings.get(symbol), symbol, true);
        }
    };

    _.Window_ProfileOptionsCommands = Window_ProfileOptionsCommands;

    //==========================================================
        // ProfileOptionsController
    //==========================================================

    function ProfileOptionsController() {
        this.initialize.apply(this, arguments);
    }

    ProfileOptionsController.prototype = Object.create(EditorController.prototype);
    ProfileOptionsController.prototype.constructor = ProfileOptionsController;

    ProfileOptionsController.prototype.mainWindowRect = function() {
        const width = Graphics.width / 2;

        const commandHeight = (
            EditorLayout.COMMAND_HEIGHT * 
            _.profileOptionSymbols.length
        );

        const height = (
            EditorLayout.HEADER_AREA_HEIGHT +
            commandHeight +
            EditorLayout.PADDING
        );

        return {
            width,
            height,
            x: (Graphics.width - width) / 2,
            y: (Graphics.height - height) / 2
        };
    }

    ProfileOptionsController.prototype.commandWindowRect = function() {
        const width = this._mainWindow.width - EditorLayout.COMMAND_MARGIN;

        return {
            width,
            x: this._mainWindow.x + (this._mainWindow.width - width) / 2,
            y: this._mainWindow.y + EditorLayout.HEADER_AREA_HEIGHT
        }
    }

    ProfileOptionsController.prototype.createMainWindow = function() {
        const rect = this.mainWindowRect();

        this._mainWindow = new Window_ProfileOptions(rect.x, rect.y, rect.width, rect.height);
        this.registerWindow(this._mainWindow);
    }

    ProfileOptionsController.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();

        this._commandWindow = new Window_ProfileOptionsCommands(rect.x, rect.y, rect.width);
        this._commandWindow.setHandler('cancel', this.popController.bind(this));
        this.registerWindow(this._commandWindow);
    }

    ProfileOptionsController.prototype.refresh = function() {
        this._mainWindow.drawTitle();
    }

    _.ProfileOptionsController = ProfileOptionsController;

    //==========================================================
        // Scene_Editor
    //==========================================================

    function Scene_Editor() {
        this.initialize.apply(this, arguments);
    }
    
    Scene_Editor.prototype = Object.create(Scene_Base.prototype);
    Scene_Editor.prototype.constructor = Scene_Editor;

    Scene_Editor.prototype.create = function() {
        Scene_Base.prototype.create.call(this);

        this._controllerLayers = [];
    
        this.createBackground();
        this.createWindowLayer();
        this.createControllers();
        //this.createBackgroundDimmer();
    };

    Scene_Editor.prototype.getBackgroundBitmap = function() {
        const image = isGameTermina() ? "forest1" : "cave";
        return ImageManager.loadBattleback2(image);
    }

    Scene_Editor.prototype.createBackground = function() {
        const backgroundWidth = 1000;

        this._backgroundSprite = new Sprite(this.getBackgroundBitmap());
        this._backgroundSprite.x = (Graphics.width - backgroundWidth) / 2;
        this._backgroundSprite.opacity = 192;

        this.addChild(this._backgroundSprite);
    }

    /*Scene_Editor.prototype.createBackgroundDimmer = function() {
        this._backgroundDimmer = new ScreenSprite();
        this._backgroundDimmer.opacity = 192;
        // IMPORTANT: This allows the sprite to coexist alongside windows in the window layer rendering logic
        this._backgroundDimmer._isWindow = false;

        this.addWindow(this._backgroundDimmer);
    }*/

    Scene_Editor.prototype.createControllers = function() {
        this._controllers = {
            hub: new HubController(),
            profileList: new ProfileListController(),
            profileOptions: new ProfileOptionsController(),
        }

        this.pushController("hub");
    }

    Scene_Editor.prototype.pushController = function(type) {
        const previousController = this._controllerLayers[this._controllerLayers.length - 1];
        if (previousController) previousController.deactivate();

        const activeController = this._controllers[type];

        activeController.activate();
        activeController.show();
        activeController.reset();

        this._controllerLayers.push(activeController);
    }

    Scene_Editor.prototype.popController = function() {
        const activeController = this._controllerLayers[this._controllerLayers.length - 1];
        activeController.deactivate();
        activeController.hide();

        this._controllerLayers.pop();

        const previousController = this._controllerLayers[this._controllerLayers.length - 1];
        if (previousController) previousController.activate();
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
