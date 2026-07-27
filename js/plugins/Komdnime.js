/*:
 * @target MV MZ
 * @plugindesc [KomdnimeFix] Mencegah game crash jika gambar/audio hilang. (By Komdnime)
 * @author Komdnime
 *
 * @help
 * Plugin ini akan melewati error file (gambar/audio) yang hilang
 * agar game tidak crash. Asset yang gagal dimuat akan diganti
 * dengan 1x1 pixel kosong (untuk gambar) atau dianggap "ready"
 * (untuk audio).
 *
 * Cocok untuk RPG Maker MV & MZ.
 */

(() => {
    // --- Bitmap Error Handler ---
    Bitmap.prototype._onError = function () {
        console.warn("[KomdnimeFix] Suppressed load error for: " + this._url);

        // buat canvas kosong 1x1 pixel
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, 1, 1);

        this._image = new Image();
        this._canvas = canvas;
        this._context = context;
        this._baseTexture = new PIXI.BaseTexture(canvas);
        this._baseTexture.mipmap = false;
        this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this._baseTexture.update();

        this._loadingState = "loaded";
        this._isReady = true;
        this._callLoadListeners();
    };

    // --- Graphics Loading Error ---
    Graphics.printLoadingError = function (url) {
        console.warn("[KomdnimeFix] Skipped error popup for: " + url);
    };

    // --- SceneManager stop() Override ---
    const _SceneManager_stop = SceneManager.stop;
    SceneManager.stop = function () {
        console.warn("[KomdnimeFix] Suppressed SceneManager.stop()");
        // tidak memanggil stop(), supaya game tetap lanjut
    };

    // --- WebAudio Error Handler ---
    const _WebAudio_onError = WebAudio.prototype._onError;
    WebAudio.prototype._onError = function () {
        console.warn("[KomdnimeFix] Suppressed audio load error: " + this._url);
        this._isReady = false;
        this._hasError = true;
        this._onLoad(); // tetap panggil supaya game lanjut
    };

})();
