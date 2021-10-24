// グラフィックカードにシェーダーのレンダリング方法を知らせる定義が必要
#ifdef GL_ES
precision mediump float;
#endif

// このサンプルでは、対象ピクセルがキャンバスのどこにあるかが知りたいので、キャンバスのサイズが必要になる
// これは、sketch.jsファイルからuniformとして送られてくる
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_skygrad;

#define WHITE vec4(1.0, 1.0, 1.0, 1.0)
#define RED vec4(1.0, 0.0, 0.0, 1.0)
#define GREEN vec4(0.0, 1.0, 0.0, 1.0)
#define BLUE vec4(0.0, 0.0, 1.0, 1.0)
#define BLACK vec4(1.0, 1.0, 1.0, 1.0)
#define TOP_COLOR vec4(185.0/255.0, 193.0/255.0, 206.0/255.0, 1.0) // <- 一番上
#define MID_COLOR vec4(252.0/255.0, 225.0/255.0, 202.0/255.0, 1.0) // <- 中間色
//#define BTM_COLOR vec4(186.0/255.0, 162.0/255.0, 163.0/255.0, 1.0) // <- 一番下
#define BTM_COLOR vec4(229.0/255.0, 181.0/255.0, 168.0/255.0, 1.0) // <- 一番下


const int   oct  = 11;
const float per  = 0.5;
const float PI   = 3.1415926;

float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return a * (1.0 - f) + b * f;
}

// 乱数生成
float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

// 補間乱数
float irnd(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
                  rnd(vec2(i.x + 1.0, i.y      )),
                  rnd(vec2(i.x,       i.y + 1.0)),
                  rnd(vec2(i.x + 1.0, i.y + 1.0)));
    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

// ノイズ生成
float noise(vec2 p){
    float t = 0.0;
    for(int i = 0; i < oct; i++){
        float freq = pow(2.0, float(i));
        float amp  = pow(per, float(oct - i));
        t += irnd(vec2(p.x / freq, p.y / freq)) * amp;
    }
    return t;
}

vec4 ColorLerp(float sty, float p1, float p2, vec4 c1, vec4 c2, float f1) {
  float flg = step(sty-p2, 0.0) * abs(f1-1.0);
  vec4 col = mix(c1, c2, (sty-p1)/(p2-p1));
  col.w = flg;
  return col;
}

void main() {
  // ピクセルの位置を解像度(キャンバスのサイズ)で割って、キャンバス上での正規化された位置を得る
  vec2 st = gl_FragCoord.xy/u_resolution.xy * 1.0;

  // 赤のグラデーションとして、x軸のピクセル位置を使う。
  // 位置が0.0に近いほど、黒くなる(st.x = 0.0)
  // 位置が幅(1.0として定義)に近いほど、赤くなる(st.x = 1.0)
  //gl_FragColor = vec4(st.x,0.0,0.0,1.0); // R,G,B,A

  // １度にアクティブにできるgl_FragColorは１つだが、コメントアウトして試してみよう。
  // 緑チャンネル
  //gl_FragColor = vec4(0.0,st.x,0.0,1.0);

  // x位置とy位置両方
  //gl_FragColor = vec4(st.x,st.y,0.0,1.0);
  //gl_FragColor = vec4(st.y*0.5,0,0.0,1.0);

  //vec3 col = vec3(0.0);
  //col.r = gl_FragCoord.x/u_resolution.x;
  //col.r = gl_FragCoord.y/u_resolution.y;
  //gl_FragColor = vec4(col, 1.0);

  //vec3 col = vec3(0.0);
  //col.r = gl_FragCoord.x/u_resolution.x;
  //col.g = 1.0;//0.5+0.5*cos(u_time);
  //col.b = gl_FragCoord.y/u_resolution.y;
  //gl_FragColor = vec4(col, 1.0);

  //float flag = step(0.5, st.y);
  //gl_FragColor = flag * RED;

  /*
  float p1 = 1.0 - 0.75;
  float f1 = step(p1, st.y);
  vec4 c1 = mix(MID_COLOR, TOP_COLOR, (st.y-p1)/(1.0-p1));
  vec4 c2 = mix(BTM_COLOR, MID_COLOR, st.y/p1);
  gl_FragColor = mix(c2, c1, f1);
  */

  /*
  float p1 = 0.25;
  float f1 = step(st.y-p1, 0.0);
  vec4 c1 = mix(BTM_COLOR, MID_COLOR, st.y/p1);
  float p2 = 0.5;
  float f2 = step(st.y-p2, 0.0) * abs(f1-1.0);
  vec4 c2 = mix(MID_COLOR, TOP_COLOR, (st.y-p1)/(p2-p1));
  gl_FragColor = f1*c1 + f2*c2;
  */

  //vec2 tt = gl_FragCoord.xy + vec2(u_time * 100.0);
  //float nn = noise(tt);
  //gl_FragColor = vec4(vec3(nn), 1.0);

  
  vec4 c1 = vec4(189.0/255.0,163.0/255.0,163.0/255.0,1.0);
  vec4 c2 = vec4(233.0/255.0,184.0/255.0,168.0/255.0,1.0);
  vec4 c3 = vec4(253.0/255.0,215.0/255.0,188.0/255.0,1.0);
  vec4 c4 = vec4(243.0/255.0,227.0/255.0,214.0/255.0,1.0);
  vec4 c5 = vec4(243.0/255.0,227.0/255.0,214.0/255.0,1.0);
  vec4 c6 = vec4(188.0/255.0,196.0/255.0,209.0/255.0,1.0);
  vec4 c7 = vec4(160.0/255.0,170.0/255.0,182.0/255.0,1.0);

  vec4 r1 = ColorLerp(st.y, 0.0, 0.08, c1, c2, 0.0);
  vec4 r2 = ColorLerp(st.y, 0.08, 0.2, c2, c3, r1.w);
  vec4 r3 = ColorLerp(st.y, 0.2, 0.3, c3, c4, r1.w+r2.w);
  vec4 r4 = ColorLerp(st.y, 0.3, 0.4, c4, c5, r1.w+r2.w+r3.w);
  vec4 r5 = ColorLerp(st.y, 0.4, 0.7, c5, c6, r1.w+r2.w+r3.w+r4.w);
  vec4 r6 = ColorLerp(st.y, 0.7, 1.0, c6, c7, r1.w+r2.w+r3.w+r4.w+r5.w);
  vec4 skyColor = vec4(r1.xyz*r1.w + r2.xyz*r2.w + r3.xyz*r3.w + r4.xyz*r4.w + r5.xyz*r5.w + r6.xyz*r6.w, 1.0);

  vec2 _t = gl_FragCoord.xy + vec2(u_time * 30.0, u_time * 30.0) * vec2(cos(u_time*0.2), sin(u_time*0.2));
  float n = noise(_t);
  vec2 t = gl_FragCoord.xy + vec2(u_time*30.1, 0);
  //float ns = clamp(abs(noise(t)) * pow(st.y, 2.0) * 0.1, 0.0, 0.1);
  float ns = abs(noise(t));
  float p = 0.7;
  ns = clamp((abs(step(st.y-p, 0.0)-1.0) + step(st.y-p, 0.0) * pow((1.0-p)+st.y,1.5)) * ns * 0.05, 0.0, 1.0);

  

  vec3 skygrad = u_skygrad;
  //vec3 skygrad = mix(vec3(0.1,0.1,0.3), vec3(1.3,1.0,1.0), 0.5*abs(1.0+cos(u_time*0.2)));
  
  //gl_FragColor = vec4(vec3(ns*4.78), 1.0);
  //gl_FragColor = vec4(skyColor.xyz, 1.0);
  //gl_FragColor = vec4(skyColor.xyz*0.8 + ns*2.78, 1.0);
  //gl_FragColor = vec4(skyColor.xyz * skygrad, 1.0);
  //gl_FragColor = vec4(skyColor.xyz*skygrad*0.9 + ns*4.78, 1.0);
  gl_FragColor = vec4(skyColor.xyz*skygrad*0.9 + clamp(length(skygrad), 0.85, 1.0)*ns*12.0, 1.0);
}