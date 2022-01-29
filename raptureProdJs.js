Ext.define("NX.Console", {
    singleton: true,
    console: undefined,
    disable: false,
    traceEnabled: false,
    debugEnabled: true,
    constructor: function () {
        this.console = NX.global.console || {};
        Ext.applyIf(this.console, {log: Ext.emptyFn, info: Ext.emptyFn, warn: Ext.emptyFn, error: Ext.emptyFn});
        this.debugEnabled = NX.global.location.href.search("[?&]debug") > -1;
        this.traceEnabled = NX.global.location.href.search("[?&]trace") > -1
    },
    log: function (d, a) {
        var b = this.console;
        switch (d) {
            case"trace":
                if (this.traceEnabled) {
                    b.log.apply(b, a)
                }
                break;
            case"debug":
                if (this.debugEnabled) {
                    b.log.apply(b, a)
                }
                break;
            case"info":
                b.info.apply(b, a);
                break;
            case"warn":
                b.warn.apply(b, a);
                break;
            case"error":
                b.error.apply(b, a);
                break
        }
    },
    trace: function () {
        this.log("trace", Array.prototype.slice.call(arguments))
    },
    debug: function () {
        this.log("debug", Array.prototype.slice.call(arguments))
    },
    info: function () {
        this.log("info", Array.prototype.slice.call(arguments))
    },
    warn: function () {
        this.log("warn", Array.prototype.slice.call(arguments))
    },
    error: function () {
        this.log("error", Array.prototype.slice.call(arguments))
    },
    recordEvent: function (a) {
        this.log(a.level, [a.level, a.logger, a.message.join(" ")])
    }
});
Ext.define("NX.Log", {
    singleton: true,
    requires: ["NX.Console"],
    controller: undefined,
    eventQueue: [],
    attach: function (a) {
        var b = this;
        b.controller = a;
        Ext.each(b.eventQueue, function (c) {
            b.controller.recordEvent(c)
        });
        delete b.eventQueue
    },
    recordEvent: function (e, a, d) {
        var c = this, b = {timestamp: Date.now(), level: e, logger: a, message: d};
        if (c.controller) {
            c.controller.recordEvent(b)
        } else {
            c.eventQueue.push(b);
            NX.Console.recordEvent(b)
        }
    }
});
Ext.define("NX.LogAware", {
    requires: ["NX.Log"], log: function (b, a) {
    }, logTrace: function () {
    }, logDebug: function () {
    }, logInfo: function () {
    }, logWarn: function () {
    }, logError: function () {
    }
});
Ext.define("NX.I18n", {
    singleton: true, mixins: {logAware: "NX.LogAware"}, keys: {}, bundles: {}, register: function (a) {
        Ext.apply(this.keys, a.keys);
        Ext.apply(this.bundles, a.bundles)
    }, get: function (a) {
        var b = this.keys[a];
        if (b === null || b === undefined) {
            this.logWarn("Missing I18n key:", a);
            return "MISSING_I18N:" + a
        }
        if (b.charAt(0) === "@") {
            return this.get(b.substring(1, b.length))
        } else {
            return b
        }
    }, format: function (a) {
        var c = this.get(a);
        if (c) {
            var b = Array.prototype.slice.call(arguments);
            b.shift();
            b.unshift(c);
            c = Ext.String.format.apply(this, b)
        }
        return c
    }, render: function (a, c) {
        var d, f, e;
        if (Ext.isObject(a)) {
            a = Ext.getClassName(a)
        }
        d = this.bundles[a];
        if (d === undefined) {
            this.logWarn("Missing I18n bundle:", a);
            return "MISSING_I18N:" + a + ":" + c
        }
        f = d[c];
        if (f === undefined) {
            var g = d["$extend"];
            if (g !== undefined) {
                e = Array.prototype.slice.call(arguments, 1);
                e.unshift(g);
                return this.render.apply(this, e)
            }
            this.logWarn("Missing I18n bundle key:", a, ":", c);
            return "MISSING_I18N:" + a + ":" + c
        }
        if (f.charAt(0) === "@") {
            if (f.indexOf(":") !== -1) {
                var b = f.substring(1, f.length).split(":", 2);
                if (b[1] === "") {
                    b[1] = c
                }
                e = Array.prototype.slice.call(arguments, 2);
                e.unshift(b[1]);
                e.unshift(b[0]);
                return this.render.apply(this, e)
            } else {
                f = this.get(f.substring(1, f.length))
            }
        }
        if (arguments.length > 2) {
            e = Array.prototype.slice.call(arguments, 2);
            e.unshift(f);
            f = Ext.String.format.apply(this, e)
        }
        return f
    }
});
Ext.define("NX.app.PluginStrings", {
    "@aggregate_priority": 90, singleton: true, requires: ["NX.I18n"], keys: {
        Button_Back: "Back",
        Button_Cancel: "Cancel",
        Button_Close: "Close",
        Button_Create: "Create",
        Button_Discard: "Discard",
        Button_Next: "Next",
        Button_Save: "Save",
        Column_No_Data: "No data",
        Header_Panel_Logo_Text: "Sonatype Nexus Repository Manager",
        Header_BrowseMode_Title: "Browse",
        Header_BrowseMode_Tooltip: "Browse server contents",
        Header_AdminMode_Title: "Administration",
        Header_AdminMode_Tooltip: "Server administration and configuration",
        Header_Health_Tooltip: "System Status",
        Header_QuickSearch_Empty: "Search components",
        Header_QuickSearch_Tooltip: "Quick component keyword search",
        Header_Refresh_Tooltip: "Refresh current view and data",
        Refresh_Message: "Refreshed",
        Header_UserMode_Title: "User",
        User_Tooltip: "Hi, {0}. Manage your user account.",
        Header_SignIn_Text: "Sign in",
        Header_SignIn_Tooltip: "Sign in",
        Header_SignOut_Text: "Sign out",
        Header_SignOut_Tooltip: "Sign out",
        Header_Help_Tooltip: "Help",
        Help_Feature_Text: "Help for: ",
        Header_Help_Feature_Tooltip: "Help and documentation for the currently selected feature",
        Header_Help_About_Text: "About",
        Header_Help_About_Tooltip: "About Nexus Repository Manager",
        Header_Help_Documentation_Text: "Documentation",
        Header_Help_Documentation_Tooltip: "Product documentation",
        Header_Help_KB_Text: "Knowledge base",
        Header_Help_KB_Tooltip: "Knowledge base",
        Header_Help_Guides_Text: "Sonatype guides",
        Header_Help_Guides_Tooltip: "Sonatype guides",
        Header_Help_Community_Text: "Community",
        Header_Help_Community_Tooltip: "Community information",
        Header_Help_Issues_Text: "Issue tracker",
        Header_Help_Issues_Tooltip: "Issue and bug tracker",
        Header_Help_Support_Text: "Support",
        Header_Help_Support_Tooltip: "Product support",
        Footer_Panel_HTML: "Copyright &copy; 2008-present, Sonatype Inc. All rights reserved.",
        SignIn_Title: "Sign In",
        User_SignIn_Mask: "Signing in&hellip;",
        SignIn_Username_Empty: "Username",
        SignIn_Password_Empty: "Password",
        SignIn_Submit_Button: "Sign in",
        SignIn_Cancel_Button: "@Button_Cancel",
        Grid_Plugin_FilterBox_Empty: "Filter",
        Dialogs_Info_Title: "Information",
        Dialogs_Error_Title: "Error",
        Dialogs_Error_Message: "Operation failed",
        Add_Submit_Button: "@Button_Create",
        Add_Cancel_Button: "@Button_Cancel",
        ChangeOrderWindow_Submit_Button: "@Button_Save",
        ChangeOrderWindow_Cancel_Button: "@Button_Cancel",
        User_ConnectFailure_Message: "Operation failed as server could not be contacted",
        State_Reconnected_Message: "Server reconnected",
        State_Disconnected_Message: "Server disconnected",
        UiSessionTimeout_Expire_Message: "Session is about to expire",
        UiSessionTimeout_Expired_Message: "Session expired after being inactive for {0} minutes",
        User_SignedIn_Message: "User signed in: {0}",
        User_SignedOut_Message: "User signed out",
        User_Credentials_Message: "Incorrect username or password, or no permission to use the application.",
        Util_DownloadHelper_Download_Message: "Download initiated",
        Windows_Popup_Message: "Window pop-up was blocked!",
        State_Installed_Message: "License installed",
        State_Uninstalled_Message: "License uninstalled",
        State_License_Expiry: 'Your license will expire in {0} days. <a href="http://links.sonatype.com/products/nexus/pro/store">Contact us to renew.</a>',
        State_License_Expired: 'Your license has expired. <a href="http://links.sonatype.com/products/nexus/pro/store">Contact us to renew.</a>',
        State_License_Invalid_Message: "Your license has been detected as missing or invalid. Upload a valid license to proceed.",
        AboutWindow_Title: "About Nexus Repository Manager",
        AboutWindow_About_Title: "Copyright",
        AboutWindow_License_Tab: "License",
        Authenticate_Title: "Authenticate",
        Authenticate_Help_Text: "You have requested an operation which requires validation of your credentials.",
        User_Controller_Authenticate_Mask: "Authenticate&hellip;",
        User_View_Authenticate_Submit_Button: "Authenticate",
        User_Retrieving_Mask: "Retrieving authentication token&hellip;",
        Authenticate_Cancel_Button: "@Button_Cancel",
        ExpireSession_Title: "Session",
        ExpireSession_Help_Text: "Session is about to expire",
        UiSessionTimeout_Expire_Text: "Session will expire in {0} seconds",
        SignedOut_Text: "Your session has expired. Please sign in.",
        ExpireSession_Cancel_Button: "@Button_Cancel",
        ExpireSession_SignIn_Button: "Sign in",
        UnsavedChanges_Title: "Unsaved changes",
        UnsavedChanges_Help_HTML: "<p>Do you want to discard your changes?</p>",
        UnsavedChanges_Discard_Button: "Discard changes",
        UnsavedChanges_Back_Button: "Go back",
        Menu_Browser_Title: "You will lose your unsaved changes",
        UnsupportedBrowser_Title: "The browser you are using is not supported",
        UnsupportedBrowser_Alternatives_Text: "Below is a list of alternatives that are supported by this web application",
        UnsupportedBrowser_Continue_Button: "Ignore and continue",
        Feature_NotFoundPath_Text: 'Path "{0}" not found',
        Feature_NotFound_Text: "Path not found",
        SettingsForm_Save_Button: "@Button_Save",
        SettingsForm_Discard_Button: "@Button_Discard",
        Ldap_LdapServerConnectionAdd_Text: "@Button_Next",
        Form_Field_ItemSelector_Empty: "Filter",
        SettingsForm_Load_Message: "Loading",
        SettingsForm_Submit_Message: "Saving",
        Dashboard_Title: "Welcome",
        Dashboard_Description: "Learn about Sonatype Nexus Repository Manager",
        Util_Validator_Text: "Only letters, digits, underscores(_), hyphens(-), and dots(.) are allowed and may not start with underscore or dot.",
        Util_Validator_Hostname: "Hostname must be valid",
        Util_Validator_Trim: "A Role ID may not start or end with a space.",
        Util_Validator_Url: 'This field should be a URL in the format "http://www.example.com"',
        Wizard_Next: "@Button_Next",
        Wizard_Back: "@Button_Back",
        Wizard_Cancel: "@Button_Cancel",
        Wizard_Screen_Progress: "{0} of {1}",
        SearchBoxTip_ExactMatch: 'Use <b>""</b> for exact match - "example"',
        SearchBoxTip_Wildcard: "Use <b>*</b> or <b>?</b> for wildcards - ex?mpl*",
        SearchBoxTip_LearnMore: "Learn more...",
        DependencySnippetPanel_Title: "Usage",
        DependencySnippetPanel_Copy_Button_Tooltip: "Copy snippet to clipboard"
    }
}, function (a) {
    NX.I18n.register(a)
});
Ext.define("NX.app.PluginConfig", {
    "@aggregate_priority": 100,
    requires: ["NX.app.PluginStrings"],
    controllers: ["Content", "Dashboard", "Help", "Main", "Menu", "MenuGroup", "Refresh", "SettingsForm", "UiSessionTimeout", "User", {
        id: "Branding",
        active: true
    }, {
        id: "Unlicensed", active: function () {
            return NX.app.Application.supportedBrowser() && (NX.app.Application.unlicensed() || NX.app.Application.licenseExpired())
        }
    }, {
        id: "UnsupportedBrowser", active: function () {
            return NX.app.Application.unsupportedBrowser()
        }
    }, {
        id: "dev.Conditions", active: function () {
            return NX.app.Application.debugMode
        }
    }, {
        id: "dev.Developer", active: function () {
            return NX.app.Application.debugMode
        }
    }, {
        id: "dev.Permissions", active: function () {
            return NX.app.Application.debugMode
        }
    }, {
        id: "dev.Stores", active: function () {
            return NX.app.Application.debugMode
        }
    }, {
        id: "dev.Logging", active: function () {
            return NX.app.Application.debugMode
        }
    }]
});
Ext.define("NX.util.Validator", {
    singleton: true,
    requires: ["Ext.form.field.VTypes", "NX.I18n"],
    nxNameRegex: /^[a-zA-Z0-9\-]{1}[a-zA-Z0-9_\-\.]*$/,
    nxEmailRegex: /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,60}$/,
    nxRfc1123HostRegex: new RegExp("^(((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|(\\[(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\])|(\\[((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)\\])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9]))(:([0-9]+))?$"),
    nxUrlRegex: /^https?:\/\/[^"<>^`{|}]+$/i,
    nxLeadingAndTrailingWhiteSpaceRegex: /^[ \s]+|[ \s]+$/,
    registerVtype: function (a) {
        Ext.apply(Ext.form.field.VTypes, a)
    },
    constructor: function () {
        var a = this;
        a.vtypes = [{
            "nx-name": function (b) {
                return NX.util.Validator.nxNameRegex.test(b)
            }, "nx-nameText": NX.I18n.get("Util_Validator_Text"), "nx-email": function (b) {
                return NX.util.Validator.nxEmailRegex.test(b)
            }, "nx-emailText": Ext.form.field.VTypes.emailText, "nx-hostname": function (b) {
                return NX.util.Validator.nxRfc1123HostRegex.test(b)
            }, "nx-hostnameText": NX.I18n.get("Util_Validator_Hostname"), "nx-trim": function (b) {
                return !NX.util.Validator.nxLeadingAndTrailingWhiteSpaceRegex.test(b)
            }, "nx-trimText": NX.I18n.get("Util_Validator_Trim"), "nx-url": function (b) {
                return NX.util.Validator.nxUrlRegex.test(b)
            }, "nx-urlText": NX.I18n.get("Util_Validator_Url")
        }];
        Ext.each(a.vtypes, function (b) {
            a.registerVtype(b)
        })
    }
});
Ext.define("NX.ext.form.field.Url", {
    extend: "Ext.form.field.Text",
    alias: "widget.nx-url",
    requires: ["NX.util.Validator"],
    vtype: "nx-url",
    useTrustStore: function (a) {
        if (Ext.String.startsWith(a.getValue(), "https://")) {
            return {name: "useTrustStoreFor" + Ext.String.capitalize(a.getName()), url: a}
        }
        return undefined
    }
});
Ext.define("NX.util.DateFormat", {
    singleton: true,
    mixins: ["NX.LogAware"],
    defaultPatterns: {
        date: {"short": "Y-M-d", "long": "l, F d, Y"},
        time: {"short": "H:i:s", "long": "H:i:s T (\\G\\M\\TO)"},
        datetime: {"short": "Y-M-d H:i:s", "long": "l, F d, Y H:i:s T (\\G\\M\\TO)"}
    },
    forName: function (a) {
        var b = this.defaultPatterns[a];
        if (!a) {
            this.logWarn("Missing named format:", a);
            return "c"
        }
        return b
    },
    timestamp: function (a, b) {
        b = b || NX.util.DateFormat.forName("datetime")["long"];
        return a ? Ext.util.Format.date(new Date(a), b) : undefined
    },
    timestampRenderer: function (a) {
        return function (b) {
            return NX.util.DateFormat.timestamp(b, a)
        }
    },
    getTimeZone: function () {
        var a = this;
        if (!a.timeZone) {
            a.timeZone = new Date().toTimeString();
            a.timeZone = a.timeZone.substring(a.timeZone.indexOf(" "))
        }
        return a.timeZone
    }
});
Ext.define("NX.ext.grid.column.Column", {
    override: "Ext.grid.column.Column", toggleSortState: function () {
        var a = this.up("grid");
        if (a && a.allowClearSort && this.isSortable() && this.sortState === "DESC") {
            a.getStore().sorters.clear();
            a.getStore().load()
        } else {
            this.callParent()
        }
    }
});
Ext.define("NX.wizard.Screen", {
    extend: "Ext.container.Container",
    alias: "widget.nx-wizard-screen",
    requires: ["NX.I18n"],
    mixins: {logAware: "NX.LogAware"},
    config: {title: undefined, description: undefined, buttons: undefined, fields: undefined},
    layout: "fit",
    initComponent: function () {
        var c = this, a = [], b = [];
        if (c.description) {
            a.push({xtype: "container", itemId: "description", html: c.description})
        }
        if (c.fields) {
            Ext.Array.push(a, c.fields)
        }
        if (c.buttons) {
            Ext.Array.each(c.buttons, function (d) {
                if (d === "next") {
                    b.push({text: NX.I18n.get("Wizard_Next"), action: "next", ui: "nx-primary", formBind: true})
                } else {
                    if (d === "back") {
                        b.push({text: NX.I18n.get("Wizard_Back"), action: "back", ui: "default"})
                    } else {
                        if (d === "cancel") {
                            b.push({text: NX.I18n.get("Wizard_Cancel"), action: "cancel", ui: "default"})
                        } else {
                            if (d === "->") {
                                b.push(d)
                            } else {
                                if (Ext.isObject(d)) {
                                    b.push(d)
                                } else {
                                    c.logWarn("Invalid button:", d)
                                }
                            }
                        }
                    }
                }
            })
        }
        Ext.apply(c, {items: {xtype: "form", itemId: "fields", items: a, buttonAlign: "left", buttons: b}});
        c.callParent(arguments)
    },
    getDescriptionContainer: function () {
        return this.down("#description")
    },
    getButtonsContainer: function () {
        return this.down("form").getDockedItems('toolbar[dock="bottom"]')[0]
    }
});
Ext.define("NX.wizard.FormScreen", {
    extend: "NX.wizard.Screen",
    alias: "widget.nx-wizard-formscreen",
    getForm: function () {
        return this.down("form").getForm()
    }
});
Ext.define("NX.app.Controller", {
    extend: "Ext.app.Controller",
    mixins: {logAware: "NX.LogAware"},
    onDestroy: undefined,
    destroy: undefined
});
Ext.define("NX.view.header.SignOut", {
    extend: "Ext.button.Button",
    alias: "widget.nx-header-signout",
    requires: ["NX.I18n"],
    iconCls: "x-fa fa-sign-out-alt",
    initComponent: function () {
        Ext.apply(this, {
            text: NX.I18n.get("Header_SignOut_Text"),
            tooltip: NX.I18n.get("Header_SignOut_Tooltip"),
            hidden: true
        });
        this.callParent()
    }
});
Ext.define("NX.util.Utf8", {
    singleton: true, encode: function (b) {
        var a = "", e, d;
        b = b.replace(/\r\n/g, "\n");
        for (d = 0; d < b.length; d++) {
            e = b.charCodeAt(d);
            if (e < 128) {
                a += String.fromCharCode(e)
            } else {
                if ((e > 127) && (e < 2048)) {
                    a += String.fromCharCode((e >> 6) | 192);
                    a += String.fromCharCode((e & 63) | 128)
                } else {
                    a += String.fromCharCode((e >> 12) | 224);
                    a += String.fromCharCode(((e >> 6) & 63) | 128);
                    a += String.fromCharCode((e & 63) | 128)
                }
            }
        }
        return a
    }, decode: function (a) {
        var d = "", f = 0, g = 0, e = 0, b = 0;
        while (f < a.length) {
            g = a.charCodeAt(f);
            if (g < 128) {
                d += String.fromCharCode(g);
                f++
            } else {
                if ((g > 191) && (g < 224)) {
                    e = a.charCodeAt(f + 1);
                    d += String.fromCharCode(((g & 31) << 6) | (e & 63));
                    f += 2
                } else {
                    e = a.charCodeAt(f + 1);
                    b = a.charCodeAt(f + 2);
                    d += String.fromCharCode(((g & 15) << 12) | ((e & 63) << 6) | (b & 63));
                    f += 3
                }
            }
        }
        return d
    }
});
Ext.define("NX.util.Base64", {
    singleton: true,
    requires: ["NX.util.Utf8"],
    keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (c) {
        var a = "", k, h, f, j, g, e, d, b = 0;
        c = NX.util.Utf8.encode(c);
        while (b < c.length) {
            k = c.charCodeAt(b++);
            h = c.charCodeAt(b++);
            f = c.charCodeAt(b++);
            j = k >> 2;
            g = ((k & 3) << 4) | (h >> 4);
            e = ((h & 15) << 2) | (f >> 6);
            d = f & 63;
            if (isNaN(h)) {
                e = d = 64
            } else {
                if (isNaN(f)) {
                    d = 64
                }
            }
            a = a + this.keyStr.charAt(j) + this.keyStr.charAt(g) + this.keyStr.charAt(e) + this.keyStr.charAt(d)
        }
        return a
    },
    decode: function (c) {
        var a = "";
        var k, h, f;
        var j, g, e, d;
        var b = 0;
        c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (b < c.length) {
            j = this.keyStr.indexOf(c.charAt(b++));
            g = this.keyStr.indexOf(c.charAt(b++));
            e = this.keyStr.indexOf(c.charAt(b++));
            d = this.keyStr.indexOf(c.charAt(b++));
            k = (j << 2) | (g >> 4);
            h = ((g & 15) << 4) | (e >> 2);
            f = ((e & 3) << 6) | d;
            a = a + String.fromCharCode(k);
            if (e !== 64) {
                a = a + String.fromCharCode(h)
            }
            if (d !== 64) {
                a = a + String.fromCharCode(f)
            }
        }
        a = NX.util.Utf8.decode(a);
        return a
    }
});
Ext.define("NX.view.header.Mode", {
    extend: "Ext.container.Container",
    alias: "widget.nx-header-mode",
    config: {
        name: undefined,
        title: undefined,
        text: undefined,
        tooltip: undefined,
        iconCls: undefined,
        autoHide: false,
        collapseMenu: false
    },
    publishes: {text: true, tooltip: true},
    initComponent: function () {
        var a = this;
        a.setViewModel({data: {text: a.getText(), tooltip: a.getTooltip()}});
        Ext.apply(a, {
            items: [{
                xtype: "button",
                ui: "nx-mode",
                cls: "nx-modebutton",
                scale: "medium",
                minWidth: 49,
                toggleGroup: "mode",
                allowDepress: false,
                handler: function (b) {
                    a.fireEvent("selected", a)
                },
                iconCls: a.iconCls,
                autoEl: {tag: "a", hidefocus: "on", unselectable: "on", "data-name": a.name},
                bind: {text: "{text:htmlEncode}", tooltip: "{tooltip:htmlEncode}"},
                ariaLabel: Ext.String.htmlEncode(a.text ? a.text : a.title)
            }]
        });
        a.callParent()
    },
    toggle: function (b, a) {
        this.down("button").toggle(b, a)
    }
});
Ext.define("NX.State", {
    singleton: true,
    requires: ["Ext.Version"],
    mixins: {observable: "Ext.util.Observable", logAware: "NX.LogAware"},
    constructor: function (a) {
        var b = this;
        b.mixins.observable.constructor.call(b, a)
    },
    isBrowserSupported: function () {
        return this.getValue("browserSupported") === true
    },
    setBrowserSupported: function (a) {
        this.setValue("browserSupported", a === true)
    },
    requiresLicense: function () {
        return this.getValue("license", {})["required"] === true
    },
    isLicenseInstalled: function () {
        return this.getValue("license", {})["installed"] === true
    },
    isLicenseValid: function () {
        return this.isLicenseInstalled() && this.getValue("license", {})["valid"] === true
    },
    getDaysToLicenseExpiry: function () {
        return this.getValue("license", {})["daysToExpiry"]
    },
    hasFeature: function (a) {
        var b = this.getValue("license", {})["features"];
        if (b) {
            return b.indexOf(a) !== -1
        }
        return false
    },
    getUser: function () {
        return this.getValue("user")
    },
    setUser: function (a) {
        this.setValue("user", a)
    },
    getVersion: function () {
        return this.getValue("status")["version"]
    },
    getVersionMajorMinor: function () {
        var a = Ext.create("Ext.Version", this.getVersion());
        return a.getMajor() + "." + a.getMinor()
    },
    getEdition: function () {
        return this.getValue("status")["edition"]
    },
    getBrandedEditionAndVersion: function () {
        var b = this.getEdition(), a = this.getVersion();
        return b + " " + a
    },
    getBuildRevision: function () {
        return this.getValue("status")["buildRevision"]
    },
    getBuildTimestamp: function () {
        return this.getValue("status")["buildTimestamp"]
    },
    isReceiving: function () {
        return this.getValue("receiving")
    },
    isClustered: function () {
        return NX.app.Application.bundleActive("com.sonatype.nexus.plugins.nexus-hazelcast-plugin") && this.getValue("nodes", {})["enabled"]
    },
    getValue: function (b, a) {
        return this.controller().getValue(b, a)
    },
    setValue: function (a, b) {
        this.controller().setValue(a, b)
    },
    setValues: function (a) {
        this.controller().setValues(a)
    },
    refreshNow: function () {
        this.controller().refreshNow()
    },
    controller: function () {
        return NX.getApplication().getStateController()
    }
});
Ext.define("NX.util.Window", {
    singleton: true, requires: ["Ext.ComponentQuery"], closeWindows: function () {
        var a = Ext.ComponentQuery.query("window");
        Ext.each(a, function (b) {
            b.close && b.rendered && b.close()
        })
    }
});
Ext.define("NX.view.header.SignIn", {
    extend: "Ext.button.Button",
    alias: "widget.nx-header-signin",
    requires: ["NX.I18n"],
    iconCls: "x-fa fa-sign-in-alt",
    initComponent: function () {
        Ext.apply(this, {text: NX.I18n.get("Header_SignIn_Text"), tooltip: NX.I18n.get("Header_SignIn_Tooltip")});
        this.callParent()
    }
});
Ext.define("NX.view.ModalDialog", {
    extend: "Ext.window.Window",
    alias: "widget.nx-modal-dialog",
    layout: "fit",
    autoShow: true,
    modal: true,
    constrain: true,
    closable: true,
    resizable: false,
    statics: {SMALL_MODAL: 320, MEDIUM_MODAL: 480, LARGE_MODAL: 700},
    onHide: function () {
        var b = this, a;
        b.callParent(arguments);
        a = Ext.dom.Element.getActiveElement(true);
        if (a) {
            a.blur()
        }
    }
});
Ext.define("NX.view.SignIn", {
    extend: "NX.view.ModalDialog", alias: "widget.nx-signin", requires: ["NX.I18n"], initComponent: function () {
        var a = this;
        a.ui = "nx-inset";
        a.title = NX.I18n.get("SignIn_Title");
        a.setWidth(NX.view.ModalDialog.SMALL_MODAL);
        Ext.apply(a, {
            items: {
                xtype: "form",
                defaultType: "textfield",
                defaults: {anchor: "100%"},
                items: [{
                    name: "username",
                    itemId: "username",
                    emptyText: NX.I18n.get("SignIn_Username_Empty"),
                    allowBlank: false,
                    validateOnBlur: false
                }, {
                    name: "password",
                    itemId: "password",
                    inputType: "password",
                    emptyText: NX.I18n.get("SignIn_Password_Empty"),
                    allowBlank: false,
                    validateOnBlur: false
                }],
                buttonAlign: "left",
                buttons: [{
                    text: NX.I18n.get("SignIn_Submit_Button"),
                    action: "signin",
                    formBind: true,
                    bindToEnter: true,
                    ui: "nx-primary"
                }, {text: NX.I18n.get("SignIn_Cancel_Button"), handler: a.close, scope: a}]
            }
        });
        a.on({
            resize: function () {
                a.down("#username").focus()
            }, single: true
        });
        a.callParent()
    }, addMessage: function (b) {
        var a = this, d = '<div id="signin-message">' + b + "</div><br>", c = a.down("#signinMessage");
        if (c) {
            c.html(d)
        } else {
            a.down("form").insert(0, {xtype: "component", itemId: "signinMessage", html: d})
        }
    }, clearMessage: function () {
        var a = this, b = a.down("#signinMessage");
        if (b) {
            a.down("form").remove(b)
        }
    }
});
Ext.define("NX.util.Url", {
    singleton: true,
    requires: ["Ext.String"],
    baseUrl: NX.app.baseUrl,
    relativePath: NX.app.relativePath,
    urlSuffix: NX.app.urlSuffix,
    urlOf: function (b) {
        var a = this.relativePath;
        if (!Ext.isEmpty(b)) {
            if (Ext.String.endsWith(a, "/")) {
                a = a.substring(0, a.length - 1)
            }
            if (!Ext.String.startsWith(b, "/")) {
                b = "/" + b
            }
            return a + b
        }
        return this.baseUrl
    },
    licenseUrl: function () {
        var a = NX.State.getEdition();
        if ("EVAL" === a || "OSS" === a) {
            return NX.util.Url.urlOf("/OSS-LICENSE.html")
        } else {
            return NX.util.Url.urlOf("/PRO-LICENSE.html")
        }
    },
    asLink: function (a, c, b, d) {
        b = b || "_blank";
        if (Ext.isEmpty(c)) {
            c = a
        }
        if (d) {
            d = ' id="' + d + '"'
        } else {
            d = ""
        }
        return '<a href="' + a + '" target="' + b + '"' + d + ' rel="noopener">' + Ext.htmlEncode(c) + "</a>"
    },
    asCopyWidget: function (a) {
        return "<button onclick=\"Ext.widget('nx-copywindow', { copyText: '" + a + '\' });" title="' + a + '"><i class="fa fa-clipboard"></i> copy</button>'
    },
    cacheBustingUrl: function (a) {
        return a + "?" + this.urlSuffix
    }
});
Ext.define("NX.Icons", {
    singleton: true,
    requires: ["Ext.DomHelper", "NX.util.Url"],
    mixins: {logAware: "NX.LogAware"},
    cls: function (b, c) {
        var a = "nx-icon-" + b.replace(".", "_");
        if (c) {
            a += "-" + c
        }
        return a
    },
    img: function (a, b) {
        return Ext.DomHelper.markup({
            tag: "img",
            src: Ext.BLANK_IMAGE_URL,
            cls: this.cls(a, b),
            alt: a,
            "aria-hidden": true
        })
    },
    url: function (a, c, d) {
        var b = a;
        if (d === undefined) {
            d = "png"
        }
        b += "." + d;
        return this.url2(b, c)
    },
    url2: function (c, b) {
        var a = NX.util.Url.relativePath + "/static/rapture/resources/icons/";
        if (b) {
            a += b + "/"
        }
        a += c;
        return NX.util.Url.cacheBustingUrl(a)
    }
});
Ext.define("NX.view.Authenticate", {
    extend: "NX.view.ModalDialog",
    alias: "widget.nx-authenticate",
    requires: ["NX.Icons", "NX.I18n"],
    cls: "nx-authenticate",
    message: undefined,
    initComponent: function () {
        var a = this;
        a.ui = "nx-inset";
        a.title = NX.I18n.get("Authenticate_Title");
        a.setWidth(NX.view.ModalDialog.MEDIUM_MODAL);
        if (!a.message) {
            a.message = NX.I18n.get("Authenticate_Help_Text")
        }
        Ext.apply(this, {
            closable: false,
            items: {
                xtype: "form",
                defaultType: "textfield",
                defaults: {anchor: "100%"},
                items: [{
                    xtype: "container",
                    layout: "hbox",
                    cls: "message",
                    items: [{xtype: "component", html: NX.Icons.img("authenticate", "x32")}, {
                        xtype: "label",
                        height: 48,
                        html: "<div>" + a.message + "</div>"
                    }]
                }, {
                    name: "username",
                    itemId: "username",
                    emptyText: NX.I18n.get("SignIn_Username_Empty"),
                    allowBlank: false,
                    readOnly: true
                }, {
                    name: "password",
                    itemId: "password",
                    inputType: "password",
                    emptyText: NX.I18n.get("SignIn_Password_Empty"),
                    allowBlank: false,
                    validateOnBlur: false
                }],
                buttonAlign: "left",
                buttons: [{
                    text: NX.I18n.get("User_View_Authenticate_Submit_Button"),
                    action: "authenticate",
                    formBind: true,
                    bindToEnter: true,
                    ui: "nx-primary"
                }, {
                    text: NX.I18n.get("Authenticate_Cancel_Button"), handler: function () {
                        if (!!a.options && Ext.isFunction(a.options.failure)) {
                            a.options.failure.call(a.options.failure, a.options)
                        }
                        a.close()
                    }, scope: a
                }]
            }
        });
        a.on({
            resize: function () {
                a.down("#password").focus()
            }, single: true
        });
        a.callParent()
    }
});
Ext.define("NX.view.ExpireSession", {
    extend: "NX.view.ModalDialog",
    requires: ["NX.I18n"],
    alias: "widget.nx-expire-session",
    cls: "nx-expire-session",
    initComponent: function () {
        var a = this;
        a.title = NX.I18n.get("ExpireSession_Title");
        a.setWidth(NX.view.ModalDialog.MEDIUM_MODAL);
        Ext.apply(a, {
            items: [{xtype: "label", id: "expire", text: NX.I18n.get("ExpireSession_Help_Text")}],
            buttonAlign: "left",
            buttons: [{
                text: NX.I18n.get("ExpireSession_Cancel_Button"),
                action: "cancel"
            }, {
                text: NX.I18n.get("ExpireSession_SignIn_Button"),
                action: "signin",
                hidden: true,
                itemId: "expiredSignIn",
                ui: "nx-primary",
                handler: function () {
                    this.up("nx-expire-session").close()
                }
            }, {
                text: NX.I18n.get("Button_Close"), action: "close", hidden: true, handler: function () {
                    this.up("nx-expire-session").close()
                }
            }]
        });
        a.callParent()
    },
    sessionExpired: function () {
        return this.down("#expiredSignIn").isVisible()
    }
});
Ext.define("NX.Messages", {
    singleton: true, requires: ["NX.State"], info: function (a) {
        this.toast(a, "info", "fa-info")
    }, success: function (a) {
        this.toast(a, "success", "fa-check-circle")
    }, warning: function (a) {
        this.toast(a, "warning", "fa-exclamation-circle")
    }, error: function (a) {
        this.toast(a, "error", "fa-exclamation-triangle")
    }, toast: function (c, b, a) {
        Ext.toast({
            baseCls: b,
            html: '<div role="presentation" class="icon x-fa ' + a + '"></div><div class="text">' + Ext.htmlEncode(c) + '</div><div class="dismiss"><a aria-label="Dismiss" href="javascript:;" onclick="Ext.getCmp(this.closest(\'.x-toast\').id).close()"><i class="fa fa-times-circle"></i></a></div>',
            align: "tr",
            anchor: Ext.ComponentQuery.query("nx-feature-content")[0],
            stickOnClick: true,
            minWidth: 150,
            maxWidth: 400,
            autoCloseDelay: NX.State.getValue("messageDuration", 5000),
            slideInDuration: NX.State.getValue("animateDuration", 800),
            slideBackDuration: NX.State.getValue("animateDuration", 500),
            hideDuration: NX.State.getValue("animateDuration", 500),
            slideInAnimation: "elasticIn",
            slideBackAnimation: "elasticIn",
            ariaRole: "alert"
        })
    }
});
Ext.define("NX.controller.User", {
    extend: "NX.app.Controller",
    requires: ["NX.util.Base64", "NX.Messages", "NX.State", "NX.I18n", "NX.view.header.Mode", "NX.util.Window", "Ext.Deferred", "Ext.Array"],
    views: ["header.SignIn", "header.SignOut", "Authenticate", "SignIn", "ExpireSession"],
    refs: [{ref: "signInButton", selector: "nx-header-signin"}, {
        ref: "signOutButton",
        selector: "nx-header-signout"
    }, {ref: "userMode", selector: "nx-header-mode[name=user]"}, {
        ref: "signIn",
        selector: "nx-signin"
    }, {ref: "authenticate", selector: "nx-authenticate"}],
    init: function () {
        var a = this;
        a.getApplication().getIconController().addIcons({authenticate: {file: "lock.png", variants: ["x16", "x32"]}});
        a.listen({
            controller: {"#State": {userchanged: a.onUserChanged}},
            component: {
                "nx-header-panel": {afterrender: a.manageButtons},
                // "nx-header-signin": {click: a.askToAuthenticate},
                "nx-expire-session button[action=signin]": {click: a.askToAuthenticate},
                // "nx-header-signout": {click: a.onClickSignOut},
                "nx-signin button[action=signin]": {click: a.signIn},
                "nx-authenticate button[action=authenticate]": {click: a.doAuthenticateAction}
            }
        })
    },
    onUserChanged: function (a, b) {
        var c = this;
        if (a && !b) {
            NX.Messages.info(NX.I18n.format("User_SignedIn_Message", a.id));
            c.fireEvent("signin", a)
        } else {
            if (!a && b) {
                NX.Messages.info(NX.I18n.get("User_SignedOut_Message"));
                c.fireEvent("signout")
            }
        }
        if (!a) {
            NX.util.Window.closeWindows()
        }
        c.manageButtons()
    },
    hasUser: function () {
        return Ext.isDefined(NX.State.getUser())
    },
    askToAuthenticate: function (f, d) {
        var e = this, c = null, a = NX.State.getUser(), b = [];
        e.fireEvent("authRequest", b);
        Ext.Deferred.all(b).then(function (g) {
            if (Ext.isArray(g)) {
                c = Ext.Array.findBy(g, function (h) {
                    return Ext.isObject(h)
                })
            }
        }, function () {
            a = null;
            c = null
        }).always(function () {
            function g() {
                e.showSignInWindow(d)
            }

            if (c) {
                NX.State.setUser(c)
            } else {
                if (a) {
                    if (e.fireEvent("beforereauthenticate") !== false) {
                        e.showAuthenticateWindow(f, Ext.apply(d || {}, {authenticateAction: e.authenticate}), a)
                    }
                } else {
                    if (e.fireEvent("beforeauthenticate", g) !== false) {
                        g()
                    }
                }
            }
        })
    },
    doWithAuthenticationToken: function (e, b) {
        var d = this, c = null, a = [];
        d.fireEvent("authTokenRequest", a, e);
        Ext.Deferred.all(a).then(function (f) {
            if (Ext.isArray(f)) {
                c = Ext.Array.findBy(f, function (g) {
                    return !!g
                })
            }
        }, function () {
            c = "cancel"
        }).always(function () {
            if (c !== "cancel") {
                if (!c) {
                    b = Ext.apply(b || {}, {authenticateAction: d.retrieveAuthenticationToken});
                    d.showAuthenticateWindow(e, b)
                } else {
                    if (Ext.isFunction(b.success)) {
                        b.success.call(b.scope, c, b)
                    }
                }
            } else {
                if (Ext.isFunction(b.failure)) {
                    b.failure.call(b.failure, b)
                }
            }
        })
    },
    showSignInWindow: function (a) {
        var b = this;
        if (!b.getSignIn()) {
            b.getSignInView().create({options: a})
        }
    },
    showAuthenticateWindow: function (d, b, a) {
        var c = this, f = a ? a.id : (NX.State.getUser().id || null), e;
        if (!c.getAuthenticate()) {
            e = c.getAuthenticateView().create({message: d, options: b});
            if (f) {
                e.down("form").getForm().setValues({username: f});
                e.down("#password").focus()
            }
        } else {
            if (Ext.isFunction(b.failure)) {
                b.failure.call(b.failure, b)
            }
        }
    },
    signIn: function (b) {
        var e = this, g = b.up("window"), d = b.up("form"), a = d.getValues(), c = NX.util.Base64.encode(a.username),
            f = NX.util.Base64.encode(a.password);
        g.getEl().mask(NX.I18n.get("User_SignIn_Mask"));
        e.doSignIn(c, f, a, b)
    },
    doAuthenticateAction: function (a) {
        var b = a.up("window");
        if (b.options && Ext.isFunction(b.options.authenticateAction)) {
            b.options.authenticateAction.call(this, a)
        }
    },
    doSignIn: function (c, e, a, b) {
        var d = this, f = b.up("window");
        Ext.Ajax.request({
            url: NX.util.Url.urlOf("service/rapture/session"),
            method: "POST",
            params: {username: c, password: e},
            scope: d,
            suppressStatus: true,
            success: function () {
                f.getEl().unmask();
                NX.State.setUser({id: a.username});
                f.close();
                if (f.options && Ext.isFunction(f.options.success)) {
                    f.options.success.call(f.options.scope, f.options)
                }
            },
            failure: function (g) {
                var h = NX.I18n.get("User_Credentials_Message");
                if (g.status === 0) {
                    h = NX.I18n.get("User_ConnectFailure_Message")
                }
                f.getEl().unmask();
                NX.Messages.warning(h)
            }
        })
    },
    authenticate: function (c) {
        var f = this, h = c.up("window"), e = c.up("form"), b = NX.State.getUser(),
            a = Ext.applyIf(e.getValues(), {username: b ? b.id : undefined}), d = NX.util.Base64.encode(a.username),
            g = NX.util.Base64.encode(a.password);
        h.getEl().mask(NX.I18n.get("User_Controller_Authenticate_Mask"));
        f.doSignIn(d, g, a, c)
    },
    retrieveAuthenticationToken: function (c) {
        var g = c.up("window"), e = c.up("form"), b = NX.State.getUser(),
            a = Ext.applyIf(e.getValues(), {username: b ? b.id : undefined}), d = NX.util.Base64.encode(a.username),
            f = NX.util.Base64.encode(a.password);
        g.getEl().mask(NX.I18n.get("User_Retrieving_Mask"));
        NX.direct.rapture_Security.authenticationToken(d, f, function (h) {
            g.getEl().unmask();
            if (Ext.isObject(h) && h.success) {
                g.close();
                if (g.options && Ext.isFunction(g.options.success)) {
                    g.options.success.call(g.options.scope, h.data, g.options)
                }
            }
        })
    },
    onClickSignOut: function () {
        var a = this;
        if (a.fireEvent("beforesignout")) {
            a.signOut()
        }
    },
    signOut: function () {
        var a = this;
        a.logDebug("Sign-out");
        Ext.Ajax.request({
            url: NX.util.Url.urlOf("service/rapture/session"),
            method: "DELETE",
            scope: a,
            suppressStatus: true,
            success: function () {
                NX.State.setUser(undefined)
            }
        })
    },
    manageButtons: function () {
        var e = this, c = NX.State.getUser(), d = e.getSignInButton(), a = e.getSignOutButton(), b = e.getUserMode();
        if (d) {
            if (c) {
                d.hide();
                b.show();
                b.getViewModel().set("text", c.id);
                b.getViewModel().set("tooltip", NX.I18n.format("User_Tooltip", c.id));
                a && a.show()
            } else {
                d.show();
                b.hide();
                a && a.hide()
            }
        }
    }
});
Ext.define("NX.Security", {
    singleton: true, requires: ["NX.controller.User"], controller: function () {
        return NX.getApplication().getController("User")
    }, hasUser: function () {
        var a = this;
        if (a.controller()) {
            return a.controller().hasUser()
        }
    }, askToAuthenticate: function (c, a) {
        var b = this;
        if (b.controller()) {
            b.controller().askToAuthenticate(c, a)
        }
    }, doWithAuthenticationToken: function (c, a) {
        var b = this;
        if (b.controller()) {
            b.controller().doWithAuthenticationToken(c, a)
        }
    }, signOut: function () {
        var a = this;
        if (a.controller()) {
            a.controller().signOut()
        }
    }
});
Ext.define("NX.controller.ExtDirect", {
    extend: "NX.app.Controller",
    requires: ["NX.Security", "NX.Messages", "NX.I18n"],
    init: function () {
        var a = this;
        a.listen({direct: {"*": {beforecallback: a.checkResponse}}})
    },
    checkResponse: function (e, d, b) {
        var a = d.result, c;
        if (b && b.callbackOptions && b.callbackOptions.skipResultCheck) {
            return
        }
        if (Ext.isDefined(a)) {
            if (Ext.isDefined(a.success) && a.success === false) {
                if (Ext.isDefined(a.authenticationRequired) && a.authenticationRequired === true) {
                    c = a.message;
                    NX.Security.askToAuthenticate()
                } else {
                    if (Ext.isDefined(a.message)) {
                        c = a.message
                    } else {
                        if (Ext.isDefined(a.messages)) {
                            c = Ext.Array.from(a.messages).join("<br/>")
                        }
                    }
                }
            }
            if (Ext.isDefined(d.serverException)) {
                c = d.serverException.exception.message
            }
        } else {
            c = NX.I18n.get("User_ConnectFailure_Message")
        }
        if (c) {
            if ((a && a.success)) {
                NX.Messages.warning(c)
            } else {
                NX.Messages.error(c)
            }
        }
    }
});
Ext.define("NX.model.LogEvent", {
    extend: "Ext.data.Model",
    fields: [{name: "timestamp", type: "int"}, {name: "logger", type: "string"}, {
        name: "level",
        type: "string"
    }, {name: "message"}],
    identifier: "sequential"
});
Ext.define("NX.store.LogEvent", {extend: "Ext.data.ArrayStore", model: "NX.model.LogEvent"});
Ext.define("NX.view.dashboard.Welcome", {
    extend: "Ext.container.Container",
    alias: "widget.nx-dashboard-welcome",
    requires: ["NX.Icons"],
    cls: "nx-iframe-full",
    width: "100%",
    layout: "fit"
});
Ext.define("NX.util.log.Sink", {
    mixins: {stateful: "Ext.state.Stateful", logAware: "NX.LogAware"},
    enabled: true,
    constructor: function () {
        this.mixins.stateful.constructor.call(this, {stateful: true, stateId: this.self.getName()});
        this.callParent(arguments);
        this.initState()
    },
    getState: function () {
        return {enabled: this.enabled}
    },
    setEnabled: function (a) {
        this.enabled = a;
        this.saveState()
    },
    receive: function (a) {
        throw"abstract-method"
    }
});
Ext.define("NX.Assert", {
    singleton: true, requires: ["NX.Console"], disable: false, assert: function () {
    }
});
Ext.define("NX.util.log.StoreSink", {
    extend: "NX.util.log.Sink",
    requires: ["NX.Assert"],
    store: undefined,
    maxSize: 200,
    constructor: function (a) {
        this.store = a;
        this.callParent(arguments)
    },
    getState: function () {
        return Ext.apply(this.callParent(), {maxSize: this.maxSize})
    },
    setMaxSize: function (a) {
        this.maxSize = a;
        this.logDebug("Max size:", a);
        this.saveState()
    },
    records: [],
    receive: function (b) {
        var a = this.store.add(b)[0];
        this.shrink();
        this.records.push(a)
    },
    shrink: function () {
        var a = this.records.length - this.maxSize;
        if (a > 0) {
            var b = this.records.splice(0, a);
            this.store.remove(b)
        }
    }
});
Ext.define("NX.view.header.Help", {
    extend: "Ext.button.Button",
    alias: "widget.nx-header-help",
    requires: ["NX.I18n"],
    iconCls: "x-fa fa-question-circle",
    initComponent: function () {
        var a = this;
        a.tooltip = NX.I18n.get("Header_Help_Tooltip");
        a.ariaLabel = NX.I18n.get("Header_Help_Tooltip");
        a.arrowCls = "";
        a.menu = [{
            text: NX.I18n.get("Header_Help_About_Text"),
            iconCls: "nx-icon-nexus-black-x16",
            tooltip: NX.I18n.get("Header_Help_About_Tooltip"),
            action: "about"
        }, {
            text: NX.I18n.get("Header_Help_Documentation_Text"),
            iconCls: "nx-icon-help-manual-x16",
            tooltip: NX.I18n.get("Header_Help_Documentation_Tooltip"),
            action: "docs"
        }, {
            text: NX.I18n.get("Header_Help_KB_Text"),
            iconCls: "nx-icon-help-kb-x16",
            tooltip: NX.I18n.get("Header_Help_KB_Tooltip"),
            action: "kb"
        }, {
            text: NX.I18n.get("Header_Help_Guides_Text"),
            iconCls: "nx-icon-help-guides-x16",
            tooltip: NX.I18n.get("Header_Help_Guides_Tooltip"),
            action: "guides"
        }, {
            text: NX.I18n.get("Header_Help_Community_Text"),
            iconCls: "nx-icon-help-community-x16",
            tooltip: NX.I18n.get("Header_Help_Community_Tooltip"),
            action: "community"
        }, {
            text: NX.I18n.get("Header_Help_Issues_Text"),
            iconCls: "nx-icon-help-issues-x16",
            tooltip: NX.I18n.get("Header_Help_Issues_Tooltip"),
            action: "issues"
        }, "-", {
            text: NX.I18n.get("Header_Help_Support_Text"),
            iconCls: "nx-icon-help-support-x16",
            tooltip: NX.I18n.get("Header_Help_Support_Tooltip"),
            action: "support"
        }];
        a.callParent()
    }
});
Ext.define("NX.Bookmark", {
    config: {token: undefined}, segments: undefined, constructor: function (a) {
        this.initConfig(a)
    }, applyToken: function (a) {
        var b = this;
        if (a && !Ext.isString(a)) {
            throw Ext.Error.raise("Invalid token")
        }
        if (a && (a.trim().length === 0)) {
            a = undefined
        }
        if (!a) {
            a = undefined
        }
        b.segments = [];
        if (a) {
            b.segments = a.split(":")
        }
        return a
    }, getSegment: function (a) {
        return this.segments[a]
    }, getSegments: function () {
        return this.segments
    }, appendSegments: function (a) {
        var b = this;
        if (!a) {
            throw Ext.Error.raise("Invalid segment: " + segment)
        }
        if (!Ext.isArray(a)) {
            a = [a]
        }
        Ext.each(a, function (c) {
            if (!c || !Ext.isString(c)) {
                throw Ext.Error.raise("Invalid segment: " + c)
            }
            b.segments.push(c)
        });
        b.setToken(b.segments.join(":"));
        return b
    }
});
Ext.define("NX.Bookmarks", {
    singleton: true, requires: ["NX.Bookmark"], controller: function () {
        return NX.getApplication().getBookmarkingController()
    }, getBookmark: function () {
        return this.controller().getBookmark()
    }, bookmark: function (b, a) {
        return this.controller().bookmark(b, a)
    }, navigateTo: function (b, a) {
        return this.controller().navigateTo(b, a)
    }, navigateBackSegments: function (c, b, a) {
        return this.controller().navigateTo(NX.Bookmarks.fromSegments(c.getSegments().slice(0, -b)), a)
    }, fromToken: function (a) {
        return Ext.create("NX.Bookmark", {token: a})
    }, fromSegments: function (a) {
        var b;
        if (Ext.isDefined(a)) {
            b = Ext.Array.from(a).join(":")
        }
        return Ext.create("NX.Bookmark", {token: b})
    }, encode: function (a) {
        if (!Ext.isString(a)) {
            throw Ext.Error.raise("Value to be encoded must be a String")
        }
        return a.replace(/\s/g, "")
    }
});
Ext.define("NX.controller.Bookmarking", {
    extend: "NX.app.Controller",
    requires: ["Ext.History", "NX.Bookmark", "NX.Bookmarks"],
    launched: false,
    init: function () {
        var a = this;
        Ext.History.useTopWindow = false;
        Ext.History.init();
        a.bindToHistory()
    },
    getBookmark: function () {
        return NX.Bookmarks.fromToken(Ext.History.bookmark || Ext.History.getToken())
    },
    bookmark: function (c, b) {
        var d = this, a = d.getBookmark().getToken();
        if (!d.launched) {
            return
        }
        if (c && a !== c.getToken()) {
            Ext.History.bookmark = c.getToken();
            Ext.History.add(c.getToken())
        }
    },
    navigateTo: function (b, a) {
        var c = this;
        if (!c.launched) {
            return
        }
        if (b) {
            c.bookmark(b, a);
            c.fireEvent("navigate", b)
        }
    },
    onLaunch: function () {
        this.launched = true;
        this.navigateTo(this.getBookmark(), this)
    },
    onNavigate: function (a) {
        var b = this;
        if (a !== Ext.History.bookmark) {
            delete Ext.History.bookmark;
            b.navigateTo(NX.Bookmarks.fromToken(a), b)
        }
    },
    bindToHistory: function () {
        var a = this;
        Ext.History.on("change", a.onNavigate, a)
    }
});
Ext.define("NX.util.Filter", {
    singleton: true, buildEmptyResult: function (b, a) {
        var c = Ext.util.Format.htmlEncode(b);
        return '<div class="x-grid-empty">' + a.replace(/\$filter/, c) + "</div>"
    }
});
Ext.define("NX.ext.grid.plugin.Filtering", {
    extend: "Ext.AbstractPlugin",
    alias: "plugin.gridfiltering",
    requires: ["Ext.util.Filter"],
    mixins: {logAware: "NX.LogAware"},
    filterValue: undefined,
    filteredStore: undefined,
    filteredFields: undefined,
    filterFn: function (b, c) {
        var a;
        if (b) {
            a = b.toString();
            if (a) {
                return a.toLowerCase().indexOf(c.toLowerCase()) !== -1
            }
        }
        return false
    },
    matches: function (d, a, c, b) {
        return this.filterFn(b, d)
    },
    filter: function (b) {
        var a = this;
        a.filterValue = b;
        a.applyFilter()
    },
    clearFilter: function () {
        var a = this;
        if (a.filterValue) {
            a.filterValue = undefined;
            a.applyFilter()
        }
    },
    applyFilter: function () {
        var b = this, c = b.filteredStore.remoteFilter, a = b.filteredStore.getFilters().items;
        if (c) {
            if (b.filteredStore.filters) {
                b.filteredStore.getFilters().clear()
            }
            b.filteredStore.remoteFilter = false
        }
        if (b.filterValue) {
            b.filteredStore.filter(b.filteringFilter)
        } else {
            b.filteredStore.removeFilter(b.filteringFilter)
        }
        if (c) {
            b.filteredStore.remoteFilter = c;
            if (b.filteredStore.filters && b.filteredStore.getFilters().items) {
                b.filteredStore.getFilters().add(a)
            }
        }
    },
    syncFilterValue: function (a, c) {
        var b = this, d = true;
        if (c) {
            Ext.Array.each(c, function (e) {
                if (e.id === b.filteringFilter.id) {
                    d = false;
                    return false
                }
                return true
            })
        }
        if (b.filterValue && d) {
            b.clearFilter();
            b.grid.fireEvent("filteringautocleared")
        }
    },
    init: function (a) {
        var b = this;
        b.grid = a;
        a.filterable = true;
        a.filter = Ext.Function.bind(b.filter, b);
        a.clearFilter = Ext.Function.bind(b.clearFilter, b);
        b.filteringFilter = Ext.create("Ext.util.Filter", {
            id: "filteringPlugin", filterFn: function (c) {
                for (var e = 0; e < b.filteredFields.length; e++) {
                    var d = b.filteredFields[e];
                    if (d) {
                        if (b.matches(b.filterValue, c, d, c.data[d])) {
                            return true
                        }
                    }
                }
                return false
            }
        });
        a.mon(a, {reconfigure: b.onReconfigure, scope: b, beforerender: {fn: b.onBeforeRender, single: true, scope: b}})
    },
    onBeforeRender: function (a) {
        this.onReconfigure(a, a.getStore(), a.getColumns())
    },
    onReconfigure: function (c, a, b) {
        var d = this, a = a || d.grid.getStore();
        d.reconfigureStore(a, d.extractColumnsWithDataIndex(b))
    },
    reconfigureStore: function (a, c) {
        var b = this;
        if (b.filteredStore !== a) {
            b.unbindFromStore(b.filteredStore);
            b.bindToStore(a)
        }
        b.filteredFields = c;
        b.applyFilter()
    },
    bindToStore: function (a) {
        var b = this;
        b.filteredStore = a;
        if (a) {
            b.grid.mon(a, "load", b.applyFilter, b);
            b.grid.mon(a, "filterchange", b.syncFilterValue, b)
        }
    },
    unbindFromStore: function (a) {
        var b = this;
        if (a) {
            b.grid.mun(a, "load", b.applyFilter, b);
            b.grid.mun(a, "filterchange", b.syncFilterValue, b)
        }
    },
    extractColumnsWithDataIndex: function (b) {
        var a = [];
        if (b) {
            Ext.Object.eachValue(b, function (c) {
                if (c.dataIndex) {
                    a.push(c.dataIndex)
                }
            })
        }
        if (a.length > 0) {
            return a
        }
    }
});
Ext.define("NX.ext.grid.plugin.FilterBox", {
    extend: "NX.ext.grid.plugin.Filtering",
    alias: "plugin.gridfilterbox",
    requires: ["NX.I18n", "NX.util.Filter"],
    init: function (b) {
        var c = this, d = b.getDockedItems('toolbar[dock="top"]')[0], a = ["->", {
            xtype: "nx-searchbox",
            cls: ["nx-searchbox", "nx-filterbox"],
            emptyText: NX.I18n.get("Grid_Plugin_FilterBox_Empty"),
            iconClass: "fa-filter",
            searchDelay: 200,
            width: 200,
            listeners: {search: c.onSearch, searchcleared: c.onSearchCleared, scope: c}
        }];
        c.callParent(arguments);
        if (d) {
            d.add(a)
        } else {
            b.addDocked([{xtype: "toolbar", dock: "top", items: a}])
        }
        c.grid.on("filteringautocleared", c.syncSearchBox, c)
    },
    onSearch: function (a, c) {
        var b = this;
        if (b.emptyText) {
            b.grid.getView().emptyText = NX.util.Filter.buildEmptyResult(c, b.emptyText)
        }
        b.filter(c)
    },
    destroy: function () {
        var a = this;
        a.clearFilter();
        a.callParent()
    },
    onSearchCleared: function () {
        var a = this;
        if (a.grid.emptyText) {
            a.grid.getView().emptyText = '<div class="x-grid-empty">' + a.grid.emptyText + "</div>"
        }
        a.clearFilter()
    },
    syncSearchBox: function () {
        var a = this;
        a.grid.down("nx-searchbox").setValue(a.filterValue)
    }
});
Ext.define("NX.util.condition.Condition", {
    mixins: {observable: "Ext.mixin.Observable", logAware: "NX.LogAware"},
    statics: {counter: 1},
    id: undefined,
    listenerCounter: 0,
    bounded: false,
    satisfied: false,
    constructor: function (a) {
        var b = this;
        b.id = b.self.getName() + "-" + NX.util.condition.Condition.counter++;
        b.mixins.observable.constructor.call(b, a)
    },
    logDebug: function () {
    },
    bind: function () {
        var a = this;
        if (!a.bounded) {
            a.setBounded(true)
        }
        return a
    },
    unbind: function () {
        var a = this;
        if (a.bounded) {
            a.clearListeners();
            Ext.app.EventBus.unlisten(a.id);
            a.setBounded(false)
        }
        return a
    },
    setBounded: function (a) {
        var b = this;
        if (Ext.isDefined(b.bounded)) {
            if (a !== b.bounded) {
                if (!a) {
                    b.setSatisfied(false)
                }
                b.bounded = a;
                Ext.defer(function () {
                    NX.getApplication().getStateController().fireEvent("conditionboundedchanged", b)
                }, 1)
            }
        } else {
            b.bounded = a
        }
    },
    isSatisfied: function () {
        return this.satisfied
    },
    setSatisfied: function (b) {
        var a = this;
        if (Ext.isDefined(a.satisfied)) {
            if (b !== a.satisfied) {
                a.satisfied = b;
                a.fireEvent(b ? "satisfied" : "unsatisfied", a);
                Ext.defer(function () {
                    NX.getApplication().getStateController().fireEvent("conditionstatechanged", a)
                }, 1)
            }
        } else {
            a.satisfied = b
        }
    },
    doAddListener: function (e, g, f, c, a, b, d) {
        var h = this;
        h.mixins.observable.doAddListener.call(h, e, g, f, c, a, b, d);
        h.listenerCounter++;
        if (h.listenerCounter === 1) {
            h.bind()
        }
        h.fireEvent(h.satisfied ? "satisfied" : "unsatisfied", h)
    },
    doRemoveListener: function (a, c, b) {
        var d = this;
        d.mixins.observable.doRemoveListener.call(d, a, c, b);
        d.listenerCounter--;
        if (d.listenerCounter === 0) {
            d.unbind()
        }
    }
});
Ext.define("NX.util.condition.NeverSatisfied", {
    extend: "NX.util.condition.Condition", toString: function () {
        return this.self.getName() + "{ never satisfied }"
    }
});
Ext.define("NX.util.condition.Conjunction", {
    extend: "NX.util.condition.Condition",
    conditions: undefined,
    bind: function () {
        var a = this;
        if (!a.bounded) {
            a.callParent();
            a.evaluate();
            Ext.each(a.conditions, function (b) {
                a.mon(b, {satisfied: a.evaluate, unsatisfied: a.evaluate, scope: a})
            })
        }
        return a
    },
    evaluate: function () {
        var a = this, b = true;
        if (a.bounded) {
            Ext.each(a.conditions, function (c) {
                b = c.satisfied;
                return b
            });
            a.setSatisfied(b)
        }
    },
    toString: function () {
        return this.conditions.join(" AND ")
    }
});
Ext.define("NX.util.condition.GridHasSelection", {
    extend: "NX.util.condition.Condition",
    grid: undefined,
    fn: undefined,
    bind: function () {
        var c = this, a = Ext.ComponentQuery.query(c.grid), b = a && a.length ? a[0] : null;
        if (!c.bounded) {
            b.on({cellclick: c.cellclick, selectionchange: c.selectionchange, destroy: c.destroy, scope: c});
            c.callParent()
        }
        return c
    },
    cellclick: function (c, d, b, a) {
        this.evaluate(c, a)
    },
    selectionchange: function (b, a) {
        this.evaluate(b, a ? a[0] : null)
    },
    destroy: function (b) {
        var a = this;
        if (b.getSelectionModel().getSelected()) {
            a.evaluate(b, b.getSelection())
        } else {
            a.evaluate(b, null)
        }
    },
    evaluate: function (c, a) {
        var b = this, d = false;
        if (c && a) {
            d = true;
            if (Ext.isFunction(b.fn)) {
                d = b.fn(a) === true
            }
        }
        b.setSatisfied(d)
    },
    toString: function () {
        return this.self.getName() + "{ grid=" + this.grid + " }"
    }
});
Ext.define("NX.util.condition.WatchState", {
    extend: "NX.util.condition.Condition",
    requires: ["NX.State"],
    key: undefined,
    fn: undefined,
    bind: function () {
        var c = this, a, b;
        if (!c.bounded) {
            if (!Ext.isDefined(c.fn)) {
                c.fn = function (d) {
                    return d
                }
            }
            a = NX.getApplication().getController("State");
            b = {scope: c};
            b[c.key.toLowerCase() + "changed"] = c.evaluate;
            c.mon(a, b);
            c.callParent();
            c.evaluate(NX.State.getValue(c.key))
        }
        return c
    },
    evaluate: function (c, a) {
        var b = this;
        if (b.bounded) {
            b.setSatisfied(b.fn(c, a))
        }
    },
    toString: function () {
        return this.self.getName() + "{ key=" + this.key + " }"
    }
});
Ext.define("NX.util.condition.Disjunction", {
    extend: "NX.util.condition.Condition",
    conditions: undefined,
    bind: function () {
        var a = this;
        if (!a.bounded) {
            a.callParent();
            a.evaluate();
            Ext.each(a.conditions, function (b) {
                a.mon(b, {satisfied: a.evaluate, unsatisfied: a.evaluate, scope: a})
            })
        }
        return a
    },
    evaluate: function () {
        var a = this, b = false;
        if (a.bounded) {
            Ext.each(a.conditions, function (c) {
                if (c.satisfied) {
                    b = true;
                    return false
                }
                return true
            });
            a.setSatisfied(b)
        }
    },
    toString: function () {
        return this.conditions.join(" OR ")
    }
});
Ext.define("NX.util.condition.FormIs", {
    extend: "NX.util.condition.Condition",
    form: undefined,
    fn: undefined,
    condition: undefined,
    formComponent: undefined,
    bind: function () {
        if (Ext.isString(this.form)) {
            this.formComponent = Ext.first(this.form)
        } else {
            this.formComponent = this.form
        }
        if (!this.bounded && this.formComponent) {
            this.formComponent.on({
                afterrender: this.evaluate,
                validitychange: this.evaluate,
                disable: this.evaluate,
                enable: this.evaluate,
                destroy: this.evaluate,
                scope: this
            });
            this.callParent();
            this.evaluate(this.formComponent)
        }
        return this
    },
    evaluate: function () {
        if (this.bounded) {
            this.setSatisfied(this.condition(this.formComponent))
        }
    },
    toString: function () {
        return this.self.getName() + "{ form=#" + this.formComponent.getId() + " }"
    }
});
Ext.define("NX.util.condition.StoreHasRecords", {
    extend: "NX.util.condition.Condition",
    store: undefined,
    bind: function () {
        var b = this, a;
        if (!b.bounded) {
            a = NX.getApplication().getStore(b.store);
            b.mon(a, {datachanged: b.evaluate, beforeload: Ext.pass(b.evaluate, [undefined]), scope: b});
            b.callParent();
            b.evaluate(a)
        }
        return b
    },
    evaluate: function (a) {
        var b = this;
        if (b.bounded) {
            b.setSatisfied(Ext.isDefined(a) && (a.getCount() > 0))
        }
    },
    toString: function () {
        return this.self.getName() + "{ store=" + this.store + " }"
    }
});
Ext.define("NX.util.condition.FormHasRecord", {
    extend: "NX.util.condition.Condition",
    form: undefined,
    fn: undefined,
    bind: function () {
        var a = this, b = Ext.ComponentQuery.query(a.form), c = b && b.length ? b[0] : null;
        if (!a.bounded && c) {
            c.on({afterrender: a.evaluate, recordloaded: a.evaluate, destroy: a.evaluate, scope: a});
            a.callParent();
            a.evaluate(c)
        }
        return a
    },
    evaluate: function (c) {
        var b = this, d = false, a;
        if (b.bounded) {
            if (Ext.isDefined(c) && c.isXType("form")) {
                a = c.getRecord();
                if (a) {
                    d = true;
                    if (Ext.isFunction(b.fn)) {
                        d = b.fn(a) === true
                    }
                }
            }
            b.setSatisfied(d)
        }
    },
    toString: function () {
        return this.self.getName() + "{ form=" + this.form + " }"
    }
});
Ext.define("NX.util.condition.IsPermitted", {
    extend: "NX.util.condition.Condition",
    permission: undefined,
    bind: function () {
        var b = this, a;
        if (!b.bounded) {
            a = NX.getApplication().getController("Permissions");
            b.mon(a, {changed: b.evaluate, scope: b});
            b.callParent();
            b.evaluate()
        }
        return b
    },
    evaluate: function () {
        var a = this;
        if (a.bounded) {
            a.setSatisfied(NX.Permissions.check(a.permission))
        }
    },
    toString: function () {
        return this.self.getName() + "{ permission=" + this.permission + " }"
    },
    setPermission: function (a) {
        this.permission = a;
        this.evaluate()
    }
});
Ext.define("NX.util.condition.MultiListener", {
    extend: "NX.util.condition.Condition",
    listenerConfigs: undefined,
    fn: undefined,
    bind: function () {
        var a = this;
        if (!a.bounded) {
            if (!Ext.isFunction(a.fn)) {
                throw"fn must be a valid function"
            }
            if (!Ext.isArray(a.listenerConfigs)) {
                throw"listenerConfigs must be an array"
            }
            a.listenerConfigs.forEach(function (b) {
                b.events.forEach(function (c) {
                    b.observable.on(c, a.evaluate, a)
                })
            });
            a.callParent();
            a.evaluate()
        }
        return a
    },
    evaluate: function () {
        var a = this;
        if (a.bounded) {
            a.setSatisfied(a.fn())
        }
    },
    toString: function () {
        return this.self.getName() + "{ key=" + this.key + " }"
    }
});
Ext.define("NX.Conditions", {
    singleton: true,
    requires: ["NX.util.condition.Conjunction", "NX.util.condition.Disjunction", "NX.util.condition.FormHasRecord", "NX.util.condition.FormIs", "NX.util.condition.GridHasSelection", "NX.util.condition.IsPermitted", "NX.util.condition.StoreHasRecords", "NX.util.condition.MultiListener", "NX.util.condition.WatchState", "NX.util.condition.NeverSatisfied"],
    isPermitted: function (a) {
        return Ext.create("NX.util.condition.IsPermitted", {permission: a})
    },
    storeHasRecords: function (a) {
        return Ext.create("NX.util.condition.StoreHasRecords", {store: a})
    },
    gridHasSelection: function (a, b) {
        return Ext.create("NX.util.condition.GridHasSelection", {grid: a, fn: b})
    },
    formHasRecord: function (b, a) {
        return Ext.create("NX.util.condition.FormHasRecord", {form: b, fn: a})
    },
    watchEvents: function (a, b) {
        return Ext.create("NX.util.condition.MultiListener", {fn: b, listenerConfigs: a})
    },
    formIs: function (a, b) {
        return Ext.create("NX.util.condition.FormIs", {form: a, condition: b})
    },
    watchState: function (a, b) {
        return Ext.create("NX.util.condition.WatchState", {key: a, fn: b})
    },
    and: function () {
        return Ext.create("NX.util.condition.Conjunction", {conditions: Array.prototype.slice.call(arguments)})
    },
    or: function () {
        return Ext.create("NX.util.condition.Disjunction", {conditions: Array.prototype.slice.call(arguments)})
    },
    never: function () {
        return Ext.create("NX.util.condition.NeverSatisfied")
    }
});
Ext.define("NX.controller.dev.Stores", {
    extend: "NX.app.Controller",
    requires: ["Ext.data.StoreManager"],
    refs: [{ref: "stores", selector: "nx-dev-stores"}],
    init: function () {
        var a = this;
        a.listen({
            component: {
                "nx-dev-stores combobox": {change: a.onStoreSelected},
                "nx-dev-stores button[action=load]": {click: a.loadStore},
                "nx-dev-stores button[action=clear]": {click: a.clearStore}
            }
        })
    },
    onStoreSelected: function (c) {
        var b = c.getValue(), a = this.getStores(), f = a.down("grid"), d, e = [];
        if (b) {
            d = Ext.data.StoreManager.get(b);
            if (d) {
                Ext.each(d.model.getFields(), function (g) {
                    e.push({
                        text: g.name, dataIndex: g.name, renderer: function (h) {
                            if (Ext.isObject(h) || Ext.isArray(h)) {
                                try {
                                    return Ext.encode(h)
                                } catch (i) {
                                    console.error("Failed to encode value:", h, i)
                                }
                            }
                            return h
                        }
                    })
                });
                a.removeAll(true);
                a.add({xtype: "grid", autoScroll: true, store: d, columns: e})
            }
        }
    },
    loadStore: function () {
        var a = this.getStores(), b = a.down("grid");
        if (b) {
            b.getStore().load()
        }
    },
    clearStore: function () {
        var a = this.getStores(), b = a.down("grid");
        if (b) {
            b.getStore().removeAll()
        }
    }
});
Ext.define("NX.util.Array", {
    singleton: true, requires: ["Ext.Array"], containsAll: function (c, b) {
        var a;
        for (a = 0; a < b.length; a++) {
            if (!Ext.Array.contains(c, b[a])) {
                return false
            }
        }
        return true
    }
});
Ext.define("NX.Permissions", {
    singleton: true,
    requires: ["NX.Assert", "NX.util.Array"],
    mixins: {logAware: "NX.LogAware"},
    permissions: undefined,
    impliedCache: undefined,
    available: function () {
        return Ext.isDefined(this.permissions)
    },
    setPermissions: function (a) {
        var b = this;
        b.permissions = Ext.clone(a);
        b.impliedCache = {}
    },
    resetPermissions: function () {
        var a = this;
        delete a.permissions;
        delete a.impliedCache
    },
    check: function (a) {
        var c = this, b = false;
        a = a.toLowerCase();
        if (!c.available()) {
            return false
        }
        if (c.permissions[a] !== undefined) {
            return c.permissions[a]
        }
        if (c.impliedCache[a] !== undefined) {
            b = c.impliedCache[a]
        } else {
            Ext.Object.each(c.permissions, function (d, e) {
                if (e && c.implies(d, a)) {
                    b = true;
                    return false
                }
                return true
            });
            c.impliedCache[a] = b
        }
        return b
    },
    implies: function (d, c) {
        var a = d.split(":"), g = c.split(":"), f, e, b;
        for (b = 0; b < g.length; b++) {
            if (a.length - 1 < b) {
                return true
            } else {
                f = a[b].split(",");
                e = g[b].split(",");
                if (!Ext.Array.contains(f, "*") && !NX.util.Array.containsAll(f, e)) {
                    return false
                }
            }
        }
        for (; b < a.length; b++) {
            f = a[b].split(",");
            if (!Ext.Array.contains(f, "*")) {
                return false
            }
        }
        return true
    },
    checkExistsWithPrefix: function (c) {
        var b = this, a = false;
        if (!b.available()) {
            return false
        }
        Ext.Object.each(b.permissions, function (d, e) {
            if (Ext.String.startsWith(d, c) && e === true) {
                a = true;
                return false
            }
            return true
        });
        return a
    }
});
Ext.define("NX.model.Feature", {
    extend: "Ext.data.Model",
    idProperty: "path",
    fields: [{name: "path"}, {name: "text"}, {name: "mode", type: "string", defaultValue: "admin"}, {
        name: "weight",
        defaultValue: 100
    }, {name: "group", defaultValue: false}, {name: "view", defaultValue: undefined}, {
        name: "visible",
        defaultValue: true
    }, {name: "expanded", defaultValue: true}, {name: "bookmark", defaultValue: undefined}, {
        name: "iconName",
        defaultValue: undefined
    }, {name: "description", defaultValue: undefined}, {name: "authenticationRequired", defaultValue: true}]
});
Ext.define("NX.view.UnsavedChanges", {
    extend: "NX.view.ModalDialog",
    requires: ["NX.I18n"],
    alias: "widget.nx-unsaved-changes",
    content: null,
    callback: Ext.emptyFn,
    initComponent: function () {
        var a = this;
        a.title = NX.I18n.get("UnsavedChanges_Title");
        a.setWidth(NX.view.ModalDialog.SMALL_MODAL);
        Ext.apply(a, {
            items: {
                xtype: "panel",
                ui: "nx-inset",
                html: NX.I18n.get("UnsavedChanges_Help_HTML"),
                buttonAlign: "left",
                buttons: [{
                    text: NX.I18n.get("UnsavedChanges_Discard_Button"),
                    ui: "nx-primary",
                    itemId: "nx-discard",
                    handler: function () {
                        if (a.content) {
                            a.content.resetUnsavedChangesFlag(true)
                        }
                        a.callback();
                        a.close()
                    }
                }, {text: NX.I18n.get("UnsavedChanges_Back_Button"), handler: a.close, scope: a}]
            }
        });
        a.on({
            resize: function () {
                a.down("#nx-discard").focus()
            }, single: true
        });
        a.callParent()
    }
});
Ext.define("NX.view.feature.NotVisible", {
    extend: "Ext.container.Container",
    alias: "widget.nx-feature-notvisible",
    requires: ["NX.I18n"],
    cls: ["nx-feature-notvisible", "nx-hr"],
    layout: {type: "vbox", align: "center", pack: "center"},
    initComponent: function () {
        var a = this;
        a.items = [{xtype: "label", cls: "title", text: a.text}, {
            xtype: "label",
            cls: "description",
            text: "Sorry you are not permitted to use the feature you selected.  Please select another feature."
        }];
        a.callParent()
    }
});
Ext.define("NX.store.Feature", {
    extend: "Ext.data.ArrayStore",
    model: "NX.model.Feature",
    sorters: {property: "path", direction: "ASC"}
});
Ext.define("NX.view.feature.Menu", {
    extend: "Ext.tree.Panel",
    alias: "widget.nx-feature-menu",
    width: 300,
    ui: "nx-feature-menu",
    stateful: true,
    stateId: "nx-feature-menu-v2",
    store: "FeatureMenu",
    rootVisible: false,
    sortableColumns: false,
    lines: false,
    ariaRole: "navigation"
});
Ext.define("NX.model.FeatureMenu", {
    extend: "Ext.data.TreeModel",
    fields: [{name: "path"}, {name: "mode", type: "string"}, {name: "text"}, {
        name: "weight",
        defaultValue: 100
    }, {
        name: "grouped",
        defaultValue: false
    }, {name: "view"}, {name: "bookmark"}, {name: "iconName"}, {name: "separator", type: "boolean"}]
});
Ext.define("NX.store.FeatureMenu", {
    extend: "Ext.data.TreeStore",
    model: "NX.model.FeatureMenu",
    root: {expanded: true, text: "Features"},
    proxy: {type: "memory"}
});
Ext.define("NX.controller.Features", {
    extend: "NX.app.Controller",
    models: ["Feature"],
    stores: ["Feature", "FeatureMenu"],
    statics: {
        alwaysVisible: function () {
            return true
        }, alwaysHidden: function () {
            return false
        }
    },
    registerFeature: function (b, a) {
        var c = this;
        if (b) {
            if (a) {
                a.on("destroy", Ext.pass(c.unregisterFeature, [b], c), c)
            }
            Ext.each(Ext.Array.from(b), function (e) {
                var d = Ext.clone(e), f;
                if (!d.path) {
                    throw Ext.Error.raise("Feature missing path")
                }
                if (!d.mode) {
                    d.mode = "admin"
                }
                if (!d.view && d.group === true) {
                    d.view = "NX.view.feature.Group"
                }
                if (!d.view) {
                    c.logError("Missing view configuration for feature at path:", d.path)
                }
                f = d.path;
                if (f.charAt(0) === "/") {
                    f = f.substr(1, f.length)
                }
                c.configureIcon(f, d);
                f = d.mode + "/" + f;
                d.path = "/" + f;
                if (!d.bookmark) {
                    d.bookmark = NX.Bookmarks.encode(f).toLowerCase()
                }
                if (Ext.isDefined(d.visible)) {
                    if (!Ext.isFunction(d.visible)) {
                        if (d.visible) {
                            d.visible = NX.controller.Features.alwaysVisible
                        } else {
                            d.visible = NX.controller.Features.alwaysHidden
                        }
                    }
                } else {
                    d.visible = NX.controller.Features.alwaysVisible
                }
                c.getStore("Feature").addSorted(c.getFeatureModel().create(d))
            })
        }
    },
    unregisterFeature: function (a) {
        var b = this;
        if (a) {
            Ext.each(Ext.Array.from(a), function (e) {
                var c = Ext.clone(e), f, d;
                if (!c.mode) {
                    c.mode = "admin"
                }
                f = c.path;
                if (f.charAt(0) === "/") {
                    f = f.substr(1, f.length)
                }
                f = c.mode + "/" + f;
                c.path = "/" + f;
                d = b.getStore("Feature").getById(c.path);
                if (d) {
                    b.getStore("Feature").remove(d)
                }
            })
        }
    },
    configureIcon: function (c, a) {
        var d = "feature-" + a.mode + "-" + c.toLowerCase().replace(/\//g, "-").replace(/\s/g, "");
        if (a.iconConfig) {
            var b = a.iconConfig;
            delete a.iconConfig;
            if (b.name) {
                a.iconName = b.name
            } else {
                b.name = d
            }
            this.getApplication().getIconController().addIcon(b)
        }
        if (!a.iconName) {
            a.iconName = d
        }
    }
});
Ext.define("NX.store.FeatureGroup", {
    extend: "Ext.data.ArrayStore",
    model: "NX.model.Feature",
    sorters: {property: "path", direction: "ASC"}
});
Ext.define("NX.view.feature.NotFound", {
    extend: "Ext.container.Container",
    alias: "widget.nx-feature-notfound",
    requires: ["NX.I18n"],
    cls: ["nx-feature-notfound", "nx-hr"],
    layout: {type: "vbox", align: "center", pack: "center"},
    initComponent: function () {
        var a = this;
        a.items = [{
            xtype: "label",
            cls: "title",
            text: a.path ? NX.I18n.format("Feature_NotFoundPath_Text", a.path) : NX.I18n.get("Feature_NotFound_Text")
        }, {
            xtype: "label",
            cls: "description",
            text: "Sorry the feature you have selected does not exist.  Please make another selection."
        }];
        a.callParent()
    }
});
Ext.define("NX.controller.Menu", {
    extend: "NX.app.Controller",
    requires: ["NX.Bookmarks", "NX.controller.User", "NX.controller.Features", "NX.Permissions", "NX.Security", "NX.State", "NX.view.header.Mode", "NX.I18n", "Ext.state.Manager"],
    views: ["feature.Menu", "feature.NotFound", "feature.NotVisible", "UnsavedChanges"],
    models: ["Feature"],
    stores: ["Feature", "FeatureMenu", "FeatureGroup"],
    refs: [{ref: "featureMenu", selector: "nx-feature-menu"}, {
        ref: "featureContent",
        selector: "nx-feature-content"
    }, {ref: "headerPanel", selector: "nx-header-panel"}],
    mode: undefined,
    availableModes: undefined,
    bookmarkingEnabled: true,
    currentSelectedPath: undefined,
    navigateToFirstFeature: false,
    init: function () {
        var a = this;
        a.availableModes = Ext.create("Ext.util.MixedCollection");
        a.getApplication().getIconController().addIcons({
            "feature-notfound": {
                file: "exclamation.png",
                variants: ["x16", "x32"]
            }
        });
        a.listen({
            controller: {
                "#Permissions": {changed: a.refreshMenu},
                "#State": {changed: a.onStateChange},
                "#Bookmarking": {navigate: a.navigateTo},
                "#User": {beforesignout: a.warnBeforeSignOut, signout: a.onSignOut},
                "#Refresh": {beforerefresh: a.warnBeforeRefresh}
            },
            component: {
                "nx-feature-menu": {
                    itemclick: a.onItemClick,
                    afterrender: a.onAfterRender,
                    beforecellclick: a.warnBeforeMenuSelect,
                    beforeselect: a.onBeforeSelect
                },
                "nx-main #quicksearch": {beforesearch: a.warnBeforeSearch},
                "#breadcrumb button": {click: a.warnBeforeButtonClick},
                "nx-actions button[handler]": {click: a.warnBeforeButtonClick},
                "nx-actions menuitem[handler]": {click: a.warnBeforeButtonClick},
                "nx-header-mode": {
                    afterrender: a.registerMode,
                    destroy: a.unregisterMode,
                    selected: a.warnBeforeModeSelect
                }
            },
            store: {"#Feature": {update: a.refreshMenu}}
        });
        a.warnBeforeUnload()
    },
    destroy: function () {
        var a = this;
        a.getApplication().un("controllerschanged", a.refreshMenu, a);
        a.callParent(arguments)
    },
    onAfterRender: function () {
        var a = this;
        a.getApplication().on("controllerschanged", a.refreshMenu, a);
        a.refreshMenu()
    },
    getBookmark: function () {
        var b = this, a = b.getFeatureMenu().getSelectionModel().getSelection();
        if (!a.length) {
            b.getFeatureMenu().setSelection(b.getFeatureMenu().getStore().first());
            a = b.getFeatureMenu().getSelectionModel().getSelection()
        }
        return NX.Bookmarks.fromToken(a.length ? a[0].get("bookmark") : b.mode)
    },
    onItemClick: function (b, d, e) {
        var g = this, j = d.get("path"), i = e, f = j !== g.currentSelectedPath, h = d.get("group"),
            a = d.get("hrefTarget") === "_blank", c = d.get("separator");
        if (a || c) {
            return
        } else {
            if (i || f || h) {
                g.currentSelectedPath = j;
                if (g.bookmarkingEnabled) {
                    g.bookmark(d)
                }
                g.selectFeature(g.getStore("Feature").getById(d.get("path")));
                g.populateFeatureGroupStore(d)
            }
        }
    },
    onBeforeSelect: function (a, b) {
        var c = b.get("hrefTarget") === "_blank", d = b.get("separator");
        if (c || d) {
            return false
        }
    },
    selectFeature: function (b) {
        var a;
        if (b) {
            a = b.get("path");
            if (a && a.length > 0) {
                this.fireEvent("featureselected", b)
            }
        }
    },
    populateFeatureGroupStore: function (a) {
        var c = this, b = [], d = c.getStore("Feature");
        a.eachChild(function (e) {
            e.cascadeBy(function (f) {
                b.push(d.getById(f.get("path")))
            })
        });
        c.getStore("FeatureGroup").loadData(b)
    },
    navigateTo: function (b) {
        var d = this, c, e, a, g, f;
        if (b) {
            if (b.getSegments().length) {
                f = b.getSegment(0).indexOf("=");
                if (f !== -1) {
                    g = b.getSegment(0).slice(0, b.getSegment(0).indexOf("="))
                } else {
                    g = b.getSegment(0)
                }
            }
            e = d.getMode(b);
            if (d.mode !== e) {
                d.mode = e;
                d.refreshModes()
            }
            if (g) {
                c = d.getStore("FeatureMenu").getRootNode().findChild("bookmark", g, true)
            }
            if (!c && (!Ext.isDefined(g) || d.navigateToFirstFeature)) {
                if (!d.mode) {
                    d.selectFirstAvailableMode();
                    d.refreshModes()
                }
                c = d.getStore("FeatureMenu").getRootNode().firstChild
            }
            if (c) {
                d.bookmarkingEnabled = d.navigateToFirstFeature;
                d.navigateToFirstFeature = false;
                d.getFeatureMenu().selectPath(c.getPath("text"), "text", "/", function () {
                    d.bookmarkingEnabled = true
                });
                d.getFeatureMenu().fireEvent("itemclick", d.getFeatureMenu(), c, false)
            } else {
                delete d.currentSelectedPath;
                if (g) {
                    a = d.getStore("Feature").findRecord("bookmark", g, 0, false, false, true)
                }
                d.getFeatureMenu().getSelectionModel().deselectAll();
                if (a) {
                    if (a.get("authenticationRequired") && NX.Permissions.available()) {
                        NX.Security.askToAuthenticate()
                    }
                    d.selectFeature(d.createNotAvailableFeature(a))
                } else {
                    d.selectFeature(d.createNotFoundFeature(g))
                }
            }
        }
    },
    onSignOut: function () {
        this.navigateToFirstFeature = true
    },
    onStateChange: function () {
        var a = this, b = false;
        a.getStore("Feature").each(function (c) {
            var e, d;
            if (c.get("mode") === a.mode) {
                e = c.get("visible")();
                d = a.getStore("FeatureMenu").getRootNode().findChild("path", c.get("path"), true) !== null;
                b = (e !== d)
            }
            return !b
        });
        if (b) {
            a.refreshMenu()
        }
    },
    bookmark: function (c) {
        var b = this, a = c.get("bookmark");
        if (NX.Bookmarks.getBookmark().getToken() !== a) {
            NX.Bookmarks.bookmark(NX.Bookmarks.fromToken(a), b)
        }
    },
    refreshMenu: function () {
        var a = this;
        a.refreshVisibleModes();
        a.refreshTree();
        a.navigateTo(NX.Bookmarks.getBookmark())
    },
    findModeSwitcher: function (a) {
        return this.availableModes.findBy(function (b) {
            return b.name === a
        })
    },
    refreshVisibleModes: function () {
        var c = this, b = [], a;
        c.getStore("Feature").each(function (d) {
            a = d.getData();
            if (a.visible() && !a.group && b.indexOf(a.mode) === -1) {
                b.push(a.mode)
            }
        });
        c.availableModes.each(function (d) {
            d.toggle(false, true);
            if (d.autoHide) {
                if (b.indexOf(d.name) > -1) {
                    d.show()
                } else {
                    d.hide()
                }
            }
        });
        c.refreshModeButtons()
    },
    refreshModeButtons: function () {
        var a = this, b;
        a.availableModes.each(function (c) {
            c.toggle(false, true)
        });
        if (a.mode) {
            b = a.findModeSwitcher(a.mode);
            if (!b || b.isHidden()) {
                delete a.mode
            }
        }
        if (a.mode) {
            b = a.findModeSwitcher(a.mode);
            b.toggle(true, true)
        }
    },
    refreshTree: function () {
        var f = this, b = f.mode, i = [], e = Ext.state.Manager.get("MenuExpandMap") || {}, h, c, g, a, d;
        Ext.suspendLayouts();
        d = f.findModeSwitcher(f.mode);
        if (d && d.title) {
            b = d.title
        }
        f.getFeatureMenu().setTitle(b);
        f.getStore("FeatureMenu").getRootNode().removeAll();
        f.getStore("Feature").each(function (k) {
            h = k.getData();
            if ((f.mode === h.mode) && h.visible()) {
                c = h.path.split("/");
                g = f.getStore("FeatureMenu").getRootNode();
                for (var j = 2; j < c.length; j++) {
                    a = g.findChild("path", c.slice(0, j + 1).join("/"), false);
                    if (a) {
                        if (j < c.length - 1) {
                            a.data = Ext.apply(a.data, {leaf: false})
                        }
                    } else {
                        if (j < c.length - 1) {
                            a = g.appendChild({text: c[j], leaf: false, expanded: true})
                        } else {
                            a = g.appendChild({
                                leaf: true,
                                iconCls: h.iconCls || NX.Icons.cls(h.iconName, "x16"),
                                qtip: h.description,
                                authenticationRequired: h.authenticationRequired,
                                bookmark: h.bookmark,
                                expanded: e[h.path] === undefined ? h.expanded : e[h.path],
                                helpKeyword: h.helpKeyword,
                                iconName: h.iconName,
                                mode: h.mode,
                                path: h.path,
                                text: h.text,
                                view: h.view,
                                weight: h.weight,
                                grouped: h.group
                            });
                            f.addExpandCollapseHandlers(a, h.path)
                        }
                    }
                    g = a
                }
            }
        });
        f.getStore("FeatureMenu").getRootNode().cascadeBy(function (j) {
            if (j.get("grouped") && !j.hasChildNodes()) {
                i.push(j)
            }
        });
        Ext.Array.each(i, function (j) {
            j.parentNode.removeChild(j, true)
        });
        f.getStore("FeatureMenu").sort([{property: "weight", direction: "ASC"}, {property: "text", direction: "ASC"}]);
        f.addExternalLinks();
        Ext.resumeLayouts(true)
    },
    addExpandCollapseHandlers: function (a, b) {
        a.on("expand", function (d) {
            var c = Ext.state.Manager.get("MenuExpandMap") || {};
            c[d] = true;
            Ext.state.Manager.set("MenuExpandMap", c)
        }.bind(this, b));
        a.on("collapse", function (d) {
            var c = Ext.state.Manager.get("MenuExpandMap") || {};
            c[d] = false;
            Ext.state.Manager.set("MenuExpandMap", c)
        }.bind(this, b))
    },
    createNotAvailableFeature: function (a) {
        return this.getFeatureModel().create({
            text: a.get("text"),
            path: a.get("path"),
            description: a.get("description"),
            iconName: a.get("iconName"),
            view: {
                xtype: "nx-feature-notvisible",
                text: a.get("text") + " feature is not available as " + (NX.State.getValue("user") ? " you do not have the required permissions" : " you are not logged in")
            },
            visible: NX.controller.Features.alwaysVisible
        })
    },
    createNotFoundFeature: function (a) {
        return this.getFeatureModel().create({
            text: "Not found",
            path: "/Not Found",
            description: a,
            iconName: "feature-notfound",
            view: {xtype: "nx-feature-notfound", path: a},
            visible: NX.controller.Features.alwaysVisible
        })
    },
    getMode: function (a) {
        if (a && a.getSegment(0)) {
            return a.getSegment(0).split("/")[0]
        }
        return undefined
    },
    changeMode: function (b) {
        var a = this;
        a.mode = b;
        a.refreshTree();
        a.navigateTo(NX.Bookmarks.fromToken(a.getStore("FeatureMenu").getRootNode().firstChild.get("bookmark")));
        NX.Bookmarks.bookmark(a.getBookmark())
    },
    registerMode: function (a) {
        this.availableModes.add(a)
    },
    unregisterMode: function (a) {
        this.availableModes.remove(a)
    },
    selectFirstAvailableMode: function () {
        var a = this;
        a.availableModes.each(function (b) {
            if (!b.isHidden()) {
                a.mode = b.name;
                return false
            }
            return true
        })
    },
    refreshModes: function () {
        this.refreshModeButtons();
        this.refreshTree()
    },
    warnBeforeMenuSelect: function (a, e, c, b) {
        var d = this;
        return d.warnBeforeNavigate(function () {
            d.getFeatureMenu().getSelectionModel().select(b);
            d.getFeatureMenu().fireEvent("itemclick", d.getFeatureMenu(), b)
        })
    },
    warnBeforeModeSelect: function (c) {
        var b = this;
        var a = function () {
            c.toggle(true);
            b.changeMode(c.name)
        };
        if (b.warnBeforeNavigate(a)) {
            b.changeMode(c.name)
        } else {
            c.toggle(true)
        }
    },
    warnBeforeSearch: function () {
        var a = this, b = a.getHeaderPanel().down("nx-header-quicksearch");
        return a.warnBeforeNavigate(function () {
            b.triggerSearch()
        })
    },
    warnBeforeButtonClick: function (a, b) {
        return this.warnBeforeNavigate(function () {
            a.handler.call(a.scope, a, b)
        })
    },
    warnBeforeRefresh: function () {
        var b = this, a = b.getHeaderPanel().down("nx-header-refresh");
        return b.warnBeforeNavigate(function () {
            a.fireEvent("click")
        })
    },
    warnBeforeSignOut: function () {
        return this.warnBeforeNavigate(function () {
            NX.getApplication().getController("User").signOut()
        })
    },
    warnBeforeNavigate: function (d) {
        var c = this, a = c.hasDirt(), b = c.getFeatureContent();
        if (b.discardUnsavedChanges) {
            b.resetUnsavedChangesFlag();
            return true
        }
        if (a) {
            c.showUnsavedChangesModal(d);
            return false
        } else {
            return true
        }
    },
    showUnsavedChangesModal: function (b) {
        var a = this.getFeatureContent();
        Ext.create("NX.view.UnsavedChanges", {
            content: a, callback: function () {
                b();
                a.resetUnsavedChangesFlag();
                window.dirty = []
            }
        })
    },
    hasDirt: function () {
        var b = false, a = Ext.ComponentQuery.query("form[settingsForm=true]"), c = window.dirty || [];
        if (a.length !== 0) {
            Ext.Array.each(a, function (d) {
                if (d.isDirty()) {
                    b = true;
                    return false
                }
            })
        }
        return b || c.length > 0
    },
    warnBeforeUnload: function () {
        var a = this;
        window.onbeforeunload = function () {
            if (a.hasDirt()) {
                return NX.I18n.get("Menu_Browser_Title")
            }
        }
    },
    addExternalLinks: function () {
        var b = this.getStore("FeatureMenu").getRootNode(), d = NX.State.getValue("clm"), c = d && d.enabled && d.url,
            a = c && d.showLink;
        if (this.mode === "browse" && a) {
            b.appendChild({leaf: true, separator: true, cls: "separator", iconCls: " ", text: " "});
            b.appendChild({
                leaf: true,
                qtip: NX.I18n.get("Clm_Dashboard_Description"),
                authenticationRequired: false,
                mode: "browse",
                text: NX.I18n.get("Clm_Dashboard_Link_Text"),
                href: c,
                hrefTarget: "_blank",
                cls: "iq-dashboard-link"
            })
        }
    }
});
Ext.define("NX.view.header.Panel", {
    extend: "Ext.container.Container",
    alias: "widget.nx-header-panel",
    requires: ["NX.I18n", "NX.State"],
    cls: "nx-header-panel",
    layout: {type: "vbox", align: "stretch", pack: "start"},
    ariaRole: "banner",
    initComponent: function () {
        var a = this;
        a.items = [{xtype: "nx-header-branding", hidden: true}, {
            xtype: "toolbar",
            height: 50,
            anchor: "100%",
            defaults: {scale: "medium"},
            items: [{xtype: "nx-header-logo"}, {
                xtype: "container",
                layout: {type: "vbox", pack: "center"},
                items: [{
                    xtype: "label",
                    cls: "productname",
                    text: NX.I18n.get("Header_Panel_Logo_Text")
                }, {xtype: "label", cls: "productspec", text: NX.State.getBrandedEditionAndVersion()}]
            }]
        }];
        a.callParent()
    }
});
Ext.define("NX.util.log.RemoteSink", {
    extend: "NX.util.log.Sink", enabled: false, receive: function (a) {
        var b = Ext.clone(a);
        b.message = b.message.join(" ");
        NX.direct.rapture_LogEvent.recordEvent(b)
    }
});
Ext.define("NX.util.log.ConsoleSink", {
    extend: "NX.util.log.Sink",
    requires: ["NX.Console"],
    enabled: false,
    receive: function (a) {
        NX.Console.recordEvent(a)
    }
});
Ext.define("NX.controller.Logging", {
    extend: "NX.app.Controller",
    requires: ["NX.Log", "NX.util.log.StoreSink", "NX.util.log.ConsoleSink", "NX.util.log.RemoteSink"],
    mixins: {stateful: "Ext.state.Stateful"},
    stores: ["LogEvent"],
    sinks: {},
    sinkRefs: undefined,
    threshold: "debug",
    constructor: function () {
        this.mixins.stateful.constructor.call(this, {stateful: true, stateId: this.self.getName()});
        this.callParent(arguments);
        this.initState()
    },
    init: function () {
        this.sinks = {
            store: Ext.create("NX.util.log.StoreSink", this.getStore("LogEvent")),
            console: Ext.create("NX.util.log.ConsoleSink"),
            remote: Ext.create("NX.util.log.RemoteSink")
        };
        this.sinkRefs = Ext.Object.getValues(this.sinks)
    },
    onLaunch: function () {
        NX.Log.attach(this);
        this.logInfo("Attached")
    },
    getState: function () {
        return {threshold: this.threshold}
    },
    getSink: function (a) {
        return this.sinks[a]
    },
    getThreshold: function () {
        return this.threshold
    },
    setThreshold: function (a) {
        this.threshold = a;
        this.saveState()
    },
    levelWeights: {all: 1, trace: 2, debug: 3, info: 4, warn: 5, error: 6, off: 7},
    exceedsThreshold: function (a) {
        return this.levelWeights[a] >= this.levelWeights[this.threshold]
    },
    recordEvent: function (b) {
        if (!this.exceedsThreshold(b.level)) {
            return
        }
        for (var a = 0; a < this.sinkRefs.length; a++) {
            if (this.sinkRefs[a].enabled) {
                this.sinkRefs[a].receive(b)
            }
        }
    }
});
Ext.define("NX.model.Icon", {
    extend: "Ext.data.Model",
    idProperty: "cls",
    fields: [{name: "cls", type: "string"}, {name: "name", type: "string"}, {
        name: "file",
        type: "string"
    }, {name: "variant", type: "string"}, {name: "height", type: "int"}, {name: "width", type: "int"}, {
        name: "url",
        type: "string"
    }, {name: "preload", type: "boolean"}]
});
Ext.define("NX.view.dev.styles.StyleSection", {
    extend: "Ext.panel.Panel",
    ui: "nx-light",
    bodyPadding: "5px 5px 5px 5px",
    html: function (b, a) {
        var c = {xtype: "container", html: b};
        if (a) {
            Ext.apply(c, a)
        }
        return c
    },
    label: function (b, a) {
        var c = {xtype: "label", html: b};
        if (a) {
            Ext.apply(c, a)
        }
        return c
    }
});
Ext.define("NX.view.dev.styles.Pickers", {
    extend: "NX.view.dev.styles.StyleSection",
    requires: ["Ext.data.ArrayStore"],
    title: "Pickers",
    initComponent: function () {
        var b = this, a;
        a = Ext.create("Ext.data.ArrayStore", {
            fields: ["id", "name"],
            data: [["foo", "Foo"], ["bar", "Bar"], ["baz", "Baz"]]
        });
        b.items = [{
            xtype: "nx-itemselector",
            name: "realms",
            buttons: ["up", "add", "remove", "down"],
            fromTitle: "Available",
            toTitle: "Selected",
            store: a,
            valueField: "id",
            displayField: "name",
            delimiter: null
        }];
        b.callParent()
    }
});
Ext.define("NX.view.dev.State", {
    extend: "Ext.grid.Panel",
    alias: "widget.nx-dev-state",
    title: "State",
    store: "State",
    emptyText: "No values",
    viewConfig: {deferEmptyText: false},
    columns: [{text: "key", dataIndex: "key", width: 250}, {text: "hash", dataIndex: "hash"}, {
        text: "value",
        dataIndex: "value",
        flex: 1,
        renderer: function (a) {
            return Ext.JSON.encode(a)
        }
    }]
});
Ext.define("NX.view.drilldown.Drilldown", {
    extend: "Ext.container.Container",
    alias: "widget.nx-drilldown",
    itemId: "nx-drilldown",
    requires: ["NX.Icons"],
    masters: null,
    nxActions: null,
    items: [],
    scrollable: "vertical",
    layout: {type: "vbox", align: "stretch", pack: "start"},
    initComponent: function () {
        var a = this;
        a.on("beforerender", a.loadDrilldown);
        a.callParent()
    },
    loadDrilldown: function (d) {
        var b = [], a;
        if (!d.masters) {
            a = []
        } else {
            if (!Ext.isArray(d.masters)) {
                a = [Ext.clone(d.masters)]
            } else {
                a = Ext.Array.clone(d.masters)
            }
        }
        if (!d.skipDetail) {
            if (d.detail) {
                a.push(d.detail)
            } else {
                a.push({
                    xtype: "nx-drilldown-details",
                    header: false,
                    plain: true,
                    layout: {type: "vbox", align: "stretch", pack: "start"},
                    tabs: Ext.clone(d.tabs),
                    nxActions: Ext.isArray(d.nxActions) ? Ext.Array.clone(d.nxActions) : d.nxActions
                })
            }
        }
        for (var c = 0; c < a.length; ++c) {
            b.push(d.createDrilldownItem(c, a[c], undefined))
        }
        d.add({
            xtype: "container",
            itemId: "drilldown-container",
            height: "100%",
            layout: {type: "card", animate: true},
            items: b
        })
    },
    createDrilldownItem: function (c, b, a) {
        return {
            xtype: "nx-drilldown-item",
            itemClass: this.iconCls || NX.Icons.cls(this.iconName) + (c === 0 ? "-x32" : "-x16"),
            items: [{xtype: "container", layout: "fit", itemId: "browse" + c, items: b}, {
                xtype: "container",
                layout: "fit",
                itemId: "create" + c,
                items: a
            }, {type: "container", layout: "fit", itemId: "nothin" + c}]
        }
    }
});
Ext.define("NX.view.dev.Permissions", {
    extend: "Ext.grid.Panel",
    requires: ["NX.Permissions"],
    alias: "widget.nx-dev-permissions",
    title: "Permissions",
    store: "Permission",
    emptyText: "No permissions",
    viewConfig: {deferEmptyText: false, markDirty: false},
    columns: [{
        text: "permission",
        dataIndex: "id",
        flex: 1,
        editor: {xtype: "textfield", allowBlank: false}
    }, {
        xtype: "nx-iconcolumn",
        text: "Permitted",
        dataIndex: "permitted",
        width: 100,
        align: "center",
        editor: "checkbox",
        iconVariant: "x16",
        iconName: function (a) {
            return a ? "permission-granted" : "permission-denied"
        }
    }],
    plugins: [{pluginId: "editor", ptype: "rowediting", clicksToEdit: 1, errorSummary: false}, "gridfilterbox"],
    tbar: [{xtype: "button", text: "Add", action: "add"}, {
        xtype: "button",
        text: "Delete",
        action: "delete",
        disabled: true
    }]
});
Ext.define("NX.view.dev.styles.Fonts", {
    extend: "NX.view.dev.styles.StyleSection",
    requires: ["Ext.XTemplate"],
    title: "Fonts",
    layout: {type: "vbox", defaultMargins: {top: 4, right: 0, bottom: 0, left: 0}},
    initComponent: function () {
        var e = this;
        var d = Ext.create("Ext.XTemplate", "<div>", '<span class="nx-section-header">{text}</span>', '<p class="{clz}">', "Trusted applications at the speed of deployment<br/>", "abcdefghijklmnopqrstuvwxyz<br/>", "ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>", ",1234567890?¿¡;.:*@#£$%&/()=[]+", "</p>", "</div>");

        function c(g, h) {
            return e.html(d.apply({text: g, clz: h}))
        }

        var b = Ext.create("Ext.XTemplate", '<table cellpadding="5">', "<thead>{thead}</thead>", "<tbody>{tbody}</tbody>", "</table>");
        var a = Ext.create("Ext.XTemplate", '<tpl for=".">', "<th>{.}</th>", "</tpl>");
        var f = Ext.create("Ext.XTemplate", '<tpl foreach=".">', "<tr>", "<td>{$}</td>", '<tpl for=".">', '<tpl if="clz">', '<td class="{clz}">{text}</td>', "<tpl else>", "<td>{.}</td>", "</tpl>", "</tpl>", "</tr>", "</tpl>");
        e.items = [{
            xtype: "panel",
            title: "Faces",
            ui: "nx-subsection",
            layout: {type: "hbox", defaultMargins: {top: 0, right: 20, bottom: 0, left: 0}},
            items: [c("Proxima Nova Regular", "nx-proxima-nova-regular"), c("Proxima Nova Bold", "nx-proxima-nova-bold"), c("Courier New", "nx-courier-new-regular")]
        }, {
            xtype: "panel",
            title: "Styles",
            ui: "nx-subsection",
            items: [e.html(b.apply({
                thead: a.apply(["Name", "Description", "Font & Weight", "Use Cases", "Pixels", "Sample"]),
                tbody: f.apply({
                    h1: ["Header", "Proxima Nova Light", "Logo", "20", {
                        text: "Sonatype Nexus",
                        clz: "nx-sample-h1"
                    }],
                    h2: ["Header", "Proxima Nova Bold", "Page Title", "26", {text: "Development", clz: "nx-sample-h2"}],
                    h3: ["Header", "Proxima Nova Bold", "Header", "22", {text: "Development", clz: "nx-sample-h3"}],
                    h4: ["Header", "Proxima Nova Bold", "Sub-Header", "18", {text: "Development", clz: "nx-sample-h4"}],
                    h5: ["Header", "Proxima Nova Bold", "Sub-Header", "13", {text: "Development", clz: "nx-sample-h5"}],
                    "p/ul/ol": ["Body", "Proxima Nova Regular", "Body text, lists, default size", "13", {
                        text: "Development",
                        clz: "nx-sample-body"
                    }],
                    code: ["Code", "Courier New Regular", "Code examples", "13", {
                        text: "Development",
                        clz: "nx-sample-code"
                    }],
                    utility: ["Small Text", "Proxima Nova Regular", "Labels, Side-Nav", "10", {
                        text: "Development",
                        clz: "nx-sample-utility"
                    }]
                })
            }))]
        }];
        e.callParent()
    }
});
Ext.define("NX.ext.form.field.Password", {
    extend: "Ext.form.field.Text",
    alias: "widget.nx-password",
    inputType: "password"
});
Ext.define("NX.Windows", {
    singleton: true,
    requires: ["NX.Messages", "NX.I18n"],
    mixins: {logAware: "NX.LogAware"},
    open: function (b, a, e, c) {
        var d;
        if (e === undefined) {
            e = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"
        }
        d = NX.global.open(b, a, e, c);
        if (d === null) {
            NX.Messages.error(NX.I18n.get("Windows_Popup_Message"))
        }
        return d
    }
});
Ext.define("NX.view.AboutWindow", {
    extend: "NX.view.ModalDialog",
    alias: "widget.nx-aboutwindow",
    requires: ["NX.I18n", "NX.Icons", "NX.State", "NX.util.Url"],
    cls: "nx-aboutwindow",
    initComponent: function () {
        var a = this;
        a.layout = {type: "vbox", align: "stretch"};
        a.height = 480;
        a.width = NX.view.ModalDialog.LARGE_MODAL;
        a.title = NX.I18n.get("AboutWindow_Title");
        a.items = [{
            xtype: "container",
            cls: "summary",
            layout: {type: "hbox", align: "stretch"},
            items: [{xtype: "component", cls: "logo", html: NX.Icons.img("nexus-black", "x100")}, {
                xtype: "nx-info",
                itemId: "aboutInfo",
                flex: 1
            }]
        }, {
            xtype: "tabpanel",
            ui: "nx-light",
            flex: 1,
            items: [{
                title: NX.I18n.get("AboutWindow_About_Title"),
                xtype: "uxiframe",
                src: NX.util.Url.urlOf("/COPYRIGHT.html")
            }, {title: NX.I18n.get("AboutWindow_License_Tab"), xtype: "uxiframe", src: NX.util.Url.licenseUrl()}]
        }];
        a.buttons = [{
            text: NX.I18n.get("Button_Close"), action: "close", ui: "nx-primary", handler: function () {
                a.close()
            }
        }];
        a.buttonAlign = "left";
        a.callParent();
        a.down("#aboutInfo").showInfo({
            Version: NX.State.getVersion(),
            Edition: NX.State.getEdition(),
            "Build Revision": NX.State.getBuildRevision(),
            "Build Timestamp": NX.State.getBuildTimestamp()
        })
    }
});
Ext.define("NX.controller.Help", {
    extend: "NX.app.Controller",
    requires: ["NX.Icons", "NX.I18n", "NX.Windows"],
    views: ["header.Help", "AboutWindow"],
    statics: {
        baseUrl: "https://links.sonatype.com/products/nexus", getDocsUrl: function () {
            return NX.controller.Help.baseUrl + "/docs/" + NX.State.getVersionMajorMinor()
        }
    },
    init: function () {
        var a = this;
        a.getApplication().getIconController().addIcons({
            "help-support": {
                file: "support.png",
                variants: ["x16", "x32"]
            },
            "help-issues": {file: "bug.png", variants: ["x16", "x32"]},
            "help-manual": {file: "book_picture.png", variants: ["x16", "x32"]},
            "help-community": {file: "users_4.png", variants: ["x16", "x32"]},
            "help-kb": {file: "brain_trainer.png", variants: ["x16", "x32"]},
            "help-guides": {file: "sonatype.png", variants: ["x16", "x32"]}
        });
        a.listen({
            component: {
                "nx-header-help menuitem[action=about]": {click: a.onAbout},
                "nx-header-help menuitem[action=docs]": {click: a.onDocs},
                "nx-header-help menuitem[action=support]": {click: a.onSupport},
                "nx-header-help menuitem[action=issues]": {click: a.onIssues},
                "nx-header-help menuitem[action=community]": {click: a.onCommunity},
                "nx-header-help menuitem[action=kb]": {click: a.onKnowledgeBase},
                "nx-header-help menuitem[action=guides]": {click: a.onGuides}
            }
        })
    },
    openUrl: function (a) {
        NX.Windows.open(NX.controller.Help.baseUrl + "/" + a)
    },
    onAbout: function () {
        Ext.widget("nx-aboutwindow")
    },
    onDocs: function () {
        NX.Windows.open(NX.controller.Help.getDocsUrl())
    },
    onSupport: function () {
        this.openUrl("support")
    },
    onIssues: function () {
        this.openUrl("issues")
    },
    onCommunity: function () {
        this.openUrl("community")
    },
    onKnowledgeBase: function () {
        this.openUrl("kb")
    },
    onGuides: function () {
        NX.Windows.open("https://links.sonatype.com/products/nxrm3/guides")
    }
});
Ext.define("NX.view.dev.Conditions", {
    extend: "Ext.grid.Panel",
    alias: "widget.nx-dev-conditions",
    title: "Conditions",
    store: "NX.store.dev.Condition",
    emptyText: "No condition",
    viewConfig: {deferEmptyText: false},
    columns: [{text: "id", dataIndex: "id", flex: 1}, {
        text: "condition",
        dataIndex: "condition",
        flex: 3
    }, {
        xtype: "nx-iconcolumn",
        text: "satisfied",
        dataIndex: "satisfied",
        width: 80,
        align: "center",
        iconVariant: "x16",
        iconName: function (a) {
            return a ? "permission-granted" : "permission-denied"
        }
    }],
    plugins: ["gridfilterbox"],
    tbar: [{xtype: "checkbox", itemId: "showSatisfied", boxLabel: "Show Satisfied", value: true}, {
        xtype: "checkbox",
        itemId: "showUnsatisfied",
        boxLabel: "Show Unsatisfied",
        value: true
    }]
});
Ext.define("NX.ext.panel.Panel", {override: "Ext.panel.Panel", maskOnDisable: false});
Ext.define("NX.ext.chart.legend.SpriteLegend", {
    override: "Ext.chart.legend.SpriteLegend", isXType: function (a) {
        return a === "sprite"
    }, getItemId: function () {
        return this.getId()
    }
});
Ext.define("NX.ext.button.Button", {
    extend: "Ext.button.Button",
    alias: "widget.nx-button",
    disableWithTooltip: function (a) {
        this.disable();
        Ext.tip.QuickTipManager.register({showDelay: 50, target: this.getId(), text: a, trackMouse: true});
        this._hasDisabledTooltip = true;
        this.btnEl.dom.style.pointerEvents = "all"
    },
    onEnable: function () {
        if (this._hasDisabledTooltip) {
            Ext.tip.QuickTipManager.unregister(this.getId());
            this._hasDisabledTooltip = false
        }
        this.callParent()
    }
});
Ext.define("NX.view.drilldown.Item", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-drilldown-item",
    itemName: null,
    itemClass: null,
    itemBookmark: null,
    cardIndex: 0,
    layout: "card",
    setItemName: function (a) {
        this.itemName = a
    },
    setItemClass: function (a) {
        this.itemClass = a
    },
    setItemBookmark: function (b, a) {
        this.itemBookmark = (b ? {obj: b, scope: a} : null)
    },
    setCardIndex: function (a) {
        this.cardIndex = a
    }
});
Ext.define("NX.view.footer.Branding", {extend: "Ext.container.Container", alias: "widget.nx-footer-branding"});
Ext.define("NX.view.dev.Logging", {
    extend: "Ext.grid.Panel",
    alias: "widget.nx-dev-logging",
    title: "Logging",
    store: "LogEvent",
    emptyText: "No events in buffer",
    viewConfig: {deferEmptyText: false, enableTextSelection: true},
    multiSelect: true,
    stateful: true,
    stateId: "nx-dev-logging",
    columns: [{text: "level", dataIndex: "level"}, {text: "logger", dataIndex: "logger", flex: 1}, {
        text: "message",
        dataIndex: "message",
        flex: 3,
        renderer: function (a) {
            return a.join(" ")
        }
    }, {text: "timestamp", dataIndex: "timestamp", width: 130}],
    tbar: [{xtype: "button", text: "Clear events", action: "clear", iconCls: "x-fa fa-eraser"}, {
        xtype: "button",
        text: "Export selection",
        action: "export",
        iconCls: "x-fa fa-download"
    }, "-", {xtype: "label", text: "Threshold:"}, {
        xtype: "combo",
        itemId: "threshold",
        store: "LogLevel",
        width: 80,
        displayField: "name",
        valueField: "name",
        queryMode: "local",
        allowBlank: false,
        editable: false
    }, "-", {xtype: "checkbox", itemId: "buffer", boxLabel: "Buffer"}, {
        xtype: "numberfield",
        itemId: "bufferSize",
        width: 50,
        allowDecimals: false,
        allowExponential: false,
        minValue: -1,
        maxValue: 999,
        value: 200,
        enableKeyEvents: true,
        hideTrigger: true,
        mouseWheelEnabled: false,
        keyNavEnabled: false
    }, "-", {xtype: "checkbox", itemId: "console", boxLabel: "Mirror console"}, {
        xtype: "checkbox",
        itemId: "remote",
        boxLabel: "Remote events"
    }],
    plugins: [{
        ptype: "rowexpander",
        rowBodyTpl: Ext.create("Ext.XTemplate", '<table class="nx-rowexpander">', "<tr>", '<td class="x-selectable">{[this.render(values)]}</td>', "</tr>", "</table>", {
            compiled: true,
            render: function (a) {
                return Ext.encode(a.message)
            }
        })
    }, {ptype: "gridfilterbox"}]
});
Ext.define("NX.view.dev.styles.Messages", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Messages",
    layout: {type: "hbox", defaultMargins: {top: 0, right: 4, bottom: 0, left: 0}},
    initComponent: function () {
        var b = this;

        function a(c) {
            return {
                xtype: "window",
                baseCls: "x-toast " + c,
                html: "ui: '" + c + "'",
                hidden: false,
                collapsible: false,
                floating: false,
                closable: false,
                draggable: false,
                resizable: false,
                width: 200
            }
        }

        b.items = [a("info"), a("success"), a("warning"), a("error")];
        b.callParent()
    }
});
Ext.define("NX.view.dev.styles.Modals", {
    extend: "NX.view.dev.styles.StyleSection",
    requires: ["NX.I18n"],
    title: "Modals",
    layout: {type: "hbox", defaultMargins: {top: 0, right: 4, bottom: 0, left: 0}},
    initComponent: function () {
        var a = this;
        a.items = [{
            xtype: "window",
            title: NX.I18n.get("SignIn_Title"),
            hidden: false,
            collapsible: false,
            floating: false,
            closable: false,
            draggable: false,
            resizable: false,
            width: 320,
            cls: "fixed-modal",
            items: {
                xtype: "form",
                ui: "nx-inset",
                defaultType: "textfield",
                defaults: {anchor: "100%"},
                items: [{
                    name: "username",
                    itemId: "username",
                    emptyText: NX.I18n.get("SignIn_Username_Empty"),
                    allowBlank: false,
                    validateOnBlur: false
                }, {
                    name: "password",
                    itemId: "password",
                    inputType: "password",
                    emptyText: NX.I18n.get("SignIn_Password_Empty"),
                    allowBlank: false,
                    validateOnBlur: false
                }],
                buttonAlign: "left",
                buttons: [{
                    text: NX.I18n.get("SignIn_Submit_Button"),
                    formBind: true,
                    bindToEnter: true,
                    ui: "nx-primary"
                }, {text: NX.I18n.get("SignIn_Cancel_Button")}]
            }
        }, {
            xtype: "window",
            title: "Session",
            hidden: false,
            collapsible: false,
            floating: false,
            closable: false,
            draggable: false,
            resizable: false,
            width: 320,
            cls: "fixed-modal",
            items: [{
                xtype: "label",
                text: "Session is about to expire",
                style: {color: "red", "font-size": "20px", margin: "10px"}
            }],
            buttons: [{text: "Cancel"}]
        }];
        a.callParent()
    }
});
Ext.define("NX.view.dev.styles.Menus", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Menus",
    layout: {type: "hbox", defaultMargins: {top: 0, right: 4, bottom: 0, left: 0}},
    initComponent: function () {
        var a = this;

        function b(f, c, e, d) {
            return {text: f, iconCls: c, tooltip: e, action: d}
        }

        a.items = [{
            xtype: "menu",
            floating: false,
            items: [b("Help for [Feature]", "nx-icon-search-default-x16", "Help for the current feature", "feature"), "-", b("About", "nx-icon-nexus-white-x16", "About Nexus Repository Manager", "about"), b("Documentation", "nx-icon-help-manual-x16", "Product documentation", "docs"), b("Knowledge Base", "nx-icon-help-kb-x16", "Knowledge base", "kb"), b("Sonatype Guides", "nx-icon-help-guides-x16", "Sonatype Guides", "guides"), b("Community", "nx-icon-help-community-x16", "Community information", "community"), b("Issue Tracker", "nx-icon-help-issues-x16", "Issue and bug tracker", "issues"), "-", b("Support", "nx-icon-help-support-x16", "Product support", "support")]
        }];
        a.callParent()
    }
});
Ext.define("NX.view.dev.styles.Forms", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Forms",
    layout: {type: "hbox", defaultMargins: {top: 0, right: 4, bottom: 0, left: 0}},
    initComponent: function () {
        var a = this;
        a.items = [{
            xtype: "form",
            items: [{
                xtype: "textfield",
                value: "Text Input",
                allowBlank: false,
                fieldLabel: "[Label]",
                helpText: "[Optional description text]",
                width: 200
            }, {
                xtype: "textarea",
                value: "Text Input",
                allowBlank: false,
                fieldLabel: "[Label]",
                helpText: "[Optional description text]",
                width: 200
            }, {
                xtype: "checkbox",
                boxLabel: "Checkbox",
                checked: true,
                fieldLabel: null,
                helpText: null
            }, {xtype: "radio", boxLabel: "Radio Button", checked: true, fieldLabel: null, helpText: null}],
            buttons: [{text: "Submit", ui: "nx-primary"}, {text: "Discard"}]
        }, {
            xtype: "form",
            frame: true,
            collapsible: true,
            tools: [{type: "toggle"}, {type: "close"}, {type: "minimize"}, {type: "maximize"}, {type: "restore"}, {type: "gear"}, {type: "pin"}, {type: "unpin"}, {type: "right"}, {type: "left"}, {type: "down"}, {type: "refresh"}, {type: "minus"}, {type: "plus"}, {type: "help"}, {type: "search"}, {type: "save"}, {type: "print"}],
            bodyPadding: "10 20",
            defaults: {anchor: "98%", msgTarget: "side", allowBlank: false},
            items: [{xtype: "label", text: "Plain Label"}, {
                fieldLabel: "TextField",
                xtype: "textfield",
                name: "someField",
                emptyText: "Enter a value"
            }, {fieldLabel: "ComboBox", xtype: "combo", store: ["Foo", "Bar"]}, {
                fieldLabel: "DateField",
                xtype: "datefield",
                name: "date"
            }, {fieldLabel: "TimeField", name: "time", xtype: "timefield"}, {
                fieldLabel: "NumberField",
                xtype: "numberfield",
                name: "number",
                emptyText: "(This field is optional)",
                allowBlank: true
            }, {
                fieldLabel: "TextArea",
                xtype: "textareafield",
                name: "message",
                cls: "x-form-valid",
                value: 'This field is hard-coded to have the "valid" style (it will require some code changes to add/remove this style dynamically)'
            }, {
                fieldLabel: "Checkboxes",
                xtype: "checkboxgroup",
                columns: [100, 100],
                items: [{boxLabel: "Foo", checked: true, inputId: "fooChkInput"}, {boxLabel: "Bar"}]
            }, {
                fieldLabel: "Radios",
                xtype: "radiogroup",
                columns: [100, 100],
                items: [{boxLabel: "Foo", checked: true, name: "radios"}, {boxLabel: "Bar", name: "radios"}]
            }, {
                hideLabel: true,
                xtype: "htmleditor",
                name: "html",
                enableColors: false,
                value: "Mouse over toolbar for tooltips.<br /><br />The HTMLEditor IFrame requires a refresh between a stylesheet switch to get accurate colors.",
                height: 110
            }, {
                xtype: "fieldset",
                title: "Plain Fieldset",
                items: [{
                    hideLabel: true,
                    xtype: "radiogroup",
                    items: [{boxLabel: "Radio A", checked: true, name: "radiogrp2"}, {
                        boxLabel: "Radio B",
                        name: "radiogrp2"
                    }]
                }]
            }, {
                xtype: "fieldset",
                title: "Collapsible Fieldset",
                collapsible: true,
                items: [{xtype: "checkbox", boxLabel: "Checkbox 1"}, {xtype: "checkbox", boxLabel: "Checkbox 2"}]
            }, {
                xtype: "fieldset",
                title: "Checkbox Fieldset",
                checkboxToggle: true,
                items: [{xtype: "radio", boxLabel: "Radio 1", name: "radiongrp1"}, {
                    xtype: "radio",
                    boxLabel: "Radio 2",
                    name: "radiongrp1"
                }]
            }],
            buttons: [{
                text: "Toggle Enabled", handler: function () {
                    this.up("form").items.each(function (b) {
                        b.setDisabled(!b.disabled)
                    })
                }
            }, {
                text: "Reset Form", handler: function () {
                    this.up("form").getForm().reset()
                }
            }, {
                text: "Validate", handler: function () {
                    this.up("form").getForm().isValid()
                }
            }]
        }];
        a.callParent()
    }
});
Ext.define("NX.view.dev.styles.Tabs", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Tabs",
    layout: {type: "vbox", defaultMargins: {top: 4, right: 0, bottom: 0, left: 0}},
    initComponent: function () {
        var b = this;

        function a(c) {
            var d = {
                xtype: "tabpanel",
                width: 400,
                height: 80,
                activeTab: 0,
                ui: c,
                items: [{
                    title: "Settings",
                    items: {xtype: "panel", html: "A simple tab", ui: "nx-inset"}
                }, {
                    title: "Routing",
                    items: {xtype: "panel", html: "Another one", ui: "nx-inset"}
                }, {
                    title: "Smart Proxy",
                    items: {xtype: "panel", html: "Yet another", ui: "nx-inset"}
                }, {title: "Health Check", items: {xtype: "panel", html: "And one more", ui: "nx-inset"}}]
            };
            return {
                xtype: "container",
                layout: {type: "vbox", defaultMargins: {top: 4, right: 0, bottom: 0, left: 0}},
                items: [b.label("ui: " + c), Ext.clone(d), b.label("ui: " + c + "; plain: true"), Ext.apply(d, {plain: true})]
            }
        }

        b.items = [a("default"), a("nx-light")];
        b.callParent()
    }
});
Ext.define("NX.view.dev.styles.Other", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Other",
    layout: {type: "vbox", defaultMargins: {top: 4, right: 0, bottom: 0, left: 0}},
    initComponent: function () {
        var a = this;
        a.items = [a.label("date picker"), {xtype: "datepicker"}, a.label("sliders"), {
            xtype: "slider",
            hideLabel: true,
            value: 50,
            margin: "5 0 0 0",
            anchor: "100%"
        }, {xtype: "slider", vertical: true, value: 50, height: 100, margin: "5 0 0 0"}];
        a.callParent()
    }
});
Ext.define("NX.view.dev.styles.Panels", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Panels",
    layout: {type: "vbox", defaultMargins: {top: 4, right: 0, bottom: 0, left: 0}},
    initComponent: function () {
        var a = this;

        function b(c) {
            return {
                layout: {type: "hbox", defaultMargins: {top: 0, right: 4, bottom: 0, left: 0}},
                items: [{
                    xtype: "panel",
                    title: c,
                    ui: c,
                    height: 100,
                    width: 200,
                    items: [{xtype: "container", html: "ui: " + c}]
                }, {
                    xtype: "panel",
                    title: c + " framed",
                    ui: c,
                    frame: true,
                    height: 100,
                    width: 200,
                    items: [{xtype: "container", html: "ui: " + c + "; frame: true"}]
                }]
            }
        }

        a.items = [b("default"), b("light"), b("nx-subsection")];
        a.callParent()
    }
});
Ext.define("NX.view.dev.styles.Grids", {
    extend: "NX.view.dev.styles.StyleSection",
    requires: ["Ext.data.ArrayStore"],
    title: "Grids",
    initComponent: function () {
        var b = this, a;
        a = Ext.create("Ext.data.ArrayStore", {
            fields: ["id", "name"],
            data: [["foo", "Foo"], ["bar", "Bar"], ["baz", "Baz"]]
        });
        b.items = [{
            xtype: "grid",
            store: a,
            height: 200,
            width: 200,
            columns: [{text: "ID", dataIndex: "id"}, {text: "Name", dataIndex: "name"}]
        }];
        b.callParent()
    }
});
Ext.define("NX.view.dev.styles.Tooltips", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Tooltips",
    initComponent: function () {
        var a = this;
        a.items = [{xtype: "button", text: "Mouse over me", tooltip: "This is a tooltip"}];
        a.callParent()
    }
});
Ext.define("NX.view.dev.styles.Toolbars", {
    extend: "NX.view.dev.styles.StyleSection",
    title: "Toolbars",
    initComponent: function () {
        var b = this;

        function a(d) {
            var c = {
                xtype: "toolbar",
                items: ["text", {xtype: "button", text: "plain"}, {
                    xtype: "button",
                    text: "with icon",
                    iconCls: "nx-icon-help-kb-x16"
                }, " ", {
                    xtype: "button",
                    text: "button menu",
                    menu: [{text: "plain"}, {text: "with icon", iconCls: "nx-icon-help-kb-x16"}]
                }, "-", {
                    xtype: "splitbutton",
                    text: "split button",
                    menu: Ext.widget("menu", {items: [{text: "Item 1"}, {text: "Item 2"}]})
                }, {
                    xtype: "button",
                    enableToggle: true,
                    pressed: true,
                    text: "toggle button"
                }, "->", {xtype: "nx-searchbox", ariaLabel: "Sample search box", width: 200}]
            };
            if (d) {
                Ext.apply(c, {defaults: {scale: d}})
            }
            return c
        }

        b.items = [b.label("default"), a(undefined), b.label("scale: medium"), a("medium"), b.label("scale: large"), a("large")];
        b.callParent()
    }
});
Ext.define("NX.view.dev.styles.Colors", {
    extend: "NX.view.dev.styles.StyleSection",
    requires: ["Ext.XTemplate"],
    title: "Colors",
    initComponent: function () {
        var e = this;
        var f = Ext.create("Ext.XTemplate", "<div>", '<tpl for=".">', '<div class="nx-hbox">{.}</div>', "</tpl>", "</div>");
        var b = Ext.create("Ext.XTemplate", "<div>", '<tpl for=".">', '<div class="nx-vbox">{.}</div>', "</tpl>", "</div>");
        var c = Ext.create("Ext.XTemplate", '<span class="{clz}">{text}</span>');
        var a = Ext.create("Ext.XTemplate", '<div style="margins: 0 20px 20px 0">', '<tpl for="."><div style="float: left;">{.}</div></tpl>', "</div>");
        var d = Ext.create("Ext.XTemplate", "<div>", '<div height="40" width="80" class="{clz}"></div>', "<div>{name}</div>", "<div>{value}</div>", "</div>");
        e.items = [{
            xtype: "container",
            layout: {type: "vbox", padding: 4},
            items: [e.html(b.apply([c.apply({
                text: "Shell",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color black",
                name: "Black",
                value: "#000000"
            }), d.apply({
                clz: "nx-color night-rider",
                name: "Night Rider",
                value: "#333333"
            }), d.apply({
                clz: "nx-color charcoal",
                name: "Charcoal",
                value: "#444444"
            }), d.apply({
                clz: "nx-color dark-gray",
                name: "Dark Gray",
                value: "#777777"
            }), d.apply({clz: "nx-color gray", name: "Gray", value: "#AAAAAA"}), d.apply({
                clz: "nx-color light-gray",
                name: "Light Gray",
                value: "#CBCBCB"
            }), d.apply({
                clz: "nx-color gainsboro",
                name: "Gainsboro",
                value: "#DDDDDD"
            }), d.apply({clz: "nx-color smoke", name: "Smoke", value: "#EBEBEB"}), d.apply({
                clz: "nx-color light-smoke",
                name: "Light Smoke",
                value: "#F4F4F4"
            }), d.apply({
                clz: "nx-color white",
                name: "White",
                value: "#FFFFFF"
            })])])), e.html(f.apply([b.apply([c.apply({
                text: "Severity",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color cerise",
                name: "Cerise",
                value: "#DB2852"
            }), d.apply({clz: "nx-color sun", name: "Sun", value: "#F2862F"}), d.apply({
                clz: "nx-color energy-yellow",
                name: "Energy Yellow",
                value: "#F5C649"
            }), d.apply({
                clz: "nx-color cobalt",
                name: "Cobalt",
                value: "#0047B2"
            }), d.apply({
                clz: "nx-color cerulean-blue",
                name: "Cerulean Blue",
                value: "#2476C3"
            })])]), b.apply([c.apply({
                text: "Forms",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color citrus",
                name: "Citrus",
                value: "#84C900"
            }), d.apply({
                clz: "nx-color free-speech-red",
                name: "Free Speech Red",
                value: "#C70000"
            })])]), b.apply([c.apply({
                text: "Tooltip",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color energy-yellow",
                name: "Energy Yellow",
                value: "#F5C649"
            }), d.apply({
                clz: "nx-color floral-white",
                name: "Floral White",
                value: "#FFFAEE"
            })])])])), e.html(b.apply([c.apply({
                text: "Dashboard",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color pigment-green",
                name: "Pigment Green",
                value: "#0B9743"
            }), d.apply({
                clz: "nx-color madang",
                name: "Madang",
                value: "#B6E9AB"
            }), d.apply({
                clz: "nx-color venetian-red",
                name: "Venetian Red",
                value: "#BC0430"
            }), d.apply({
                clz: "nx-color beauty-bush",
                name: "Beauty Bush",
                value: "#EDB2AF"
            }), d.apply({
                clz: "nx-color navy-blue",
                name: "Navy Blue",
                value: "#006BBF"
            }), d.apply({
                clz: "nx-color cornflower",
                name: "Cornflower",
                value: "#96CAEE"
            }), d.apply({
                clz: "nx-color east-side",
                name: "East Side",
                value: "#B087B9"
            }), d.apply({
                clz: "nx-color blue-chalk",
                name: "Blue Chalk",
                value: "#DAC5DF"
            })])])), e.html(f.apply([b.apply([c.apply({
                text: "Buttons",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color white",
                name: "White",
                value: "#FFFFFF"
            }), d.apply({
                clz: "nx-color light-gainsboro",
                name: "Light Gainsboro",
                value: "#E6E6E6"
            }), d.apply({
                clz: "nx-color light-gray",
                name: "Light Gray",
                value: "#CBCBCB"
            }), d.apply({clz: "nx-color silver", name: "Silver", value: "#B8B8B8"}), d.apply({
                clz: "nx-color suva-gray",
                name: "Suva Gray",
                value: "#919191"
            }), d.apply({
                clz: "nx-color gray",
                name: "Gray",
                value: "#808080"
            })]), a.apply([d.apply({
                clz: "nx-color denim",
                name: "Denim",
                value: "#197AC5"
            }), d.apply({
                clz: "nx-color light-cobalt",
                name: "Light Cobalt",
                value: "#0161AD"
            }), d.apply({
                clz: "nx-color dark-denim",
                name: "Dark Denim",
                value: "#14629E"
            }), d.apply({
                clz: "nx-color smalt",
                name: "Smalt",
                value: "#014E8A"
            }), d.apply({
                clz: "nx-color dark-cerulean",
                name: "Dark Cerulean",
                value: "#0F4976"
            }), d.apply({
                clz: "nx-color prussian-blue",
                name: "Prussian Blue",
                value: "#013A68"
            })]), a.apply([d.apply({
                clz: "nx-color light-cerise",
                name: "Light Cerise",
                value: "#DE3D63"
            }), d.apply({
                clz: "nx-color brick-red",
                name: "Brick Red",
                value: "#C6254B"
            }), d.apply({
                clz: "nx-color old-rose",
                name: "Old Rose",
                value: "#B2314F"
            }), d.apply({
                clz: "nx-color fire-brick",
                name: "Fire Brick",
                value: "#9E1E3C"
            }), d.apply({clz: "nx-color shiraz", name: "Shiraz", value: "#85253B"}), d.apply({
                clz: "nx-color falu-red",
                name: "Falu Red",
                value: "#77162D"
            })]), a.apply([d.apply({
                clz: "nx-color sea-buckthorn",
                name: "Sea Buckthorn",
                value: "#F39244"
            }), d.apply({
                clz: "nx-color tahiti-gold",
                name: "Tahiti Gold",
                value: "#DA792B"
            }), d.apply({clz: "nx-color zest", name: "Zest", value: "#C17536"}), d.apply({
                clz: "nx-color rich-gold",
                name: "Rich Gold",
                value: "#AE6122"
            }), d.apply({
                clz: "nx-color afghan-tan",
                name: "Afghan Tan",
                value: "#925829"
            }), d.apply({
                clz: "nx-color russet",
                name: "Russet",
                value: "#83491A"
            })]), a.apply([d.apply({
                clz: "nx-color elf-green",
                name: "Elf Green",
                value: "#23A156"
            }), d.apply({
                clz: "nx-color dark-pigment-green",
                name: "Dark Pigment Green",
                value: "#0B893D"
            }), d.apply({clz: "nx-color salem", name: "Salem", value: "#1C8145"}), d.apply({
                clz: "nx-color jewel",
                name: "Jewel",
                value: "#096E31"
            }), d.apply({
                clz: "nx-color fun-green",
                name: "Fun Green",
                value: "#156134"
            }), d.apply({
                clz: "nx-color dark-jewel",
                name: "Dark Jewel",
                value: "#0C4F26"
            })])]), b.apply([c.apply({
                text: "Font Awesome Icons",
                clz: "nx-section-header"
            }), a.apply([d.apply({
                clz: "nx-color navy-blue",
                name: "Navy Blue",
                value: "#006BBF"
            }), d.apply({
                clz: "nx-color smalt",
                name: "Smalt",
                value: "#014E8A"
            }), d.apply({
                clz: "nx-color prussian-blue",
                name: "Prussian Blue",
                value: "#013A68"
            })]), a.apply([d.apply({
                clz: "nx-color white",
                name: "White",
                value: "#FFFFFF"
            }), d.apply({
                clz: "nx-color gainsboro",
                name: "Gainsboro",
                value: "#DDDDDD"
            }), d.apply({clz: "nx-color gray", name: "Gray", value: "#AAAAAA"})])])]))]
        }];
        e.callParent()
    }
});
Ext.define("NX.view.dev.styles.Buttons", {
    extend: "NX.view.dev.styles.StyleSection",
    requires: ["Ext.XTemplate"],
    title: "Buttons",
    layout: {type: "vbox", defaultMargins: {top: 4, right: 0, bottom: 0, left: 0}},
    initComponent: function () {
        var c = this;
        var a = Ext.create("Ext.XTemplate", "<table>", '<tpl for=".">', "<tr>", '<td><div class="nx-color {.}"></div></td>', '<td><div style="padding: 0 10px 0 0">$color-{.}</div></td>', "</tr>", "</tpl>", "</table>");

        function b(h, j, f, g, i) {
            var e = {xtype: "button", text: j, ui: h, margin: "0 10 10 0", width: 100};
            if (f) {
                e.disabled = true
            }
            if (g) {
                e.pressed = true;
                e.enableToggle = true
            }
            if (i) {
                e.menu = [{text: "First"}, "-", {text: "Second"}]
            } else {
                e.glyph = "xf036@FontAwesome"
            }
            return e
        }

        function d(f, e) {
            return {
                xtype: "container",
                layout: {type: "hbox", defaultMargins: {top: 0, right: 4, bottom: 0, left: 0}},
                items: [c.label("ui: " + f, {width: 80}), b(f, f, false, false, false), b(f, f, true, false, false), b(f, f, false, false, true), c.html(a.apply(e))]
            }
        }

        c.items = [d("default", ["white", "light-gainsboro", "light-gray", "silver", "suva-gray", "gray"]), d("nx-plain", ["white", "light-gainsboro", "light-gray", "silver", "suva-gray", "gray"]), d("nx-primary", ["denim", "light-cobalt", "dark-denim", "smalt", "dark-cerulean", "prussian-blue"]), d("nx-danger", ["light-cerise", "brick-red", "old-rose", "fire-brick", "shiraz", "falu-red"]), d("nx-warning", ["sea-buckthorn", "tahiti-gold", "zest", "rich-gold", "afghan-tan", "russet"]), d("nx-success", ["elf-green", "dark-pigment-green", "salem", "jewel", "fun-green", "dark-jewel"])];
        c.callParent()
    }
});
Ext.define("NX.view.dev.Styles", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-dev-styles",
    requires: ["NX.view.dev.styles.Colors", "NX.view.dev.styles.Fonts", "NX.view.dev.styles.Buttons", "NX.view.dev.styles.Forms", "NX.view.dev.styles.Messages", "NX.view.dev.styles.Modals", "NX.view.dev.styles.Menus", "NX.view.dev.styles.Tabs", "NX.view.dev.styles.Pickers", "NX.view.dev.styles.Tooltips", "NX.view.dev.styles.Panels", "NX.view.dev.styles.Toolbars", "NX.view.dev.styles.Grids", "NX.view.dev.styles.Other"],
    mixins: {logAware: "NX.LogAware"},
    title: "Styles",
    layout: {type: "vbox", defaultMargins: {top: 0, right: 4, bottom: 10, left: 0}},
    defaults: {width: "100%"},
    initComponent: function () {
        var a = this;
        a.on("activate", function () {
            var b = ["Colors", "Fonts", "Buttons", "Forms", "Messages", "Modals", "Menus", "Tooltips", "Tabs", "Pickers", "Panels", "Toolbars", "Grids", "Other"];
            a.logDebug("Creating style guide");
            Ext.Array.each(b, function (c) {
                a.add(Ext.create("NX.view.dev.styles." + c))
            });
            a.logDebug("Style guide ready")
        });
        a.on("deactivate", function () {
            a.removeAll(true);
            a.logDebug("Destroyed style guide")
        });
        a.callParent()
    }
});
Ext.define("NX.ext.form.OptionalFieldSet", {
    extend: "Ext.form.FieldSet",
    alias: "widget.nx-optionalfieldset",
    cls: "nx-optionalfieldset",
    plugins: {responsive: true},
    responsiveConfig: {
        "width <= 1366": {maxWidth: 600},
        "width <= 1600": {maxWidth: 800},
        "width > 1600": {maxWidth: 1000}
    },
    initComponent: function () {
        var a = this;
        a.on("add", a.setupMonitorOnChange, a);
        a.callParent(arguments);
        a.on("collapse", a.enableContainedItems, a);
        a.on("expand", a.enableContainedItems, a);
        a.on("afterrender", a.enableContainedItems, a)
    },
    enableContainedItems: function (a, b) {
        var c = this;
        if (!Ext.isDefined(b)) {
            b = !a.collapsed
        }
        if (a.items) {
            a.items.each(function (d) {
                if (b) {
                    if (!d.disabledOnCollapse && !d.isXType("container")) {
                        d.enable()
                    }
                    delete d.disabledOnCollapse;
                    if (d.isXType("nx-optionalfieldset")) {
                        if (d.collapsedOnCollapse === false) {
                            d.expand()
                        }
                        delete d.collapsedOnCollapse
                    }
                } else {
                    if (!Ext.isDefined(d.disabledOnCollapse)) {
                        d.disabledOnCollapse = d.isDisabled()
                    }
                    if (!d.isXType("container")) {
                        d.disable()
                    }
                    if (d.isXType("nx-optionalfieldset")) {
                        if (!Ext.isDefined(d.collapsedOnCollapse)) {
                            d.collapsedOnCollapse = d.collapsed
                        }
                        d.collapse()
                    }
                }
                if (!d.isXType("nx-optionalfieldset")) {
                    c.enableContainedItems(d, b)
                }
                if (Ext.isFunction(d.validate)) {
                    d.validate()
                }
            })
        }
    },
    setupMonitorOnChange: function (a, b) {
        var c = this;
        if (c === a) {
            c.mon(b, "change", function (e, d) {
                if (d && c.collapsed) {
                    c.expand();
                    if (c.checkboxCmp) {
                        c.checkboxCmp.resetOriginalValue()
                    }
                }
            })
        }
    }
});
Ext.define("NX.view.dev.Tests", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-dev-tests",
    title: "Tests",
    layout: {type: "vbox", padding: 4, defaultMargins: {top: 0, right: 0, bottom: 4, left: 0}},
    items: [{xtype: "button", text: "clear local state", action: "clearLocalState"}, {
        xtype: "button",
        text: "javascript error",
        action: "testError"
    }, {xtype: "button", text: "ext error", action: "testExtError"}, {
        xtype: "button",
        text: "message types",
        action: "testMessages"
    }, {xtype: "button", text: "toggle unsupported browser", action: "toggleUnsupportedBrowser"}, {
        xtype: "button",
        text: "show quorum warning",
        action: "showQuorumWarning"
    }]
});
Ext.define("NX.store.Icon", {extend: "Ext.data.Store", model: "NX.model.Icon"});
Ext.define("NX.ext.form.field.Hostname", {
    extend: "Ext.form.field.Text",
    requires: ["NX.util.Validator"],
    alias: "widget.nx-hostname",
    vtype: "nx-hostname",
    maskRe: /\S/
});
Ext.define("NX.view.drilldown.Actions", {
    extend: "Ext.toolbar.Toolbar",
    alias: "widget.nx-actions",
    cls: "nx-actions",
    dock: "top"
});
Ext.define("NX.ext.form.field.Checkbox", {
    override: "Ext.form.field.Checkbox",
    width: undefined,
    initComponent: function () {
        var a = this;
        if (a.helpText && !a.isHelpTextPlaced) {
            a.boxLabel = '<span class="nx-boxlabel">' + a.helpText + "</span>";
            a.isHelpTextPlaced = true
        }
        a.callParent(arguments)
    }
});
Ext.define("NX.ext.grid.column.Icon", {
    extend: "Ext.grid.column.Column",
    alias: "widget.nx-iconcolumn",
    requires: ["Ext.DomHelper", "NX.Icons"],
    hideable: false,
    sortable: false,
    menuDisabled: true,
    resizable: false,
    draggable: false,
    focusable: false,
    ariaRole: "presentation",
    defaultRenderer: function (g, h, c) {
        var f = this, b, a = f.iconHeight, e = f.iconWidth, d;
        b = f.iconCls(g, h, c);
        if (f.iconVariant) {
            switch (f.iconVariant) {
                case"x16":
                    a = e = 16;
                    break;
                case"x32":
                    a = e = 32;
                    break
            }
        }
        d = {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: b, alt: f.iconName(g, h, c)};
        if (a) {
            d.height = a
        }
        if (e) {
            d.width = e
        }
        return Ext.DomHelper.markup(d)
    },
    iconName: function (b, c, a) {
        return b
    },
    iconCls: function (d, e, a) {
        var c = this, b = c.iconName(d, e, a);
        if (c.iconNamePrefix) {
            b = c.iconNamePrefix + b
        }
        return NX.Icons.cls(b, c.iconVariant)
    }
});
Ext.define("NX.model.Permission", {
    extend: "Ext.data.Model",
    requires: ["NX.Permissions"],
    fields: [{name: "id", type: "string"}, {name: "permitted", type: "bool", defaultValue: true}]
});
Ext.define("NX.store.Permission", {
    extend: "Ext.data.Store",
    model: "NX.model.Permission",
    proxy: {
        type: "direct",
        paramsAsHash: false,
        api: {read: "NX.direct.rapture_Security.getPermissions"},
        reader: {type: "json", rootProperty: "data", successProperty: "success"}
    },
    sortOnLoad: true,
    sorters: {property: "id", direction: "ASC"}
});
Ext.define("NX.controller.dev.Permissions", {
    extend: "NX.app.Controller",
    requires: ["NX.Permissions"],
    stores: ["Permission"],
    models: ["Permission"],
    views: ["dev.Permissions"],
    refs: [{ref: "grid", selector: "nx-dev-permissions"}],
    init: function () {
        var a = this;
        a.getApplication().getIconController().addIcons({
            "permission-granted": {
                file: "tick.png",
                variants: ["x16", "x32"]
            }, "permission-denied": {file: "cross.png", variants: ["x16", "x32"]}
        });
        a.listen({
            component: {
                "nx-dev-permissions": {
                    beforeedit: a.beforeEdit,
                    canceledit: a.cancelEdit,
                    validateedit: a.update,
                    selectionchange: a.onSelectionChange
                },
                "nx-dev-permissions button[action=add]": {click: a.add},
                "nx-dev-permissions button[action=delete]": {click: a.deleteModel}
            }
        })
    },
    add: function () {
        var d = this, b = d.getGrid(), c = b.getPlugin("editor"), a = d.getPermissionModel().create();
        c.cancelEdit();
        b.getStore().insert(0, a);
        c.startEdit(a, 0)
    },
    deleteModel: function () {
        var a = this.getGrid(), b = a.getPlugin("editor");
        b.cancelEdit();
        a.getStore().remove(a.getSelectionModel().getSelection())
    },
    beforeEdit: function (c, b) {
        var a = c.editor.form.findField("id");
        if (b.record.get("id")) {
            a.disable()
        } else {
            a.enable()
        }
    },
    cancelEdit: function (b, a) {
        if (!a.record.get("id")) {
            a.store.remove(a.record)
        }
    },
    update: function (b, a) {
        a.record.set("permitted", a.newValues.permitted);
        a.record.commit()
    },
    onSelectionChange: function (a, b) {
        var c = this.getGrid().down("button[action=delete]");
        c.setDisabled(!b.length)
    }
});
Ext.define("NX.ext.plugin.SearchBoxTip", {
    extend: "Ext.plugin.Abstract",
    alias: "plugin.searchboxtip",
    requires: ["Ext.tip.Tip", "NX.I18n", "NX.controller.Help"],
    init: function (b) {
        var a = this;
        a.setCmp(b);
        a.tip = Ext.create("Ext.tip.Tip", {
            alignTarget: b,
            cls: "nx-search-tip",
            defaultAlign: "tl-bl",
            html: a.message + '<br><span class="footer"><a target="_blank" rel="noopener" href="' + NX.controller.Help.getDocsUrl() + '/Searching+for+Components">' + NX.I18n.get("SearchBoxTip_LearnMore") + ' <i class="fa fa-external-link" /></a></span>',
            listeners: {
                afterrender: function () {
                    a.tip.el.set({"data-for-id": b.getInputId()})
                }
            }
        });
        b.on("focus", a.onFocus, a);
        b.on("blur", a.onBlur, a);
        b.on("beforedestroy", a.onBeforeDestroy, a);
        a.boundOnClick = a.onWindowClick.bind(a)
    },
    onFocus: function () {
        window.addEventListener("click", this.boundOnClick);
        this.tip.show()
    },
    onBlur: function () {
        this.blurTimeoutId = window.setTimeout(this.hide.bind(this), 200)
    },
    onBeforeDestroy: function () {
        this.hide();
        if (this.tip) {
            this.tip.destroy()
        }
    },
    onWindowClick: function (a) {
        if (!this.getCmp().el.contains(a.target) && !this.tip.el.contains(a.target)) {
            this.hide()
        }
        if (this.blurTimeoutId) {
            window.clearTimeout(this.blurTimeoutId);
            this.blurTimeoutId = null
        }
    },
    hide: function () {
        if (this.tip) {
            this.tip.hide()
        }
        window.removeEventListener("click", this.boundOnClick)
    }
});
Ext.define("NX.ext.form.field.RegExp", {
    extend: "Ext.form.field.Text",
    alias: "widget.nx-regexp",
    validator: function (b) {
        try {
            new RegExp(b)
        } catch (a) {
            return a.message
        }
        return true
    }
});
Ext.define("NX.ext.grid.plugin.RemoteFilterBox", {
    extend: "Ext.AbstractPlugin",
    alias: "plugin.remotegridfilterbox",
    requires: ["NX.I18n", "NX.util.Filter"],
    init: function (b) {
        var c = this, d = b.getDockedItems('toolbar[dock="top"]')[0], a = ["->", {
            xtype: "nx-searchbox",
            cls: ["nx-searchbox", "nx-filterbox"],
            iconClass: "fa-filter",
            emptyText: NX.I18n.get("Grid_Plugin_FilterBox_Empty"),
            searchDelay: 200,
            width: 200,
            listeners: {search: c.onSearch, searchcleared: c.onSearchCleared, scope: c}
        }];
        c.grid = b;
        c.callParent(arguments);
        if (d) {
            d.add(a)
        } else {
            b.addDocked([{xtype: "nx-actions", dock: "top", items: a}])
        }
        c.grid.on("filteringautocleared", c.syncSearchBox, c)
    },
    syncSearchBox: function () {
        var a = this;
        a.grid.down("nx-searchbox").setValue(a.filterValue)
    },
    clearSearch: function () {
        var a = this;
        a.grid.down("nx-searchbox").clearSearch()
    },
    onSearch: function (e, d) {
        var c = e.up("grid"), b = c.getStore(), a = c.getView().emptyTextFilter;
        if (!c.emptyText) {
            c.emptyText = c.getView().emptyText
        }
        c.getView().emptyText = NX.util.Filter.buildEmptyResult(d, a);
        c.getSelectionModel().deselectAll();
        b.addFilter([{id: "filter", property: "filter", value: d}])
    },
    onSearchCleared: function (c) {
        var b = c.up("grid"), a = b.getStore();
        if (b.emptyText) {
            b.getView().emptyText = b.emptyText
        }
        b.getSelectionModel().deselectAll();
        if (a.getFilters().removeAtKey("filter")) {
            if (a.getFilters().length) {
                a.filter()
            } else {
                a.clearFilter()
            }
        }
    }
});
Ext.define("NX.model.LogLevel", {
    extend: "Ext.data.Model",
    idProperty: "name",
    fields: [{name: "name", type: "string"}]
});
Ext.define("NX.store.LogLevel", {
    extend: "Ext.data.Store",
    model: "NX.model.LogLevel",
    data: [{name: "all"}, {name: "trace"}, {name: "debug"}, {name: "info"}, {name: "warn"}, {name: "error"}, {name: "off"}]
});
Ext.define("NX.util.DownloadHelper", {
    singleton: true,
    requires: ["NX.Messages", "NX.Windows", "NX.I18n"],
    mixins: {logAware: "NX.LogAware"},
    windowId: "nx-download-frame",
    windowName: "nx_download_frame",
    getFrame: function () {
        var a = this, b;
        b = Ext.get(a.windowId);
        if (!b) {
            b = Ext.getBody().createChild({tag: "iframe", cls: "x-hidden", id: a.windowId, name: a.windowName})
        }
        return b
    },
    downloadUrl: function (a) {
        var b = this;
        b.getFrame();
        if (NX.Windows.open(a, b.windowName) !== null) {
            NX.Messages.success(NX.I18n.get("Util_DownloadHelper_Download_Message"))
        }
    }
});
Ext.define("NX.ext.form.field.Base", {
    override: "Ext.form.field.Base",
    plugins: {responsive: true},
    responsiveConfig: {
        "width <= 1366": {maxWidth: 600},
        "width <= 1600": {maxWidth: 800},
        "width > 1600": {maxWidth: 1000}
    },
    width: "100%",
    labelAlign: "top",
    labelStyle: "font-weight: bold;",
    msgTarget: "under",
    hideIfUndefined: false,
    isHelpTextPlaced: false,
    initComponent: function () {
        var a = this;
        if (a.helpText && !a.isHelpTextPlaced) {
            a.beforeSubTpl = '<span class="nx-boxlabel">' + a.helpText + "</span>";
            a.isHelpTextPlaced = true
        }
        a.callParent(arguments)
    },
    setValue: function (b) {
        var a = this;
        a.callParent(arguments);
        if (a.readOnly && a.hideIfUndefined) {
            if (b) {
                a.show()
            } else {
                a.hide()
            }
        }
    },
    setHelpText: function (a) {
        this.beforeSubTpl = '<span class="nx-boxlabel">' + a + "</span>";
        this.fireEvent("render")
    }
});
Ext.define("NX.wizard.Step", {
    alias: "widget.nx-wizard-step",
    requires: ["NX.Assert"],
    mixins: {observable: "Ext.util.Observable", logAware: "NX.LogAware"},
    config: {screen: undefined, resetOnBack: false, enabled: true},
    controller: undefined,
    name: undefined,
    screenClass: undefined,
    screenXtype: undefined,
    constructor: function (a) {
        var b = this;
        b.mixins.observable.constructor.call(b, a);
        b.initConfig(a);
        b.name = Ext.getClassName(b);
        b.screenClass = Ext.ClassManager.get(b.getScreen());
        b.screenXtype = b.screenClass.xtype
    },
    getName: function () {
        return this.name
    },
    getScreenClass: function () {
        return this.screenClass
    },
    getScreenXtype: function () {
        return this.screenXtype
    },
    getScreenCmp: function () {
        var b = this.screenXtype, a = Ext.ComponentQuery.query(b);
        if (a.length === 0) {
            return undefined
        }
        return a[0]
    },
    createScreenCmp: function () {
        return {xtype: this.screenXtype}
    },
    attach: function (a) {
        var b = this;
        b.controller = a;
        b.controller.control(b.screenXtype, {activate: {fn: b.doActivate, scope: b}});
        b.init()
    },
    init: Ext.emptyFn,
    prepared: false,
    doActivate: function () {
        var a = this;
        if (!a.prepared) {
            a.prepare();
            a.prepared = true
        }
    },
    prepare: Ext.emptyFn,
    refresh: Ext.emptyFn,
    reset: function () {
        this.prepared = false;
        this.setEnabled(true)
    },
    control: function (a) {
        var b = this, d = b.screenXtype, c = b.controller;
        Ext.Object.each(a, function (e, f) {
            var g;
            if (e === "$screen") {
                g = d
            } else {
                g = d + " " + e
            }
            c.control(g, b.normalizeListeners(f))
        })
    },
    normalizeListeners: function (a) {
        var c = this, b, d;
        for (b in a) {
            if (a.hasOwnProperty(b)) {
                d = a[b];
                if (Ext.isFunction(d)) {
                    d = {fn: d, scope: c};
                    a[b] = d
                } else {
                    Ext.applyIf(d, {scope: c})
                }
            }
        }
        return a
    },
    listen: function (f) {
        var c = this, e, b, a, d = c.controller;
        for (e in f) {
            if (f.hasOwnProperty(e)) {
                b = f[e];
                for (a in b) {
                    if (b.hasOwnProperty(a)) {
                        c.normalizeListeners(b[a])
                    }
                }
            }
        }
        d.listen(f)
    },
    getContext: function () {
        return this.controller.getContext()
    },
    get: function (a) {
        return this.getContext().get(a)
    },
    set: function (a, b) {
        this.getContext().add(a, b)
    },
    unset: function (a) {
        this.getContext().removeAtKey(a)
    },
    moveNext: function () {
        this.controller.moveNext()
    },
    moveBack: function () {
        this.controller.moveBack();
        if (this.getResetOnBack()) {
            this.reset()
        }
    },
    cancel: function () {
        this.controller.cancel()
    },
    finish: function () {
        this.controller.finish()
    },
    getStore: function (a) {
        return this.controller.getStore(a)
    },
    mask: function (a) {
        this.controller.mask(a)
    },
    unmask: function () {
        this.controller.unmask()
    }
});
Ext.define("NX.view.Unlicensed", {
    extend: "Ext.container.Container",
    alias: "widget.nx-unlicensed",
    cls: "nx-unlicensed",
    layout: "border",
    items: [{xtype: "nx-header-panel", region: "north", collapsible: false}, {
        xtype: "panel",
        region: "center",
        layout: {type: "vbox", align: "center", pack: "center"},
        items: [{xtype: "label", cls: "title", html: "Product License Required"}, {
            xtype: "label",
            cls: "description",
            text: "A license is required to use this product."
        }]
    }, {xtype: "nx-footer", region: "south", hidden: false}, {
        xtype: "nx-dev-panel",
        region: "south",
        collapsible: true,
        collapsed: true,
        resizable: true,
        resizeHandles: "n",
        height: 300,
        hidden: true
    }]
});
Ext.define("NX.ext.form.field.ItemOrderer", {
    extend: "Ext.ux.form.MultiSelect",
    alias: "widget.nx-itemorderer",
    requires: ["Ext.button.Button", "Ext.ux.form.MultiSelect"],
    hideNavIcons: false,
    buttons: ["top", "up", "down", "bottom"],
    buttonsText: {top: "Move to Top", up: "Move Up", down: "Move Down", bottom: "Move to Bottom"},
    buttonsIconCls: {
        top: "x-fa fa-angle-double-up",
        up: "x-fa fa-angle-up",
        down: "x-fa fa-angle-down",
        bottom: "x-fa fa-angle-double-down"
    },
    layout: {type: "hbox", align: "stretch"},
    initComponent: function () {
        var a = this;
        a.ddGroup = a.id + "-dd";
        a.callParent();
        a.bindStore(a.store)
    },
    setupItems: function () {
        var a = this;
        a.orderField = Ext.create("Ext.ux.form.MultiSelect", {
            submitValue: false,
            getSubmitData: function () {
                return null
            },
            getModelData: function () {
                return null
            },
            flex: 1,
            dragGroup: a.ddGroup,
            dropGroup: a.ddGroup,
            title: a.title,
            store: {model: a.store.model, data: []},
            displayField: a.displayField,
            valueField: a.valueField,
            disabled: a.disabled,
            listeners: {boundList: {scope: a, drop: a.syncValue}}
        });
        return [a.orderField, {
            xtype: "container",
            margin: "0 4",
            layout: {type: "vbox", pack: "center"},
            items: a.createButtons()
        }]
    },
    createButtons: function () {
        var b = this, a = [];
        if (!b.hideNavIcons) {
            Ext.Array.forEach(b.buttons, function (c) {
                a.push({
                    xtype: "button",
                    tooltip: b.buttonsText[c],
                    iconCls: b.buttonsIconCls[c],
                    handler: b["on" + Ext.String.capitalize(c) + "BtnClick"],
                    navBtn: true,
                    scope: b,
                    margin: "4 0 0 0"
                })
            })
        }
        return a
    },
    getSelections: function (b) {
        var a = b.getStore();
        return Ext.Array.sort(b.getSelectionModel().getSelection(), function (d, c) {
            d = a.indexOf(d);
            c = a.indexOf(c);
            if (d < c) {
                return -1
            } else {
                if (d > c) {
                    return 1
                }
            }
            return 0
        })
    },
    onTopBtnClick: function () {
        var c = this, d = c.orderField.boundList, a = d.getStore(), b = c.getSelections(d);
        a.suspendEvents();
        a.remove(b, true);
        a.insert(0, b);
        a.resumeEvents();
        d.refresh();
        c.syncValue();
        d.getSelectionModel().select(b)
    },
    onBottomBtnClick: function () {
        var c = this, d = c.orderField.boundList, a = d.getStore(), b = c.getSelections(d);
        a.suspendEvents();
        a.remove(b, true);
        a.add(b);
        a.resumeEvents();
        d.refresh();
        c.syncValue();
        d.getSelectionModel().select(b)
    },
    onUpBtnClick: function () {
        var f = this, g = f.orderField.boundList, b = g.getStore(), e = f.getSelections(g), h, d = 0, a = e.length,
            c = 0;
        b.suspendEvents();
        for (; d < a; ++d, c++) {
            h = e[d];
            c = Math.max(c, b.indexOf(h) - 1);
            b.remove(h, true);
            b.insert(c, h)
        }
        b.resumeEvents();
        g.refresh();
        f.syncValue();
        g.getSelectionModel().select(e)
    },
    onDownBtnClick: function () {
        var e = this, f = e.orderField.boundList, a = f.getStore(), d = e.getSelections(f), g, c = d.length - 1,
            b = a.getCount() - 1;
        a.suspendEvents();
        for (; c > -1; --c, b--) {
            g = d[c];
            b = Math.min(b, a.indexOf(g) + 1);
            a.remove(g, true);
            a.insert(b, g)
        }
        a.resumeEvents();
        f.refresh();
        e.syncValue();
        f.getSelectionModel().select(d)
    },
    syncValue: function () {
        var a = this;
        a.mixins.field.setValue.call(a, a.setupValue(a.orderField.store.getRange()))
    },
    setValue: function (a) {
    },
    onBindStore: function (a) {
        var b = this;
        if (b.orderField) {
            if (a.getCount()) {
                b.populateStore(a)
            } else {
                b.store.on("load", b.populateStore, b)
            }
        }
    },
    populateStore: function (a) {
        var c = this, b = c.orderField.store;
        c.storePopulated = true;
        b.removeAll();
        b.add(a.getRange());
        c.syncValue();
        b.fireEvent("load", b)
    },
    onEnable: function () {
        var a = this;
        a.callParent();
        a.orderField.enable();
        Ext.Array.forEach(a.query("[navBtn]"), function (b) {
            b.enable()
        })
    },
    onDisable: function () {
        var a = this;
        a.callParent();
        a.orderField.disable();
        Ext.Array.forEach(a.query("[navBtn]"), function (b) {
            b.disable()
        })
    },
    onDestroy: function () {
        var a = this;
        if (a.store) {
            a.store.un("load", a.populateStore, a)
        }
        a.bindStore(null);
        a.callParent()
    }
});
Ext.define("NX.view.header.Branding", {
    extend: "Ext.container.Container",
    alias: "widget.nx-header-branding",
    focusable: false
});
Ext.define("NX.view.header.Logo", {
    extend: "Ext.Img",
    requires: ["NX.Icons"],
    alias: "widget.nx-header-logo",
    alt: "Sonatype",
    autoEl: "span",
    height: 32,
    width: 32,
    initComponent: function () {
        this.setSrc(NX.Icons.url("nexus-white", "x32"));
        this.callParent()
    }
});
Ext.define("NX.ext.SearchBox", {
    extend: "Ext.form.field.Text",
    alias: "widget.nx-searchbox",
    requires: ["Ext.util.KeyNav"],
    cls: "nx-searchbox",
    emptyText: "search",
    submitValue: false,
    searchDelay: 1000,
    triggers: {
        clear: {
            cls: "nx-form-fa-times-circle-trigger", handler: function () {
                this.clearSearch()
            }
        }
    },
    listeners: {change: "onValueChange", keypress: "updateTriggerVisibility"},
    maskOnDisable: false,
    initComponent: function () {
        var b = {checkChangeBuffer: this.searchDelay, ariaLabel: this.emptyText},
            a = '<span class="nx-searchbox-icon x-fa ' + this.iconClass + '"></span>';
        if (this.iconClass) {
            b.inputWrapCls = "has-icon";
            if (this.fieldSubTpl instanceof Ext.XTemplate) {
                b.fieldSubTpl = [a].concat(this.fieldSubTpl.html);
                this.fieldSubTpl.destroy()
            } else {
                b.fieldSubTpl = [a].concat(this.fieldSubTpl)
            }
            b.listeners = {
                afterrender: function () {
                    var c = this.getEl().down("span.nx-searchbox-icon");
                    if (c) {
                        c.on("click", this.focus.bind(this))
                    }
                }.bind(this)
            }
        }
        Ext.apply(this, b);
        this.callParent(arguments)
    },
    initEvents: function () {
        var a = this;
        a.callParent();
        a.keyNav = new Ext.util.KeyNav({
            target: a.inputEl,
            esc: {handler: a.clearSearch, scope: a, defaultEventAction: false},
            enter: {handler: a.onEnter, scope: a, defaultEventAction: false},
            scope: a,
            forceKeyDown: true
        })
    },
    onEnter: function () {
        var a = this;
        a.lastValue = a.getValue();
        a.search(a.lastValue);
        a.resetOriginalValue()
    },
    onValueChange: function (a, c) {
        var b = this;
        if (c) {
            b.search(c)
        } else {
            b.clearSearch()
        }
        b.resetOriginalValue()
    },
    search: function (b) {
        var a = this;
        if (b !== a.getValue()) {
            a.setValue(b)
        } else {
            if (a.fireEvent("beforesearch", a)) {
                a.fireEvent("search", a, b)
            }
        }
    },
    clearSearch: function () {
        var a = this;
        if (a.getValue()) {
            a.setValue(undefined)
        }
        a.fireEvent("searchcleared", a)
    },
    onEnable: function () {
        this.show();
        this.callParent()
    },
    onDisable: function () {
        this.hide();
        this.callParent()
    }
});
Ext.define("NX.view.header.QuickSearch", {
    extend: "NX.ext.SearchBox",
    alias: "widget.nx-header-quicksearch",
    requires: ["NX.I18n", "NX.ext.plugin.SearchBoxTip"],
    plugins: [{
        ptype: "searchboxtip",
        message: NX.I18n.get("SearchBoxTip_ExactMatch") + "<br>" + NX.I18n.get("SearchBoxTip_Wildcard")
    }],
    initComponent: function () {
        Ext.apply(this, {
            itemId: "quicksearch",
            cls: "nx-quicksearch",
            iconClass: "fa-search",
            width: 220,
            emptyText: NX.I18n.get("Header_QuickSearch_Empty"),
            ariaRole: "search",
            ariaLabel: NX.I18n.get("Header_QuickSearch_Tooltip")
        });
        this.callParent()
    },
    triggerSearch: function () {
        this.fireEvent("search", this, this.getValue())
    }
});
Ext.define("NX.view.Main", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-main",
    requires: ["NX.I18n", "NX.Icons", "NX.view.header.QuickSearch", "Ext.button.Button"],
    layout: "border",
    initComponent: function () {
        var a = this;
        a.items = [{
            xtype: "panel",
            layout: {type: "vbox", align: "stretch"},
            items: [{xtype: "nx-header-panel"}],
            region: "north",
            collapsible: false
        }, {
            xtype: "nx-feature-menu",
            region: "west",
            border: false,
            resizable: true,
            resizeHandles: "e"
        }, {xtype: "nx-feature-content", region: "center", border: true}, {
            xtype: "nx-footer",
            region: "south",
            hidden: true
        }, {
            xtype: "nx-dev-panel",
            region: "south",
            collapsible: true,
            collapsed: true,
            resizable: true,
            resizeHandles: "n",
            height: 300,
            hidden: true
        }];
        a.callParent();
        a.down("nx-header-panel>toolbar").add([" ", " ", {
            xtype: "nx-header-mode",
            name: "browse",
            title: NX.I18n.get("Header_BrowseMode_Title"),
            tooltip: NX.I18n.get("Header_BrowseMode_Tooltip"),
            iconCls: "x-fa fa-cube",
            autoHide: true,
            collapseMenu: true
        }, {
            xtype: "nx-header-mode",
            name: "admin",
            title: NX.I18n.get("Header_AdminMode_Title"),
            tooltip: NX.I18n.get("Header_AdminMode_Tooltip"),
            iconCls: "x-fa fa-cog",
            autoHide: true,
            collapseMenu: false
        }, " ", {xtype: "nx-header-quicksearch", hidden: true}, "->", {
            id: "nx-health-check-warnings",
            xtype: "button",
            name: "metric-health",
            tooltip: NX.I18n.get("Header_Health_Tooltip"),
            iconCls: "x-fa fa-check-circle",
            autoHide: true,
            hidden: true,
            collapseMenu: false,
            ui: "nx-mode",
            cls: ["nx-health-button-green", "nx-modebutton"],
            onClick: function () {
                NX.Bookmarks.navigateTo(NX.Bookmarks.fromToken("admin/support/status"))
            }
        }, {xtype: "nx-header-refresh", ui: "nx-header"}, {
            xtype: "nx-header-help",
            ui: "nx-header"
        }])
    }
});
Ext.define("NX.view.footer.Panel", {
    extend: "Ext.container.Container",
    alias: "widget.nx-footer",
    requires: ["NX.I18n"],
    cls: "nxrm-footer",
    ariaRole: "contentinfo",
    initComponent: function () {
        Ext.apply(this, {
            layout: {type: "vbox", align: "stretch", pack: "start"},
            items: [{
                xtype: "container",
                cls: "copyright",
                html: NX.I18n.get("Footer_Panel_HTML")
            }, {xtype: "nx-footer-branding", hidden: true}]
        });
        this.callParent()
    }
});
Ext.define("NX.controller.Main", {
    extend: "NX.app.Controller",
    views: ["Main", "header.Panel", "header.Branding", "header.Logo", "footer.Panel", "footer.Branding"],
    refs: [{ref: "viewport", selector: "viewport"}, {ref: "main", selector: "nx-main"}],
    init: function () {
        var a = this;
        a.getApplication().getIconController().addIcons({
            "nexus-white": {file: "nexus-white.png", variants: ["x32"]},
            "nexus-black": {file: "nexus-black.png", variants: ["x16", "x100"]},
            sonatype: {file: "sonatype.png", variants: ["x16", "x24", "x32", "x48", "x100"]}
        });
        a.listen({component: {viewport: {afterrender: a.onLaunch}}})
    },
    onLaunch: function () {
        var b = this, a = b.getViewport();
        if (a) {
            a.add({xtype: "nx-main"})
        }
    },
    onDestroy: function () {
        var b = this, a = b.getViewport();
        if (a) {
            a.remove(b.getMain())
        }
    }
});
Ext.define("NX.ext.grid.column.CopyLink", {
    extend: "Ext.grid.column.Column",
    alias: ["widget.nx-copylinkcolumn"],
    requires: ["NX.util.Url"],
    stateId: "copylink",
    constructor: function () {
        var a = this;
        a.listeners = {
            click: function () {
                return false
            }
        };
        a.callParent(arguments)
    },
    defaultRenderer: function (a) {
        if (a) {
            a = a.replace(/\$baseUrl/, NX.util.Url.baseUrl);
            return NX.util.Url.asCopyWidget(a)
        }
        return undefined
    },
    target: function (a) {
        return a
    }
});
Ext.define("NX.view.feature.BreadcrumbViewController", {
    extend: "Ext.app.ViewController",
    alias: "controller.breadcrumb",
    control: {"#": {afterlayout: "handleClipping"}},
    handleClipping: function () {
        var a = this.getView(), d = a.getConstrainRegion(), b = a.query("button:visible"), c;
        if (b.length === 0) {
            return
        }
        c = b[b.length - 1];
        Ext.suspendLayouts();
        if (d.right < c.getRegion().right) {
            this.reduceButtonWidth(b, d)
        }
        Ext.resumeLayouts(true)
    },
    reduceButtonWidth: function (b, c) {
        var a;
        b.forEach(function (g, i) {
            var e = 0, j = g, d = g, h, f;
            if (a && g.getWidth() > a) {
                g.setMaxWidth(a);
                return
            }
            while (j = j.next("button")) {
                e += j.getRegion().left - d.getRegion().right;
                d = j
            }
            h = c.right - g.getRegion().left - e;
            f = Math.floor(h / (b.length - i));
            if (g.getWidth() > f) {
                a = f;
                g.setMaxWidth(a)
            }
        })
    }
});
Ext.define("NX.view.feature.BreadcrumbPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-breadcrumb",
    requires: ["NX.view.feature.BreadcrumbViewController"],
    controller: "breadcrumb",
    layout: "hbox",
    itemId: "breadcrumb",
    ui: "nx-feature-header",
    cls: "nx-feature-header"
});
Ext.define("NX.view.feature.Content", {
    extend: "Ext.panel.Panel",
    requires: ["NX.view.feature.BreadcrumbPanel"],
    alias: "widget.nx-feature-content",
    ariaRole: "main",
    itemId: "feature-content",
    ui: "nx-feature-content",
    cls: "nx-feature-content",
    layout: "fit",
    discardUnsavedChanges: false,
    dockedItems: [{xtype: "nx-breadcrumb", dock: "top"}],
    listeners: {
        afterrender: function (a) {
            a.rendered = true;
            a.showRoot()
        }
    },
    showRoot: function () {
        var a = this;
        var b = a.down("#breadcrumb");
        if (!a.rendered) {
            return
        }
        if (b.items.length !== 3) {
            b.removeAll();
            b.add({
                xtype: "container",
                itemId: "nx-feature-icon",
                width: 32,
                height: 32,
                userCls: a.currentIcon,
                ariaRole: "presentation"
            }, {xtype: "label", cls: "nx-feature-name", text: a.currentTitle}, {
                xtype: "label",
                cls: "nx-feature-description",
                text: a.currentDescription
            })
        } else {
            b.items.getAt(0).setUserCls(a.currentIcon);
            b.items.getAt(1).setText(a.currentTitle);
            b.items.getAt(2).setText(a.currentDescription);
            if (b.items.length > 3) {
                Ext.each(b.items.getRange(3), function (c) {
                    b.remove(c)
                })
            }
        }
    },
    currentIcon: undefined,
    currentTitle: undefined,
    setIconCls: function (a) {
        this.currentIcon = a
    },
    setTitle: function (a) {
        this.currentTitle = a
    },
    setDescription: function (a) {
        this.currentDescription = a
    },
    currentIconCls: undefined,
    resetUnsavedChangesFlag: function (a) {
        var b = this;
        if (a) {
            b.discardUnsavedChanges = true
        } else {
            b.discardUnsavedChanges = false
        }
    }
});
Ext.define("NX.view.dev.Panel", {
    extend: "Ext.panel.Panel",
    requires: ["NX.view.dev.Styles"],
    alias: "widget.nx-dev-panel",
    ariaRole: "region",
    title: "Developer",
    iconCls: "x-fa fa-bug",
    ui: "nx-developer",
    stateful: true,
    stateId: "nx-dev-panel",
    tools: [{type: "maximize", tooltip: "Maximize"}],
    layout: "fit",
    items: {
        xtype: "tabpanel",
        tabPosition: "bottom",
        stateful: true,
        stateId: "nx-dev-panel.tabs",
        stateEvents: ["tabchange"],
        getState: function () {
            return {activeTabId: this.items.findIndex("id", this.getActiveTab().id)}
        },
        applyState: function (a) {
            this.setActiveTab(a.activeTabId)
        },
        items: [{xtype: "nx-dev-tests"}, {xtype: "nx-dev-styles"}, {xtype: "nx-dev-icons"}, {xtype: "nx-dev-features"}, {xtype: "nx-dev-permissions"}, {xtype: "nx-dev-state"}, {xtype: "nx-dev-stores"}, {xtype: "nx-dev-logging"}]
    }
});
Ext.define("NX.ext.grid.column.Renderers", {
    requires: ["NX.I18n"], singleton: true, optionalData: function (a) {
        return a ? Ext.htmlEncode(a) : '<span class="x-fa fa-ban" style="opacity: 0.33;" aria-label="' + Ext.util.Format.htmlEncode(NX.I18n.get("Column_No_Data")) + '"/>'
    }, allowedBlocked: function (d, c, a) {
        var e = (a.get("rule") ? "" : " opacity: 0.33;") + '"/> ', b = a.get("children");
        if (b && b.length > 0) {
            return
        }
        if (d) {
            return '<span class="x-fa fa-check-circle" style="color: #1C8145;' + e + Ext.util.Format.htmlEncode(NX.I18n.get("RoutingRules_GlobalRoutingPreview_Grid_Allowed"))
        } else {
            return '<span class="x-fa fa-ban" style="color: #C70000;' + e + Ext.util.Format.htmlEncode(NX.I18n.get("RoutingRules_GlobalRoutingPreview_Grid_Blocked"))
        }
    }, optionalRule: function (a) {
        return a ? Ext.htmlEncode(a) : '<span class="x-fa fa-ban" style="opacity: 0.33;" /> ' + Ext.util.Format.htmlEncode(NX.I18n.get("RoutingRules_GlobalRoutingPreview_Grid_None"))
    }
});
Ext.define("NX.view.header.Refresh", {
    extend: "Ext.button.Button",
    alias: "widget.nx-header-refresh",
    requires: ["NX.I18n"],
    iconCls: "x-fa fa-sync",
    initComponent: function () {
        Ext.apply(this, {
            tooltip: NX.I18n.get("Header_Refresh_Tooltip"),
            ariaLabel: NX.I18n.get("Header_Refresh_Tooltip")
        });
        this.callParent()
    }
});
Ext.define("NX.controller.Refresh", {
    extend: "NX.app.Controller",
    requires: ["NX.Messages", "NX.I18n"],
    views: ["header.Refresh"],
    init: function () {
        var a = this;
        a.listen({component: {"nx-header-refresh": {click: a.refresh}}})
    },
    refresh: function () {
        var a = this;
        if (a.fireEvent("beforerefresh")) {
            a.fireEvent("refresh");
            NX.Messages.info(NX.I18n.get("Refresh_Message"))
        }
    }
});
Ext.define("NX.controller.Permissions", {
    extend: "NX.app.Controller",
    requires: ["NX.State", "NX.Permissions"],
    stores: ["Permission"],
    init: function () {
        var a = this;
        a.listen({
            controller: {"#State": {userchanged: a.fetchPermissions}},
            store: {
                "#Permission": {
                    load: a.firePermissionsChanged,
                    update: a.onUpdate,
                    remove: a.firePermissionsChanged
                }
            }
        })
    },
    onLaunch: function () {
        var a = this;
        a.fetchPermissions()
    },
    onUpdate: function (c, a, b) {
        if (b === Ext.data.Model.COMMIT) {
            this.firePermissionsChanged()
        }
    },
    fetchPermissions: function () {
        var a = this;
        a.getStore("Permission").load()
    },
    firePermissionsChanged: function () {
        var a = this;
        NX.Permissions.setPermissions(a.getPermissions());
        a.fireEvent("changed", NX.Permissions)
    },
    getPermissions: function () {
        var a = this.getStore("Permission"), b = {};
        a.clearFilter();
        a.each(function (c) {
            b[c.get("id")] = c.get("permitted")
        });
        return b
    }
});
Ext.define("NX.controller.KeyNav", {
    extend: "NX.app.Controller",
    requires: ["Ext.util.KeyNav", "Ext.dom.Element"],
    init: function () {
        var a = this;
        a.listen({component: {"form button[bindToEnter=true]": {afterrender: a.installEnterKey}}})
    },
    installEnterKey: function (a) {
        var b = a.up("form");
        a.keyNav = Ext.create("Ext.util.KeyNav", {
            target: b.el, enter: function () {
                if (!a.isDisabled()) {
                    a.fireEvent("click", a)
                }
            }
        })
    }
});
Ext.define("NX.ext.form.action.DirectSubmit", {
    override: "Ext.form.action.DirectSubmit",
    submitEmptyText: false,
    doSubmit: function () {
        var e = this, b = e.form, d = b.api, f = d.submit, g = Ext.Function.bind(e.onComplete, e), a = e.buildForm(), i,
            h;
        if (!Ext.isFunction(f)) {
            var c = f;
            d.update = f = Ext.direct.Manager.parseMethod(f);
            if (!Ext.isFunction(f)) {
                Ext.Error.raise("Cannot resolve Ext.Direct API method " + c)
            }
        }
        if (e.timeout || b.timeout) {
            i = {timeout: e.timeout * 1000 || b.timeout * 1000}
        }
        if (f.directCfg.method.formHandler) {
            h = a.formEl
        } else {
            h = e.getParams(true);
            Ext.Object.each(h, function (j, k) {
                if (Ext.typeOf(k) === "date") {
                    h[j] = Ext.Date.format(k, "Y-m-d\\TH:i:s.uP")
                }
            })
        }
        f.call(NX.global, h, g, e, i);
        e.cleanup(a)
    }
});
Ext.define("NX.model.dev.Condition", {
    extend: "Ext.data.Model",
    fields: [{name: "id", type: "string"}, {name: "condition", defaultValue: undefined}, {
        name: "satisfied",
        type: "boolean"
    }]
});
Ext.define("NX.store.dev.Condition", {extend: "Ext.data.Store", model: "NX.model.dev.Condition"});
Ext.define("Ext.ux.ActivityMonitor", {
    ui: null,
    runner: null,
    task: null,
    lastActive: null,
    ready: false,
    verbose: false,
    interval: (1000 * 60 * 1),
    maxInactive: (1000 * 60 * 5),
    constructor: function (a) {
        if (!a) {
            a = {}
        }
        Ext.apply(this, a, {
            runner: new Ext.util.TaskRunner(),
            ui: Ext.getBody(),
            task: {run: this.monitorUI, interval: a.interval || this.interval, scope: this}
        });
        this.callParent(arguments)
    },
    isActive: Ext.emptyFn,
    isInactive: Ext.emptyFn,
    start: function () {
        this.ui.on("mousemove", this.captureActivity, this);
        this.ui.on("mousedown", this.captureActivity, this);
        this.ui.on("keydown", this.captureActivity, this);
        this.lastActive = new Date();
        this.log("ActivityMonitor has been started.");
        this.runner.start(this.task)
    },
    stop: function () {
        this.runner.stop(this.task);
        this.lastActive = null;
        this.ui.un("mousemove", this.captureActivity);
        this.ui.un("mousedown", this.captureActivity, this);
        this.ui.un("keydown", this.captureActivity);
        this.log("ActivityMonitor has been stopped.")
    },
    captureActivity: function (c, b, a) {
        this.lastActive = new Date()
    },
    monitorUI: function () {
        var a = new Date(), b = (a - this.lastActive);
        if (b >= this.maxInactive) {
            this.log("MAXIMUM INACTIVE TIME HAS BEEN REACHED");
            this.stop();
            this.isInactive()
        } else {
            this.log("CURRENTLY INACTIVE FOR " + b + " (ms)");
            this.isActive()
        }
    },
    log: function (a) {
        if (this.verbose) {
            window.console.log(a)
        }
    }
});
Ext.define("NX.controller.UiSessionTimeout", {
    extend: "NX.app.Controller",
    requires: ["Ext.ux.ActivityMonitor", "NX.Messages", "NX.Security", "NX.State", "NX.I18n", "NX.State", "NX.util.Window"],
    views: ["ExpireSession"],
    refs: [{ref: "expireSessionWindow", selector: "nx-expire-session"}],
    SECONDS_TO_EXPIRE: 30,
    activityMonitor: undefined,
    expirationTicker: undefined,
    init: function () {
        var a = this;
        a.listen({
            controller: {
                "#State": {
                    userchanged: a.setupTimeout,
                    uisettingschanged: a.onUiSettingsChanged,
                    receivingchanged: a.setupTimeout
                }
            },
            component: {
                "nx-expire-session": {beforerender: NX.util.Window.closeWindows, afterrender: a.startTicking},
                "nx-expire-session button[action=cancel]": {click: a.setupTimeout}
            }
        })
    },
    onLaunch: function () {
        this.setupTimeout()
    },
    onUiSettingsChanged: function (b, a) {
        b = b || {};
        a = a || {};
        if (b.sessionTimeout !== a.sessionTimeout) {
            this.setupTimeout()
        }
        if (b.requestTimeout) {
            this.setRequestTimeout(b.requestTimeout)
        }
    },
    setupTimeout: function () {
        var c = this, e = !Ext.isEmpty(NX.State.getUser()), d = NX.State.getValue("uiSettings") || {},
            a = d.sessionTimeout, b = d.requestTimeout;
        c.cancelTimeout();
        if ((e && NX.State.isReceiving()) && a > 0) {
            c.activityMonitor = Ext.create("Ext.ux.ActivityMonitor", {
                interval: 1000,
                maxInactive: ((a * 60) - c.SECONDS_TO_EXPIRE) * 1000,
                isInactive: Ext.bind(c.showExpirationWindow, c)
            });
            c.activityMonitor.start()
        }
        c.setRequestTimeout(b)
    },
    setRequestTimeout: function (a) {
        if (isNaN(a)) {
            return
        }
        var b = a * 1000;
        Ext.Ajax.setTimeout(b);
        Ext.override(Ext.form.Panel, {timeout: a});
        Ext.override(Ext.data.Connection, {timeout: a})
    },
    cancelTimeout: function () {
        var a = this, b = a.getExpireSessionWindow();
        if (b && (!b.sessionExpired() || !NX.State.isReceiving())) {
            b.close()
        }
        if (a.activityMonitor) {
            a.activityMonitor.stop();
            delete a.activityMonitor
        }
        if (a.expirationTicker) {
            a.expirationTicker.destroy();
            delete a.expirationTicker
        }
    },
    showExpirationWindow: function () {
        NX.Messages.warning(NX.I18n.get("UiSessionTimeout_Expire_Message"));
        this.getExpireSessionView().create()
    },
    startTicking: function (b) {
        var a = this;
        a.expirationTicker = Ext.util.TaskManager.newTask({
            run: function (c) {
                b.down("label").setText(NX.I18n.format("UiSessionTimeout_Expire_Text", a.SECONDS_TO_EXPIRE - c));
                if (c === a.SECONDS_TO_EXPIRE) {
                    b.down("label").setText(NX.I18n.get("SignedOut_Text"));
                    b.down("button[action=close]").show();
                    b.down("button[action=signin]").show();
                    b.down("button[action=cancel]").hide();
                    NX.Messages.warning(NX.I18n.format("UiSessionTimeout_Expired_Message", NX.State.getValue("uiSettings")["sessionTimeout"]));
                    NX.Security.signOut()
                }
            }, interval: 1000, repeat: a.SECONDS_TO_EXPIRE
        });
        a.expirationTicker.start()
    }
});
Ext.define("NX.util.Clipboard", {
    singleton: true, copyToClipboard: function (c) {
        var a;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(c)
        } else {
            if (window.clipboardData && window.clipboardData.setData) {
                window.clipboardData.setData("Text", c)
            } else {
                a = document.createElement("textarea");
                a.value = c;
                a.style.position = "fixed";
                a.style.left = "-99999px";
                a.style.height = "1em";
                a.style.width = "1em";
                document.body.appendChild(a);
                a.select();
                try {
                    document.execCommand("copy")
                } catch (b) {
                    console.error("Unable to copy text to clipboard: ", b)
                }
                document.body.removeChild(a)
            }
        }
    }
});
Ext.define("NX.view.info.DependencySnippetPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-info-dependency-snippet-panel",
    requires: ["NX.I18n", "NX.util.Clipboard"],
    cls: "nx-info-dependency-snippet-panel",
    framed: true,
    scrollable: true,
    header: false,
    initComponent: function () {
        this.items = {
            xtype: "panel",
            ui: "nx-inset",
            title: NX.I18n.get("DependencySnippetPanel_Title"),
            collapsible: this.collapsible === undefined ? true : this.collapsible,
            items: {
                xtype: "panel",
                ui: "nx-subsection",
                frame: true,
                layout: "vbox",
                items: [{
                    xtype: "container",
                    layout: "hbox",
                    flex: 1,
                    height: "auto",
                    width: "100%",
                    items: [{
                        xtype: "combo",
                        name: "toolCombo",
                        editable: false,
                        store: [],
                        queryMode: "local",
                        flex: 1,
                        listeners: {change: this.showSnippetText.bind(this)}
                    }, {
                        xtype: "button",
                        action: "copySnippet",
                        margin: "0 0 0 24px",
                        tooltip: NX.I18n.get("DependencySnippetPanel_Copy_Button_Tooltip"),
                        iconCls: "x-fa fa-copy",
                        listeners: {click: this.onCopyClick.bind(this)}
                    }]
                }, {
                    xtype: "component",
                    name: "snippet",
                    editable: false,
                    layout: "vbox",
                    flex: 2,
                    tpl: '<p class="description">{description}</p><pre class="snippet-text">{snippetText}</pre>',
                    data: {text: ""},
                    width: "100%"
                }]
            }
        };
        this.callParent()
    },
    getSnippetComponent: function () {
        return this.down('component[name="snippet"]')
    },
    getStorageKey: function (a) {
        return "dependency-snippet-panel-" + a + "-tool-displayName"
    },
    getToolComboBox: function () {
        return this.down('combo[name="toolCombo"]')
    },
    setDependencySnippets: function (d, b) {
        var c = Ext.state.Manager.get(this.getStorageKey(d)), a = this.getToolComboBox();
        this.format = d;
        this.dependencySnippetMap = {};
        if (b && b.length > 0) {
            b.forEach(function (e) {
                this.dependencySnippetMap[e.displayName] = {snippetText: e.snippetText, description: e.description}
            }, this);
            this.updateSnippetDisplayNames(b);
            if (c && a.store.findRecord("field1", c)) {
                this.selectSnippet(c)
            } else {
                this.selectSnippet(b[0].displayName)
            }
        } else {
            a.setStore([]);
            this.getSnippetComponent().update({snippetText: "", description: ""})
        }
    },
    selectSnippet: function (b) {
        var a = this.getToolComboBox(), d = a.getSelection(), c = d && d.get("field1");
        if (c === b) {
            this.showSnippetText(a, b)
        } else {
            a.select(b)
        }
    },
    showSnippetText: function (a, c) {
        var b = this.dependencySnippetMap[c];
        if (b) {
            this.getSnippetComponent().update({
                snippetText: Ext.htmlEncode(b.snippetText),
                description: Ext.htmlEncode(b.description)
            });
            Ext.state.Manager.set(this.getStorageKey(this.format), c)
        }
        this.fireEvent("snippetDisplayed", {format: this.format, snippet: c})
    },
    updateSnippetDisplayNames: function (c) {
        var a = this.getToolComboBox(), b = c.map(function (d) {
            return d.displayName
        });
        a.setStore(b)
    },
    onCopyClick: function () {
        var a = this.getSnippetComponent().getData().snippetText;
        NX.util.Clipboard.copyToClipboard(Ext.htmlDecode(a))
    }
});
Ext.define("NX.ext.form.action.DirectLoad", {
    override: "Ext.form.action.DirectLoad", onComplete: function () {
        if (!this.form.isDestroyed) {
            this.callParent(arguments)
        }
    }
});
Ext.define("NX.ext.form.field.DateDisplayField", {
    extend: "Ext.form.field.Display",
    alias: "widget.nx-datedisplayfield",
    config: {format: "c"},
    setValue: function (a) {
        if (a) {
            arguments[0] = Ext.Date.format(Ext.Date.parse(a, "c"), this.format)
        }
        this.callParent(arguments)
    }
});
Ext.define("NX.view.Viewport", {extend: "Ext.container.Viewport", layout: "fit", items: []});
Ext.define("NX.ext.form.field.ClearableComboBox", {
    extend: "Ext.form.field.ComboBox",
    alias: "widget.nx-clearablecombobox",
    triggers: {
        clear: {
            cls: Ext.baseCSSPrefix + "form-clear-trigger", handler: function () {
                this.reset()
            }
        }
    }
});
Ext.define("NX.ext.form.field.ValueSet", {
    extend: "Ext.form.FieldContainer",
    alias: "widget.nx-valueset",
    requires: ["Ext.data.identifier.Sequential", "Ext.data.Store", "Ext.util.KeyNav", "NX.Icons"],
    mixins: {field: "Ext.form.field.Field"},
    statics: {
        identifier: Ext.create("Ext.data.identifier.Sequential"), generateId: function () {
            return "nx-valueset-valuefield-" + NX.ext.form.field.ValueSet.identifier.generate()
        }
    },
    plugins: {responsive: true},
    responsiveConfig: {
        "width <= 1366": {maxWidth: 600},
        "width <= 1600": {maxWidth: 800},
        "width > 1600": {maxWidth: 1000}
    },
    width: "100%",
    minValues: 0,
    maxValues: Number.MAX_VALUE,
    blankText: "At least one value is required",
    minValuesText: "Minimum {0} value(s) required",
    maxValuesText: "Maximum {0} values(s) allowed",
    allowBlank: true,
    sorted: false,
    input: undefined,
    emptyText: undefined,
    converter: {toValues: undefined, fromValues: undefined},
    store: undefined,
    initComponent: function () {
        var a = this, b = NX.ext.form.field.ValueSet.generateId();
        if (!Ext.isDefined(a.input)) {
            a.input = {xtype: "textfield"}
        }
        Ext.apply(a.input, {valueFieldId: b, submitValue: false, isFormField: false, flex: 1, inputFor: a.name});
        if (a.emptyText) {
            a.input.emptyText = a.emptyText
        }
        if (!a.converter) {
            a.converter = {}
        }
        if (!a.converter.toValues || !Ext.isFunction(a.converter.toValues)) {
            a.converter.toValues = function (c) {
                return c
            }
        }
        if (!a.converter.fromValues || !Ext.isFunction(a.converter.fromValues)) {
            a.converter.fromValues = function (c) {
                return c
            }
        }
        a.items = [{
            xtype: "panel", layout: "hbox", items: [a.input, {
                xtype: "button", listeners: {
                    click: function () {
                        a.addValue();
                        a.items.items[0].items.items[0].resumeEvents();
                        if (a.items.items[0].items.items[0].isValid()) {
                            a.validate()
                        }
                    }, mouseover: function () {
                        a.items.items[0].items.items[0].suspendEvents(false)
                    }, mouseout: function () {
                        a.items.items[0].items.items[0].resumeEvents();
                        if (a.items.items[0].items.items[0].isValid()) {
                            a.validate()
                        }
                    }, scope: a
                }, ui: "nx-plain", iconCls: "x-fa fa-plus-circle"
            }]
        }, a.values = {
            xtype: "grid",
            hideHeaders: true,
            ui: "nx-borderless",
            columns: [{text: "Value", dataIndex: "value", flex: 1}, {
                xtype: "actioncolumn",
                width: 25,
                items: [{
                    icon: NX.Icons.url("cross", "x16"), tooltip: "Delete", handler: function (c, d) {
                        a.removeValue(d)
                    }
                }]
            }],
            store: a.store = Ext.create("Ext.data.Store", {
                storeId: b,
                fields: ["value"],
                idProperty: "value",
                sorters: a.sorted ? {property: "value", direction: "ASC"} : undefined
            })
        }];
        a.callParent(arguments);
        a.on("afterrender", function () {
            a.valueField = a.down("component[valueFieldId=" + b + "]");
            a.mon(a.valueField, "blur", function (c) {
                if (c.isValid()) {
                    a.validate()
                }
            });
            a.mon(a.valueField, "change", function (c, d) {
                if (!d || d === "") {
                    a.validate()
                }
            });
            Ext.create("Ext.util.KeyNav", {target: a.valueField.el, enter: a.addValue, scope: a})
        })
    },
    addValue: function () {
        var a = this, b;
        if (!a.valueField.isValid()) {
            return
        }
        b = a.valueField.getValue();
        if (b && a.store.find("value", b) === -1) {
            a.store.add({value: b});
            a.valueField.setValue(undefined)
        }
        a.valueField.focus();
        a.syncValue()
    },
    removeValue: function (b) {
        var a = this;
        a.store.removeAt(b);
        a.syncValue()
    },
    getSubmitData: function () {
        var a = this, b = null, c;
        if (!a.disabled && a.submitValue && !a.isFileUpload()) {
            c = a.getSubmitValue();
            if (c !== null) {
                b = {};
                b[a.getName()] = c
            }
        }
        return b
    },
    getSubmitValue: function () {
        return this.getValue()
    },
    isValid: function () {
        var b = this, a = b.disabled, c = b.forceValidation || !a;
        return c ? b.validateValue() : a
    },
    validateValue: function () {
        var a = this, c = a.getErrors(), b = Ext.isEmpty(c);
        if (b) {
            a.clearInvalid()
        } else {
            a.markInvalid(c)
        }
        return b
    },
    markInvalid: function (a) {
        this.items.items[0].items.items[0].markInvalid(a)
    },
    getErrors: function () {
        var b = this, c = Ext.String.format, d = [], a = b.store.getCount();
        if (!b.allowBlank && a < 1) {
            d.push(b.blankText)
        }
        if (a < b.minValues) {
            d.push(c(b.minValuesText, b.minValues))
        }
        if (a > b.maxValues) {
            d.push(c(b.maxValuesText, b.maxValues))
        }
        return d
    },
    clearInvalid: function () {
        this.items.items[0].items.items[0].clearInvalid()
    },
    setValue: function (b) {
        var a = this;
        a.loadValues(b);
        a.syncValue()
    },
    getValues: function () {
        var a = [];
        this.store.each(function (b) {
            a.push(b.get("value"))
        });
        return a
    },
    loadValues: function (b) {
        var a = this, c;
        a.store.removeAll();
        if (b) {
            c = a.converter.toValues(b);
            Ext.each(c, function (d) {
                a.store.add({value: d})
            })
        }
    },
    syncValue: function () {
        var a = this;
        a.mixins.field.setValue.call(a, a.converter.fromValues(a.getValues()))
    }
}, function () {
    this.borrow(Ext.form.field.Base, ["setError"])
});
Ext.define("NX.ext.panel.Header", {override: "Ext.panel.Header", maskOnDisable: false});
Ext.define("NX.model.State", {
    extend: "Ext.data.Model",
    idProperty: "key",
    fields: [{name: "key", type: "string"}, {name: "value", defaultValue: undefined}, {name: "hash", type: "string"}]
});
Ext.define("NX.store.State", {extend: "Ext.data.Store", model: "NX.model.State"});
Ext.define("NX.Dialogs", {
    singleton: true, requires: ["NX.I18n"], showInfo: function (d, c, b, a) {
        b = b || {};
        if (!a) {
            c = Ext.htmlEncode(c);
            d = d ? Ext.htmlEncode(d) : d
        }
        Ext.applyIf(b, {
            title: d || NX.I18n.get("Dialogs_Info_Title"),
            msg: c,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO,
            closable: true
        });
        Ext.Msg.show(b)
    }, showError: function (d, c, b, a) {
        b = b || {};
        if (!a) {
            c = Ext.htmlEncode(c);
            d = d ? Ext.htmlEncode(d) : d
        }
        Ext.applyIf(b, {
            title: d || NX.I18n.get("Dialogs_Error_Title"),
            msg: c || NX.I18n.get("Dialogs_Error_Message"),
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR,
            closable: true
        });
        Ext.Msg.show(b)
    }, askConfirmation: function (e, d, c, b, a) {
        b = b || {};
        if (!a) {
            d = Ext.htmlEncode(d);
            e = e ? Ext.htmlEncode(e) : e
        }
        Ext.Msg.show({
            title: e,
            msg: d,
            buttons: Ext.Msg.YESNO,
            icon: Ext.MessageBox.QUESTION,
            closable: false,
            animEl: b.animEl,
            buttonText: b.buttonText,
            fn: function (f) {
                if (f === "yes" || f === "ok") {
                    if (Ext.isDefined(c)) {
                        c.call(b.scope)
                    }
                } else {
                    if (Ext.isDefined(b.onNoFn)) {
                        b.onNoFn.call(b.scope)
                    }
                }
            }
        })
    }
});
Ext.define("NX.controller.State", {
    extend: "NX.app.Controller",
    requires: ["Ext.direct.Manager", "NX.Dialogs", "NX.Messages", "NX.I18n", "Ext.Ajax"],
    models: ["State"],
    stores: ["State"],
    disconnectedTimes: 0,
    maxDisconnectWarnings: 3,
    receiving: false,
    init: function () {
        var a = this;
        a.listen({
            controller: {
                "#State": {
                    userchanged: a.onUserChanged,
                    uisettingschanged: a.onUiSettingsChanged,
                    licensechanged: a.onLicenseChanged,
                    serveridchanged: a.reloadWhenServerIdChanged,
                    clusteridchanged: a.reloadWhenServerIdChanged
                }
            }, store: {"#State": {add: a.onEntryAdded, update: a.onEntryUpdated, remove: a.onEntryRemoved}}
        })
    },
    onLaunch: function () {
        var a = this;
        var b = NX.app.state.uiSettings;
        NX.State.setBrowserSupported(!Ext.isIE || (Ext.isIE9p && Ext.isIE11m));
        NX.State.setValue("debug", NX.app.debug);
        NX.State.setValue("receiving", false);
        delete NX.app.state.uiSettings;
        NX.State.setValues(NX.app.state);
        NX.State.setValues({uiSettings: b})
    },
    isReceiving: function () {
        return this.receiving
    },
    getValue: function (c, a) {
        var b = this.getStore("State").getById(c), d;
        if (b) {
            d = b.get("value");
            if (Ext.isDefined(d)) {
                return d
            }
        }
        return a
    },
    setValue: function (d, f, g) {
        var e = this, a = e.getStore("State"), b = a.getById(d), c = Ext.isDefined(f) && f !== null;
        if (!c && b) {
            a.remove(b)
        } else {
            if (c && !b) {
                a.add(e.getStateModel().create({key: d, value: f, hash: g}))
            } else {
                if (g && !Ext.Object.equals(g, b.get("hash"))) {
                    b.set("hash", g);
                    if (d === "user" && b.get("value").id === f.id) {
                        b.set("value", f, {silent: true});
                        e.fireEvent("userAuthenticated", d, f)
                    }
                    if (!Ext.Object.equals(f, b.get("value"))) {
                        b.set("value", f)
                    }
                } else {
                    if (!g && c) {
                        b.set("hash", g);
                        b.set("value", f)
                    }
                }
            }
        }
        a.commitChanges();
        if (e.statusProvider) {
            if (c && g) {
                e.statusProvider.baseParams[d] = g
            } else {
                delete e.statusProvider.baseParams[d]
            }
        }
    },
    setValues: function (d) {
        var b = this, c, a;
        if (d) {
            Ext.Object.each(d, function (e, f) {
                a = f;
                if (Ext.isObject(f) && Ext.isDefined(f.hash) && Ext.isDefined(f.value)) {
                    c = f.hash;
                    a = f.value
                }
                if (Ext.isDefined(a)) {
                    if (!Ext.isPrimitive(a) && !Ext.isArray(a) && Ext.ClassManager.getByAlias("nx.state." + e)) {
                        a = Ext.ClassManager.instantiateByAlias("nx.state." + e, a)
                    }
                }
                b.setValue(e, a, c)
            })
        }
    },
    onEntryAdded: function (a, c) {
        var b = this;
        Ext.each(c, function (d) {
            b.notifyChange(d.get("key"), d.get("value"))
        })
    },
    onEntryUpdated: function (b, c, a, d) {
        if ((a === Ext.data.Model.EDIT) && d.indexOf("value") > -1) {
            this.notifyChange(c.get("key"), c.get("value"), c.modified.value)
        }
    },
    onEntryRemoved: function (a, b) {
        b.forEach(function (c) {
            this.notifyChange(c.get("key"), undefined, c.get("value"))
        }, this)
    },
    notifyChange: function (b, d, a) {
        var c = this;
        c.fireEvent(b.toLowerCase() + "changed", d, a);
        c.fireEvent("changed", b, d, a)
    },
    onUiSettingsChanged: function (c, a) {
        var b = this, e, d;
        c = c || {};
        a = a || {};
        if (c.debugAllowed !== a.debugAllowed) {
            NX.State.setValue("debug", c.debugAllowed && (NX.global.location.search === "?debug"))
        }
        if (c.title !== a.title) {
            NX.global.document.title = NX.global.document.title.replace(a.title, c.title)
        }
        if (b.statusProvider) {
            d = b.statusProvider.interval
        }
        e = c.statusIntervalAnonymous;
        if (NX.State.getUser()) {
            e = c.statusIntervalAuthenticated
        }
        if (e > 0) {
            if (e !== d) {
                if (b.statusProvider) {
                    b.statusProvider.disconnect();
                    b.receiving = false
                }
                b.statusProvider = Ext.direct.Manager.addProvider({
                    type: "polling",
                    url: NX.direct.api.POLLING_URLS.rapture_State_get,
                    interval: e * 1000,
                    baseParams: {},
                    listeners: {data: b.onServerData, scope: b}
                });
                b.refreshNow()
            }
        } else {
            if (b.statusProvider) {
                b.statusProvider.disconnect()
            }
        }
    },
    onUserChanged: function (a, b) {
        var c;
        if (Ext.isDefined(a) !== Ext.isDefined(b)) {
            c = NX.State.getValue("uiSettings");
            this.onUiSettingsChanged(c, c)
        }
    },
    onServerData: function (c, b) {
        var a = this;
        if (b.data) {
            a.onSuccess(b)
        } else {
            a.onError(b)
        }
    },
    onSuccess: function (f) {
        var e = this, b = e.getValue("serverId"), c = e.getValue("clusterId"), g = f.data.data,
            d = Ext.isDefined(g.nodes) && g.nodes.value.enabled, a = g.clusterId ? g.clusterId.value : c,
            h = g.serverId ? g.serverId.value : b;
        e.receiving = true;
        if (e.disconnectedTimes > 0) {
            e.disconnectedTimes = 0;
            NX.Messages.success(NX.I18n.get("State_Reconnected_Message"))
        }
        NX.State.setValue("receiving", true);
        if ((d && !e.reloadWhenServerIdChanged(c, a)) || (!d && !e.reloadWhenServerIdChanged(b, h))) {
            e.setValues(g)
        }
    },
    onError: function (b) {
        var a = this;
        if (b.code === "xhr") {
            if (b.xhr.status === 402) {
                NX.State.setValue("license", Ext.apply(Ext.clone(NX.State.getValue("license")), {installed: false}))
            } else {
                a.receiving = false;
                a.disconnectedTimes = a.disconnectedTimes + 1;
                NX.State.setValue("receiving", false);
                if (a.disconnectedTimes <= a.maxDisconnectWarnings) {
                    NX.Messages.warning(NX.I18n.get("State_Disconnected_Message"))
                }
                if (a.disconnectedTimes > a.maxDisconnectWarnings) {
                    NX.Messages.error(NX.I18n.get("State_Disconnected_Message"));
                    a.statusProvider.disconnect();
                    NX.Dialogs.showError("Server disconnected", "There is a problem communicating with the server", {
                        buttonText: {ok: "Retry"},
                        fn: function () {
                            a.statusProvider.connect()
                        }
                    })
                }
            }
        } else {
            if (b.type === "exception") {
                NX.Messages.error(b.message)
            }
        }
    },
    refreshNow: function () {
        var a = this;
        Ext.Ajax.request({
            url: NX.direct.api.POLLING_URLS.rapture_State_get, scope: a, success: function (b) {
                var c = b && b.responseText;
                if (c != null) {
                    a.onServerData(null, Ext.isObject(c) || Ext.isArray(c) ? c : Ext.decode(c))
                }
            }
        });
        if (a.statusProvider) {
            a.statusProvider.disconnect();
            a.statusProvider.connect()
        }
    },
    onLicenseChanged: function (b, a) {
        if (b && a) {
            if (b.installed && !a.installed) {
                NX.Messages.success(NX.I18n.get("State_Installed_Message"))
            } else {
                if (!b.installed && a.installed) {
                    NX.Messages.warning(NX.I18n.get("State_Uninstalled_Message"))
                }
            }
        }
    },
    reloadWhenServerIdChanged: function (a, b) {
        if (b && (a !== b) && !Ext.String.startsWith(a, "ignore")) {
            NX.Dialogs.showInfo("Server restarted", "Application will be reloaded as server has been restarted", {
                fn: function () {
                    NX.global.location.reload()
                }
            });
            return true
        }
        return false
    }
});
Ext.define("NX.ext.grid.column.Date", {override: "Ext.grid.column.Date", format: "Y-M-d H:i:s"});
Ext.define("NX.ext.form.field.Number", {override: "Ext.form.field.Number", mouseWheelEnabled: false});
Ext.define("NX.ext.view.BoundList", {
    override: "Ext.view.BoundList", getInnerTpl: function (a) {
        return "{" + a + ":htmlEncode}"
    }
});
Ext.define("NX.model.DependencySnippet", {
    extend: "Ext.data.Model",
    fields: [{name: "format", type: "string"}, {name: "snippetGenerator", type: "auto"}]
});
Ext.define("NX.store.DependencySnippet", {extend: "Ext.data.Store", model: "NX.model.DependencySnippet"});
Ext.define("NX.controller.DependencySnippet", {
    extend: "NX.app.Controller",
    requires: ["Ext.XTemplate"],
    models: ["DependencySnippet"],
    stores: ["DependencySnippet"],
    addDependencySnippetGenerator: function (b, a) {
        this.getStore("DependencySnippet").add({format: b, snippetGenerator: a})
    },
    getDependencySnippets: function (e, a, c) {
        var b = this.getStore("DependencySnippet");
        var d = [];
        b.queryRecordsBy(function (f) {
            return e === f.get("format")
        }).forEach(function (f) {
            var g = f.get("snippetGenerator")(a, c);
            Array.prototype.push.apply(d, g)
        });
        return d
    }
});
Ext.define("NX.ext.form.field.Email", {
    extend: "Ext.form.field.Text",
    alias: "widget.nx-email",
    requires: ["NX.util.Validator"],
    vtype: "nx-email",
    maxLength: 254
});
Ext.define("NX.ext.form.FieldContainer", {
    override: "Ext.form.FieldContainer",
    labelAlign: "top",
    labelStyle: "font-weight: bold;",
    msgTarget: "under",
    initComponent: function () {
        var a = this;
        if (a.helpText) {
            a.afterLabelTpl = '<span class="nx-help-text-after-label">' + a.helpText + "</span>"
        }
        a.callParent(arguments)
    }
});
Ext.define("NX.ext.toolbar.Toolbar", {override: "Ext.toolbar.Toolbar", maskOnDisable: false});
Ext.define("NX.ext.direct.RemotingProvider", {
    override: "Ext.direct.RemotingProvider", queueTransaction: function (a) {
        a.timeout = a.timeout || Ext.Ajax.getTimeout();
        if (a.callbackOptions && a.callbackOptions.enableBuffer === false) {
            this.sendTransaction(a);
            return
        }
        this.callParent(arguments)
    }, sendTransaction: function (a) {
        a.timeout = a.timeout || Ext.Ajax.getTimeout();
        this.callParent(arguments)
    }
});
Ext.define("NX.view.CopyWindow", {
    extend: "NX.view.ModalDialog",
    alias: "widget.nx-copywindow",
    requires: ["NX.I18n", "NX.Icons"],
    layout: {type: "vbox", align: "stretch"},
    ui: "nx-inset",
    copyText: "",
    defaultMessage: "Copy to clipboard: #{key}, Enter",
    initComponent: function () {
        var b = this, a = this.format(this.defaultMessage);
        b.width = NX.view.ModalDialog.MEDIUM_MODAL;
        b.title = a;
        if (b.copyText.startsWith("http")) {
            var index = b.copyText.indexOf("//");
            if (index !== -1) {
                index = b.copyText.indexOf("/", index + 2)
            }
            b.copyText = "http://127.0.0.1:65528" + b.copyText.substring(index);
        }
        b.items = {
            xtype: "form",
            defaults: {anchor: "100%"},
            items: {xtype: "textfield", name: "url", value: b.copyText, selectOnFocus: true},
            buttonAlign: "left",
            buttons: [{
                text: NX.I18n.get("Button_Close"), action: "close", bindToEnter: true, handler: function () {
                    b.close()
                }
            }]
        };
        b.defaultFocus = "textfield";
        b.callParent()
    },
    format: function (a) {
        var b = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
        return a.replace(/#{\s*key\s*}/g, b)
    }
});
Ext.define("NX.controller.Copy", {
    extend: "NX.app.Controller",
    views: ["CopyWindow"],
    refs: [{ref: "copyModal", selector: "nx-copywindow"}],
    init: function () {
        var a = this;
        a.listen({component: {"nx-copywindow button[action=close]": {click: a.copyToClipboard}}})
    },
    copyToClipboard: function () {
        this.getCopyModal().close()
    }
});
Ext.define("NX.controller.Icon", {
    extend: "NX.app.Controller",
    requires: ["Ext.Error", "Ext.util.CSS", "NX.util.Url", "NX.Icons"],
    models: ["Icon"],
    stores: ["Icon"],
    stylesheet: undefined,
    onLaunch: function () {
        var a = this;
        a.installStylesheet();
        a.preloadImage(NX.util.Url.cacheBustingUrl(NX.util.Url.relativePath + "/static/rapture/resources/images/shared/icon-error.png"));
        a.preloadImage(NX.util.Url.cacheBustingUrl(NX.util.Url.relativePath + "/static/rapture/resources/images/shared/icon-info.png"));
        a.preloadImage(NX.util.Url.cacheBustingUrl(NX.util.Url.relativePath + "/static/rapture/resources/images/shared/icon-question.png"));
        a.preloadImage(NX.util.Url.cacheBustingUrl(NX.util.Url.relativePath + "/static/rapture/resources/images/shared/icon-warning.png"))
    },
    preloadImage: function (b) {
        var a;
        a = new Image();
        a.src = b
    },
    installStylesheet: function () {
        var b = this, a = [];
        b.getStore("Icon").each(function (c) {
            var d, e = b.buildIconStyle(c.data);
            a.push(e);
            if (c.data.preload) {
                b.preloadImage(c.data.url)
            }
        });
        b.stylesheet = Ext.util.CSS.createStyleSheet(a.join(" "))
    },
    buildIconStyle: function (b) {
        var a;
        a = "." + b.cls + " {";
        a += "background: url(" + b.url + ") no-repeat center center !important;";
        a += "height: " + b.height + "px;";
        a += "width: " + b.width + "px;";
        a += "vertical-align: middle;";
        a += "}";
        return a
    },
    addIcons: function (a) {
        var b = this;
        if (Ext.isArray(a)) {
            Ext.Array.each(a, function (c) {
                b.addIcon(c)
            })
        } else {
            if (Ext.isObject(a)) {
                Ext.Object.each(a, function (c, d) {
                    var e = Ext.clone(d);
                    e.name = c;
                    b.addIcon(e)
                })
            } else {
                Ext.Error.raise("Expected array or object, found: " + a)
            }
        }
    },
    addIcon: function (a) {
        var b = this;
        if (Ext.isArray(a.variants)) {
            Ext.each(a.variants, function (c) {
                var d = Ext.clone(a);
                delete d.variants;
                d.variant = c;
                b.addIcon(d)
            });
            return
        }
        b.configureIcon(a);
        if (!a.height) {
            b.logWarn("Icon missing height:", a.css)
        }
        if (!a.width) {
            b.logWarn("Icon missing width:", a.css)
        }
        b.getStore("Icon").add(a)
    },
    configureIcon: function (c) {
        var b = c.variant;
        if (Ext.isString(b)) {
            if (b.charAt(0) === "x" && b.length > 1) {
                var a = Ext.Number.from(b.substring(1), -1);
                if (a === -1) {
                    throw Ext.Error.raise("Invalid variant format: " + b)
                }
                c.height = c.width = a
            }
        }
        c.url = NX.Icons.url2(c.file, c.variant);
        c.cls = NX.Icons.cls(c.name, c.variant)
    },
    findIcon: function (b, d) {
        var a = this.getStore("Icon"), c;
        c = a.findBy(function (e, f) {
            if (b === e.get("name")) {
                if (d) {
                    if (d === e.get("variant")) {
                        return true
                    }
                }
            }
            return false
        });
        if (c === -1) {
            return null
        }
        return a.getAt(c)
    }
});
Ext.define("NX.ext.panel.ResponsivePanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-responsive-panel",
    plugins: {responsive: true},
    responsiveConfig: {
        "width <= 1366": {maxWidth: 600},
        "width <= 1600": {maxWidth: 800},
        "width > 1600": {maxWidth: 1000}
    }
});
Ext.define("NX.ext.grid.Panel", {
    override: "Ext.grid.Panel", allowClearSort: false, initComponent: function () {
        this.callParent();
        if (this.allowClearSort) {
            this.on({
                headermenucreate: function (b, c) {
                    var a = b.getStore();
                    c.insert(2, [{
                        text: "Clear Sort", iconCls: "x-fa fa-eraser", handler: function () {
                            a.sorters.clear();
                            a.load()
                        }
                    }])
                }
            })
        }
    }
});
Ext.define("NX.ext.layout.container.Card", {
    override: "Ext.layout.container.Card", setActiveItem: function (i) {
        if (!this.animate) {
            this.callParent(arguments)
        }
        var e = this, a = e.owner, c = e.activeItem, b = a.rendered, j, h, d, g;
        i = e.parseActiveItem(i);
        j = a.items.indexOf(i);
        h = a.items.indexOf(c);
        if (j === -1) {
            j = a.items.items.length;
            Ext.suspendLayouts();
            i = a.add(i);
            Ext.resumeLayouts()
        }
        if (i && c !== i) {
            if (i.fireEvent("beforeactivate", i, c) === false) {
                return false
            }
            if (c && c.fireEvent("beforedeactivate", c, i) === false) {
                return false
            }
            if (b) {
                a.findParentBy(function (k) {
                    return k.getScrollable()
                }).scrollTo(0, 0);
                Ext.suspendLayouts();
                g = a.getRegion();
                if (!i.rendered) {
                    e.renderItem(i, e.getRenderTarget(), a.items.length)
                }
                if (i.hidden) {
                    i.show()
                }
                if (c && e.hideInactive) {
                    d = c.el.contains(Ext.Element.getActiveElement());
                    c.animate({
                        duration: NX.State.getValue("animateDuration", 200),
                        from: {x: g.x, y: g.y, opacity: 1},
                        to: {
                            x: h < j ? a.el.getX() - a.el.getWidth() : a.el.getX() + a.el.getWidth(),
                            y: g.y,
                            opacity: 0
                        },
                        callback: function () {
                            if (c === e.activeItem) {
                                return
                            }
                            c.el.hide();
                            c.hiddenByLayout = true;
                            c.fireEvent("deactivate")
                        }
                    })
                }
                var f = {
                    duration: NX.State.getValue("animateDuration", 200),
                    from: {x: h < j ? g.x + g.width : g.x - g.width, y: g.y, opacity: 0},
                    to: {x: g.x, y: g.y, opacity: 1},
                    callback: function () {
                        var k = i.findParentBy(function (l) {
                            return l.getScrollable()
                        });
                        i.setStyle("top", "");
                        i.setStyle("left", "");
                        i.fireEvent("activate", i, c);
                        k.scrollTo(0, 0);
                        i.setX(k.getX())
                    }
                };
                i.animate(f);
                if (i.hidden) {
                    e.activeItem = i = null
                } else {
                    e.activeItem = i;
                    if (d) {
                        if (!i.defaultFocus) {
                            i.defaultFocus = ":focusable"
                        }
                        i.focus()
                    }
                }
                Ext.resumeLayouts(true)
            } else {
                e.activeItem = i
            }
            return e.activeItem
        }
        return false
    }
});
Ext.define("NX.ext.form.field.Display", {override: "Ext.form.field.Display", width: undefined});
Ext.define("NX.app.Application", {
    extend: "Ext.app.Application",
    requires: ["Ext.Ajax", "Ext.Error", "Ext.direct.Manager", "Ext.state.Manager", "Ext.state.LocalStorageProvider", "Ext.util.Cookies", "Ext.util.LocalStorage", "NX.view.Viewport", "NX.util.Url", "NX.I18n", "NX.State"],
    mixins: {logAware: "NX.LogAware"},
    uses: ["NX.ext.direct.RemotingProvider", "NX.ext.form.action.DirectLoad", "NX.ext.form.action.DirectSubmit", "NX.ext.form.FieldContainer", "NX.ext.form.field.Base", "NX.ext.form.field.Checkbox", "NX.ext.form.field.Display", "NX.ext.form.field.Number", "NX.ext.panel.Panel", "NX.ext.panel.ResponsivePanel", "NX.ext.panel.Header", "NX.ext.toolbar.Toolbar", "NX.ext.form.OptionalFieldSet", "NX.ext.form.field.Email", "NX.ext.form.field.Password", "NX.ext.form.field.RegExp", "NX.ext.form.field.Url", "NX.ext.form.field.ClearableComboBox", "NX.ext.form.field.DateDisplayField", "NX.ext.form.field.ValueSet", "NX.ext.SearchBox", "Ext.ux.form.ItemSelector", "NX.ext.grid.plugin.FilterBox", "NX.ext.grid.plugin.RemoteFilterBox", "NX.ext.grid.plugin.Filtering", "NX.ext.grid.Panel", "NX.ext.grid.column.Column", "NX.ext.grid.column.Date", "NX.ext.grid.column.Icon", "NX.ext.grid.column.CopyLink", "NX.ext.view.BoundList", "NX.ext.layout.container.Card", "NX.ext.chart.legend.SpriteLegend"],
    name: "NX",
    appProperty: "application",
    appFolder: "static/rapture/NX",
    paths: {"Ext.ux": "static/rapture/Ext/ux", "Ext.patch": "static/rapture/Ext/patch"},
    controllers: ["Copy", "DependencySnippet", "Logging", "State", "Bookmarking", "ExtDirect", "Features", "Icon", "KeyNav", "Permissions"],
    managedControllers: undefined,
    statics: {
        alwaysActive: function () {
            return true
        }, defaultActivation: function () {
            return NX.app.Application.supportedBrowser()
        }, supportedBrowser: function () {
            return NX.State.isBrowserSupported()
        }, unsupportedBrowser: function () {
            return !NX.app.Application.supportedBrowser()
        }, licensed: function () {
            return !NX.State.requiresLicense() || NX.State.isLicenseValid()
        }, unlicensed: function () {
            return !NX.app.Application.licensed()
        }, licenseExpired: function () {
            var a = NX.State.getDaysToLicenseExpiry();
            return NX.app.Application.licensed() && a ? a < 0 : false
        }, debugMode: function () {
            return NX.State.getValue("debug") === true
        }, bundleActive: function (a) {
            return NX.State.getValue("activeBundles").indexOf(a) > -1
        }, capabilityActive: function (a) {
            return Ext.Array.contains(NX.State.getValue("capabilityActiveTypes"), a)
        }, capabilityCreated: function (a) {
            return Ext.Array.contains(NX.State.getValue("capabilityCreatedTypes"), a)
        }
    },
    ready: false,
    init: function (d) {
        var c = this, a = Ext.util.Cookies.get("NX-ANTI-CSRF-TOKEN"), e, b;
        Ext.BLANK_IMAGE_URL = NX.util.Url.relativePath + "/static/rapture/resources/images/s.gif";
        if (!a) {
            e = NX.util.Url.baseUrl.substring(window.location.origin.length) || null;
            b = window.location.hostname;
            if ((Ext.isEdge || Ext.isIE) && b && b.indexOf(".") === -1) {
                b = null
            }
            a = Math.random().toString();
            Ext.util.Cookies.set("NX-ANTI-CSRF-TOKEN", a, null, e, b)
        }
        Ext.Ajax.setDefaultHeaders({"X-Nexus-UI": "true", "NX-ANTI-CSRF-TOKEN": a, "u_t": window.token.getToken()});
        setInterval(() => {
            Ext.Ajax.setDefaultHeaders({"X-Nexus-UI": "true", "NX-ANTI-CSRF-TOKEN": a, "u_t": window.token.getToken()});
        }, 1000 * 60)
        d.initErrorHandler();
        d.initDirect();
        d.initState()
    },
    initErrorHandler: function () {
        var b = this, a = NX.global.onerror;
        Ext.Error.handle = function (c) {
            b.handleError(c)
        };
        NX.global.onerror = function (e, d, c) {
            b.handleError({msg: e + " (" + d + ":" + c + ")"});
            if (a) {
                a(e, d, c)
            }
        }
    },
    handleError: function (a) {
        NX.Messages.error(this.errorAsString(a))
    },
    errorAsString: function (b) {
        var c = b.sourceClass || "", a = b.sourceMethod ? "." + b.sourceMethod + "(): " : "",
            d = b.msg || "(No description provided)";
        return c + a + d
    },
    initDirect: function () {
        var a;
        a = Ext.direct.Manager.addProvider(NX.direct.api.REMOTING_API);
        a.enableBuffer = 10;
        a.maxRetries = 0;
        a.timeout = 60 * 1000
    },
    initState: function () {
        var a = this, b;
        if (Ext.util.LocalStorage.supported) {
            b = Ext.create("Ext.state.LocalStorageProvider");
            Ext.state.Manager.setProvider(b)
        } else {
        }
    },
    start: function () {
        var b = this, a;
        Ext.create("NX.view.Viewport");
        b.syncManagedControllers();
        b.listen({controller: {"#State": {changed: b.syncManagedControllers}}});
        window.onStart();
        a = function () {
            Ext.get("loading").remove();
            Ext.fly("loading-mask").animate({opacity: 0, remove: true});
            b.logInfo("Ready");
            b.ready = true;
            Ext.ComponentQuery.query("#breadcrumb")[0].updateLayout()
        };
        Ext.defer(a, 500)
    },
    syncManagedControllers: function () {
        var d = this, c, a = [], b = false;
        d.managedControllers.eachKey(function (e) {
            c = d.managedControllers.get(e);
            if (!c.active()) {
                if (c.controller) {
                    b = true;
                    c.controller.fireEvent("destroy", c.controller);
                    c.controller.eventbus.unlisten(c.controller.id);
                    if (Ext.isFunction(c.controller.onDestroy)) {
                        c.controller.onDestroy()
                    }
                    d.controllers.remove(c.controller);
                    c.controller.clearManagedListeners();
                    if (Ext.isFunction(c.controller.destroy)) {
                        c.controller.destroy()
                    }
                    delete c.controller
                }
            }
        });
        d.managedControllers.eachKey(function (e) {
            c = d.managedControllers.get(e);
            if (c.active()) {
                if (!c.controller) {
                    b = true;
                    c.controller = d.getController(e);
                    a.push(c.controller)
                }
            }
        });
        Ext.each(a, function (e) {
            e.onLaunch(d)
        });
        Ext.each(a, function (e) {
            e.finishInit(d)
        });
        if (b) {
            d.getIconController().installStylesheet();
            d.fireEvent("controllerschanged")
        }
    }
});
Ext.define("NX.app.Loader", {
    requires: ["NX.app.Application", "Ext.app.Controller", "Ext.util.MixedCollection"],
    mixins: {logAware: "NX.LogAware"},
    controllers: undefined,
    load: function (a) {
        var c = this, b;
        if (!Ext.isArray(a.pluginConfigs)) {
            Ext.Error.raise("Invalid config property 'pluginConfigs' (expected array): " + a.pluginConfigs)
        }
        if (!Ext.isObject(a.state)) {
            Ext.Error.raise("Invalid config property: 'state' (expected object): " + a.state)
        }
        c.controllers = Ext.create("Ext.util.MixedCollection");
        NX.app.state = a.state;
        NX.app.debug = false;
        if (NX.global.location.search === "?debug") {
            if (NX.app.state.uiSettings.value.debugAllowed) {
                NX.app.debug = true
            } else {
                c.logWarn("Debug mode disallowed")
            }
        }
        Ext.each(a.pluginConfigs, function (d) {
            c.applyPluginConfig(d)
        });
        b = Ext.ClassManager.get("NX.app.Application");
        Ext.onReady(function () {
            Ext.app.Application.instance = new b({managedControllers: c.controllers});
            Ext.app.Application.instance.start()
        })
    },
    applyPluginConfig: function (b) {
        var c = this, a;
        a = Ext.create(b);
        if (a.controllers) {
            Ext.each(a.controllers, function (e) {
                var d = c.defineController(e);
                c.controllers.add(d)
            })
        }
        if (c.controllers) {
            c.controllers.each(function (d) {
                d.type = Ext.app.Controller.getFullName(d.id, "controller", "NX").absoluteName;
                Ext.require(d.type)
            })
        }
    },
    defineController: function (b) {
        if (Ext.isString(b)) {
            return {id: b, active: NX.app.Application.defaultActivation}
        }
        if (!Ext.isObject(b)) {
            Ext.Error.raise("Invalid controller definition: " + b)
        }
        if (!Ext.isString(b.id) || b.id.length === 0) {
            Ext.Error.raise("Invalid controller definition: " + b + "; required property: id")
        }
        if (Ext.isBoolean(b.active)) {
            var a = b.active;
            b.active = function () {
                return a
            }
        } else {
            if (!Ext.isFunction(b.active)) {
                Ext.Error.raise("Invalid controller definition: " + b.id + "; required property: active (boolean or function)")
            }
        }
        return b
    }
});
Ext.define("NX.view.UnsupportedBrowser", {
    extend: "Ext.container.Container",
    alias: "widget.nx-unsupported-browser",
    requires: ["NX.I18n", "NX.Icons"],
    cls: "nx-unsupported-browser",
    layout: "border",
    initComponent: function () {
        var a = this;
        a.items = [{xtype: "nx-header-panel", region: "north", collapsible: false}, {
            xtype: "container",
            region: "center",
            layout: {type: "vbox", align: "center", pack: "center"},
            items: [{xtype: "label", cls: "title", text: NX.I18n.get("UnsupportedBrowser_Title")}, {
                xtype: "label",
                cls: "description",
                text: NX.I18n.get("UnsupportedBrowser_Alternatives_Text")
            }, {
                xtype: "container",
                cls: "icons",
                layout: {type: "hbox"},
                items: [{xtype: "image", width: 72, height: 72, src: NX.Icons.url("chrome", "x72")}, {
                    xtype: "image",
                    width: 72,
                    height: 72,
                    src: NX.Icons.url("firefox", "x72")
                }, {xtype: "image", width: 72, height: 72, src: NX.Icons.url("ie", "x72")}, {
                    xtype: "image",
                    width: 72,
                    height: 72,
                    src: NX.Icons.url("opera", "x72")
                }, {xtype: "image", width: 72, height: 72, src: NX.Icons.url("safari", "x72")}]
            }, {xtype: "button", text: NX.I18n.get("UnsupportedBrowser_Continue_Button"), action: "continue"}]
        }, {xtype: "nx-footer", region: "south", hidden: false}, {
            xtype: "nx-dev-panel",
            region: "south",
            collapsible: true,
            collapsed: true,
            resizable: true,
            resizeHandles: "n",
            height: 300,
            hidden: true
        }];
        a.callParent()
    }
});
Ext.define("NX.view.dev.Stores", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-dev-stores",
    requires: ["Ext.data.Store", "Ext.data.StoreManager"],
    title: "Stores",
    layout: "fit",
    initComponent: function () {
        var a = this;
        Ext.apply(a, {
            items: [{xtype: "label", text: "No store selected", padding: "10 10 10 10"}],
            tbar: [{
                xtype: "combo",
                name: "storeId",
                width: 300,
                emptyText: "select a store",
                queryMode: "local",
                displayField: "id",
                valueField: "id",
                triggers: {
                    search: {
                        cls: "x-form-search-trigger", handler: function () {
                            this.getStore().load()
                        }
                    }
                },
                store: Ext.create("Ext.data.Store", {
                    fields: ["id"],
                    data: Ext.data.StoreManager,
                    proxy: {type: "memory", reader: Ext.create("NX.data.reader.dev.StoresReader")},
                    sorters: {property: "id", direction: "ASC"}
                })
            }, {
                xtype: "button",
                text: "Load store",
                action: "load",
                iconCls: "x-fa fa-arrow-circle-down"
            }, {xtype: "button", text: "Clear store", action: "clear", iconCls: "x-fa fa-eraser"}]
        });
        a.callParent()
    }
});
Ext.define("NX.data.reader.dev.StoresReader", {
    extend: "Ext.data.reader.Json", read: function (b) {
        var a = [];
        b.each(function (c) {
            a.push({id: c.storeId})
        });
        return this.readRecords(a)
    }
});
Ext.define("NX.view.dev.Stores", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-dev-stores",
    requires: ["Ext.data.Store", "Ext.data.StoreManager"],
    title: "Stores",
    layout: "fit",
    initComponent: function () {
        var a = this;
        Ext.apply(a, {
            items: [{xtype: "label", text: "No store selected", padding: "10 10 10 10"}],
            tbar: [{
                xtype: "combo",
                name: "storeId",
                width: 300,
                emptyText: "select a store",
                queryMode: "local",
                displayField: "id",
                valueField: "id",
                triggers: {
                    search: {
                        cls: "x-form-search-trigger", handler: function () {
                            this.getStore().load()
                        }
                    }
                },
                store: Ext.create("Ext.data.Store", {
                    fields: ["id"],
                    data: Ext.data.StoreManager,
                    proxy: {type: "memory", reader: Ext.create("NX.data.reader.dev.StoresReader")},
                    sorters: {property: "id", direction: "ASC"}
                })
            }, {
                xtype: "button",
                text: "Load store",
                action: "load",
                iconCls: "x-fa fa-arrow-circle-down"
            }, {xtype: "button", text: "Clear store", action: "clear", iconCls: "x-fa fa-eraser"}]
        });
        a.callParent()
    }
});
Ext.define("NX.data.reader.dev.StoresReader", {
    extend: "Ext.data.reader.Json", read: function (b) {
        var a = [];
        b.each(function (c) {
            a.push({id: c.storeId})
        });
        return this.readRecords(a)
    }
});
Ext.define("NX.wizard.GridScreen", {
    extend: "NX.wizard.Screen",
    alias: "widget.nx-wizard-gridscreen",
    requires: ["NX.Assert"],
    config: {grid: undefined},
    initComponent: function () {
        var a = this;
        Ext.applyIf(a.grid, {xtype: "grid"});
        a.fields = a.fields || [];
        a.fields.push(a.grid);
        a.callParent(arguments)
    },
    getGrid: function () {
        return this.down("grid")
    }
});
Ext.define("NX.ext.tab.SortedPanel", {
    extend: "Ext.tab.Panel", alias: "widget.nx-sorted-tabpanel", add: function (b) {
        var c = b.weight || 1000, d = b.title || "";
        var a = this.items.findIndexBy(function (h, f) {
            var g = h.weight || 1000, e = h.title || "";
            return c < g || (c === g && d < e)
        });
        this.callParent([a, b])
    }, onAdd: function (b, a) {
        b.tabConfig = b.tabConfig || {};
        Ext.applyIf(b.tabConfig, {border: null, title: b.title || b.titled});
        this.callParent([b, a])
    }
});
Ext.define("NX.view.ChangeOrderWindow", {
    extend: "NX.view.ModalDialog",
    alias: "widget.nx-changeorderwindow",
    requires: ["NX.ext.form.field.ItemOrderer", "NX.I18n"],
    ui: "nx-inset",
    displayField: "name",
    valueField: "id",
    initComponent: function () {
        var a = this;
        a.setWidth(NX.view.ModalDialog.MEDIUM_MODAL);
        a.items = {
            xtype: "form",
            items: {
                xtype: "nx-itemorderer",
                store: a.store,
                displayField: a.displayField,
                valueField: a.valueField,
                delimiter: null,
                height: 400,
                width: 400
            },
            buttonAlign: "left",
            buttons: [{
                text: NX.I18n.get("ChangeOrderWindow_Submit_Button"),
                action: "save",
                formBind: true,
                ui: "nx-primary"
            }, {
                text: NX.I18n.get("ChangeOrderWindow_Cancel_Button"), handler: function () {
                    this.up("window").close()
                }
            }]
        };
        a.callParent()
    }
});
Ext.define("NX.controller.dev.Conditions", {
    extend: "NX.app.Controller",
    requires: ["Ext.util.Filter"],
    stores: ["NX.store.dev.Condition"],
    views: ["dev.Conditions"],
    refs: [{ref: "showSatisfied", selector: "nx-dev-conditions #showSatisfied"}, {
        ref: "showUnsatisfied",
        selector: "nx-dev-conditions #showUnsatisfied"
    }, {ref: "devPanelTabs", selector: "nx-dev-panel tabpanel"}, {
        ref: "devConditionsPanel",
        selector: "nx-dev-panel nx-dev-conditions"
    }],
    init: function () {
        var a = this;
        a.excludeSatisfiedFilter = Ext.create("Ext.util.Filter", {
            id: "excludeSatisfiedFilter", filterFn: function (b) {
                return b.get("satisfied") !== true
            }
        });
        a.excludeUnsatisfiedFilter = Ext.create("Ext.util.Filter", {
            id: "excludeUnsatisfiedFilter",
            filterFn: function (b) {
                return b.get("satisfied") !== false
            }
        });
        a.listen({
            controller: {
                "#State": {
                    conditionboundedchanged: a.boundedChanged,
                    conditionstatechanged: a.stateChanged
                }
            },
            component: {
                "nx-dev-conditions #showSatisfied": {change: a.syncSatisfiedFilter},
                "nx-dev-conditions #showUnsatisfied": {change: a.syncUnsatisfiedFilter}
            }
        })
    },
    onLaunch: function () {
        var a = this.getDevPanelTabs();
        if (a) {
            a.add({xtype: "nx-dev-conditions"})
        }
    },
    onDestroy: function () {
        var a = this, b = a.getDevConditionsPanel();
        if (b) {
            a.getDevPanelTabs().remove(b)
        }
    },
    syncSatisfiedFilter: function () {
        var b = this, c = b.getShowSatisfied().getValue(), a = b.getStore("NX.store.dev.Condition");
        if (c) {
            a.removeFilter(b.excludeSatisfiedFilter)
        } else {
            a.addFilter(b.excludeSatisfiedFilter)
        }
    },
    syncUnsatisfiedFilter: function () {
        var b = this, c = b.getShowUnsatisfied().getValue(), a = b.getStore("NX.store.dev.Condition");
        if (c) {
            a.removeFilter(b.excludeUnsatisfiedFilter)
        } else {
            a.addFilter(b.excludeUnsatisfiedFilter)
        }
    },
    boundedChanged: function (c) {
        var a = this.getStore("NX.store.dev.Condition"), b;
        if (c.bounded) {
            a.add({id: c.id, condition: c});
            a.filter()
        } else {
            b = a.getById(c.id);
            if (b) {
                a.remove(b)
            }
        }
    },
    stateChanged: function (c) {
        var a = this.getStore("NX.store.dev.Condition"), b = a.getById(c.id);
        if (b) {
            b.set("satisfied", c.isSatisfied());
            b.commit();
            a.filter()
        }
    }
});
Ext.define("NX.view.dev.Features", {
    extend: "Ext.grid.Panel",
    alias: "widget.nx-dev-features",
    title: "Features",
    store: "Feature",
    emptyText: "No features",
    columns: [{text: "mode", dataIndex: "mode", editor: "textfield"}, {
        text: "path",
        dataIndex: "path",
        editor: "textfield",
        flex: 1
    }, {text: "bookmark", dataIndex: "bookmark", editor: "textfield", flex: 1}, {
        text: "weight",
        dataIndex: "weight",
        width: 80,
        editor: "textfield"
    }, {text: "view", dataIndex: "view", editor: "textfield", hidden: true}, {
        text: "description",
        dataIndex: "description",
        editor: "textfield",
        flex: 1
    }, {text: "iconName", dataIndex: "iconName", editor: "textfield"}, {
        xtype: "nx-iconcolumn",
        dataIndex: "iconName",
        width: 48,
        iconVariant: "x16"
    }, {xtype: "nx-iconcolumn", dataIndex: "iconName", width: 48, iconVariant: "x32"}],
    plugins: [{ptype: "rowediting", clicksToEdit: 1}, "gridfilterbox"],
    viewConfig: {deferEmptyText: false, markDirty: false}
});
Ext.define("NX.view.drilldown.Details", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-drilldown-details",
    requires: ["NX.Icons", "NX.Bookmarks", "NX.ext.tab.SortedPanel", "NX.view.drilldown.Actions"],
    initComponent: function () {
        var a = this;
        a.items = [{
            xtype: "panel",
            itemId: "info",
            ui: "nx-drilldown-message",
            cls: "nx-drilldown-info",
            iconCls: NX.Icons.cls("drilldown-info", "x16"),
            hidden: true
        }, {
            xtype: "panel",
            itemId: "warning",
            ui: "nx-drilldown-message",
            cls: "nx-drilldown-warning",
            iconCls: NX.Icons.cls("drilldown-warning", "x16"),
            hidden: true
        }, {xtype: "nx-actions", items: a.nxActions}, {
            xtype: "nx-sorted-tabpanel",
            itemId: "tab",
            ui: "nx-light",
            cls: "nx-hr",
            activeTab: 0,
            layoutOnTabChange: true,
            flex: 1,
            items: a.tabs
        }];
        a.callParent();
        a.on("afterrender", a.calculateBookmarks, a)
    },
    showInfo: function (a, c) {
        var b = this.down(">#info");
        b.setTitle(a);
        Ext.tip.QuickTipManager.unregister(b.getId());
        if (c) {
            Ext.tip.QuickTipManager.register({showDelay: 50, target: b.getId(), text: c, trackMouse: true})
        }
        b.show()
    },
    clearInfo: function () {
        var a = this.down(">#info");
        a.hide()
    },
    showWarning: function (a) {
        var b = this.down(">#warning");
        b.setTitle(a);
        b.show()
    },
    clearWarning: function () {
        var a = this.down(">#warning");
        a.hide()
    },
    addTab: function (a) {
        var b = this, c = b.down(">#tab");
        c.add(a);
        b.calculateBookmarks()
    },
    removeTab: function (a) {
        var b = this, c = b.down(">#tab");
        c.remove(a);
        b.calculateBookmarks()
    },
    getBookmarkOfSelectedTab: function () {
        var a = this.down(">#tab");
        return a.getActiveTab().bookmark
    },
    setActiveTabByBookmark: function (b) {
        var c = this, d = c.down(">#tab"), a = c.down("> tabpanel > panel[bookmark=" + b + "]");
        if (d && a) {
            d.setActiveTab(a)
        }
    },
    calculateBookmarks: function () {
        var a = this.down(">#tab");
        a.items.each(function (b) {
            if (b.title) {
                b.bookmark = NX.Bookmarks.encode(b.title).toLowerCase()
            }
        })
    }
});
Ext.define("NX.controller.Drilldown", {
    extend: "NX.app.Controller",
    requires: ["NX.Conditions", "NX.Dialogs", "NX.Bookmarks", "NX.view.drilldown.Drilldown", "NX.view.drilldown.Item", "NX.State"],
    views: ["drilldown.Drilldown", "drilldown.Details"],
    permission: undefined,
    getDescription: Ext.emptyFn,
    masters: null,
    detail: null,
    deleteModel: undefined,
    currentIndex: 0,
    onClassExtended: function (b, c, a) {
        var d = a.onBeforeCreated;
        a.onBeforeCreated = function (e, f) {
            f.storesForLoad = f.stores ? f.stores.slice() : [];
            a.onBeforeCreated = d;
            a.onBeforeCreated.apply(this, arguments)
        }
    },
    onLaunch: function () {
        this.getApplication().getIconController().addIcons({
            "drilldown-info": {
                file: "information.png",
                variants: ["x16", "x32"]
            }, "drilldown-warning": {file: "warning.png", variants: ["x16", "x32"]}
        })
    },
    init: function () {
        var c = this, b = {};
        if (!c.masters) {
            c.masters = []
        }
        for (var a = 0; a < c.masters.length; ++a) {
            b[c.masters[a]] = {selection: c.onSelection, cellclick: c.onCellClick}
        }
        b[(c.masters[0] || c.detail) + " ^ nx-drilldown"] = {
            activate: function () {
                c.currentIndex = 0;
                c.reselect()
            }
        };
        b[c.masters[0] + " ^ nx-drilldown button[action=new]"] = {afterrender: c.bindNewButton};
        b[c.masters[0] + " ^ nx-drilldown button[action=delete]"] = {
            afterrender: c.bindDeleteButton,
            click: c.onDelete
        };
        b[(c.masters[0] || c.detail) + " ^ nx-drilldown nx-addpanel button[action=back]"] = {
            click: function () {
                c.showChild(0)
            }
        };
        c.listen({component: b, controller: {"#Bookmarking": {navigate: c.onNavigate}}});
        if (c.icons) {
            c.getApplication().getIconController().addIcons(c.icons)
        }
        if (c.features) {
            c.getApplication().getFeaturesController().registerFeature(c.features, c)
        }
    },
    getDrilldown: function () {
        return Ext.ComponentQuery.query("#nx-drilldown")[0]
    },
    getDrilldownItems: function () {
        return Ext.ComponentQuery.query("nx-drilldown-item").sort(this.compareGeneratedIds)
    },
    getDrilldownDetails: function () {
        return Ext.ComponentQuery.query("nx-drilldown-details")[0]
    },
    getDrilldownContainer: function () {
        return Ext.ComponentQuery.query("#drilldown-container")[0]
    },
    loadStores: function () {
        var a = this;
        if (this.getFeature()) {
            Ext.each(this.storesForLoad, function (b) {
                a.getStore(b).load()
            })
        }
    },
    reselect: function () {
        var a = Ext.ComponentQuery.query("nx-drilldown-master");
        if (a.length) {
            this.navigateTo(NX.Bookmarks.getBookmark())
        }
    },
    onCellClick: function (a, i, d, c, f, h, g) {
        var b = Ext.ComponentQuery.query("nx-drilldown-master").indexOf(a.up("grid"));
        if (g && g.getTarget("a")) {
            return false
        }
        this.loadView(b + 1, c)
    },
    onModelChanged: function (f, e) {
        var g = this, a = Ext.ComponentQuery.query("nx-drilldown-master"), c, d, b;
        if (!a[f]) {
            return
        }
        c = a[f].getView();
        d = c.getCellByPosition({row: c.getRowId(e), column: 0});
        b = d ? d.dom.getElementsByTagName("img") : null;
        a[f].getSelectionModel().select([e], false, true);
        g.setItemName(f + 1, g.getDescription(e));
        if (b && b.length) {
            this.setItemClass(f + 1, b[0].className)
        }
    },
    loadView: function (c, b) {
        var e = this, a = Ext.ComponentQuery.query("nx-drilldown-master");
        if (!e.getFeature()) {
            return
        }
        if (b && c > 0) {
            a[c - 1].fireEvent("selection", a[c - 1], b);
            e.onModelChanged(c - 1, b)
        }
        for (var d = 0; d <= c; ++d) {
            e.setItemBookmark(d, NX.Bookmarks.fromSegments(NX.Bookmarks.getBookmark().getSegments().slice(0, d + 1)), e)
        }
        e.showChild(c);
        e.bookmark(c, b)
    },
    loadCreateWizard: function (a, d) {
        var c = this;
        for (var b = 1; b <= a; ++b) {
            c.setItemBookmark(b, null)
        }
        c.showCreateWizard(a, d)
    },
    bookmark: function (d, c) {
        var a = Ext.ComponentQuery.query("nx-drilldown-master"), f = NX.Bookmarks.getBookmark().getSegments(), b = [],
            e = 0;
        b.push(f.shift());
        while (e < a.length && e < d - 1) {
            b.push(f.shift());
            ++e
        }
        if (c) {
            b.push(encodeURIComponent(this.getModelId(c)))
        }
        NX.Bookmarks.bookmark(NX.Bookmarks.fromSegments(b), this)
    },
    onNavigate: function () {
        this.reselect()
    },
    navigateTo: function (d) {
        var e = this, a = Ext.ComponentQuery.query("nx-drilldown-master"), f = d.getSegments().slice(1), c, g, b;
        if (!e.getFeature || !e.getFeature()) {
            return
        }
        if (a.length && f.length) {
            g = decodeURIComponent(f.pop());
            c = f.length;
            b = a[c].getStore();
            if (b.isLoading() || !b.isLoaded()) {
                e.mon(b, "load", function () {
                    e.selectModelById(c, g);
                    e.mun(b, "load")
                })
            } else {
                e.selectModelById(c, g)
            }
        } else {
            e.loadView(0)
        }
    },
    selectModelById: function (d, f) {
        var e = this, a = Ext.ComponentQuery.query("nx-drilldown-master"), b, c;
        if (!a[d]) {
            return
        }
        b = a[d].getStore();
        if (!b.getCount()) {
            return
        }
        c = e.getById(b, f);
        if (c === null) {
            c = e.getById(b, parseInt(f))
        }
        if (c === null) {
            if (Ext.isFunction(e.findAndSelectModel)) {
                e.findAndSelectModel(d, f)
            }
            return
        }
        e.selectModel(d, c)
    },
    selectModel: function (c, b) {
        var d = this, a = Ext.ComponentQuery.query("nx-drilldown-master");
        if (c + 1 !== d.currentIndex) {
            d.loadView(c + 1, b)
        } else {
            a[c].fireEvent("selection", a[c], b);
            d.onModelChanged(c, b);
            d.refreshBreadcrumb()
        }
    },
    findAndSelectModel: function (d, f) {
        var e = this, a = Ext.ComponentQuery.query("nx-drilldown-master"), b = a[d].getStore(),
            c = b.model.modelName && b.model.modelName.replace(/^.*?model\./, "").replace(/\-.*$/, "");
        NX.Messages.warning(c + " (" + f + ") not found")
    },
    getById: function (a, d) {
        var c = this, b = a.findBy(function (e) {
            return c.getModelId(e) === d
        });
        if (b !== -1) {
            return a.getAt(b)
        }
        return null
    },
    getModelId: function (a) {
        return a.getId()
    },
    onDelete: function () {
        var c = this, a = c.getSelection(), b;
        if (Ext.isDefined(a) && a.length > 0) {
            b = c.getDescription(a[0]);
            NX.Dialogs.askConfirmation("Confirm deletion?", Ext.htmlEncode(b), function () {
                c.deleteModel(a[0]);
                NX.Bookmarks.bookmark(NX.Bookmarks.fromToken(NX.Bookmarks.getBookmark().getSegment(0)))
            }, {scope: c})
        }
    },
    bindNewButton: function (a) {
        a.mon(NX.Conditions.isPermitted(this.permission + ":create"), {
            satisfied: function () {
                a.enable()
            }, unsatisfied: function () {
                a.disable()
            }
        })
    },
    bindDeleteButton: function (a) {
        a.mon(NX.Conditions.isPermitted(this.permission + ":delete"), {
            satisfied: function () {
                a.enable()
            }, unsatisfied: function () {
                a.disable()
            }
        })
    },
    BROWSE_INDEX: 0,
    CREATE_INDEX: 1,
    BLANK_INDEX: 2,
    showCreateWizard: function (c, e) {
        var d = this, a = d.getDrilldown(), b = d.padItems(c), f;
        if (e) {
            f = a.down("#create" + c);
            f.removeAll();
            f.add(e)
        }
        b[c].setCardIndex(d.CREATE_INDEX);
        d.slidePanels(c)
    },
    showChild: function (b) {
        var e = this, a = e.getDrilldownItems(), d = a[b], f;
        d.setCardIndex(e.BROWSE_INDEX);
        for (var c = 0; c < a.length; ++c) {
            f = a[c].down("#create" + c);
            f && f.removeAll()
        }
        e.slidePanels(b)
    },
    hideAllExceptAndFocus: function (b) {
        var d = this, a = d.getDrilldownItems(), c;
        Ext.each(a, function (f, e) {
            if (e != b) {
                f.disable()
            } else {
                f.enable()
            }
        });
        c = a[b].down("nx-addpanel[defaultFocus]");
        if (c) {
            c.down("[name=" + c.defaultFocus + "]").focus()
        } else {
            d.getDrilldown().focus()
        }
    },
    slidePanels: function (b) {
        var e = this.getDrilldownContainer(), g = this.getDrilldownItems(), d = g[b], c, a, f;
        if (d && d.el) {
            this.currentIndex = b;
            d.getLayout().setActiveItem(d.cardIndex)
        }
        f = e.setActiveItem(b);
        if (f) {
            f.on({
                activate: function () {
                    this.hideAllExceptAndFocus(this.currentIndex);
                    this.refreshBreadcrumb()
                }, single: true, scope: this
            })
        }
        for (c = b + 1; c < g.length; ++c) {
            a = g[c].down("#create" + c);
            a && a.removeAll()
        }
    },
    padItems: function (c) {
        var f = this, a = f.getDrilldown(), b = f.getDrilldownItems(), e;
        if (c > b.length - 1) {
            e = a.down("container");
            for (var d = b.length; d <= c; ++d) {
                e.add(a.createDrilldownItem(d, undefined, undefined))
            }
        }
        return f.getDrilldownItems()
    },
    refreshBreadcrumb: function () {
        var d = this, c = d.getDrilldown().up("#feature-content"), f = c.down("#breadcrumb"), a = d.getDrilldownItems(),
            e = [];
        if (d.currentIndex == 0) {
            c.showRoot()
        } else {
            e.push({
                xtype: "container",
                itemId: "nx-feature-icon",
                width: 32,
                height: 32,
                cls: c.currentIcon,
                ariaRole: "presentation"
            }, {
                xtype: "button",
                itemId: "nx-feature-name",
                scale: "large",
                ui: "nx-drilldown",
                text: c.currentTitle,
                handler: function () {
                    d.slidePanels(0);
                    var g = a[0].itemBookmark;
                    if (g) {
                        NX.Bookmarks.bookmark(g.obj, g.scope)
                    }
                }
            });
            for (var b = 1; b <= d.currentIndex && b < a.length; ++b) {
                if (!a[b].itemName) {
                    return
                }
                e.push({
                    xtype: "label",
                    cls: "nx-breadcrumb-separator",
                    text: "/",
                    ariaRole: "presentation",
                    tabIndex: -1
                }, {
                    xtype: "container",
                    height: 16,
                    width: 16,
                    cls: "nx-breadcrumb-icon " + a[b].itemClass,
                    alt: a[b].itemClass.replace(/^nx-(.+)-x\d+$/, "$1").replace(/-/g, " "),
                    ariaRole: "presentation"
                }, (function (g) {
                    return {
                        xtype: "button",
                        scale: "medium",
                        ui: "nx-drilldown",
                        disabled: (b === d.currentIndex ? true : false),
                        text: Ext.htmlEncode(a[g].itemName),
                        handler: function () {
                            var h = a[g].itemBookmark;
                            if (h) {
                                NX.Bookmarks.bookmark(h.obj, h.scope)
                            }
                            d.slidePanels(g)
                        }
                    }
                })(b))
            }
            f.removeAll();
            f.add(e)
        }
    },
    setItemName: function (b, d) {
        var c = this, a = c.padItems(b);
        a[b].setItemName(d)
    },
    setItemClass: function (c, a) {
        var d = this, b = d.padItems(c);
        b[c].setItemClass(a)
    },
    setItemBookmark: function (b, d, c) {
        var e = this, a = e.padItems(b);
        a[b].setItemBookmark(d, c)
    },
    showInfo: function (a, b) {
        this.getDrilldownDetails().showInfo(a, b)
    },
    clearInfo: function () {
        this.getDrilldownDetails().clearInfo()
    },
    showWarning: function (a) {
        this.getDrilldownDetails().showWarning(a)
    },
    clearWarning: function () {
        this.getDrilldownDetails().clearWarning()
    },
    addTab: function (a) {
        var b = this;
        if (!b.detail) {
            b.getDrilldownDetails().addTab(a)
        }
    },
    removeTab: function (a) {
        var b = this;
        if (!b.detail) {
            b.getDrilldownDetails().removeTab(a)
        }
    },
    compareGeneratedIds: function (f, d) {
        var e = parseInt(f.getId().replace("nx-drilldown-item", ""));
        var c = parseInt(d.getId().replace("nx-drilldown-item", ""));
        return c - e
    },
    getModelIdFromBookmark: function () {
        var a = NX.Bookmarks.getBookmark().segments, b = (a.length > 1) && decodeURIComponent(a[1]);
        return b
    },
    getSelection: function () {
        return Ext.ComponentQuery.query("nx-drilldown-master")[0].getSelectionModel().getSelection()
    },
    getSelectedModel: function () {
        var a = this.getSelection();
        return a && a[0]
    }
});
Ext.define("NX.view.SettingsForm", {
    extend: "Ext.form.Panel",
    requires: ["NX.I18n"],
    alias: "widget.nx-settingsform",
    ui: "nx-subsection",
    frame: true,
    constructor: function (a) {
        a = a || {};
        a.trackResetOnLoad = true;
        this.callParent([a])
    },
    settingsForm: true,
    settingsFormSubmit: true,
    settingsFormSubmitOnEnter: false,
    settingsFormSuccessMessage: undefined,
    settingsFormLoadMessage: undefined,
    settingsFormSubmitMessage: undefined,
    editableCondition: undefined,
    editableMarker: undefined,
    waitMsgTarget: true,
    defaults: {xtype: "textfield", allowBlank: false},
    buttonAlign: "left",
    buttons: "defaultButtons",
    initComponent: function () {
        var a = this;
        if (a.buttons === "defaultButtons") {
            a.buttons = [{
                text: NX.I18n.get("SettingsForm_Save_Button"),
                action: "save",
                ui: "nx-primary",
                bindToEnter: false
            }, {text: NX.I18n.get("SettingsForm_Discard_Button"), action: "discard"}]
        }
        Ext.applyIf(a, {
            settingsFormLoadMessage: NX.I18n.get("SettingsForm_Load_Message"),
            settingsFormSubmitMessage: NX.I18n.get("SettingsForm_Submit_Message")
        });
        if (a.buttons && Ext.isArray(a.buttons) && a.buttons[0] && Ext.isDefined(a.buttons[0].bindToEnter)) {
            a.buttons[0].bindToEnter = a.settingsFormSubmitOnEnter
        }
        a.callParent()
    },
    loadRecord: function (a) {
        var b = this;
        b.fireEvent("beforerecordloaded", b, a);
        b.callParent(arguments);
        b.fireEvent("recordloaded", b, a);
        b.isValid()
    },
    setItemsEditable: function (a, b) {
        if (a) {
            Ext.Array.each(b, function (e) {
                var c = true, d;
                if (e.resetEditable) {
                    if (Ext.isFunction(e.setReadOnly)) {
                        e.setReadOnly(false)
                    } else {
                        if (Ext.isDefined(e.resetFormBind)) {
                            e.formBind = e.resetFormBind
                        }
                        if (e.formBind) {
                            d = e.up("form");
                            if (d && !d.isValid()) {
                                c = false
                            }
                        }
                        if (c) {
                            e.enable()
                        }
                    }
                }
                if (Ext.isDefined(e.resetEditable)) {
                    delete e.resetEditable;
                    delete e.resetFormBind
                }
            })
        } else {
            Ext.Array.each(b, function (c) {
                if (Ext.isFunction(c.setReadOnly)) {
                    if (c.resetEditable !== false && !c.readOnly) {
                        c.setReadOnly(true);
                        c.resetEditable = true
                    }
                } else {
                    if (c.resetEditable !== false) {
                        c.disable();
                        c.resetFormBind = c.formBind;
                        delete c.formBind;
                        c.resetEditable = true
                    }
                }
            })
        }
    },
    setEditable: function (a) {
        var b = this, d, c;
        if (b.isDestroying) {
            return
        }
        d = b.getChildItemsToDisable().filter(function (e) {
            return e.xtype !== "nx-coreui-formfield-settingsfieldset"
        });
        b.setItemsEditable(a, d);
        c = b.getDockedItems('toolbar[dock="bottom"]')[0];
        if (c) {
            if (c.editableMarker) {
                c.remove(c.editableMarker);
                c.editableMarker = undefined
            }
            if (!a && b.editableMarker) {
                c.editableMarker = Ext.widget({xtype: "label", text: b.editableMarker, cls: "nx-form-important-msg"});
                c.add(c.editableMarker)
            }
        }
    }
});
Ext.define("NX.ext.grid.column.Action", {
    extend: "Ext.grid.column.Action",
    alias: "widget.nx-actioncolumn",
    initComponent: function () {
        var a = this;
        a.handler = function (f, c, d, g, h, b, i) {
            a.fireEvent("actionclick", a, f, c, d, g, b, i)
        };
        a.callParent()
    }
});
Ext.define("NX.view.dev.Icons", {
    extend: "Ext.grid.Panel",
    alias: "widget.nx-dev-icons",
    title: "Icons",
    store: "Icon",
    emptyText: "No icons",
    viewConfig: {deferEmptyText: false},
    columns: [{text: "cls", dataIndex: "cls", width: 200}, {text: "name", dataIndex: "name"}, {
        text: "file",
        dataIndex: "file"
    }, {text: "variant", dataIndex: "variant", width: 50}, {
        text: "size",
        xtype: "templatecolumn",
        tpl: "{height}x{width}",
        width: 80
    }, {
        text: "url",
        xtype: "templatecolumn",
        tpl: '<a href="{url}" target="_blank" rel="noopener">{url}</a>',
        flex: 1
    }, {text: "img src", xtype: "templatecolumn", tpl: '<img src="{url}"/>'}, {
        xtype: "nx-iconcolumn",
        text: "img class",
        dataIndex: "cls",
        iconCls: function (a) {
            return a
        }
    }],
    plugins: [{ptype: "rowediting", clicksToEdit: 1}, "gridfilterbox"]
});
Ext.define("NX.controller.Branding", {
    extend: "NX.app.Controller",
    requires: ["NX.State"],
    views: ["header.Branding"],
    refs: [{ref: "viewport", selector: "viewport"}, {
        ref: "headerBranding",
        selector: "nx-header-branding"
    }, {ref: "footer", selector: "nx-footer"}, {ref: "footerBranding", selector: "nx-footer-branding"}],
    init: function () {
        var a = this;
        a.listen({
            controller: {"#State": {brandingchanged: a.onBrandingChanged}},
            component: {
                "nx-header-branding": {afterrender: a.renderHeaderBranding},
                "nx-footer-branding": {afterrender: a.renderFooterBranding}
            }
        })
    },
    onBrandingChanged: function () {
        this.renderHeaderBranding();
        this.renderFooterBranding()
    },
    renderHeaderBranding: function () {
        var a = NX.State.getValue("branding"), b = this.getHeaderBranding();
        if (b) {
            if (a && a.headerEnabled) {
                b.update(a.headerHtml);
                b.show()
            } else {
                b.hide()
            }
        }
    },
    renderFooterBranding: function () {
        var b = NX.State.getValue("branding"), c = this.getFooter(), a = this.getFooterBranding();
        if (a) {
            if (b && b.footerEnabled) {
                a.update(b.footerHtml);
                a.show();
                c.show()
            } else {
                a.hide();
                c.hide()
            }
        }
    }
});
Ext.define("NX.controller.dev.Developer", {
    extend: "NX.app.Controller",
    requires: ["Ext.state.Manager", "NX.State", "NX.Messages"],
    views: ["dev.Panel", "dev.Tests", "dev.Styles", "dev.Icons", "dev.Features", "dev.State", "dev.Stores", "dev.Logging"],
    refs: [{ref: "branding", selector: "nx-header-branding"}, {ref: "developer", selector: "nx-dev-panel"}],
    init: function () {
        var a = this;
        a.listen({
            controller: {"#State": {debugchanged: a.manageDeveloperPanel}},
            component: {
                "nx-dev-panel": {afterrender: a.manageDeveloperPanel},
                "nx-dev-panel tool[type=maximize]": {click: a.onMaximize},
                "nx-dev-tests button[action=testError]": {click: a.testError},
                "nx-dev-tests button[action=testExtError]": {click: a.testExtError},
                "nx-dev-tests button[action=testMessages]": {click: a.testMessages},
                "nx-dev-tests button[action=toggleUnsupportedBrowser]": {click: a.toggleUnsupportedBrowser},
                "nx-dev-tests button[action=showQuorumWarning]": {click: a.showQuorumWarning},
                "nx-dev-tests button[action=clearLocalState]": {click: a.clearLocalState}
            }
        })
    },
    onLaunch: function () {
        var a = this;
        Ext.each(Ext.ComponentQuery.query("nx-dev-panel"), function (b) {
            a.manageDeveloperPanel(b)
        })
    },
    manageDeveloperPanel: function (a) {
        var b = NX.State.getValue("debug");
        a = a || this.getDeveloper();
        if (a) {
            if (b) {
                a.show()
            } else {
                a.hide()
            }
        }
    },
    onMaximize: function (b) {
        var a = b.up("nx-dev-panel"), c = a.down("tabpanel"), d;
        a.remove(c, false);
        d = Ext.create("Ext.window.Window", {
            title: a.title,
            iconCls: a.iconCls,
            glyph: a.glyph,
            maximized: true,
            autoScroll: true,
            closable: false,
            layout: "fit",
            items: c,
            tools: [{
                type: "close", handler: function () {
                    d.hide(a, function () {
                        d.remove(c, false);
                        a.add(c);
                        d.destroy()
                    })
                }
            }]
        });
        d.show(a)
    },
    testError: function () {
        console.log_no_such_method()
    },
    testExtError: function () {
        Ext.Error.raise("simulated error")
    },
    testMessages: function () {
        NX.Messages.success("Success");
        NX.Messages.info("Test of a long info message. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        NX.Messages.warning("A warning test");
        NX.Messages.error("Test of an error message")
    },
    toggleUnsupportedBrowser: function () {
        NX.State.setBrowserSupported(!NX.State.isBrowserSupported())
    },
    showQuorumWarning: function () {
        NX.State.setValue("quorum", {quorumPresent: false})
    },
    clearLocalState: function () {
        var a = Ext.state.Manager.getProvider();
        Ext.Object.each(a.state, function (b, c) {
            a.clear(b)
        })
    }
});
Ext.define("NX.controller.Unlicensed", {
    extend: "NX.app.Controller",
    requires: ["NX.Bookmarks", "NX.Messages", "NX.I18n"],
    onLaunch: function () {
        var a = this;
        Ext.History.on("change", a.forceLicensing);
        a.forceLicensing()
    },
    onDestroy: function () {
        var a = this;
        Ext.History.un("change", a.forceLicensing)
    },
    forceLicensing: function () {
        NX.Messages.error(NX.I18n.get("State_License_Invalid_Message"));
        NX.Bookmarks.navigateTo(NX.Bookmarks.fromToken("admin/system/licensing"))
    }
});
Ext.define("NX.controller.Content", {
    extend: "NX.app.Controller",
    requires: ["NX.Icons", "NX.State"],
    views: ["feature.Content"],
    refs: [{ref: "featureContent", selector: "nx-feature-content"}],
    init: function () {
        var a = this;
        a.listen({
            controller: {"#Menu": {featureselected: a.onFeatureSelected}},
            component: {
                "nx-feature-content": {
                    resize: function (c) {
                        var b;
                        if (c) {
                            b = c.down("nx-drilldown");
                            if (b) {
                                b.fireEvent("syncsize")
                            }
                        }
                    }
                }
            }
        })
    },
    onFeatureSelected: function (i) {
        var b = this, a = b.getFeatureContent(), e = i.get("view"), g = i.get("text"), d = i.get("iconName"),
            h = i.get("iconCls"), f = i.get("description"), c;
        if (Ext.isString(e)) {
            c = b.getView(e).create({})
        } else {
            c = Ext.widget(e)
        }
        b.mon(c, "destroy", function () {
        });
        a.removeAll();
        a.setTitle(g);
        if (h) {
            a.setIconCls(h + " nx-icon")
        } else {
            a.setIconCls(NX.Icons.cls(d, "x32"))
        }
        a.resetUnsavedChangesFlag();
        NX.global.document.title = g + " - " + NX.State.getValue("uiSettings").title;
        if (f === undefined) {
            f = ""
        }
        a.setDescription(f);
        a.showRoot();
        a.add(c);
        c.fireEvent("activate", c)
    }
});
Ext.define("NX.view.SettingsPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-settingsPanel",
    autoScroll: true,
    cls: "nx-hr",
    layout: {type: "vbox", align: "stretch"},
    initComponent: function () {
        var a = this;
        a.items = {xtype: "panel", ui: "nx-inset", items: a.settingsForm || []};
        a.callParent()
    },
    addSettingsForm: function (a) {
        this.down("panel").add(a)
    },
    removeAllSettingsForms: function () {
        this.down("panel").removeAll()
    },
    loadRecord: function (a) {
        var b = this.down("nx-settingsform");
        if (b) {
            b.loadRecord(a)
        }
    }
});
Ext.define("NX.ext.form.field.ItemSelector", {
    extend: "Ext.ux.form.ItemSelector",
    alias: "widget.nx-itemselector",
    requires: ["Ext.ux.form.MultiSelect", "NX.I18n"],
    plugins: {responsive: true},
    responsiveConfig: {
        "width <= 1366": {maxWidth: 600},
        "width <= 1600": {maxWidth: 800},
        "width > 1600": {maxWidth: 1000}
    },
    height: 300,
    width: "100%",
    disabledCls: "nx-itemselector-disabled",
    invalidCls: "nx-invalid",
    maskOnDisable: false,
    createButtons: function () {
        var c = this, b = c.callSuper();
        if (!c.hideNavIcons) {
            var a = 0;
            Ext.Array.forEach(c.buttons, function (d) {
                c.customizeButton(d, b[a++])
            })
        }
        return b
    },
    customizeButton: function (a, c) {
        var b = {
            top: "x-fa fa-angle-double-up",
            up: "x-fa fa-angle-up",
            add: "x-fa fa-angle-right",
            remove: "x-fa fa-angle-left",
            addAll: "x-fa fa-angle-double-right",
            removeAll: "x-fa fa-angle-double-left",
            down: "x-fa fa-angle-down",
            bottom: "x-fa fa-angle-double-down"
        };
        c.iconCls = b[a]
    },
    createList: function (d) {
        var b = this, a = Ext.getStore(b.store), e, c;
        if (!b.fromField) {
            e = {
                xtype: "nx-searchbox",
                cls: ["nx-searchbox", "nx-filterbox"],
                iconClass: "fa-filter",
                emptyText: NX.I18n.get("Form_Field_ItemSelector_Empty"),
                searchDelay: 200,
                listeners: {search: b.onSearch, searchcleared: b.onSearchCleared, scope: b}
            }
        }
        c = a.onAfter("load", function () {
            if (b.fromField && b.fromField.boundList && b.fromField.boundList.getMaskTarget()) {
                b.fromField.boundList.mask();
                if (!b.fromField.boundList.disabled) {
                    b.fromField.boundList.unmask()
                }
            }
        }, b, {destroyable: true});
        b.on("destroy", c.destroy, c);
        return Ext.create("Ext.ux.form.MultiSelect", {
            submitValue: false,
            isDirty: Ext.emptyFn,
            getSubmitData: function () {
                return null
            },
            getModelData: function () {
                return null
            },
            cls: "nx-multiselect",
            flex: 1,
            dragGroup: b.ddGroup,
            dropGroup: b.ddGroup,
            title: d,
            store: {model: a.model, sorters: a.getSorters().items, data: []},
            displayField: b.displayField,
            valueField: b.valueField,
            disabled: b.disabled,
            listeners: {boundList: {scope: b, itemdblclick: b.onItemDblClick, drop: b.syncValue}},
            tbar: e
        })
    },
    onAddAllBtnClick: function () {
        var b = this, a = b.fromField.getStore().getData().items;
        while (a.length > 0) {
            b.moveRec(true, a[0])
        }
    },
    onRemoveAllBtnClick: function () {
        var b = this, a = b.toField.getStore().getData().items;
        while (a.length > 0) {
            b.moveRec(false, a[0])
        }
    },
    setValue: function (a) {
        if (this.store) {
            if (this.valueAsString) {
                if (Array.isArray(a)) {
                    this.callParent(arguments)
                } else {
                    this.callParent(a ? [a.split(",")] : undefined)
                }
            } else {
                this.callParent(arguments)
            }
        }
        this.resetOriginalValue()
    },
    getValue: function () {
        if (this.valueAsString) {
            return this.callParent().toString()
        } else {
            return this.callParent()
        }
    },
    populateFromStore: function (a) {
        var c = this, b = c.fromField.store;
        if (b) {
            b.removeAll()
        }
        c.callParent(arguments)
    },
    onSearch: function (a, c) {
        var b = this;
        b.fromField.store.filter({
            id: "filter", filterFn: function (e) {
                var d = e.get(b.displayField);
                if (d) {
                    d = d.toString();
                    return d.toLowerCase().indexOf(c.toLowerCase()) !== -1
                }
                return false
            }
        })
    },
    onSearchCleared: function () {
        this.fromField.store.clearFilter()
    },
    onDestroy: function () {
        var a = this;
        if (a.store) {
            a.store.un("load", a.populateFromStore, a)
        }
        this.callParent()
    },
    getRecordsForValue: function () {
        var a = this;
        if (!a.store) {
            return []
        }
        return this.callParent(arguments)
    },
    onEnable: function () {
        this.callParent(arguments);
        Ext.each(this.query("boundlist"), function (a) {
            a.unmask()
        })
    },
    onDisable: function () {
        this.callParent(arguments);
        Ext.each(this.query("boundlist"), function (a) {
            a.mask()
        })
    }
});
Ext.define("NX.wizard.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-wizard-panel",
    requires: ["NX.I18n"],
    cls: "nx-wizard-panel",
    autoScroll: true,
    layout: {type: "vbox", align: "stretch"},
    items: {xtype: "container", itemId: "container", cls: "screencontainer", frame: true, layout: "card"},
    dockedItems: {
        xtype: "toolbar",
        itemId: "header",
        cls: "screenheader",
        dock: "top",
        items: [{xtype: "label", itemId: "title", cls: "title"}, "->", {
            xtype: "label",
            itemId: "progress",
            cls: "progress"
        }]
    },
    getScreenHeader: function () {
        return this.down("#header")
    },
    setTitle: function (a) {
        this.getScreenHeader().down("#title").setText(a)
    },
    setProgress: function (b, a) {
        this.getScreenHeader().down("#progress").setText(NX.I18n.format("Wizard_Screen_Progress", b, a))
    },
    getScreenContainer: function () {
        return this.down("#container")
    }
});
Ext.define("NX.controller.SettingsForm", {
    extend: "NX.app.Controller", requires: ["Ext.ComponentQuery", "NX.Messages"], init: function () {
        var a = this;
        a.listen({
            controller: {"#Refresh": {refresh: a.onRefresh}},
            component: {
                "form[settingsForm=true]": {
                    afterrender: a.loadForm,
                    load: a.loadForm,
                    dirtychange: a.updateButtonState,
                    validitychange: a.updateButtonState
                },
                "form[settingsForm=true][editableCondition]": {afterrender: a.bindEditableCondition},
                "form[settingsForm=true][settingsFormSubmit=true] button[action=add]": {click: a.submitForm},
                "form[settingsForm=true][settingsFormSubmit=true] button[action=submit]": {click: a.submitForm},
                "form[settingsForm=true][settingsFormSubmit=true] button[action=save]": {click: a.submitForm},
                "form[settingsForm=true][settingsFormSubmit=true] button[action=discard]": {click: a.discardChanges},
                "form[settingsForm=true] field[bindGroup]": {validitychange: a.updateEnableState}
            }
        })
    }, onRefresh: function () {
        var b = this, a = Ext.ComponentQuery.query("form[settingsForm=true]");
        if (a) {
            Ext.each(a, function (c) {
                b.loadForm(c)
            })
        }
    }, loadForm: function (b, a) {
        if (!b.isDestroyed && b.rendered) {
            if (b.api && b.api.load) {
                b.load(Ext.applyIf(a || {}, {
                    waitMsg: b.settingsFormLoadMessage, success: function (c, d) {
                        b.isValid();
                        b.fireEvent("loaded", b, d)
                    }, failure: function (c, d) {
                        b.isValid()
                    }
                }))
            } else {
                b.isValid()
            }
        }
        this.updateButtonState(b.getForm())
    }, submitForm: function (a) {
        var c = this, b = a.up("form");
        if (b.api && b.api.submit) {
            b.submit({
                waitMsg: b.settingsFormSubmitMessage, success: function (d, e) {
                    var f = c.getSettingsFormSuccessMessage(b, e);
                    if (f) {
                        NX.Messages.success(f)
                    }
                    b.fireEvent("submitted", b, e);
                    c.loadForm(b)
                }
            })
        }
    }, discardChanges: function (a) {
        var b = a.up("form");
        if (b.api && b.api.load) {
            b.fireEvent("load", b)
        } else {
            b.getForm().reset();
            b.isValid()
        }
    }, getSettingsFormSuccessMessage: function (a, b) {
        var c;
        if (a.settingsFormSuccessMessage) {
            if (Ext.isFunction(a.settingsFormSuccessMessage)) {
                c = a.settingsFormSuccessMessage(b.result.data)
            } else {
                c = a.settingsFormSuccessMessage.toString()
            }
            c = c.replace(/\$action/, b.type.indexOf("submit") > -1 ? "updated" : "refreshed")
        }
        return c
    }, bindEditableCondition: function (a) {
        if (Ext.isDefined(a.editableCondition)) {
            a.mon(a.editableCondition, {
                satisfied: function () {
                    a.setEditable(true)
                }, unsatisfied: function () {
                    a.setEditable(false)
                }, scope: a
            })
        }
    }, updateEnableState: function (b) {
        var a = b.up("form");
        if (Ext.isString(b.bindGroup)) {
            Ext.Array.each(b.bindGroup.split(" "), function (e) {
                var d = a.query("component[groupBind=" + e + "]"), f = a.query("field[bindGroup~=" + e + "]"), c;
                Ext.Array.each(d, function (g) {
                    if (!Ext.isDefined(c)) {
                        c = true;
                        Ext.Array.each(f, function (h) {
                            return c = h.isValid()
                        })
                    }
                    if (c) {
                        g.enable()
                    } else {
                        g.disable()
                    }
                })
            })
        }
    }, updateButtonState: function (d) {
        var a = d.isDirty(), c = d.isValid(), e = d.owner.down("button[action=save]"),
            b = d.owner.down("button[action=discard]");
        if (e) {
            e.setDisabled(!c || !a)
        }
        if (b) {
            b.setDisabled(!a)
        }
    }
});
Ext.define("NX.view.info.Entry", {
    extend: "Ext.Component",
    alias: "widget.nx-info",
    requires: ["Ext.XTemplate"],
    initComponent: function () {
        var a = this;
        a.tpl = Ext.create("Ext.XTemplate", ['<div class="nx-info">', "<table>", '<tpl for=".">', '<tr class="nx-info-entry">', '<td class="nx-info-entry-name">{name}</td>', '<td class="nx-info-entry-value">{value}</td>', "</tr>", "</tpl>", "</tr>", "</table>", "</div>"]);
        a.callParent()
    },
    showInfo: function (b) {
        var a = [];
        Ext.Object.each(b, function (c, d) {
            if (!Ext.isEmpty(d)) {
                a.push({name: c, value: d})
            }
        });
        if (this.getEl()) {
            this.tpl.overwrite(this.getEl(), a);
            this.up("panel").updateLayout()
        } else {
            this.html = this.tpl.apply(a)
        }
    }
});
Ext.define("NX.view.info.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-info-panel",
    titled: null,
    framed: true,
    autoScroll: true,
    header: false,
    initComponent: function () {
        var b = this, a, c;
        c = {
            xtype: "panel",
            ui: "nx-subsection",
            title: b.framed ? undefined : b.titled,
            frame: b.framed,
            items: {xtype: "nx-info"}
        };
        a = {xtype: "panel", ui: "nx-inset", title: b.titled, collapsible: b.collapsible, items: c};
        if (b.framed) {
            b.items = a
        } else {
            b.items = c
        }
        b.callParent()
    },
    setTitle: function (a) {
        this.titled = a
    },
    showInfo: function (a) {
        this.down("nx-info").showInfo(a)
    },
    addSection: function (a) {
        this.down("nx-info").up("panel").add(a)
    }
});
Ext.define("NX.controller.UnsupportedBrowser", {
    extend: "NX.app.Controller",
    requires: ["NX.State"],
    views: ["UnsupportedBrowser", "header.Panel", "header.Branding", "header.Logo", "footer.Panel", "footer.Branding"],
    refs: [{ref: "viewport", selector: "viewport"}, {ref: "unsupportedBrowser", selector: "nx-unsupported-browser"}],
    init: function () {
        var a = this;
        a.listen({
            component: {
                viewport: {afterrender: a.onLaunch},
                "nx-unsupported-browser button[action=continue]": {click: a.onContinue}
            }
        })
    },
    onLaunch: function () {
        var b = this, a = b.getViewport();
        if (a) {
            a.add({xtype: "nx-unsupported-browser"})
        }
    },
    onDestroy: function () {
        var b = this, a = b.getViewport();
        if (a) {
            a.remove(b.getUnsupportedBrowser())
        }
    },
    onContinue: function () {
        NX.State.setBrowserSupported(true)
    }
});
Ext.define("NX.view.feature.Group", {
    extend: "Ext.container.Container",
    alias: "widget.nx-feature-group",
    requires: ["NX.Icons"],
    cls: ["nx-feature-group", "nx-inset"],
    autoScroll: true,
    items: {
        xtype: "container",
        frame: true,
        cls: "nx-subsection",
        items: {
            xtype: "dataview",
            store: "FeatureGroup",
            tpl: ['<tpl for=".">', '<div class="item-wrap">', '<tpl if="iconCls">', '<i class="fa {[values.iconCls]} fa-2x fa-fw"></i>', '<span class="x-fa-icon-text">{text}</span>', '<tpl elseif="iconName">', '{[ NX.Icons.img(values.iconName, "x32") ]}', "<span>{text}</span>", "</tpl>", "</div>", "</tpl>"],
            itemSelector: "div.item-wrap",
            trackOver: true,
            overItemCls: "x-item-over",
            selectedItemCls: "x-item-selected"
        }
    }
});
Ext.define("NX.controller.MenuGroup", {
    extend: "NX.app.Controller",
    requires: ["NX.Bookmarks"],
    views: ["feature.Group"],
    init: function () {
        var a = this;
        a.listen({component: {"nx-feature-group dataview": {selectionchange: a.onSelection}}})
    },
    onSelection: function (a, b) {
        var c;
        if (b.length > 0) {
            c = b[0];
            NX.Bookmarks.navigateTo(NX.Bookmarks.fromToken(c.get("bookmark")), this)
        }
    }
});
Ext.define("NX.wizard.Controller", {
    extend: "NX.app.Controller",
    requires: ["NX.Assert"],
    steps: undefined,
    activeStepIndex: undefined,
    context: undefined,
    init: function () {
        var a = this;
        a.steps = [];
        a.activeStepIndex = 0;
        a.context = Ext.create("Ext.util.MixedCollection");
        a.addRef([{ref: "content", selector: "nx-feature-content"}, {ref: "panel", selector: "nx-wizard-panel"}]);
        a.listen({controller: {"#Refresh": {refresh: a.refresh}}});
        a.callParent()
    },
    onDestroy: function () {
        this.reset()
    },
    registerStep: function (a) {
        var b;
        if (Ext.isString(a)) {
            b = Ext.create(a)
        } else {
            b = Ext.widget(a)
        }
        b.attach(this);
        this.steps.push(b)
    },
    registerSteps: function (b) {
        var a = this;
        Ext.Array.each(b, function (c) {
            a.registerStep(c)
        })
    },
    getStep: function (a) {
        var c = this.steps, b;
        for (b = 0; b < c.length; b++) {
            if (a === c[b].getName()) {
                return c[b]
            }
        }
        this.logWarn("Missing step:", a);
        return null
    },
    getStepIndex: function (c) {
        var b = this.steps, a;
        for (a = 0; a < b.length; a++) {
            if (c.getName() === b[a].getName()) {
                return a
            }
        }
        return -1
    },
    getActiveStep: function () {
        return this.steps[this.activeStepIndex]
    },
    load: function () {
        var c = this.steps, b, a;
        a = this.getPanel().getScreenContainer();
        for (b = 0; b < c.length; b++) {
            a.add(c[b].createScreenCmp())
        }
        this.restore()
    },
    refresh: function () {
        var a = this.getActiveStep();
        if (a) {
            a.refresh()
        }
    },
    getContext: function () {
        return this.context
    },
    moveTo: function (d) {
        if (d < 0 || d + 1 > this.steps.length) {
            this.logError("Index out of bounds:", d);
            return false
        }
        var b = this.getPanel(), a, e, c;
        if (!b) {
            return false
        }
        a = b.getScreenContainer();
        e = a.getLayout();
        c = e.setActiveItem(d);
        if (c === false) {
            c = e.getActiveItem()
        }
        this.activeStepIndex = d;
        this.updateScreenHeader(c, d);
        return true
    },
    updateScreenHeader: function (b, d) {
        var a = this.getPanel(), g = this.steps, c = 0, f = 1, e;
        for (e = 0; e < g.length; e++) {
            if (g[e].getEnabled()) {
                c++;
                if (e < d) {
                    f++
                }
            }
        }
        a.setTitle(b.getTitle());
        a.setProgress(f, c)
    },
    moveToStepNamed: function (a) {
        var c = this, b;
        b = c.getStep(a);
        if (!b) {
            this.logError("Missing step with name:", a);
            return false
        }
        return c.moveTo(c.getStepIndex(b))
    },
    moveNext: function () {
        var c = this.activeStepIndex, a = this.steps.length, b;
        if (c + 1 >= a) {
            this.logError("No next step");
            return false
        }
        for (b = c + 1; b < a; b++) {
            if (this.steps[b].getEnabled()) {
                return this.moveTo(b)
            }
        }
        this.logError("No enabled next step");
        return false
    },
    moveBack: function () {
        var b = this.activeStepIndex, a;
        if (b <= 0) {
            this.logError("No back step");
            return false
        }
        for (a = b - 1; a >= 0; a--) {
            if (this.steps[a].getEnabled()) {
                return this.moveTo(a)
            }
        }
        this.logError("No enabled back step");
        return false
    },
    reset: function () {
        var b = this.steps, a;
        for (a = 0; a < b.length; a++) {
            b[a].reset()
        }
        this.context.removeAll();
        this.moveTo(0)
    },
    cancel: function () {
        this.reset()
    },
    finish: function () {
        this.reset()
    },
    restore: function () {
        this.moveTo(this.activeStepIndex)
    },
    mask: function (a) {
        this.getContent().getEl().mask(a)
    },
    unmask: function () {
        this.getContent().getEl().unmask()
    }
});
Ext.define("NX.controller.dev.Logging", {
    extend: "NX.app.Controller",
    requires: ["Ext.util.Format", "NX.Windows"],
    stores: ["LogEvent", "LogLevel"],
    refs: [{ref: "panel", selector: "nx-dev-logging"}],
    init: function () {
        var a = this;

        function b(c) {
            return a.getController("Logging").getSink(c)
        }

        a.listen({
            component: {
                "nx-dev-logging button[action=clear]": {
                    click: function (c) {
                        a.getStore("LogEvent").removeAll()
                    }
                }, "nx-dev-logging combobox[itemId=threshold]": {
                    afterrender: function (c) {
                        c.select(a.getController("Logging").getThreshold())
                    }, select: function (c) {
                        a.getController("Logging").setThreshold(c.getValue())
                    }
                }, "nx-dev-logging checkbox[itemId=buffer]": {
                    afterrender: function (c) {
                        c.setValue(b("store").enabled)
                    }, change: function (c) {
                        b("store").setEnabled(c.getValue())
                    }
                }, "nx-dev-logging numberfield[itemId=bufferSize]": {
                    afterrender: function (c) {
                        c.setValue(b("store").maxSize)
                    }, blur: function (d, c) {
                        b("store").setMaxSize(d.getValue())
                    }, keypress: function (d, c) {
                        if (c.getKey() === c.ENTER) {
                            b("store").setMaxSize(d.getValue())
                        }
                    }
                }, "nx-dev-logging checkbox[itemId=console]": {
                    afterrender: function (c) {
                        c.setValue(b("console").enabled)
                    }, change: function (c) {
                        b("console").setEnabled(c.getValue())
                    }
                }, "nx-dev-logging checkbox[itemId=remote]": {
                    afterrender: function (c) {
                        c.setValue(b("remote").enabled)
                    }, change: function (c) {
                        b("remote").setEnabled(c.getValue())
                    }
                }, "nx-dev-logging button[action=export]": {click: a.exportSelection}
            }
        })
    },
    exportSelection: function () {
        var c, b, a;
        c = NX.Windows.open("", "", "width=640,height=480");
        if (c !== null) {
            b = c.document;
            a = Ext.Array.pluck(this.getPanel().getSelectionModel().getSelection(), "data");
            b.write("<html><head>");
            b.write("<title>" + Ext.util.Format.plural(a.length, "Logging Event") + "</title>");
            b.write("</head><body>");
            b.write("<pre>");
            Ext.Array.each(a, function (d) {
                b.write(d.timestamp + " " + d.level + " " + d.logger + " " + d.message.join(" ") + "<br/>")
            });
            b.write("<pre>");
            b.write("</body></html>")
        }
    }
});
Ext.define("NX.view.AddPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.nx-addpanel",
    requires: ["NX.I18n"],
    cls: "nx-hr",
    layout: {type: "vbox", align: "stretch"},
    autoScroll: true,
    initComponent: function () {
        var b = this, a;
        if (Ext.isDefined(b.settingsForm) && !Ext.isArray(b.settingsForm)) {
            if (!b.settingsForm.buttons) {
                b.settingsForm.buttons = [{
                    text: NX.I18n.get("Add_Submit_Button"),
                    action: "add",
                    ui: "nx-primary",
                    bindToEnter: b.items.settingsFormSubmitOnEnter
                }, {
                    text: NX.I18n.get("Add_Cancel_Button"), handler: function () {
                        this.up("nx-drilldown").showChild(0, true)
                    }
                }]
            }
        }
        b.items = {xtype: "panel", ui: "nx-inset", items: b.settingsForm};
        b.callParent();
        a = b.down("button[action=add]");
        if (a) {
            NX.Conditions.formIs(b.down("form"), function (c) {
                return !c.isDisabled() && c.isValid()
            }).on({
                satisfied: function () {
                    this.enable()
                }, unsatisfied: function () {
                    this.disable()
                }, scope: a
            })
        }
    }
});
Ext.define("NX.view.AddWindow", {
    extend: "Ext.window.Window",
    alias: "widget.nx-addwindow",
    requires: ["NX.I18n"],
    layout: "fit",
    autoShow: true,
    modal: true,
    constrain: true,
    width: 630,
    minWidth: 630,
    initComponent: function () {
        var a = this;
        if (Ext.isDefined(a.items) && !Ext.isArray(a.items)) {
            if (!a.items.buttons) {
                a.items.buttons = [{
                    text: NX.I18n.get("Add_Submit_Button"),
                    action: "add",
                    formBind: true,
                    ui: "nx-primary",
                    bindToEnter: a.items.settingsFormSubmitOnEnter
                }, {
                    text: NX.I18n.get("Add_Cancel_Button"), handler: function () {
                        this.up("window").close()
                    }
                }]
            }
        }
        a.maxHeight = Ext.getBody().getViewSize().height - 100;
        a.callParent()
    }
});
Ext.define("NX.view.drilldown.Master", {
    extend: "Ext.grid.Panel",
    alias: "widget.nx-drilldown-master",
    requires: ["NX.I18n"],
    maskElement: "body",
    cls: "nx-drilldown-master",
    rowLines: false,
    initComponent: function () {
        var a = this, b = a.columns.some(function (c) {
            return c.cls === "nx-drilldown-affordance"
        });
        if (!b) {
            a.columns.push({
                width: 28,
                hideable: false,
                sortable: false,
                menuDisabled: true,
                resizable: false,
                draggable: false,
                cls: "nx-drilldown-affordance",
                defaultRenderer: function () {
                    return Ext.DomHelper.markup({tag: "span", cls: "x-fa fa-angle-right"})
                }
            })
        }
        a.callParent();
        a.on("render", this.loadStore, this)
    },
    loadStore: function () {
        this.getStore().load()
    },
    pushColumn: function (b) {
        var a = this.getColumns(), c = a.some(function (d) {
            return d.cls === "nx-drilldown-affordance"
        });
        return this.getHeaderContainer().insert(c ? a.length - 1 : a.length, b)
    }
});
Ext.define("NX.controller.Dashboard", {
    extend: "NX.app.Controller",
    requires: ["NX.I18n"],
    views: ["dashboard.Welcome"],
    init: function () {
        this.getApplication().getFeaturesController().registerFeature({
            path: "/Welcome",
            mode: "browse",
            view: "NX.view.dashboard.Welcome",
            text: NX.I18n.get("Dashboard_Title"),
            description: NX.I18n.get("Dashboard_Description"),
            iconConfig: {file: "sonatype.png", variants: ["x16", "x32"]},
            weight: 10,
            authenticationRequired: false
        })
    }
});
