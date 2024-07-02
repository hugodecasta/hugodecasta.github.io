import { group_by, group_cascade } from "./utils.js"
import { button, div, h1, hr, span } from "./vanille/components.js"

const colors = await (await fetch('parti_color.json')).json()
const data = await (await fetch('lg2024data.json')).json()
const depts = Object.fromEntries((await (await fetch('deps.csv')).text()).split('\n').map(l => l.split(',')).map(d => [d[0], d]))

console.log(depts)

function title(t) {
    div().add(
        div().set_style({
            width: '50px',
            margin: '30px',
            width: '30px',
            height: '5px',
            background: '#aaa',
            display: 'inline-block',
            marginBottom: '7px'
        }),
        h1(t).set_style({
            color: '#aaa', display: 'inline-block'
        })
    ).add2b().set_style({
        marginLeft: '-100px'
    })
}

h1("Barrage contre l'XD - 2024").add2b().set_style({
    width: '100%',
    textAlign: 'center',
    fontSize: '50px'
})

function cdt_comp(cdt) {
    return div().add(
        div().set_style({
            width: '10px', height: '10px',
            display: 'inline-block',
            background: colors[cdt.CodNuaCand],
            borderRadius: '1000px',
            marginRight: '10px'
        }),
        span(cdt.PrenomPsn + ' ' + cdt.NomPsn + ' (' + cdt.LibNuaCand + ')')
    ).set_style({ margin: '10px' })
}

function parti_comp(code, number = null) {
    const name = data.find(d => d['CodNuaCand'] == code)['LibNuaCand']
    const disp_name = number != null ? `${name} (${number})` : name
    return div().add(
        div().set_style({
            width: '10px', height: '10px',
            display: 'inline-block',
            background: colors[code],
            borderRadius: '1000px',
            marginRight: '10px'
        }),
        span(disp_name)
    )
}

function display_nest(nested, compers, liners) {
    const d = div()
    const local_compers = [...compers]
    const local_liners = [...liners]
    const comp = local_compers.shift()
    const liner = local_liners.shift()
    if (Array.isArray(nested)) {
        for (const e of nested) {
            comp(e).add2(d)
        }
    }
    else {
        for (const name in nested) {
            let disp = false
            const inner = div().add(
                hr(),
                display_nest(nested[name], local_compers, local_liners),
                hr(),
            )
            const b = button(comp(name, Object.keys(nested[name]).length), () => { disp = !disp; update() }).set_style({
                display: liner ? 'block' : 'inline-block'
            })
            function update() {
                inner.set_style({ display: disp ? 'block' : 'none', marginLeft: '50px' })
            }
            d.add(b, inner)
            update()
        }
    }
    return d
}

function disp_dept(code, number) {
    return div().add(
        span(depts[code][1] + ' - ' + code, ' (' + number + ')')
    )
}

function ordonanceur(bases, cb) {
    const ord = div()
    cb(bases)
    return ord
}

title('Tour 1 : Désistements nécessaires ...')
const disp_t1_des = div()
ordonanceur(
    [
        ['Parti', 'CodNuaCand', parti_comp, false,],
        ['Département', 'Departement', disp_dept, true],
        ['Circonscription', 'LibCirElec', (t, n) => span(t, ' (' + n + ')'), false],
    ],
    (order) => {
        const des = group_cascade(data.filter(c => c.PT1 == 3), order.map(o => o[1]))
        disp_t1_des.clear()
        disp_t1_des.add(display_nest(des, [...order.map(o => o[2]), cdt_comp], [...order.map(o => o[3]), false]))
    }
).add2b()
disp_t1_des.add2b()