extends Camera3D

@export var move_speed: float = 8.0
@export var look_sensitivity: float = 0.0025
@export var pitch_limit_deg: float = 80.0

var _yaw: float = 0.0
var _pitch: float = 0.0

func _ready() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	_yaw = rotation.y
	_pitch = rotation.x

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		_yaw -= event.relative.x * look_sensitivity
		_pitch -= event.relative.y * look_sensitivity
		var limit := deg_to_rad(pitch_limit_deg)
		_pitch = clamp(_pitch, -limit, limit)
		rotation = Vector3(_pitch, _yaw, 0.0)

	if event.is_action_pressed("ui_cancel"):
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

	if event is InputEventMouseButton and event.pressed and Input.get_mouse_mode() != Input.MOUSE_MODE_CAPTURED:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func _process(delta: float) -> void:
	var input_vec := Vector3.ZERO

	if Input.is_key_pressed(KEY_W):
		input_vec.z -= 1.0
	if Input.is_key_pressed(KEY_S):
		input_vec.z += 1.0
	if Input.is_key_pressed(KEY_A):
		input_vec.x -= 1.0
	if Input.is_key_pressed(KEY_D):
		input_vec.x += 1.0
	if Input.is_key_pressed(KEY_Q):
		input_vec.y += 1.0
	if Input.is_key_pressed(KEY_E):
		input_vec.y -= 1.0

	if input_vec == Vector3.ZERO:
		return

	var basis_no_pitch := Basis(Vector3.UP, _yaw)
	var forward := -basis_no_pitch.z
	var right := basis_no_pitch.x

	var move_dir := (right * input_vec.x) + (forward * input_vec.z)
	if move_dir.length_squared() > 0.0:
		move_dir = move_dir.normalized()

	var vertical := Vector3.UP * input_vec.y
	global_position += (move_dir + vertical) * move_speed * delta
