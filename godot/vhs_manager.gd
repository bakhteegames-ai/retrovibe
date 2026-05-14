extends ColorRect

@export var glitch_chance_per_frame: float = 0.015
@export var glitch_min_duration: float = 0.10
@export var glitch_max_duration: float = 0.25

var _camera: Camera3D
var _mat: ShaderMaterial
var _prev_cam_pos: Vector3 = Vector3.ZERO
var _glitch_timer: float = 0.0
var _glitch_type: int = 0
var _glitch_offset: Vector2 = Vector2.ZERO

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	_camera = get_viewport().get_camera_3d()
	_mat = material as ShaderMaterial
	if _camera:
		_prev_cam_pos = _camera.global_position

func _process(delta: float) -> void:
	if _mat == null:
		return
	var vel_mag := 0.0
	if _camera:
		var current_pos := _camera.global_position
		vel_mag = current_pos.distance_to(_prev_cam_pos) / max(delta, 0.00001)
		_prev_cam_pos = current_pos
	_mat.set_shader_parameter("uCameraVelocity", vel_mag)
	_update_glitch(delta)
	_mat.set_shader_parameter("uGlitchTimer", _glitch_timer)
	_mat.set_shader_parameter("uGlitchType", _glitch_type)
	_mat.set_shader_parameter("uGlitchOffset", _glitch_offset)

func _update_glitch(delta: float) -> void:
	if _glitch_timer > 0.0:
		_glitch_timer = max(_glitch_timer - delta, 0.0)
		return
	if randf() < glitch_chance_per_frame:
		_glitch_timer = randf_range(glitch_min_duration, glitch_max_duration)
		_glitch_type = randi_range(0, 3)
		_glitch_offset = Vector2(randf_range(-0.08, 0.08), randf_range(-0.02, 0.02))
