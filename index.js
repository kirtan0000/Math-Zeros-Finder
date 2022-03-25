const math = require('mathjs')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const derivative = (fnc, x_val) => {
  const fx = math.parse(fnc.toString())
  const x = math.parse('x')
  return math.derivative(fx, x).evaluate({ x: x_val })
}

const parser = math.parser()

const evaluate_fx_at_x_val = (fx, x_val) => {
  parser.evaluate(`f(x) = ${fx}`)
  return parser.evaluate(`f(${x_val})`)
}

const eval_approx = (x_n_minus_1, fnc) => {
  const fx_evaluated_at_x_n_minus_1 = evaluate_fx_at_x_val(fnc, x_n_minus_1)

  return (
    x_n_minus_1 - fx_evaluated_at_x_n_minus_1 / derivative(fnc, x_n_minus_1)
  )
}

readline.question(
  `Welcome to zeroes finder!
Please enter a function where x is the variable.
This will only approximate 1 of the zeroes.
It is recommended to use at least 10 or more approximations.

Function: 
`,
  fnc => {
    var curr_x = 1

    readline.question(
      `How many approximations would you like?
`,
      aprrox_num => {
        try {
          for (var i = 0; i < aprrox_num; i++) {
            curr_x = eval_approx(curr_x, fnc)
          }

          const value_unbounded = curr_x == '-Infinity' || curr_x == 'Infinity'

          if (value_unbounded) {
            console.log(
              `It looks there exists no zero for this function. (There might be a horizontal asymptote at x = 0.)`
            )
          }

          if (
            math.abs(evaluate_fx_at_x_val(fnc, curr_x)) >= 0.01 &&
            !value_unbounded
          ) {
            console.log(
              "Warning: It looks like the approximation isn't accurate. Maybe try more approximations or maybe there are no zeroes to this equation."
            )
          }

          if (
            !value_unbounded &&
            math.abs(evaluate_fx_at_x_val(fnc, curr_x)) <= 0.01
          ) {
            console.log(
              ` 
              It looks *ONE* of the zeros of this function *MAY* be: "${curr_x}". 

              This may be inaccurate and this function could have no zeroes. 

              If accurate, this answer is most likely a few decimal places off.
              If this answer seems inaccurate, try checking the syntax and replacing 'x' + '(x)' to fit order of operations.
              `
            )
          }
        } catch (error) {
          console.log(
            "Error parsing this text. Try valid syntax or maybe this function isn't supported."
          )
        }

        readline.close()
      }
    )
  }
)
