import { group_by, group_cascade } from "./utils.js"
import { button, create_elm, div, h1, hr, input, p, span } from "./vanille/components.js"

const colors = await (await fetch('parti_color.json')).json()
const data = await (await fetch('lg2024data.json')).json()
const depts = Object.fromEntries((await (await fetch('deps.csv')).text()).split('\n').map(l => l.split(',')).map(d => [d[0], d]))

const mobile = window.innerWidth < 600

document.body.style.padding = mobile ? '20px' : '0px'

function title(t) {
    div().add(
        ...[
            mobile ? null : div().set_style({
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
        ].filter(e => e)
    ).add2b().set_style({
        marginLeft: mobile ? '0px' : '-100px',
        marginTop: '100px',
    })
}

h1("Barrage contre l'XD - 2024").add2b().set_style({
    width: '100%',
    textAlign: 'center',
    fontSize: '50px',
    marginBottom: '-50px'
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
    const last = local_compers.length == 0
    if (last) {
        if (Array.isArray(nested)) {
            for (const e of nested) {
                comp(e).add2(d)
            }
        }
        else {
            for (const i in nested) {
                comp(i, nested[i]).add2(d)
            }
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
            const compi = comp(name, Object.keys(nested[name]).length)
            const b = button(compi, () => { disp = !disp; update() }).set_style({
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
        span(code + ' - ' + depts[code][1], ' (' + number + ')')
    )
}

function disp_circo_uni_cdt(libe_circo, [cdt]) {
    return div().add(
        span(libe_circo),
        cdt_comp(cdt)
    )
}

function ordonanceur(bases, cb) {
    const ord = div()
    cb(bases)
    return ord
}

function options_comp(options, cb) {
    const option = Object.values(options)[0]
    cb(option)
    const option_id = Math.random()
    return div().add(
        ...Object.entries(options).map(([name, data], i) => {
            const inp = input(i == 0, 'radio', () => cb(data)).set_attributes({ id: name, name: option_id })
            inp.checked = i == 0
            return span().add(
                inp,
                create_elm('label', '', name).set_attributes({ for: name })
            ).set_style({ margin: '10px' })
        })
    ).set_style({ margin: '30px' })
}

// ----------------------------------------------------------------------------- T1

title('Tour 1 : Désistements nécessaires ...')

p("Après le premier tours, suite à un record de participation électorale, de nombres circonscroptions se sont retrouvées" +
    " dans la configuration triangulaire, c'est à dire avec trois candidats admissibles au second tour." +
    " Lorsque des trianglulaire se mettent en place, il est possible pour un candidat de se désister " +
    "en donnant pour consigne à ses électeurs de donner leurs voix à un candidat désigné parmi les deux restants." +
    " De cette manière, dans les circonscriptions en triangulaires dans lesquelles l'XD est arrivée en tête, un barrage est possible " +
    "si le candidat arrivé en 3ème place se désiste et donne pour consigne de voter pour l'adversaire de l'XD." +
    " Les données ci-dessous indiquent les désistements nécessaires pour faire barrage à " +
    "l'XD dans les circonscriptions triangulaires avec XD à la première place au premier tour.")
    .add2b().set_style({ textAlign: 'justify' })

const disp_t1_des = div()
options_comp(
    {
        ' par Parti': [
            ['CodNuaCand', parti_comp, false,],
            ['Departement', disp_dept, true],
            ['LibCirElec', disp_circo_uni_cdt, true],
        ],
        ' par Département': [
            ['Departement', disp_dept, true],
            ['LibCirElec', disp_circo_uni_cdt, true],
        ],
    },
    (order) => {
        const des = group_cascade(data.filter(c => c.PT1 == 3), order.map(o => o[0]))
        disp_t1_des.clear()
        disp_t1_des.add(display_nest(des, order.map(o => o[1]), order.map(o => o[2])))
    }
).add2b()
disp_t1_des.add2b()

// ----------------------------------------------------------------------------- T2

title('Inter Tour : Le barrage se met en place...')

p('Coming soon !').add2b()