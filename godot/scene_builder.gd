extends Node3D

const CAMERA_CONTROLLER_SCRIPT := preload("res://godot/camera_controller.gd")
const VHS_MANAGER_SCRIPT := preload("res://godot/vhs_manager.gd")
const VHS_SHADER := preload("res://godot/extreme_vhs.gdshader")

func _ready() -> void:
	randomize()
	_build_environment()
	var camera := _build_camera()
	_build_ground()
	_build_city()
	_build_vhs_overlay(camera)

func _build_environment() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.05, 0.02, 0.10)
	env.fog_enabled = true
	env.fog_mode = Environment.FOG_MODE_EXP
	env.fog_density = 0.06
	env.fog_light_color = Color(0.15, 0.08, 0.35)
	env.fog_light_energy = 0.7
	env.fog_aerial_perspective = 0.35
	env.fog_sky_affect = 0.2
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	var moon := DirectionalLight3D.new()
	moon.light_color = Color(0.60, 0.72, 1.0)
	moon.light_energy = 1.2
	moon.shadow_enabled = true
	moon.rotation_degrees = Vector3(-45.0, -30.0, 0.0)
	add_child(moon)

func _build_camera() -> Camera3D:
	var cam := Camera3D.new()
	cam.name = "MainCamera"
	cam.current = true
	cam.fov = 72.0
	cam.near = 0.05
	cam.far = 400.0
	cam.position = Vector3(0.0, 3.0, 15.0)
	cam.set_script(CAMERA_CONTROLLER_SCRIPT)
	add_child(cam)
	return cam

func _build_ground() -> void:
	var ground := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(220.0, 420.0)
	ground.mesh = plane
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.08, 0.08, 0.10)
	mat.roughness = 0.9
	mat.metallic = 0.2
	ground.material_override = mat
	add_child(ground)

func _build_city() -> void:
	var palette: Array[Color] = [Color(0.20, 0.35, 1.00), Color(0.55, 0.20, 0.95), Color(1.00, 0.45, 0.18), Color(0.95, 0.25, 0.65)]
	for i in 14:
		var side := -1.0 if i % 2 == 0 else 1.0
		var z := -120.0 + i * 18.0
		var x := side * randf_range(10.0, 20.0)
		var h := randf_range(8.0, 28.0)
		var w := randf_range(4.0, 10.0)
		var d := randf_range(6.0, 14.0)
		var c := palette[i % palette.size()]
		var b := MeshInstance3D.new()
		var box := BoxMesh.new()
		box.size = Vector3(w, h, d)
		b.mesh = box
		b.position = Vector3(x, h * 0.5, z)
		var m := StandardMaterial3D.new()
		m.albedo_color = c * 0.22
		m.metallic = 0.45
		m.roughness = 0.35
		m.emission_enabled = true
		m.emission = c
		m.emission_energy_multiplier = 1.8
		b.material_override = m
		add_child(b)
		if randf() < 0.6:
			var omni := OmniLight3D.new()
			omni.light_color = c
			omni.light_energy = randf_range(2.0, 4.5)
			omni.omni_range = randf_range(12.0, 20.0)
			omni.position = b.position + Vector3(0.0, h * 0.35, side * -2.0)
			add_child(omni)

func _build_vhs_overlay(_camera: Camera3D) -> void:
	var layer := CanvasLayer.new()
	layer.layer = 10
	add_child(layer)
	var rect := ColorRect.new()
	rect.anchor_left = 0.0
	rect.anchor_top = 0.0
	rect.anchor_right = 1.0
	rect.anchor_bottom = 1.0
	rect.offset_left = 0.0
	rect.offset_top = 0.0
	rect.offset_right = 0.0
	rect.offset_bottom = 0.0
	rect.color = Color(1, 1, 1, 1)
	rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var sm := ShaderMaterial.new()
	sm.shader = VHS_SHADER
	sm.set_shader_parameter("uFogColor", Vector3(0.15, 0.08, 0.35))
	rect.material = sm
	rect.set_script(VHS_MANAGER_SCRIPT)
	layer.add_child(rect)
