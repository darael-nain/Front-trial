var checkType = {
	//check by the value
	value: item => (typeof item === 'boolean') ? 'checkbox' : 'text',
	// check by html element typ
	html: type => ( type === 'checkbox') ? 'checked' : 'value'

}

