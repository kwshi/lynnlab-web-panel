package motors


type Msg interface {
	Success() bool
	Error() string
}

type ListMsg struct {
	Payload []int `json:"payload"`
	Succ bool `json:"success"`
	Err string `json:"error"`
}

func (m *ListMsg) Success() bool {
	return m.Succ
}

func (m *ListMsg) Error() string {
	return m.Err
}

type BlankMsg struct {
	Succ bool `json:"success"`
	Err string `json:"error"`
}

func (m *BlankMsg) Success() bool {
	return m.Succ
}

func (m *BlankMsg) Error() string {
	return m.Err
}

type SingleState struct {
	Position float64 `json:"position"`
	Moving  bool `json:"moving"`
}

type State map[int]*SingleState

type StateMsg struct {
	Payload State `json:"payload"`
	Succ bool `json:"success"`
	Err string `json:"error"`
}

func (m *StateMsg) Success() bool {
	return m.Succ
}

func (m *StateMsg) Error() string {
	return m.Err
}

