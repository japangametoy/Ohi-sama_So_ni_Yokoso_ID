//=============================================================================
//  Keke_FrontViewPlus - フロントビュープラス
// バージョン: 1.0.0
//=============================================================================
// Copyright (c) 2022 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 標準のフロントビュー戦闘の表示を強化
 * @author ケケー
 * @url https://kekeelabo.com
 * 
 * @help
 * 【ver.1.0.0】
 * 標準のフロントビュー戦闘で味方側にもアニメーションとダメージポップを表示する
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 * 
 * 
 * 
 * Animations and damage pops for allies in standard front-view combat
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 * 
 * 
 * 
 * @param ダメージポップX
 * @parent ■その他
 * @desc ダメージポップのX軸のずらし幅。5 なら右に 5ピクセル ずらす。初期値 0
 * @default 0
 *
 * @param ダメージポップY
 * @parent ■その他
 * @desc ダメージポップのY軸のずらし幅。5 なら下に 5ピクセル ずらす。初期値 0
 * @default 0
 */
 
 
 
(() => {
    //- プラグイン名
    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

    
    //- ツクールMVか
    function isMv() {
        return typeof(ColorManager) == "undefined";
    };
    
    
    //- ツクールMZか
    function isMz() {
        return typeof(ColorManager) != "undefined";
    };


    //==================================================
    //--  パラメータ受け取り
    //==================================================

    const parameters = PluginManager.parameters(pluginName);
    
    const keke_damagePopX = Number(parameters["ダメージポップX"]);
    const keke_damagePopY = Number(parameters["ダメージポップY"]);


    
    //==================================================
    //--  フロントビュープラス
    //==================================================
    
    //- フロントビュー時もアクタースプライトを作る(コア追加)
    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.apply(this);
        if ($gameSystem.isSideView()) { return; }
        if (this._actorSprites.length) { return; }
        this._actorSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_Actor();
            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite)
            sprite.visible = false;
       }
    };
    
    
    //- スプライトアクターの位置更新(コア追加)
    if (isMz()) {
    const _Sprite_Actor_updatePosition = Sprite_Actor.prototype.updatePosition;
    Sprite_Actor.prototype.updatePosition = function() {
        _Sprite_Actor_updatePosition.apply(this);
        // フロントアクター位置の更新
        updateFrontActorPos(this);
    };
    };
    
    
    //- フロントアクター位置の更新
    function updateFrontActorPos(sprite) {
        if (!isFrontViewAdapt(sprite)) { return; }
        const statusWindow = SceneManager._scene._statusWindow;
        const i = $gameParty.allMembers().indexOf(sprite._actor);
        const rect = statusWindow.faceRect(i);
        sprite._homeX = statusWindow.x + rect.x + rect.width / 2;
        sprite._homeY = statusWindow.y + rect.y;
        sprite._offsetX = 0;
        sprite._offsetY = 0;
    };
    
    
    //- フロントビュー時のアニメ条件(コア追加)
    const _Spriteset_Battle_makeTargetSprites = Spriteset_Battle.prototype.makeTargetSprites;
    Spriteset_Battle.prototype.makeTargetSprites = function(targets) {
        let targetSprites = _Spriteset_Battle_makeTargetSprites.apply(this, arguments);
        targetSprites = targetSprites.filter(sprite => {
            if (sprite._isAsFaceKe) { return true; }
            if (!sprite._battler) { return false; }
            if ($gameSystem.isSideView()) { return true; }
            if (sprite._enemy) { return true; }
           return isFrontViewAdapt(sprite);
        });
        return targetSprites;
    };


    //- フロントビューでもダメージポップ有効に
    const _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        if (this._battler.isDamagePopupRequested()) {
            if (isFrontViewAdapt(this)) {
                this.createDamageSprite();
            }
        }
        _Sprite_Battler_updateDamagePopup.apply(this);
    };


    //- ダメージポップの位置変更(コア追加)
    const _Sprite_Battler_damageOffsetX = Sprite_Battler.prototype.damageOffsetX;
    Sprite_Battler.prototype.damageOffsetX = function() {
        let result = _Sprite_Battler_damageOffsetX.apply(this);
        const svActorOffsetXNo = !$gameSystem.isSideView() && this._actor ? 32 : 0;
        result += keke_damagePopX + svActorOffsetXNo;
        return result;
    };
    
    const _Sprite_Battler_damageOffsetY = Sprite_Battler.prototype.damageOffsetY;
    Sprite_Battler.prototype.damageOffsetY = function() {
        let result = _Sprite_Battler_damageOffsetY.apply(this);
        result += keke_damagePopY;
        if (isFrontViewAdapt(this)) {
            const statusWindow = SceneManager._scene._statusWindow;
            const rect = statusWindow.faceRect(0);
            result += rect.height;
        }
        return result;
    };
    
    
    //- ダメージポップのレイヤー変更(コア追加)
    if (isMz()) {
    const _Sprite_Actor_createDamageSprite = Sprite_Actor.prototype.createDamageSprite;
    Sprite_Actor.prototype.createDamageSprite = function() {
        _Sprite_Actor_createDamageSprite.apply(this);
        if (!isFrontViewAdapt(this)) { return; }
        // レイヤー変更
        if (isFrontViewAdapt(this) && !$gameTemp._fullAnimeStatusKe) {
            const sprite = this._damages[this._damages.length - 1];
            SceneManager._scene._windowLayer.addChild(sprite);
        }
    };
    };
    
    
    //- フロントビュー対応か
    function isFrontViewAdapt(sprite) {
        const statusWindow = SceneManager._scene._statusWindow;
        return !$gameSystem.isSideView() && sprite._actor && (statusWindow && statusWindow.visible) && isMz();
    };
    
    
    //- MV時のダメージポップ位置補整(コア追加)
    if (isMv()) {
    const _Sprite_Battler_setupDamagePopup = Sprite_Battler.prototype.setupDamagePopup;
    Sprite_Battler.prototype.setupDamagePopup = function() {
        const requested = this._battler.isDamagePopupRequested();
        const damages = this._damages.map(d => d);
        _Sprite_Battler_setupDamagePopup.apply(this);
        if (requested) {
            if (this._battler.isSpriteVisible()) {
                const last = damages[damages.length - 1];
                if (last && last.children.length) {
                    const cur = this._damages[this._damages.length - 1];
                    cur.x = last.x + 8;
                    cur.y = last.y - 16;
                }
            }
        }
    };
    }
    
})();