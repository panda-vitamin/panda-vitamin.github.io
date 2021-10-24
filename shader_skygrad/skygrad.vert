// グラフィックカードにシェーダーのレンダリング方法を知らせる定義が必要
#ifdef GL_ES
precision mediump float;
#endif

// ピクセルの位置を取得し、シェーダーをシェイプに正しくマッピングするために必ず含める
attribute vec3 aPosition;

void main() {
    // w成分として1.0を追加して、位置データをvec4にコピーする
    vec4 positionVec4 = vec4(aPosition, 1.0);

    // 出力がキャンバスにフィットするようスケーリングする
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

    // 頂点情報を、フラグメントシェーダに送る
    gl_Position = positionVec4;
}