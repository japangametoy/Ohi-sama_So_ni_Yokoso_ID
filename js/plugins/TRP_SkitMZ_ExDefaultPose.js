//=============================================================================
// TRP_SkitMZ_ExDefaultPose.js
//=============================================================================
// Copyright (c) 2021 Thirop
//=============================================================================
/*:
 * @target MZ
 * @author Thirop
 * @plugindesc デフォルトポーズ機能の追加
 * @orderAfter TRP_SkitMZ
 * @help 【注意】拡張おまけパッチについてはTRP_SkitMZの使用条件対象外です。
 * また、TRP_SkitMZの今後のアップデートなどへの対応も保証しておりません。
 * 商用利用：○
 * 改変：○
 * 再配布：不可
 *
 * キャラごとのデフォルトポーズ変更機能が使用できます。
 * (デフォルトポーズは会話シーン開始時の初期ポーズ)
 * 
 *
 * 【ポーズの指定】
 * 会話中にデフォルトポーズに変更したいときはDEFを指定
 * skit pose キャラ名 t DEF
 *
 * また、DEF-Pose1のようにDEF-から始まるポーズ名を指定すると
 * デフォルトポーズが指定されてないときは「Pose1」
 * 指定している場合(例:Defo）は「DefoPose1」のように
 * デフォルトポーズによって分類して指定が可能です。
 *
 * 【MV形式コマンド】
 * skit defaultPose キャラ名 ポーズ名
 * スキット デフォルトポーズ キャラ名 ポーズ名
 * 
 *
 * @command defaultPose
 * @text デフォルトポーズをセット
 * @desc デフォルトポーズをセット
 *
 * @arg name
 * @text 対象キャラ名
 * @desc 対象キャラ名
 *
 * @arg pose
 * @text ポーズ名
 * @desc デフォルトに設定するポーズ名。clearで設定削除
 *
 */
//============================================================================= 

(function(){
'use strict';

(()=>{
	var command = 'defaultPose';
	PluginManager.registerCommand('TRP_SkitMZ_ExDefaultPose', command, function(args){
		var argsArr = Object.values(args)
		argsArr.unshift(command);
		$gameSkit.processCommand(argsArr);
		this.setWaitMode('skit');
	});
})();

//=============================================================================
// Skit
//=============================================================================
var _Skit_initialize = Skit.prototype.initialize;
Skit.prototype.initialize = function(){
	_Skit_initialize.call(this);
	this._defaultPoses = {};
};

Skit.prototype.defaultPose = function(name){
	if(!this._defaultPoses)this._defaultPoses = {};
	if(this._defaultPoses[name]!==undefined){
		return this._defaultPoses[name];
	}else{
		return 'normal';
	}
};

var _Skit__processCommand = Skit.prototype._processCommand;
Skit.prototype._processCommand = function(args,macroPos){
	var skitCommand = args[0].toLowerCase();
	if(skitCommand==='defaultpose'||skitCommand==='デフォルトポーズ'){
		this.setDefaultPose(args,macroPos);
	}else{
		_Skit__processCommand.call(this,args,macroPos);
	}
};

Skit.prototype.setDefaultPose = function(args,macroPos){
	if(!this._defaultPoses)this._defaultPoses = {};

	var name = args[1];
	var pose = args[2];
	if(pose===undefined || pose==='clear'){
		delete this._defaultPoses[name];
	}else{
		this._defaultPoses[name] = pose;
	}
};


//=============================================================================
// SkitActor
//=============================================================================
var _SkitActor_clearParameters = SkitActor.prototype.clearParameters;
SkitActor.prototype.clearParameters = function(){
	_SkitActor_clearParameters.call(this);

	this._pose = $gameSkit.defaultPose(this._name);
};

var _SkitActor_changeImage = SkitActor.prototype.changeImage;
SkitActor.prototype.changeImage = function(wait,easeType,pose,expression,duration,style){
	if(pose){
		if(pose==='DEF'){
			pose = $gameSkit.defaultPose(this._name)
		}else if(pose.indexOf('DEF-')===0){
			var defaultPose = $gameSkit.defaultPose(this._name);
			if(defaultPose==='normal'){
				pose = pose.replace('DEF-','');
			}else{
				pose = pose.replace('DEF-',defaultPose);
			}
		}
	}

	_SkitActor_changeImage.call(this,wait,easeType,pose,expression,duration,style);
};




})();