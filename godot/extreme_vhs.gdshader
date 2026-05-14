shader_type canvas_item;
render_mode unshaded;

uniform sampler2D screen_texture : hint_screen_texture, filter_linear_mipmap, repeat_disable;
uniform float uIntensity : hint_range(0.0, 2.5) = 1.2;
uniform float uBlackLevel : hint_range(0.0, 0.3) = 0.12;
uniform float uHighlightRollOff : hint_range(0.4, 1.0) = 0.75;
uniform float uWBDrift : hint_range(0.0, 0.5) = 0.2;
uniform float uMidtoneCompression : hint_range(0.8, 2.5) = 1.6;
uniform float uRGBSeparation : hint_range(0.0, 12.0) = 6.0;
uniform float uEdgeDependent : hint_range(0.0, 2.0) = 1.2;
uniform float uTimeVarying : hint_range(0.0, 1.0) = 0.5;
uniform float uHorizontalWave : hint_range(0.0, 0.08) = 0.025;
uniform float uVerticalJitter : hint_range(0.0, 0.03) = 0.008;
uniform float uTrackingLoss : hint_range(0.0, 0.04) = 0.01;
uniform float uScanTearing : hint_range(0.0, 1.0) = 0.6;
uniform float uScanlineStrength : hint_range(0.0, 1.0) = 0.6;
uniform float uPhosphorGlow : hint_range(0.0, 1.0) = 0.5;
uniform float uNoiseGrain : hint_range(0.0, 0.6) = 0.25;
uniform float uNoiseMacro : hint_range(0.0, 0.5) = 0.12;
uniform float uNoiseTemporal : hint_range(0.0, 2.0) = 0.9;
uniform vec3 uFogColor = vec3(0.15, 0.08, 0.35);
uniform float uFogBleed : hint_range(0.0, 1.0) = 0.6;
uniform float uDistanceErosion : hint_range(0.0, 1.0) = 0.8;
uniform float uGlitchTimer : hint_range(0.0, 1.0) = 0.0;
uniform int uGlitchType = 0;
uniform vec2 uGlitchOffset = vec2(0.0);
uniform float uCameraVelocity : hint_range(0.0, 60.0) = 0.0;

float hash(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));vec2 u=f*f*(3.0-2.0*f);return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;}
vec3 sample_chroma(vec2 uv,float edge,float vel){float sep=(uRGBSeparation*0.0015)*(1.0+edge*uEdgeDependent+vel);float drift=sin(TIME*(1.8+uTimeVarying*3.5)+uv.y*12.0)*sep*(0.3+uTimeVarying);vec2 ro=vec2(sep+drift,0),bo=vec2(-sep-drift,0);return vec3(texture(screen_texture,uv+ro).r,texture(screen_texture,uv).g,texture(screen_texture,uv+bo).b);} 

void fragment(){
	vec2 uv=SCREEN_UV;vec2 base_uv=uv;
	float wave=sin((uv.y*36.0)+TIME*1.2)*uHorizontalWave;
	float jitter=(hash(vec2(floor(TIME*60.0),uv.y*997.0))-0.5)*2.0*uVerticalJitter;
	float tracking=sin(TIME*32.0+uv.y*400.0)*uTrackingLoss;
	float tear_band=step(1.0-(0.05*uScanTearing),hash(vec2(floor(TIME*24.0),floor(uv.y*24.0))));
	float tear_shift=(hash(vec2(floor(TIME*48.0),floor(uv.y*140.0)))-0.5)*0.09*uScanTearing*tear_band;
	uv.x+=wave+tracking+tear_shift;uv.y+=jitter;uv=clamp(uv,vec2(0.0),vec2(1.0));
	vec2 px=SCREEN_PIXEL_SIZE;vec3 c0=texture(screen_texture,uv).rgb,cx=texture(screen_texture,uv+vec2(px.x,0)).rgb,cy=texture(screen_texture,uv+vec2(0,px.y)).rgb;
	float edge=clamp((length(c0-cx)+length(c0-cy))*2.5,0.0,1.0);
	float vel=clamp(uCameraVelocity/12.0,0.0,2.0);
	vec3 col=sample_chroma(uv,edge,vel);
	col=max(col,vec3(uBlackLevel));col=1.0-pow(1.0-col,vec3(max(0.01,uHighlightRollOff)));col=pow(col,vec3(max(0.1,uMidtoneCompression)));
	float wb_phase=TIME*0.7;vec3 wb=vec3(1.0+sin(wb_phase)*uWBDrift,1.0+sin(wb_phase*0.73+1.4)*uWBDrift*0.5,1.0-cos(wb_phase*0.91)*uWBDrift);col*=wb;
	float scan=sin((uv.y+TIME*0.015)*1300.0)*0.5+0.5;scan=mix(1.0,scan,uScanlineStrength);col*=scan;
	float glow=smoothstep(0.55,1.0,max(col.r,max(col.g,col.b)))*uPhosphorGlow;col+=col*glow*0.25;
	float n1=noise(uv*700.0+TIME*(35.0*uNoiseTemporal)),n2=noise(uv*160.0-TIME*(12.0*uNoiseTemporal)),macro=noise(uv*24.0+vec2(TIME*2.5,TIME*1.7));
	float grain=((n1-0.5)*uNoiseGrain)+((n2-0.5)*uNoiseGrain*0.45);col+=vec3(grain);col+=vec3((macro-0.5)*uNoiseMacro);
	float dist=length(base_uv-vec2(0.5))*1.6;float erosion=smoothstep(0.2,1.0,dist)*uDistanceErosion;col=mix(col,uFogColor,uFogBleed*(0.35+erosion*0.65));
	if(uGlitchTimer>0.001){float t=clamp(uGlitchTimer,0.0,1.0);if(uGlitchType==0){float band=step(0.4,sin((base_uv.y+TIME*8.0)*70.0));vec2 guv=base_uv+vec2(uGlitchOffset.x*band*t,0);col=texture(screen_texture,clamp(guv,vec2(0),vec2(1))).rgb;}else if(uGlitchType==1){col*=1.0+0.8*t;}else if(uGlitchType==2){float l=dot(col,vec3(0.299,0.587,0.114));col=mix(col,vec3(l),0.85*t);}else{vec2 block=floor(base_uv*28.0)/28.0;vec2 guv=base_uv+(hash(block+TIME)-0.5)*uGlitchOffset*t*2.0;col=texture(screen_texture,clamp(guv,vec2(0),vec2(1))).rgb;}}
	col*=uIntensity;COLOR=vec4(clamp(col,0.0,1.0),1.0);
}
