// MessagePlus.js Ver.3.4.0

/*:
* @target MZ
* @plugindesc メッセージの表示に機能を追加します。
* @orderBefore MessageFaceOption
* @orderAfter SkipControlCharacter
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/491236774.html
* @help メッセージ表示速度を遅くした場合、制御文字による遅延が大きくなる為、
* SkipControlCharacterの導入をお勧めします。
*
* 「メッセージ速度調整機能」を有効にすると、パラメータ「メッセージウェイト」が
* 使用可能になります。
* 制御文字\MW[フレーム数]で文章の表示中に変更可能です。
* フレーム数を0にするとパラメータの設定値になります。
*
* [更新履歴]
* 2022/09/04：Ver.1.0.0　公開。
* 2022/09/19：Ver.1.0.1　文章開始位置Yの調整機能を追加。
* 2022/09/21：Ver.2.0.0　不具合修正。瞬間表示時にウェイトを無視するパラメータを追加。
* 2023/03/12：Ver.2.1.0　メッセージウィンドウの座標を調整するパラメータを追加。
* 2023/03/14：Ver.3.0.0　制御文字でメッセージ速度を途中で変えることができるようにしました。
* 2023/03/28：Ver.3.1.0　Window_FaceBoxを外部から参照可能に。
* 2023/03/28：Ver.3.2.0　ポーズサインの座標を調整可能に。
* 2023/05/08：Ver.3.3.0　「暗くする」のデザインを修正。
* 2023/07/24：Ver.3.3.1　MenuCommonEvent.jsに対応。
* 2024/01/18：Ver.3.4.0　ウェイトスキップの不具合修正。v1.8.0に対応。
*
* @param messageSpeed
* @text メッセージ速度調整機能
* @desc メッセージ速度を制御可能にします。
* @type boolean
* @default true
*
* @param messageWait
* @text メッセージウェイト
* @desc 次の文字を表示するまでのウェイト。
* 1で標準。
* @type number
* @min 1
* @default 1
*
* @param skipWait
* @text ウェイトスキップ
* @desc 高速表示時に文章に付与されたウェイト（\.\|など）を無視します。
* @type boolean
* @default false
*
* @param instantOpen
* @text 瞬間開閉
* @desc ウィンドウを一瞬で開閉します。
* @type boolean
* @default false
*
* @param ignoreChanged
* @text 設定変更無視
* @desc ウィンドウ背景・位置変更時にウィンドウが開閉されるのを無視します。
* @type boolean
* @default false
*
* @param numLines
* @text 行数
* @desc メッセージウィンドウの行数を設定します。
* @type number
* @default 4
*
* @param startOffsetY
* @text 開始位置オフセットY
* @desc 文章の開始位置を調整します。
* @type number
* @default 0
*
* @param fastPauseSign
* @text ポーズサイン高速化
* @desc ポーズサインのアニメーションを速くします。
* @type boolean
* @default false
*
* @param pauseSignToRight
* @text ポーズサイン右寄せ
* @desc ポーズサインを右側に表示します。
* @type boolean
* @default false
*
* @param pauseSignOffsetX
* @text ポーズサインオフセットX
* @desc ポーズサインのX座標を指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param pauseSignOffsetY
* @text ポーズサインオフセットY
* @desc ポーズサインのY座標を指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param offsetX
* @text オフセットX
* @desc メッセージのウィンドウのX座標を指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param offsetY
* @text オフセットY
* @desc メッセージのウィンドウのY座標を指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param offsetHeight
* @text オフセット高さ
* @desc メッセージのウィンドウの高さを指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param faceWindow
* @text 顔ウィンドウ
* @desc 顔画像をメッセージウィンドウと分けて表示します。
* @type struct<faceWindow>
* @default {"enabled":"false","variableWidth":"false","centering":"false","margin":"6","padding":"8","opacity":"-1","noFrame":"false"}
*
* @param nameWindow
* @text 名前ウィンドウ
* @desc 名前ウィンドウを調整します。
* @type struct<nameWindow>
* @default {"offsetY":"0","minWidth":"-1","isWindow":"true"}
*
* @param choiceListWindow
* @text 選択肢ウィンドウ
* @desc 選択肢ウィンドウを調整します。
* @type struct<choiceListWindow>
* @default {"offsetY":"0","centering":"true","minWidth":"-1"}
*
*/

/*~struct~faceWindow:
*
* @param enabled
* @text 有効化
* @desc 顔ウィンドウを有効化します。
* @type boolean
* @default false
*
* @param variableWidth
* @text 可変幅
* @desc 顔画像の有無でウィンドウの幅を変化させます。
* @type boolean
* @default false
*
* @param centering
* @text 中央揃え
* @desc 顔画像がなしのとき、メッセージウィンドウを中央に表示します。
* @type boolean
* @default false
*
* @param margin
* @text 余白
* @desc 顔ウィンドウとメッセージウィンドウの余白を設定します。
* @type number
* @default 6
* @min -99999
*
* @param padding
* @text パディング
* @desc ウィンドウ端から顔画像までの距離。
* @type number
* @default 8
*
* @param opacity
* @text 顔ウィンドウ不透明度
* @desc 顔ウィンドウの不透明度を設定します。
* -1でメッセージウィンドウと同じ。
* @type number
* @default -1
* @min -1
*
* @param noFrame
* @text フレームなし
* @desc 顔ウィンドウのフレームを無くします。
* @type boolean
* @default false
*
*/

/*~struct~nameWindow:
*
* @param offsetY
* @text オフセットY
* @desc ウィンドウのY座標を指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param minWidth
* @text 最低幅
* @desc ウィンドウの最低幅です。これ以上小さくなりません。
* -1で無効
* @type number
* @default -1
* @min -1
*
* @param isWindow
* @text ウィンドウか
* @desc ウィンドウの重ね合わせに影響します。
* @type boolean
* @default true
*
*/

/*~struct~choiceListWindow:
*
* @param offsetY
* @text オフセットY
* @desc ウィンドウのY座標を指定した数だけずらします。
* @type number
* @default 0
* @min -999999
*
* @param centering
* @text 中央揃え
* @desc メッセージウィンドウがない時、ウィンドウを中央に表示します。
* @type boolean
* @default true
*
* @param minWidth
* @text 最低幅
* @desc ウィンドウの最低幅です。これ以上小さくなりません。
* -1で無効
* @type number
* @default -1
* @min -1
*
*/

'use strict';

{
	//プラグイン名取得。
	const script = document.currentScript;
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);

	const instantOpen = parameters["instantOpen"] === "true";
	const ignoreChanged = parameters["ignoreChanged"] === "true";
	const skipWait = parameters["skipWait"] === "true";
	const numLines = Number(parameters["numLines"]);
	const startOffsetY = Number(parameters["startOffsetY"]);
	const offsetX = Number(parameters["offsetX"]);
	const offsetY = Number(parameters["offsetY"]);
	const offsetHeight = Number(parameters["offsetHeight"]);
	const messageWait = Number(parameters["messageWait"]);
	const messageSpeed = parameters["messageSpeed"] === "true";
	const fastPauseSign = parameters["fastPauseSign"] === "true";
	const pauseSignToRight = parameters["pauseSignToRight"] === "true";
	const pauseSignOffsetX = Number(parameters["pauseSignOffsetX"]);
	const pauseSignOffsetY = Number(parameters["pauseSignOffsetY"]);

	const faceWindow = JSON.parse(parameters["faceWindow"]);
	faceWindow["enabled"] = faceWindow["enabled"] === "true";
	faceWindow["variableWidth"] = faceWindow["variableWidth"] === "true";
	faceWindow["centering"] = faceWindow["centering"] === "true";
	faceWindow["margin"] = Number(faceWindow["margin"]);
	faceWindow["padding"] = Number(faceWindow["padding"]);
	faceWindow["opacity"] = Number(faceWindow["opacity"]);
	faceWindow["noFrame"] = faceWindow["noFrame"] === "true";

	const nameWindow = JSON.parse(parameters["nameWindow"]);
	nameWindow["offsetY"] = Number(nameWindow["offsetY"]);
	nameWindow["minWidth"] = Number(nameWindow["minWidth"]);
	nameWindow["isWindow"] = nameWindow["isWindow"] === "true";

	const choiceListWindow = JSON.parse(parameters["choiceListWindow"]);
	choiceListWindow["centering"] = choiceListWindow["centering"] === "true";
	choiceListWindow["offsetY"] = Number(choiceListWindow["offsetY"]);
	choiceListWindow["minWidth"] = Number(choiceListWindow["minWidth"]);

	//-----------------------------------------------------------------------------
	// Scene_Message

	if (skipWait) {
		Scene_Message.prototype.cancelMessageWait = function() {};
	}

	//-----------------------------------------------------------------------------
	// Window_Message

	if (pauseSignToRight && !faceWindow.enabled) {
		const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
		Window_Message.prototype.updatePlacement = function() {
			_Window_Message_updatePlacement.call(this);
			const spacing = $gameMessage.faceName() && $gameMessage.isRTL() ? ImageManager.faceWidth + 20 : 0;
			const x = this.width - 24 - spacing + pauseSignOffsetX;
			const y = this.height - 12 + pauseSignOffsetY;
			this._pauseSignSprite.move(x, y);
		};
	}

	if (fastPauseSign) {
		const _Window_Message__updatePauseSign = Window_Message.prototype._updatePauseSign;
		Window_Message.prototype._updatePauseSign = function() {
			_Window_Message__updatePauseSign.call(this);
			const sprite = this._pauseSignSprite;
			const x = Math.floor(this._animationCount / 8) % 2;
			const y = Math.floor(this._animationCount / 8 / 2) % 2;
			const sx = 144;
			const sy = 96;
			const p = 24;
			sprite.setFrame(sx + x * p, sy + y * p, p, p);
		};
	}

	if (skipWait) {
		const _Window_Message_updateWait = Window_Message.prototype.updateWait;
		Window_Message.prototype.updateWait = function() {
			this.updateSkipWait();
			return _Window_Message_updateWait.call(this);
		};

		Window_Message.prototype.updateSkipWait = function() {
			if (this._textState && !this.pause) {
				this.updateShowFast();
				if (this._showFast) {
					this._waitCount = 0;
				}
			}
		};
	}

	if (messageSpeed) {
		const _Window_Message_processCharacter = Window_Message.prototype.processCharacter;
		Window_Message.prototype.processCharacter = function(textState) {
			if (!this.updateMessageWait()) {
				_Window_Message_processCharacter.call(this, textState);
			}
		};

		const _Window_Message_clearFlags = Window_Message.prototype.clearFlags;
		Window_Message.prototype.clearFlags = function() {
			_Window_Message_clearFlags.call(this);
			this._messageWait = messageWait;
			this._messageWaitCount = 0;
		};

		Window_Message.prototype.updateMessageWait = function() {
			this._messageWaitCount--;
			if (this._messageWaitCount > 0) {
				return true;
			}
			this._messageWaitCount = this._messageWait;
			return false;
		};

		const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
		Window_Message.prototype.processEscapeCharacter = function(code, textState) {
			switch (code) {
			case "MW":
				this._messageWait = this.obtainEscapeParam(textState) || messageWait;
				break;
			default:
				_Window_Message_processEscapeCharacter.apply(this, arguments);
				break;
			}
		};
	}

	if (instantOpen) {
		const _Window_Message_updateOpen = Window_Message.prototype.updateOpen;
		Window_Message.prototype.updateOpen = function() {
			if (this._opening) {
				this.openness = 255;
			}
			_Window_Message_updateOpen.call(this);
		};

		const _Window_Message_updateClose = Window_Message.prototype.updateClose;
		Window_Message.prototype.updateClose = function() {
			if (this._closing) {
				this.openness = 0;
			}
			_Window_Message_updateClose.call(this);
		};
	}

	if (ignoreChanged || instantOpen) {
		Window_Message.prototype.areSettingsChanged = function() {
			return false;
		};
	}

	const _Window_Message_newPage = Window_Message.prototype.newPage;
	Window_Message.prototype.newPage = function(textState) {
		_Window_Message_newPage.call(this, textState);
		textState.y += startOffsetY;
	};

	const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
	Window_Message.prototype.updatePlacement = function() {
		_Window_Message_updatePlacement.call(this);
		if (this._positionType !== 1) {
			this.y -= this._positionType ? offsetY : -offsetY;
		}
	};

	if (faceWindow.enabled) {
		const _Window_Message_initMembers = Window_Message.prototype.initMembers;
		Window_Message.prototype.initMembers = function() {
			this._faceBoxWindow = null;
			_Window_Message_initMembers.call(this);
		};

		Window_Message.prototype.refreshDimmerBitmap = function() {
			if (this._dimmerSprite) {
				const bitmap = this._dimmerSprite.bitmap;
				const w = this.width > 0 ? this.dimmerWidth() : 0;
				const h = this.height+8;
				const m = this.padding;
				const c1 = ColorManager.dimColor1();
				const c2 = ColorManager.dimColor2();
				bitmap.resize(w, h);
				bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
				bitmap.fillRect(0, m, w, h - m * 2, c1);
				bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
				this._dimmerSprite.setFrame(0, 0, w, h);
				this.updateDimmerPlacement();
			}
		};

		Window_Message.prototype.dimmerWidth = function() {
			let width = this.width + 8;
			if ($gameMessage.faceName()) {
				width += this.x - this._faceBoxWindow.x;
			}
			return width
		};

		Window_Message.prototype.updateDimmerPlacement = function() {
			this._dimmerSprite.x = -4;
			this._dimmerSprite.y = -4;
			if ($gameMessage.faceName()) {
				this._dimmerSprite.x -= this.x - this._faceBoxWindow.x;
			}
		};

		Window_Message.prototype.setFaceBoxWindow = function(faceBoxWindow) {
			this._faceBoxWindow = faceBoxWindow;
		};

		const _Window_Message_synchronizeNameBox  = Window_Message.prototype.synchronizeNameBox;
		Window_Message.prototype.synchronizeNameBox = function() {
			_Window_Message_synchronizeNameBox.call(this);
			if (this._faceBoxWindow) {
				this.synchronizeFaceBox();
			}
		};

		Window_Message.prototype.synchronizeFaceBox = function() {
			this._faceBoxWindow.openness = this.openness;
		};

		const _Window_Message_startMessage = Window_Message.prototype.startMessage;
		Window_Message.prototype.startMessage = function() {
			_Window_Message_startMessage.call(this);
			this.createContents();
			this._faceBoxWindow.start();
		};

		Window_Message.prototype.drawMessageFace = function() {
			const faceName = $gameMessage.faceName();
			const faceIndex = $gameMessage.faceIndex();
			const width = ImageManager.faceWidth;
			const height = this._faceBoxWindow.innerHeight;
			const x = (this._faceBoxWindow.innerWidth - width) / 2;
			this._faceBoxWindow.drawFace(faceName, faceIndex, x, 0, width, height);
		};

		const _Window_Message_newLineX = Window_Message.prototype.newLineX;
		Window_Message.prototype.newLineX = function(textState) {
			const margin = 4;
			return textState.rtl ? this.innerWidth - margin : margin;
		};

		const _Window_Message_loadMessageFace = Window_Message.prototype.loadMessageFace;
		Window_Message.prototype.loadMessageFace = function() {
			_Window_Message_loadMessageFace.call(this);
			if ($gameMessage.faceName()) {
				this._faceBoxWindow.show();
			} else {
				this._faceBoxWindow.hide();
			}
		};

		const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
		Window_Message.prototype.updatePlacement = function() {
			_Window_Message_updatePlacement.call(this);
			const variableWidth = faceWindow.variableWidth;
			const centering = faceWindow.centering;
			if (variableWidth) {
				this.width = this.windowWidth();
				this.height = this.windowHeight();
			}
			if (!$gameMessage.faceName() && (centering || variableWidth)) {
				this.x = (Graphics.boxWidth - this.width) / 2;
			} else if ($gameMessage.isRTL()) {
				this.x = offsetX;
			} else {
				this.x = this.height + faceWindow.margin + offsetX;
			}
		};

		Window_Message.prototype.windowWidth = function() {
			if ($gameMessage.faceName()) {
				return Graphics.boxWidth - this.height - faceWindow.margin - (offsetX * 2);
			} else {
				return Graphics.boxWidth - (offsetX * 2);
			}
		};

		Window_Message.prototype.windowHeight = function() {
			return this.height;
		};

		if (pauseSignToRight) {
			const _Window_Message__refreshPauseSign = Window_Message.prototype._refreshPauseSign;
			Window_Message.prototype._refreshPauseSign = function() {
				_Window_Message__refreshPauseSign.call(this);
				const x = this.width - 24 + pauseSignOffsetX;
				const y = this.height - 12 + pauseSignOffsetY;
				this._pauseSignSprite.move(x, y);
			};
		}
	}

	//-----------------------------------------------------------------------------
	// Window_FaceBox

	function Window_FaceBox() {
		this.initialize(...arguments);
	}

	Window_FaceBox.prototype = Object.create(Window_Base.prototype);
	Window_FaceBox.prototype.constructor = Window_FaceBox;

	Window_FaceBox.prototype.initialize = function(rect) {
		Window_Base.prototype.initialize.call(this, rect);
		this.openness = 0;
		if (faceWindow.noFrame) this.frameVisible = false;
	};

	Window_FaceBox.prototype.loadWindowskin = function() {
		Window_Message.prototype.loadWindowskin.call(this);
	};

	Window_FaceBox.prototype.updateBackOpacity = function() {
		Window_Message.prototype.updateBackOpacity.call(this);
	};

	if (faceWindow.opacity > -1) {
		Window_FaceBox.prototype.updateBackOpacity = function() {
			this.backOpacity = faceWindow.opacity;
		};
	}

	Window_FaceBox.prototype.updatePadding = function() {
		this.padding = faceWindow.padding;
	};

	Window_FaceBox.prototype.setMessageWindow = function(messageWindow) {
		this._messageWindow = messageWindow;
	};

	Window_FaceBox.prototype.start = function() {
		this.updatePlacement();
		this.updateBackground();
		this.refresh();
	};

	Window_FaceBox.prototype.updatePlacement = function() {
		const messageWindow = this._messageWindow;
		if ($gameMessage.isRTL()) {
			this.x = Graphics.boxWidth - this.width - offsetX;
		} else {
			this.x = offsetX;
		}
		this.y = messageWindow.y;
	};

	Window_FaceBox.prototype.updateBackground = function() {
		this.setBackgroundType($gameMessage.background());
	};

	const _Window_Base_setBackgroundType = Window_Base.prototype.setBackgroundType;
	Window_FaceBox.prototype.setBackgroundType = function(type) {
		_Window_Base_setBackgroundType.call(this, type);
		if (type === 1) {
			this.hideBackgroundDimmer();
		}
	};

	Window_FaceBox.prototype.refresh = function() {
		this.contents.clear();
	};

	window.Window_FaceBox = Window_FaceBox;

	//-----------------------------------------------------------------------------
	// Window_NameBox

	const _Window_NameBox_initialize = Window_NameBox.prototype.initialize;
	Window_NameBox.prototype.initialize = function() {
		_Window_NameBox_initialize.call(this);
		this._isWindow = nameWindow.isWindow;
	};

	const _Window_NameBox_updatePlacement = Window_NameBox.prototype.updatePlacement;
	Window_NameBox.prototype.updatePlacement = function() {
		_Window_NameBox_updatePlacement.call(this);
		const messageWindow = this._messageWindow;
		let offsetY = nameWindow.offsetY;
		offsetY = this.y < messageWindow.y ? offsetY : -offsetY;
		if (this.y + offsetY <= 0) {
			this.y += messageWindow.height + this.height;
		}
		offsetY = this.y < messageWindow.y ? offsetY : -offsetY;
		this.y += offsetY;
	};

	if (choiceListWindow.minWidth > -1) {
		const _Window_NameBox_windowWidth = Window_NameBox.prototype.windowWidth;
		Window_NameBox.prototype.windowWidth = function() {
			let windowWidth = _Window_NameBox_windowWidth.call(this);
			if (this._name) {
				windowWidth = Math.max(windowWidth, nameWindow.minWidth);
			}
			return windowWidth;
		};
	}

	//-----------------------------------------------------------------------------
	// Window_ChoiceList

	const _Window_ChoiceList_windowX = Window_ChoiceList.prototype.windowX;
	Window_ChoiceList.prototype.windowX = function() {
		let x = _Window_ChoiceList_windowX.call(this);
		const positionType = $gameMessage.choicePositionType();
		if (positionType !== 1) {
			x += positionType ? -offsetX : offsetX;
		}
		return x;
	};

	const _Window_ChoiceList_windowY = Window_ChoiceList.prototype.windowY;
	Window_ChoiceList.prototype.windowY = function() {
		let y = _Window_ChoiceList_windowY.call(this);
		if (choiceListWindow.centering && !this._messageWindow.canStart()) {
			y = (Graphics.boxHeight - this.height) / 2;
		} else {
			const offsetY = choiceListWindow.offsetY;
			const messageY = this._messageWindow.y;
			y += messageY >= Graphics.boxHeight / 2 ? offsetY : -offsetY;
		}
		return y;
	};

	if (choiceListWindow.minWidth > -1) {
		const _Window_ChoiceList_windowWidth = Window_ChoiceList.prototype.windowWidth;
		Window_ChoiceList.prototype.windowWidth = function() {
			const windowWidth = _Window_ChoiceList_windowWidth.call(this);
			return Math.max(windowWidth, choiceListWindow.minWidth);
		};
	}

	//-----------------------------------------------------------------------------
	// Window_NumberInput

	const _Window_NumberInput_updatePlacement = Window_NumberInput.prototype.updatePlacement;
	Window_NumberInput.prototype.updatePlacement = function() {
		_Window_NumberInput_updatePlacement.call(this);
		if (choiceListWindow.centering && !this._messageWindow.canStart()) {
			this.y = (Graphics.boxHeight - this.height) / 2;
		}
	};

	//-----------------------------------------------------------------------------
	// Scene_Message

	const _Scene_Message_messageWindowRect = Scene_Message.prototype.messageWindowRect;
	Scene_Message.prototype.messageWindowRect = function() {
		const rect = _Scene_Message_messageWindowRect.call(this);
		rect.x += offsetX;
		rect.height = this.calcWindowHeight(numLines, false) + 8;
		rect.height += offsetHeight;
		return rect;
	};

	if (faceWindow.enabled) {
		const _Scene_Message_createMessageWindow = Scene_Message.prototype.createMessageWindow;
		Scene_Message.prototype.createMessageWindow = function() {
			this.createFaceBoxWindow();
			_Scene_Message_createMessageWindow.call(this);
		};

		Scene_Message.prototype.createFaceBoxWindow = function() {
			const rect = this.faceBoxWindowRect();
			this._faceBoxWindow = new Window_FaceBox(rect);
			this.addWindow(this._faceBoxWindow);
		};

		Scene_Message.prototype.faceBoxWindowRect = function() {
			const rect = this.messageWindowRect();
			rect.width = rect.height;
			rect.x = 0;
			rect.y = 0;
			return rect;
		};

		Scene_MenuBase.prototype.createFaceBoxWindow = function() {
			Scene_Message.prototype.createFaceBoxWindow.call(this);
		};

		Scene_MenuBase.prototype.faceBoxWindowRect = function() {
			return Scene_Message.prototype.faceBoxWindowRect.call(this);
		};

		const _Scene_Message_associateWindows = Scene_Message.prototype.associateWindows;
		Scene_Message.prototype.associateWindows = function() {
			_Scene_Message_associateWindows.call(this);
			const messageWindow = this._messageWindow;
			messageWindow.setFaceBoxWindow(this._faceBoxWindow);
			this._faceBoxWindow.setMessageWindow(messageWindow);
		};

		const _Scene_Message_messageWindowRect = Scene_Message.prototype.messageWindowRect;
		Scene_Message.prototype.messageWindowRect = function() {
			const rect = _Scene_Message_messageWindowRect.call(this);
			rect.width = Graphics.boxWidth - rect.height - faceWindow.margin - (offsetX * 2);
			return rect;
		};

	} else {
		const _Scene_Message_messageWindowRect = Scene_Message.prototype.messageWindowRect;
		Scene_Message.prototype.messageWindowRect = function() {
			const rect = _Scene_Message_messageWindowRect.call(this);
			rect.width -= offsetX * 2;
			return rect;
		};
	}

}