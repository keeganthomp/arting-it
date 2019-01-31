import NumberFormat from 'react-number-format'
import React  from 'react'
import PropTypes from 'prop-types'

export const NumberFormatCustom = (props) => {
  const { onChange, inputRef, ...other } = props
  return (<NumberFormat
    decimalScale={2}
    {...other}
    getInputRef={inputRef}
    thousandSeparator={true}
    prefix={'$'}
    defaultValue={null}
    allowNegative={false}
    onValueChange={values => {
      onChange({
        target: {
          value: values.value
        }
      })
    }}
  />)
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default NumberFormatCustom